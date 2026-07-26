import { describe, expect, it } from "vitest";
import {
  mapOutcome,
  normaliseRows,
  partitionRecords,
} from "./member-import.mjs";

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
});
