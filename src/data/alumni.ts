export type AlumniOutcome = "recommendation" | "graduate-exam" | "employment";

export interface AlumniMember {
  id: string;
  name: string;
  cohort: number;
  outcome: AlumniOutcome;
  organization: string;
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
  statusMessage: "Mock 展示，正式资料待 Excel 导入后替换",
  emptyMessage: "优秀成员资料整理中",
} as const;

// Mock data for the alumni section. Replace with verified records when available.
export const alumniMembers: AlumniMember[] = [
  {
    id: "mock-2025-01",
    name: "陈思远",
    cohort: 2025,
    outcome: "recommendation",
    organization: "浙江大学",
    detail: "计算机科学与技术",
  },
  {
    id: "mock-2025-02",
    name: "林子涵",
    cohort: 2025,
    outcome: "employment",
    organization: "字节跳动",
    detail: "前端开发工程师",
  },
  {
    id: "mock-2024-01",
    name: "周明宇",
    cohort: 2024,
    outcome: "graduate-exam",
    organization: "北京航空航天大学",
    detail: "软件工程",
  },
  {
    id: "mock-2024-02",
    name: "王若曦",
    cohort: 2024,
    outcome: "employment",
    organization: "腾讯",
    detail: "后端开发工程师",
  },
  {
    id: "mock-2023-01",
    name: "刘晨",
    cohort: 2023,
    outcome: "recommendation",
    organization: "华中科技大学",
    detail: "计算机技术",
  },
  {
    id: "mock-2023-02",
    name: "赵雨桐",
    cohort: 2023,
    outcome: "graduate-exam",
    organization: "武汉大学",
    detail: "人工智能",
  },
  {
    id: "mock-2022-01",
    name: "孙浩然",
    cohort: 2022,
    outcome: "employment",
    organization: "阿里云",
    detail: "云计算开发工程师",
  },
  {
    id: "mock-2022-02",
    name: "吴佳宁",
    cohort: 2022,
    outcome: "recommendation",
    organization: "中山大学",
    detail: "计算机科学与技术",
  },
  {
    id: "mock-2021-01",
    name: "郑博文",
    cohort: 2021,
    outcome: "graduate-exam",
    organization: "电子科技大学",
    detail: "网络与信息安全",
  },
  {
    id: "mock-2021-02",
    name: "何欣怡",
    cohort: 2021,
    outcome: "employment",
    organization: "美团",
    detail: "产品经理",
  },
];
