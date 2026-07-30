import { spawnSync } from "node:child_process";
import { accessSync, constants, statSync } from "node:fs";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import ExcelJS from "exceljs";
import {
  importMembers,
  mapOutcome,
  normaliseRows,
  partitionRecords,
  validateWorkbook,
} from "./member-import.mjs";

const expectedHeaders = ["年级", "方向", "专业", "姓名", "毕业去向"];
const localSourceWorkbookPath = "/Users/cookie/Library/Containers/com.tencent.qq/Data/Downloads/LEC近三年人员信息 (1).xlsx";
const configuredSourceWorkbookPath = process.env.MEMBER_SOURCE_WORKBOOK;
const sourceWorkbookPath = configuredSourceWorkbookPath ?? localSourceWorkbookPath;
const isReadableFile = (path: string) => {
  try {
    accessSync(path, constants.R_OK);
    return statSync(path).isFile();
  } catch {
    return false;
  }
};
const sourceWorkbookIsReadable = isReadableFile(sourceWorkbookPath);
const sourceWorkbookConfigurationError = process.env.CI && (
  !configuredSourceWorkbookPath || !isReadableFile(configuredSourceWorkbookPath)
)
  ? `CI requires MEMBER_SOURCE_WORKBOOK to point to a readable original LEC workbook. ${
    configuredSourceWorkbookPath
      ? `Configured path is unreadable: ${configuredSourceWorkbookPath}.`
      : "The variable is not set."
  } No original workbook is committed.`
  : undefined;

const validRows = [
  ...Array.from({ length: 53 }, (_, index) => [
    `${19 + Math.floor(index / 14)}级`,
    index % 2 === 0 ? "保研" : "就业",
    "软件工程",
    `校友${index + 1}`,
    "去向",
  ]),
  ...Array.from({ length: 35 }, (_, index) => [
    index < 12 ? "23级" : index < 24 ? "24级" : "25级",
    "",
    "软件工程",
    ["蒋京玲", "罗乙番"][index] ?? `在读${index + 1}`,
    "",
  ]),
];

const createWorkbook = async (
  directory: string,
  rows: unknown[][],
  configureWorksheet?: (worksheet: ExcelJS.Worksheet) => void,
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Sheet1");
  worksheet.addRows(rows);
  configureWorksheet?.(worksheet);
  const inputPath = join(directory, "members.xlsx");
  await workbook.xlsx.writeFile(inputPath);
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

  it("uses temporary-workbook merge metadata for direction carry", async () => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const rowsWithDirectionMerge: unknown[][] = validRows.map((row) => [...row]);
    rowsWithDirectionMerge[0][1] = "考公";
    rowsWithDirectionMerge[1][0] = "";
    rowsWithDirectionMerge[1][1] = "";
    rowsWithDirectionMerge[2][0] = "";
    rowsWithDirectionMerge[2][1] = "";
    const inputPath = await createWorkbook(
      directory,
      [expectedHeaders, ...rowsWithDirectionMerge],
      (worksheet) => worksheet.mergeCells("B2:B3"),
    );
    const outputPath = join(directory, "member-records.generated.ts");

    const records = await importMembers(inputPath, outputPath);

    expect(records.alumniMembers.slice(0, 3).map((record) => record.direction)).toEqual([
      "考公",
      "考公",
      "",
    ]);
  });

  it("maps source directions to alumni outcomes", () => {
    expect(mapOutcome("深造")).toBe("further-study");
    expect(mapOutcome("考公")).toBe("employment");
  });

  it("retains the source classifications behind two further-study records", () => {
    expect(mapOutcome("深造", 2019, "曹志鹏")).toBe("graduate-exam");
    expect(mapOutcome("深造", 2020, "孙钰镒")).toBe("graduate-exam");
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

  it("rejects an unknown workbook direction before changing generated output", async () => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const rowsWithUnknownDirection = validRows.map((row) => [...row]);
    rowsWithUnknownDirection[0][1] = "未知";
    const inputPath = await createWorkbook(directory, [expectedHeaders, ...rowsWithUnknownDirection]);
    const outputPath = join(directory, "member-records.generated.ts");
    const originalOutput = "export const preserved = true;\n";
    await writeFile(outputPath, originalOutput);

    await expect(importMembers(inputPath, outputPath)).rejects.toThrow(/direction/i);
    await expect(readFile(outputPath, "utf8")).resolves.toBe(originalOutput);
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

  it("accepts exact numeric cohort cells from the source workbook", async () => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const rowsWithNumericCohorts: unknown[][] = validRows.map((row) => [...row]);
    rowsWithNumericCohorts[0][0] = 19;
    rowsWithNumericCohorts[53][0] = 23;
    rowsWithNumericCohorts[65][0] = 24;
    rowsWithNumericCohorts[77][0] = 25;
    const inputPath = await createWorkbook(directory, [expectedHeaders, ...rowsWithNumericCohorts]);
    const outputPath = join(directory, "member-records.generated.ts");

    await expect(importMembers(inputPath, outputPath)).resolves.toMatchObject({
      currentMembers: expect.arrayContaining([
        expect.objectContaining({ cohort: 2023 }),
        expect.objectContaining({ cohort: 2024 }),
        expect.objectContaining({ cohort: 2025 }),
      ]),
      alumniMembers: expect.arrayContaining([expect.objectContaining({ cohort: 2019 })]),
    });
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

    await expect(importMembers(inputPath, outputPath)).rejects.toThrow(/33 current/i);
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

  it.each([
    ["number", 123],
    ["boolean", true],
    ["formula", { formula: "\"公式名\"", result: "公式名" }],
    ["rich text", { richText: [{ text: "富文本名" }] }],
    ["date", new Date("2026-07-26T00:00:00.000Z")],
  ])("rejects a %s name cell before changing generated output", async (_label, invalidName) => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const rowsWithInvalidName: unknown[][] = validRows.map((row) => [...row]);
    rowsWithInvalidName[0][3] = invalidName;
    const inputPath = await createWorkbook(directory, [expectedHeaders, ...rowsWithInvalidName]);
    const outputPath = join(directory, "member-records.generated.ts");
    const originalOutput = "export const preserved = true;\n";
    await writeFile(outputPath, originalOutput);

    await expect(importMembers(inputPath, outputPath)).rejects.toThrow(/name/i);
    await expect(readFile(outputPath, "utf8")).resolves.toBe(originalOutput);
  });

  it.each([
    ["number", "major", 2, 123],
    ["boolean", "major", 2, true],
    ["formula", "major", 2, { formula: "\"公式专业\"", result: "公式专业" }],
    ["rich text", "major", 2, { richText: [{ text: "富文本专业" }] }],
    ["date", "major", 2, new Date("2026-07-26T00:00:00.000Z")],
    ["number", "destination", 4, 123],
    ["boolean", "destination", 4, true],
    ["formula", "destination", 4, { formula: "\"公式去向\"", result: "公式去向" }],
    ["rich text", "destination", 4, { richText: [{ text: "富文本去向" }] }],
    ["date", "destination", 4, new Date("2026-07-26T00:00:00.000Z")],
  ])("rejects a %s %s cell before changing generated output", async (_label, field, columnIndex, invalidValue) => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const rowsWithInvalidOptionalText: unknown[][] = validRows.map((row) => [...row]);
    rowsWithInvalidOptionalText[0][columnIndex] = invalidValue;
    const inputPath = await createWorkbook(directory, [expectedHeaders, ...rowsWithInvalidOptionalText]);
    const outputPath = join(directory, "member-records.generated.ts");
    const originalOutput = "export const preserved = true;\n";
    await writeFile(outputPath, originalOutput);

    await expect(importMembers(inputPath, outputPath)).rejects.toThrow(new RegExp(field, "i"));
    await expect(readFile(outputPath, "utf8")).resolves.toBe(originalOutput);
  });

  it.each([
    ["number", 123],
    ["boolean", true],
    ["formula", { formula: "\"公式方向\"", result: "公式方向" }],
    ["rich text", { richText: [{ text: "富文本方向" }] }],
    ["date", new Date("2026-07-26T00:00:00.000Z")],
  ])("rejects a %s direction cell before changing generated output", async (_label, invalidDirection) => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const rowsWithInvalidDirection: unknown[][] = validRows.map((row) => [...row]);
    rowsWithInvalidDirection[0][1] = invalidDirection;
    const inputPath = await createWorkbook(directory, [expectedHeaders, ...rowsWithInvalidDirection]);
    const outputPath = join(directory, "member-records.generated.ts");
    const originalOutput = "export const preserved = true;\n";
    await writeFile(outputPath, originalOutput);

    await expect(importMembers(inputPath, outputPath)).rejects.toThrow(/Invalid direction/i);
    await expect(readFile(outputPath, "utf8")).resolves.toBe(originalOutput);
  });

  it.each(["19garbage", "19.5"])(
    "rejects malformed grade %s before changing generated output",
    async (malformedGrade) => {
      const directory = await mkdtemp(join(tmpdir(), "member-import-"));
      const rowsWithMalformedGrade = validRows.map((row) => [...row]);
      rowsWithMalformedGrade[0][0] = malformedGrade;
      const inputPath = await createWorkbook(directory, [expectedHeaders, ...rowsWithMalformedGrade]);
      const outputPath = join(directory, "member-records.generated.ts");
      const originalOutput = "export const preserved = true;\n";
      await writeFile(outputPath, originalOutput);

      await expect(importMembers(inputPath, outputPath)).rejects.toThrow(/cohort/i);
      await expect(readFile(outputPath, "utf8")).resolves.toBe(originalOutput);
    },
  );

  it("writes the 33/53 partitions into one generated records module", async () => {
    const directory = await mkdtemp(join(tmpdir(), "member-import-"));
    const inputPath = await createWorkbook(directory, [expectedHeaders, ...validRows]);
    const outputPath = join(directory, "member-records.generated.ts");

    const records = await importMembers(inputPath, outputPath);

    expect(records.currentMembers).toHaveLength(33);
    expect(records.currentMembers).toEqual(expect.arrayContaining([
      expect.objectContaining({ cohort: 2023 }),
    ]));
    expect(records.currentMembers.map((record) => record.name)).not.toContain("蒋京玲");
    expect(records.currentMembers.map((record) => record.name)).not.toContain("罗乙番");
    expect(records.alumniMembers).toEqual(expect.arrayContaining([
      expect.objectContaining({ cohort: 2019 }),
    ]));
    const generatedOutput = await readFile(outputPath, "utf8");
    expect(generatedOutput).toContain("export const generatedMembers");
    expect(generatedOutput).toContain("export const generatedAlumniMembers");
    expect(generatedOutput.match(/id: "member-/g)).toHaveLength(33);
    expect(generatedOutput.match(/id: "alumni-/g)).toHaveLength(53);
    expect(generatedOutput).not.toContain("蒋京玲");
    expect(generatedOutput).not.toContain("罗乙番");
  });

  it.skipIf(process.env.MEMBER_SOURCE_CONFIG_PROBE === "1").each([
    ["is absent", undefined],
    ["is unreadable", join(tmpdir(), `missing-member-source-${process.pid}.xlsx`)],
  ])("fails clearly in CI when the real source workbook configuration %s", (_label, configuredPath) => {
    const childEnvironment = {
      ...process.env,
      CI: "1",
      MEMBER_SOURCE_CONFIG_PROBE: "1",
    };
    if (configuredPath) childEnvironment.MEMBER_SOURCE_WORKBOOK = configuredPath;
    else delete childEnvironment.MEMBER_SOURCE_WORKBOOK;

    const result = spawnSync(
      "npm",
      ["test", "--", "scripts/member-import.test.ts", "-t", "real source workbook"],
      {
        cwd: process.cwd(),
        encoding: "utf8",
        env: childEnvironment,
      },
    );
    const output = `${result.stdout}\n${result.stderr}`;

    expect(result.status).not.toBe(0);
    expect(output).toContain(
      "CI requires MEMBER_SOURCE_WORKBOOK to point to a readable original LEC workbook",
    );
  });

  if (sourceWorkbookConfigurationError) {
    it("requires MEMBER_SOURCE_WORKBOOK for the real source workbook in CI", () => {
      throw new Error(sourceWorkbookConfigurationError);
    });
  }

  it.runIf(sourceWorkbookIsReadable && !sourceWorkbookConfigurationError)(
    "imports the real source workbook into 33/53 partitions",
    async () => {
      const directory = await mkdtemp(join(tmpdir(), "member-import-"));
      const outputPath = join(directory, "member-records.generated.ts");

      const records = await importMembers(sourceWorkbookPath, outputPath);

      expect(records.currentMembers).toHaveLength(33);
      expect(records.alumniMembers).toHaveLength(53);
      expect(records.currentMembers).toEqual(expect.arrayContaining([
        { cohort: 2023, direction: "就业", major: "软工", name: "陈居浩", destination: "美团" },
        { cohort: 2024, direction: "", major: "软工", name: "龚云飞", destination: "" },
        { cohort: 2025, direction: "", major: "", name: "王硕", destination: "" },
      ]));
      expect(records.currentMembers.map((record) => record.name)).not.toContain("蒋京玲");
      expect(records.currentMembers.map((record) => record.name)).not.toContain("罗乙番");
      expect(records.alumniMembers).toContainEqual({
        cohort: 2019,
        direction: "深造",
        major: "物联网",
        name: "刘洪堃",
        destination: "电科",
      });
      expect(records.alumniMembers).toEqual(expect.arrayContaining([
        { cohort: 2022, direction: "就业", major: "物联网", name: "陈信豪", destination: "字节跳动" },
        { cohort: 2022, direction: "深造", major: "物联网", name: "隋炀", destination: "天津大学" },
      ]));
      const generatedOutput = await readFile(outputPath, "utf8");
      expect(generatedOutput).not.toContain("蒋京玲");
      expect(generatedOutput).not.toContain("罗乙番");
      const goldenOutput = await readFile(
        join(process.cwd(), "src/data/member-records.generated.ts"),
        "utf8",
      );
      expect(generatedOutput).toBe(goldenOutput);
    },
  );
});
