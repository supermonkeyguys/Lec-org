import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import XLSX from "xlsx";
import {
  importMembers,
  mapOutcome,
  normaliseRows,
  partitionRecords,
  validateWorkbook,
} from "./member-import.mjs";

const expectedHeaders = ["年级", "方向", "专业", "姓名", "毕业去向"];

const validRows = [
  ...Array.from({ length: 65 }, (_, index) => [
    `${19 + Math.floor(index / 13)}级`,
    index % 2 === 0 ? "保研" : "",
    "软件工程",
    `校友${index + 1}`,
    "去向",
  ]),
  ...Array.from({ length: 23 }, (_, index) => [
    index < 12 ? "24级" : "25级",
    "",
    "软件工程",
    `在读${index + 1}`,
    "",
  ]),
];

const createWorkbook = async (directory: string, rows: unknown[][]) => {
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, XLSX.utils.aoa_to_sheet(rows), "Sheet1");
  const inputPath = join(directory, "members.xlsx");
  await writeFile(inputPath, XLSX.write(workbook, { type: "buffer", bookType: "xlsx" }));
  return inputPath;
};

describe("member workbook normalization", () => {
  const rows = [
    ["19级", "保研", "物联网", "赵千", "电科"],
    [undefined, "就业", "软工", "赵宇", "字节跳动"],
    ["在读", undefined, undefined, undefined, undefined],
    ["24", undefined, "软工", "gyf", undefined],
    ["25", undefined, undefined, "ws", undefined],
  ] as const;

  it("normalises merged cells and skips separator rows", () => {
    expect(normaliseRows(rows)).toEqual([
      {
        cohort: 2019,
        direction: "保研",
        major: "物联网",
        name: "赵千",
        destination: "电科",
      },
      {
        cohort: 2019,
        direction: "就业",
        major: "软工",
        name: "赵宇",
        destination: "字节跳动",
      },
      {
        cohort: 2024,
        direction: "",
        major: "软工",
        name: "gyf",
        destination: "",
      },
      {
        cohort: 2025,
        direction: "",
        major: "",
        name: "ws",
        destination: "",
      },
    ]);
  });

  it("only carries a direction into rows covered by its source merge", () => {
    const rows = [
      ["22级", "就业", "软工", "有标签", "公司"],
      [undefined, undefined, "软工", "合并单元格", "公司"],
      [undefined, undefined, "软工", "真实空白", ""],
    ] as const;

    expect(normaliseRows(rows, [{ s: { r: 1, c: 1 }, e: { r: 2, c: 1 } }])).toEqual([
      {
        cohort: 2022,
        direction: "就业",
        major: "软工",
        name: "有标签",
        destination: "公司",
      },
      {
        cohort: 2022,
        direction: "就业",
        major: "软工",
        name: "合并单元格",
        destination: "公司",
      },
      {
        cohort: 2022,
        direction: "",
        major: "软工",
        name: "真实空白",
        destination: "",
      },
    ]);
  });

  it("maps source directions to alumni outcomes", () => {
    expect(mapOutcome("深造")).toBe("graduate-exam");
    expect(mapOutcome("考公")).toBe("employment");
  });

  it("partitions current members by cohort", () => {
    expect(partitionRecords(normaliseRows(rows)).currentMembers).toHaveLength(2);
  });

  it("requires the exact Sheet1 header row", () => {
    expect(() => validateWorkbook([["年级", "方向", "专业", "姓名", "去向"]])).toThrow(
      /headers/i,
    );
  });

  it("rejects unknown source directions", () => {
    expect(() => validateWorkbook([
      expectedHeaders,
      ["19级", "未知", "软件工程", "校友", "去向"],
    ])).toThrow(/direction/i);
  });

  it("rejects a numeric zero direction instead of treating it as blank", () => {
    const rowsWithZeroDirection = validRows.map((row) => [...row]);
    rowsWithZeroDirection[0][1] = 0;

    expect(() => validateWorkbook([expectedHeaders, ...rowsWithZeroDirection])).toThrow(/direction/i);
  });

  it("rejects a numeric zero grade instead of inheriting the preceding cohort", () => {
    const rowsWithZeroGrade = validRows.map((row) => [...row]);
    rowsWithZeroGrade.at(-1)![0] = 0;

    expect(() => validateWorkbook([expectedHeaders, ...rowsWithZeroGrade])).toThrow(/cohort/i);
  });

  it("rejects malformed headers before changing generated output", async () => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const inputPath = await createWorkbook(directory, [
      ["年级", "方向", "专业", "姓名", "去向"],
      ...validRows,
    ]);
    const outputPath = join(directory, "member-records.generated.ts");
    const originalOutput = "export const preserved = true;\n";
    await writeFile(outputPath, originalOutput);

    await expect(importMembers(inputPath, outputPath)).rejects.toThrow(/headers/i);
    await expect(readFile(outputPath, "utf8")).resolves.toBe(originalOutput);
  });

  it("rejects incomplete records before changing generated output", async () => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const inputPath = await createWorkbook(directory, [expectedHeaders, ...validRows.slice(0, -1)]);
    const outputPath = join(directory, "member-records.generated.ts");
    const originalOutput = "export const preserved = true;\n";
    await writeFile(outputPath, originalOutput);

    await expect(importMembers(inputPath, outputPath)).rejects.toThrow(/23 current/i);
    await expect(readFile(outputPath, "utf8")).resolves.toBe(originalOutput);
  });

  it("rejects missing names before changing generated output", async () => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const rowsWithMissingName = validRows.map((row) => [...row]);
    rowsWithMissingName[0][3] = "";
    const inputPath = await createWorkbook(directory, [expectedHeaders, ...rowsWithMissingName]);
    const outputPath = join(directory, "member-records.generated.ts");
    const originalOutput = "export const preserved = true;\n";
    await writeFile(outputPath, originalOutput);

    await expect(importMembers(inputPath, outputPath)).rejects.toThrow(/name/i);
    await expect(readFile(outputPath, "utf8")).resolves.toBe(originalOutput);
  });

  it("writes the 23/65 partitions into one generated records module", async () => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const inputPath = await createWorkbook(directory, [expectedHeaders, ...validRows]);
    const outputPath = join(directory, "member-records.generated.ts");

    await expect(importMembers(inputPath, outputPath)).resolves.toMatchObject({
      currentMembers: expect.arrayContaining([expect.objectContaining({ cohort: 2024 })]),
      alumniMembers: expect.arrayContaining([expect.objectContaining({ cohort: 2019 })]),
    });
    const generatedOutput = await readFile(outputPath, "utf8");
    expect(generatedOutput).toContain("export const generatedMembers");
    expect(generatedOutput).toContain("export const generatedAlumniMembers");
    expect(generatedOutput.match(/id: "member-/g)).toHaveLength(23);
    expect(generatedOutput.match(/id: "alumni-/g)).toHaveLength(65);
  });
});
