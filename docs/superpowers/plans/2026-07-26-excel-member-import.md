# Excel Member Import Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (- [ ]) syntax for tracking.

**Goal:** Replace mock member cards with the named records in LEC近三年人员信息 (1).xlsx.

**Architecture:** A development-only Node importer reads Sheet1, forward-fills merged cells, and emits the existing TypeScript data modules. The website continues to read static TypeScript data, with optional Excel fields rendered conditionally.

**Tech Stack:** Next.js 16 Pages Router, React 19, TypeScript, Vitest, Tailwind CSS, xlsx.

## Global Constraints

- Read only Sheet1; never commit, overwrite, or mutate the source workbook.
- Route all named 19–23 cohort records to alumniMembers (65 records) and all named 24/25 cohort records to members (23 records); ignore the blank 在读 separator row.
- Map 保研 → recommendation, 考研/深造 → graduate-exam, 就业/考公 → employment; omit the tag for an empty source direction.
- Do not modify the seven existing technical directions or the current section layout.

---

## File Structure

- scripts/member-import.mjs: normalizes workbook rows and writes deterministic data modules.
- scripts/member-import.test.ts: tests row normalization and partitioning.
- src/data/members.ts, src/data/alumni.ts: generated records and non-mock content copy.
- src/components/Members.tsx, src/components/Alumni.tsx: safe rendering of optional real-data fields.
- Existing matching *.test.* files: real-record regressions.

### Task 1: Build the normalization layer

**Files:**
- Create: scripts/member-import.mjs
- Create: scripts/member-import.test.ts

**Interfaces:**
- Produces normaliseRows(rows): Array<{ cohort: number; direction: string; major: string; name: string; destination: string }>.
- Produces partitionRecords(records): { currentMembers: SourceRecord[]; alumniMembers: SourceRecord[] }.
- Produces mapOutcome(direction): "recommendation" | "graduate-exam" | "employment" | undefined.

- [ ] **Step 1: Write the failing Vitest cases**

~~~ts
const rows = [
  ["19级", "保研", "物联网", "赵千", "电科"],
  [undefined, "就业", "软工", "赵宇", "字节跳动"],
  ["在读", undefined, undefined, undefined, undefined],
  ["24", undefined, "软工", "gyf", undefined],
  ["25", undefined, undefined, "ws", undefined],
] as const;

expect(normaliseRows(rows)).toEqual([
  { cohort: 2019, direction: "保研", major: "物联网", name: "赵千", destination: "电科" },
  { cohort: 2019, direction: "就业", major: "软工", name: "赵宇", destination: "字节跳动" },
  { cohort: 2024, direction: "", major: "软工", name: "gyf", destination: "" },
  { cohort: 2025, direction: "", major: "", name: "ws", destination: "" },
]);
expect(mapOutcome("深造")).toBe("graduate-exam");
expect(mapOutcome("考公")).toBe("employment");
expect(partitionRecords(normaliseRows(rows)).currentMembers).toHaveLength(2);
~~~

- [ ] **Step 2: Prove the test is red**

Run: npm test -- scripts/member-import.test.ts

Expected: FAIL because scripts/member-import.mjs and its exports do not exist.

- [ ] **Step 3: Implement the minimal conversion functions**

~~~js
export function mapOutcome(direction) {
  return { 保研: "recommendation", 考研: "graduate-exam", 深造: "graduate-exam", 就业: "employment", 考公: "employment" }[direction.trim()];
}

export function normaliseRows(rows) {
  let grade = "";
  let direction = "";
  return rows.flatMap(([nextGrade, nextDirection, major, name, destination]) => {
    if (nextGrade) { grade = String(nextGrade).trim(); direction = ""; }
    if (nextDirection) direction = String(nextDirection).trim();
    const cohort = Number.parseInt(grade, 10);
    const memberName = String(name ?? "").trim();
    if (!Number.isInteger(cohort) || !memberName) return [];
    return [{ cohort: 2000 + cohort, direction, major: String(major ?? "").trim(), name: memberName, destination: String(destination ?? "").trim() }];
  });
}
~~~

Implement partitionRecords to retain source order, group 2019–2023 as alumni, and group 2024–2025 as current members.

- [ ] **Step 4: Prove the focused test is green**

Run: npm test -- scripts/member-import.test.ts

Expected: PASS with the merged-cell, separator, mapping, and cohort assertions.

- [ ] **Step 5: Commit Task 1**

~~~bash
git add scripts/member-import.mjs scripts/member-import.test.ts
git commit -m "feat: normalize member Excel records"
~~~

### Task 2: Add the reproducible Excel CLI and generate the arrays

**Files:**
- Modify: package.json
- Modify: package-lock.json
- Modify: scripts/member-import.mjs
- Modify: src/data/members.ts
- Modify: src/data/alumni.ts

**Interfaces:**
- npm run import:members -- "/absolute/path/to/file.xlsx" reads the workbook and writes exactly the two data modules.
- A generated member has { id, name, cohort, role, status: "current", avatar, bio? }.
- A generated alumnus has { id, name, cohort, outcome?, organization?, detail? }.

- [ ] **Step 1: Add the isolated parser dependency and command**

~~~json
{
  "scripts": { "import:members": "node scripts/member-import.mjs" },
  "devDependencies": { "xlsx": "^0.18.5" }
}
~~~

Run: npm install --package-lock-only

Expected: package lock gains xlsx; production dependencies remain unchanged.

- [ ] **Step 2: Implement the workbook boundary and writers**

~~~js
const workbook = XLSX.readFile(inputPath, { cellDates: false });
const sheet = workbook.Sheets.Sheet1;
if (!sheet) throw new Error("Workbook must contain Sheet1");
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" }).slice(1);
const records = partitionRecords(normaliseRows(rows));
await writeFile(new URL("../src/data/members.ts", import.meta.url), renderMembers(records.currentMembers));
await writeFile(new URL("../src/data/alumni.ts", import.meta.url), renderAlumni(records.alumniMembers));
~~~

Use source-order IDs. Set role to the cohort display label, bio to a non-empty major, and a DiceBear avatar URL derived from the name. Only emit outcome, organization, and detail when their source cells contain text. Make rendered files retain their interfaces, label constants, and non-mock copy.

- [ ] **Step 3: Generate data from the supplied workbook**

Run: npm run import:members -- "/Users/cookie/Library/Containers/com.tencent.qq/Data/Downloads/LEC近三年人员信息 (1).xlsx"

Expected: Imported 23 current members and 65 alumni members; the Excel source timestamp and bytes are unchanged.

- [ ] **Step 4: Commit Task 2**

~~~bash
git add package.json package-lock.json scripts/member-import.mjs src/data/members.ts src/data/alumni.ts
git commit -m "feat: import LEC member records"
~~~

### Task 3: Render optional real-data fields and lock down the result

**Files:**
- Modify: src/data/members.test.ts
- Modify: src/data/alumni.test.ts
- Modify: src/components/Members.tsx
- Modify: src/components/Members.test.tsx
- Modify: src/components/Alumni.tsx
- Modify: src/components/Alumni.test.tsx

**Interfaces:**
- AlumniMember.outcome, organization, and detail are optional.
- Public component imports from @/data/members and @/data/alumni remain unchanged.

- [ ] **Step 1: Replace the mock assertions with workbook invariants**

~~~ts
expect(members).toHaveLength(23);
expect(new Set(members.map((member) => member.cohort))).toEqual(new Set([2024, 2025]));
expect(alumniMembers).toHaveLength(65);
expect(new Set(alumniMembers.map((member) => member.cohort))).toEqual(new Set([2019, 2020, 2021, 2022, 2023]));
expect(alumniMembers.some((member) => member.name === "刘洪堃")).toBe(true);
expect(alumniMembers.some((member) => member.name.includes("Mock"))).toBe(false);
~~~

Update component tests to assert the 2024 filter contains gyf, alumni contains 2019 届 and 刘洪堃, and no page copy includes Mock 展示.

- [ ] **Step 2: Prove the updated tests are red**

Run: npm test -- src/data/members.test.ts src/data/alumni.test.ts src/components/Members.test.tsx src/components/Alumni.test.tsx

Expected: FAIL against the current mock data and unconditional alumni fields.

- [ ] **Step 3: Render only populated alumni fields**

~~~tsx
{member.outcome && (
  <span className={\`rounded-full px-2 py-0.5 font-mono text-xs \${outcomeClassNames[member.outcome]}\`}>
    {outcomeLabels[member.outcome]}
  </span>
)}
{member.organization && <p className="text-muted">{member.organization}</p>}
{member.detail && <p className="mt-1 text-sm text-fade">{member.detail}</p>}
~~~

Keep newest-first groups, current grid classes, responsive behavior, and all technical-direction data untouched.

- [ ] **Step 4: Prove the focused regressions are green**

Run: npm test -- src/data/members.test.ts src/data/alumni.test.ts src/components/Members.test.tsx src/components/Alumni.test.tsx

Expected: PASS with no empty labels, destination paragraphs, or mock text.

- [ ] **Step 5: Commit Task 3**

~~~bash
git add src/data/members.test.ts src/data/alumni.test.ts src/components/Members.tsx src/components/Members.test.tsx src/components/Alumni.tsx src/components/Alumni.test.tsx
git commit -m "feat: show imported member records"
~~~

### Task 4: Verify the static site and preview

**Files:**
- No source changes.

- [ ] **Step 1: Run full automated verification**

Run: npm test && npm run lint && npm run build

Expected: all Vitest files pass, ESLint exits zero, and the static export completes.

- [ ] **Step 2: Run the refresh without stopping the old preview**

Run: npm run dev -- -p 3013

Expected: the branch is visible at http://localhost:3013/; leave the existing localhost:3000 process alone.

- [ ] **Step 3: Browser-check member views**

At desktop and 390px widths, select both current-member cohorts and confirm 2023–2019 alumni cohorts, real names, responsive cards, and no horizontal scrolling.

- [ ] **Step 4: Confirm the staged scope before hand-off**

Run: git diff --check && git status --short

Expected: no Excel source file or browser-output directory is staged.
