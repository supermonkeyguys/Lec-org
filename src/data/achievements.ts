export interface AchievementStat {
  label: string;
  value: string;
  description: string;
}

export interface YearlyAchievementHighlight {
  year: string;
  details: string;
}

export const achievementsContent = {
  eyebrow: "Team Achievements",
  title: "团队成就",
  subtitle: "用竞赛、项目和成长记录每一次认真投入。",
  stats: [
    {
      label: "省级奖项",
      value: "100+",
      description: "蓝桥杯、天梯赛、睿抗。",
    },
    {
      label: "国家级奖项",
      value: "50+",
      description: "蓝桥杯、天梯赛、睿抗、ICPC、CCPC。",
    },
    {
      label: "项目实践",
      value: "多次立项",
      description: "服务外包、软件大赛、挑战杯。",
    },
    {
      label: "毕业生去向",
      value: "大厂 / 名校深造",
      description: "985、211 等名校；字节跳动、阿里巴巴等互联网头部大厂。",
    },
  ] satisfies AchievementStat[],
  yearlyHighlights: [
    {
      year: "2023",
      details: "天梯赛省赛 6 人次、国赛 10 人次。",
    },
    {
      year: "2024",
      details:
        "睿抗省赛 5 人次、国赛 3 人次；ICPC 陕西全国邀请赛铜奖；CCPC 郑州全国邀请赛银奖。",
    },
    {
      year: "2025",
      details:
        "睿抗省赛 10 人次、国赛 5 人次；天梯赛四川省赛团队一等奖/三等奖、全国总决赛团队二等奖；ICPC 陕西全国邀请赛铜奖；CCPC 福州全国邀请赛铜奖。",
    },
  ] satisfies YearlyAchievementHighlight[],
  eventTags: [
    "全国大学生软件大赛",
    "挑战杯",
    "团体程序设计天梯赛",
    "中国大学生服务外包创新创业大赛",
    "ACM-ICPC",
  ],
} as const;
