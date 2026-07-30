import { generatedRecentActivities } from "./recent-activities.generated";

export interface RecentActivity {
  id: string;
  year: number;
  month: number;
  dateLabel: string;
  title: string;
}

export const historyContent = {
  eyebrow: "Recent Activity",
  title: "我们最近在",
  subtitle: "记录 LEC 的最新动态。",
} as const;

export const recentActivities = generatedRecentActivities;
