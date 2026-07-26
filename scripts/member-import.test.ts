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

  it("maps source directions to alumni outcomes", () => {
    expect(mapOutcome("深造")).toBe("graduate-exam");
    expect(mapOutcome("考公")).toBe("employment");
  });

  it("partitions current members by cohort", () => {
    expect(partitionRecords(normaliseRows(rows)).currentMembers).toHaveLength(2);
  });
});
