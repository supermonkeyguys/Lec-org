import { generatedAlumniMembers } from "./member-records.generated";

export type AlumniOutcome = "recommendation" | "graduate-exam" | "employment";

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

export const alumniMembers: AlumniMember[] = generatedAlumniMembers.filter(
  (member) => Boolean(member.organization) && member.cohort < 2023,
);
