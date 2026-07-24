export interface Milestone {
  year: number;
  title: string;
  description: string;
}

export const milestones: Milestone[] = [
  {
    year: 2010,
    title: "团队成立",
    description:
      "临时节点（待正式资料核验）：团队于 2010 年 6 月成立；其余信息将在正式资料到位后替换。",
  },
  {
    year: 2015,
    title: "持续学习交流",
    description: "临时节点：通过例会和学习交流，持续开展技术学习与实践。",
  },
  {
    year: 2020,
    title: "竞赛与项目实践",
    description: "临时节点：围绕竞赛和项目实践，帮助成员将所学知识用于解决实际问题。",
  },
  {
    year: 2025,
    title: "资料待补充",
    description: "临时节点：正式团队历史资料到位后，将统一替换当前展示内容。",
  },
];
