export interface AchievementStat {
  label: string;
  value: string;
  description: string;
}

export const achievementsContent = {
  eyebrow: "Team Achievements",
  title: "团队成就",
  subtitle: "用竞赛、项目和成长记录每一次认真投入。",
  stats: [
    {
      label: "省级奖项",
      value: "100+",
      description: "参考站展示数据，待正式资料确认。",
    },
    {
      label: "国家级奖项",
      value: "50+",
      description: "参考站展示数据，待正式资料确认。",
    },
    {
      label: "项目实践",
      value: "多次立项",
      description: "团队项目曾多次获学院立项，待正式资料确认。",
    },
    {
      label: "毕业生去向",
      value: "大厂 / 名校深造",
      description: "参考站介绍内容，待正式资料确认。",
    },
  ] satisfies AchievementStat[],
  eventTags: [
    "全国大学生软件大赛",
    "挑战杯",
    "团体程序设计天梯赛",
    "中国大学生服务外包创新创业大赛",
    "ACM-ICPC",
  ],
} as const;
