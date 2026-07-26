import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import XLSX from "xlsx";

export function mapOutcome(direction) {
  return {
    保研: "recommendation",
    考研: "graduate-exam",
    深造: "graduate-exam",
    就业: "employment",
    考公: "employment",
  }[direction.trim()];
}

export function normaliseRows(rows) {
  let grade = "";
  let direction = "";

  return rows.flatMap(([nextGrade, nextDirection, major, name, destination]) => {
    if (nextGrade) {
      grade = String(nextGrade).trim();
      direction = "";
    }
    if (nextDirection) direction = String(nextDirection).trim();

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

export function renderMembers(records) {
  const renderedRecords = renderRecords(records, (record, index) => {
    const bio = record.major ? `\n    bio: ${text(record.major)},` : "";
    const avatar = `https://api.dicebear.com/9.x/pixel-art/svg?seed=${encodeURIComponent(record.name)}&radius=50`;

    return `  {\n    id: ${text(`member-${index + 1}`)},\n    name: ${text(record.name)},\n    cohort: ${record.cohort},\n    role: ${text(`${record.cohort} 级`)},\n    status: "current",\n    avatar: ${text(avatar)},${bio}\n  }`;
  });

  return `export interface Member {
  id: string;
  name: string;
  cohort: number;
  role: string;
  status: "current";
  avatar: string;
  bio?: string;
}

export const membersContent = {
  eyebrow: "Our People",
  title: "成员",
  subtitle: "当前在读成员",
  statusLabel: "在读",
  emptyMessage: "在读成员资料整理中",
} as const;

export const members: Member[] = [
${renderedRecords}
];
`;
}

export function renderAlumni(records) {
  const renderedRecords = renderRecords(records, (record, index) => {
    const outcome = mapOutcome(record.direction);
    const fields = [
      outcome && `    outcome: ${text(outcome)},`,
      record.destination && `    organization: ${text(record.destination)},`,
      record.major && `    detail: ${text(record.major)},`,
    ].filter(Boolean).join("\n");

    return `  {\n    id: ${text(`alumni-${index + 1}`)},\n    name: ${text(record.name)},\n    cohort: ${record.cohort},${fields ? `\n${fields}` : ""}\n  }`;
  });

  return `export type AlumniOutcome = "recommendation" | "graduate-exam" | "employment";

export interface AlumniMember {
  id: string;
  name: string;
  cohort: number;
  outcome?: AlumniOutcome;
  organization?: string;
  detail?: string;
}

export const outcomeLabels: Record<AlumniOutcome, string> = {
  recommendation: "保研",
  "graduate-exam": "考研",
  employment: "就业",
};

export const alumniContent = {
  eyebrow: "Alumni Outcomes",
  title: "往届优秀成员",
  statusMessage: "优秀成员资料整理中",
  emptyMessage: "优秀成员资料整理中",
} as const;

export const alumniMembers: AlumniMember[] = [
${renderedRecords}
];
`;
}

export async function importMembers(inputPath) {
  const workbook = XLSX.readFile(inputPath, { cellDates: false });
  const sheet = workbook.Sheets.Sheet1;
  if (!sheet) throw new Error("Workbook must contain Sheet1");

  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }).slice(1);
  const records = partitionRecords(normaliseRows(rows));

  await writeFile(new URL("../src/data/members.ts", import.meta.url), renderMembers(records.currentMembers));
  await writeFile(new URL("../src/data/alumni.ts", import.meta.url), renderAlumni(records.alumniMembers));

  return records;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const inputPath = process.argv[2];
  if (!inputPath) throw new Error("Usage: npm run import:members -- /absolute/path/to/file.xlsx");

  const records = await importMembers(inputPath);
  console.log(`Imported ${records.currentMembers.length} current members and ${records.alumniMembers.length} alumni members.`);
}
