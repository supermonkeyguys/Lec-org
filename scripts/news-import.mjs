import { rename, unlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ExcelJS from "exceljs";

const expectedHeaders = ["时间", "事件"];
const generatedActivitiesPath = resolve(
  process.cwd(),
  "src/data/recent-activities.generated.ts",
);

const text = (value) => JSON.stringify(value);

export function parseDate(value) {
  const match = /^(\d{4})[.-](\d{1,2})$/.exec(String(value).trim());
  if (!match) throw new Error(`Invalid activity date: ${value}`);

  const year = Number.parseInt(match[1], 10);
  const month = Number.parseInt(match[2], 10);
  if (month < 1 || month > 12) throw new Error(`Invalid activity date: ${value}`);

  return { year, month, dateLabel: `${year} 年 ${month} 月` };
}

export function normaliseNewsRows(rows) {
  const headers = rows[0] ?? [];
  if (headers.length < expectedHeaders.length || expectedHeaders.some((header, index) => headers[index] !== header)) {
    throw new Error("Workbook headers must be 时间, 事件 in that order");
  }

  return rows.slice(1)
    .flatMap(([date, rawTitle], index) => {
      if (typeof rawTitle !== "string" || !rawTitle.trim()) return [];

      try {
        return [{
          ...parseDate(date),
          title: rawTitle.trim(),
          sourceIndex: index,
        }];
      } catch (error) {
        throw new Error(`${error.message} at source row ${index + 2}`);
      }
    })
    .sort((left, right) => (
      right.year - left.year
      || right.month - left.month
      || left.sourceIndex - right.sourceIndex
    ))
    .map(({ year, month, dateLabel, title }, index) => ({
      id: `activity-${index + 1}`,
      year,
      month,
      dateLabel,
      title,
    }));
}

export function renderGeneratedActivities(records) {
  const activities = records.map((activity) => `  {\n    id: ${text(activity.id)},\n    year: ${activity.year},\n    month: ${activity.month},\n    dateLabel: ${text(activity.dateLabel)},\n    title: ${text(activity.title)},\n  }`).join(",\n");

  return `import type { RecentActivity } from "./milestones";

export const generatedRecentActivities: RecentActivity[] = [
${activities}
];
`;
}

async function writeAtomically(outputPath, content) {
  const temporaryPath = join(
    dirname(outputPath),
    `.${Date.now()}-${process.pid}-recent-activities.generated.ts.tmp`,
  );

  try {
    await writeFile(temporaryPath, content);
    await rename(temporaryPath, outputPath);
  } finally {
    await unlink(temporaryPath).catch(() => {});
  }
}

const worksheetRows = (sheet) => Array.from(
  { length: sheet.rowCount },
  (_, rowIndex) => [
    sheet.getCell(rowIndex + 1, 1).value,
    sheet.getCell(rowIndex + 1, 2).value,
  ],
);

export async function importNews(inputPath, outputPath = generatedActivitiesPath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputPath);
  const sheet = workbook.worksheets[0];
  if (!sheet) throw new Error("Workbook must contain a worksheet");

  const records = normaliseNewsRows(worksheetRows(sheet));
  await writeAtomically(outputPath, renderGeneratedActivities(records));
  return records;
}

if (process.argv[1]?.endsWith("news-import.mjs") && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inputPath = process.argv[2];
  if (!inputPath) throw new Error("Usage: npm run import:news -- /absolute/path/to/news.xlsx");

  const records = await importNews(inputPath);
  console.log(`Imported ${records.length} recent activities.`);
}
