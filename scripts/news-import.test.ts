import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { expect, it } from "vitest";
import ExcelJS from "exceljs";
import { importNews, normaliseNewsRows } from "./news-import.mjs";

const headers = ["时间", "事件"];

async function createWorkbook(directory: string, rows: unknown[][]) {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("工作表1");
  sheet.addRows(rows);
  const inputPath = join(directory, "news.xlsx");
  await workbook.xlsx.writeFile(inputPath);
  return inputPath;
}

it("normalises mixed date formats and sorts events newest first", () => {
  expect(normaliseNewsRows([
    headers,
    ["2024.2", "较早动态"],
    ["2026-07", "最新动态一"],
    ["2026.07", "最新动态二"],
    ["2025.11", "中间动态"],
    ["2025.03", ""],
  ])).toMatchObject([
    { id: "activity-1", dateLabel: "2026 年 7 月", title: "最新动态一" },
    { id: "activity-2", dateLabel: "2026 年 7 月", title: "最新动态二" },
    { id: "activity-3", dateLabel: "2025 年 11 月", title: "中间动态" },
    { id: "activity-4", dateLabel: "2024 年 2 月", title: "较早动态" },
  ]);
});

it("rejects invalid headers without replacing generated activity data", async () => {
  const directory = await mkdtemp(join(tmpdir(), "news-import-"));
  const inputPath = await createWorkbook(directory, [["日期", "事件"], ["2026.07", "动态"]]);
  const outputPath = join(directory, "recent-activities.generated.ts");
  const originalOutput = "export const preserved = true;\n";
  await writeFile(outputPath, originalOutput);

  await expect(importNews(inputPath, outputPath)).rejects.toThrow(/headers/i);
  await expect(readFile(outputPath, "utf8")).resolves.toBe(originalOutput);
});
