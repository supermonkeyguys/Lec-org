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
