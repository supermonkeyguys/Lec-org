export type MilestoneSourceStatus = "temporary" | "verified";

export interface Milestone {
  id: string;
  dateLabel: string;
  title: string;
  description: string;
  sourceStatus: MilestoneSourceStatus;
  sourceNote: string;
}

export const historyContent = {
  eyebrow: "Team History",
  title: "团队历史",
  subtitle: "现阶段仅展示团队介绍中可确认的成立时间。",
  statusLabel: "临时展示 · 正式历史资料待补充",
} as const;

export const milestones: Milestone[] = [
  {
    id: "founded-2010-06",
    dateLabel: "2010 年 6 月",
    title: "团队成立",
    description: "LEC 团队成立，宗旨为“学以致用，服务学校，走向社会”。",
    sourceStatus: "temporary",
    sourceNote: "依据现有团队介绍整理，待正式历史资料核验。",
  },
];
