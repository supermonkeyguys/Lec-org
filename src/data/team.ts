export interface TeamFact {
  label: string;
  value: string;
  description: string;
}

export interface TeamAboutImage {
  src: string;
  alt: string;
}

export interface TeamInfo {
  name: string;
  nameEn: string;
  founded: { year: number; month: number };
  memberCount: { value: number; approximate: boolean };
  weeklyAttendanceHours: number;
  mission: string;
  facts: TeamFact[];
  aboutImages: TeamAboutImage[];
  content: {
    heroMeta: string;
    heroCta: string;
    missionEyebrow: string;
    missionTitle: string;
    missionSubtitle: string;
    footerTagline: string;
  };
}

export const teamInfo: TeamInfo = {
  name: "LEC 实验室",
  nameEn: "LEC Lab",
  founded: { year: 2010, month: 6 },
  memberCount: { value: 30, approximate: true },
  weeklyAttendanceHours: 28,
  mission: "学以致用，服务学校，走向社会",
  facts: [
    {
      label: "团队规模",
      value: "约 30 人",
      description: "由在读成员共同参与团队学习与建设。",
    },
    {
      label: "每周考勤",
      value: "28 小时",
      description: "以稳定投入保障学习与实践进度。",
    },
    {
      label: "日常活动",
      value: "例会 / 学习交流",
      description: "通过固定交流保持信息同步与知识共享。",
    },
    {
      label: "实践方向",
      value: "竞赛 / 项目实践",
      description: "把所学知识用于竞赛准备和项目实践。",
    },
  ],
  aboutImages: [
    { src: "/about/lec-about-01.webp", alt: "乐程团队活动照片 1" },
    { src: "/about/lec-about-02.webp", alt: "乐程团队活动照片 2" },
    { src: "/about/lec-about-03.webp", alt: "乐程团队活动照片 3" },
    { src: "/about/lec-about-04.webp", alt: "乐程团队活动照片 4" },
    { src: "/about/lec-about-05.webp", alt: "乐程团队活动照片 5" },
    { src: "/about/lec-about-06.webp", alt: "乐程团队活动照片 6" },
  ],
  content: {
    heroMeta: "2010 年 6 月成立",
    heroCta: "认识我们的成员 →",
    missionEyebrow: "Team Profile",
    missionTitle: "团队宗旨与日常",
    missionSubtitle: "团队介绍临时依据，正式资料到位后从数据文件统一替换。",
    footerTagline: "Built by LEC members",
  },
};
