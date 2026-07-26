import { generatedMembers } from "./member-records.generated";

export interface Member {
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

export const members: Member[] = generatedMembers;
