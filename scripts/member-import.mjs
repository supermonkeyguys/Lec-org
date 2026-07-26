import { rename, unlink, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import XLSX from "xlsx";

const expectedHeaders = ["年级", "方向", "专业", "姓名", "毕业去向"];
const allowedDirections = new Set(["保研", "考研", "深造", "就业", "考公"]);
const generatedRecordsPath = resolve(process.cwd(), "src/data/member-records.generated.ts");

export function mapOutcome(direction) {
  return {
    保研: "recommendation",
    考研: "graduate-exam",
    深造: "graduate-exam",
    就业: "employment",
    考公: "employment",
  }[direction.trim()];
}

const isMergedContinuation = (merges, sourceRow, column) => merges.some(({ s, e }) => (
  s.c <= column && e.c >= column && s.r < sourceRow && sourceRow <= e.r
));

export function normaliseRows(rows, merges = []) {
  let grade = "";
  let direction = "";

  return rows.flatMap(([nextGrade, nextDirection, major, name, destination], rowIndex) => {
    if (nextGrade) {
      grade = String(nextGrade).trim();
      direction = "";
    }
    if (nextDirection) direction = String(nextDirection).trim();
    else if (!isMergedContinuation(merges, rowIndex + 1, 1)) direction = "";

    const cohort = Number.parseInt(grade, 10);
    const memberName = String(name ?? "").trim();
    if (!Number.isInteger(cohort) || !memberName) return [];

    return [{
      cohort: 2000 + cohort,
      direction,
      major: String(major ?? "").trim(),
      name: memberName,
      destination: String(destination ?? "").trim(),
    }];
  });
}

export function partitionRecords(records) {
  return records.reduce(
    (partitions, record) => {
      if (record.cohort >= 2019 && record.cohort <= 2023) {
        partitions.alumniMembers.push(record);
      }
      if (record.cohort >= 2024 && record.cohort <= 2025) {
        partitions.currentMembers.push(record);
      }
      return partitions;
    },
    { currentMembers: [], alumniMembers: [] },
  );
}

const text = (value) => JSON.stringify(value);

const renderRecords = (records, renderRecord) => records
  .map((record, index) => renderRecord(record, index))
  .join(",\n");

const renderMembers = (records) => renderRecords(records, (record, index) => {
  const bio = record.major ? `\n    bio: ${text(record.major)},` : "";
  const avatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(record.name)}&radius=50`;

  return `  {\n    id: ${text(`member-${index + 1}`)},\n    name: ${text(record.name)},\n    cohort: ${record.cohort},\n    role: ${text(`${record.cohort} 级`)},\n    status: "current",\n    avatar: ${text(avatar)},${bio}\n  }`;
});

const renderAlumni = (records) => renderRecords(records, (record, index) => {
  const outcome = mapOutcome(record.direction);
  const fields = [
    outcome && `    outcome: ${text(outcome)},`,
    record.destination && `    organization: ${text(record.destination)},`,
    record.major && `    detail: ${text(record.major)},`,
  ].filter(Boolean).join("\n");

  return `  {\n    id: ${text(`alumni-${index + 1}`)},\n    name: ${text(record.name)},\n    cohort: ${record.cohort},${fields ? `\n${fields}` : ""}\n  }`;
});

export function renderGeneratedRecords(records) {
  return `import type { Member } from "./members";
import type { AlumniMember } from "./alumni";

export const generatedMembers: Member[] = [
${renderMembers(records.currentMembers)}
];

export const generatedAlumniMembers: AlumniMember[] = [
${renderAlumni(records.alumniMembers)}
];
`;
}

const isEmptyRow = (row) => row.every((value) => String(value ?? "").trim() === "");

function validateSourceRows(rows, merges) {
  let grade = "";
  let direction = "";

  rows.forEach(([nextGrade, nextDirection, major, name, destination], rowIndex) => {
    if (nextGrade) {
      grade = String(nextGrade).trim();
      direction = "";
    }
    if (nextDirection) direction = String(nextDirection).trim();
    else if (!isMergedContinuation(merges, rowIndex + 1, 1)) direction = "";

    const row = [nextGrade, nextDirection, major, name, destination];
    if (isEmptyRow(row) || (grade === "在读" && isEmptyRow([nextDirection, major, name, destination]))) {
      return;
    }

    const cohort = Number.parseInt(grade, 10);
    if (!Number.isInteger(cohort)) {
      throw new Error(`Invalid cohort at Sheet1 row ${rowIndex + 2}`);
    }
    if (!String(name ?? "").trim()) {
      throw new Error(`Member name is required at Sheet1 row ${rowIndex + 2}`);
    }
    if (direction && !allowedDirections.has(direction)) {
      throw new Error(`Unknown direction at Sheet1 row ${rowIndex + 2}: ${direction}`);
    }
  });
}

export function validateWorkbook(rows, merges = []) {
  const headers = rows[0] ?? [];
  if (headers.length !== expectedHeaders.length || headers.some((header, index) => header !== expectedHeaders[index])) {
    throw new Error("Sheet1 headers must be 年级, 方向, 专业, 姓名, 毕业去向 in that order");
  }

  const dataRows = rows.slice(1);
  validateSourceRows(dataRows, merges);
  const sourceRecords = normaliseRows(dataRows, merges);
  const records = partitionRecords(sourceRecords);

  if (sourceRecords.some((record) => record.cohort < 2019 || record.cohort > 2025)) {
    throw new Error("Member cohorts must be 2019 through 2025");
  }
  if (records.currentMembers.length !== 23) {
    throw new Error(`Expected 23 current members, found ${records.currentMembers.length}`);
  }
  if (records.alumniMembers.length !== 65) {
    throw new Error(`Expected 65 alumni members, found ${records.alumniMembers.length}`);
  }

  const currentCohorts = new Set(records.currentMembers.map((record) => record.cohort));
  const alumniCohorts = new Set(records.alumniMembers.map((record) => record.cohort));
  if (currentCohorts.size !== 2 || !currentCohorts.has(2024) || !currentCohorts.has(2025)) {
    throw new Error("Current member cohorts must be 2024 and 2025");
  }
  if (alumniCohorts.size !== 5 || [2019, 2020, 2021, 2022, 2023].some((cohort) => !alumniCohorts.has(cohort))) {
    throw new Error("Alumni cohorts must be 2019 through 2023");
  }

  return records;
}

async function writeAtomically(outputPath, content) {
  const temporaryPath = join(
    dirname(outputPath),
    `.${Date.now()}-${process.pid}-member-records.generated.ts.tmp`,
  );

  try {
    await writeFile(temporaryPath, content);
    await rename(temporaryPath, outputPath);
  } finally {
    await unlink(temporaryPath).catch(() => {});
  }
}

export async function importMembers(inputPath, outputPath = generatedRecordsPath) {
  const workbook = XLSX.readFile(inputPath, { cellDates: false });
  const sheet = workbook.Sheets.Sheet1;
  if (!sheet) throw new Error("Workbook must contain Sheet1");

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
  const records = validateWorkbook(rows, sheet["!merges"] ?? []);
  await writeAtomically(outputPath, renderGeneratedRecords(records));

  return records;
}

if (process.argv[1]?.endsWith("member-import.mjs") && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inputPath = process.argv[2];
  if (!inputPath) throw new Error("Usage: npm run import:members -- /absolute/path/to/file.xlsx");

  const records = await importMembers(inputPath);
  console.log(`Imported ${records.currentMembers.length} current members and ${records.alumniMembers.length} alumni members.`);
}
