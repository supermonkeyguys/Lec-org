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
    introduction: string[];
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
    { src: "/about/lec-about-01.webp", alt: "团队成员围坐火锅聚餐" },
    { src: "/about/lec-about-02.webp", alt: "团队成员乘坐商场扶梯" },
    { src: "/about/lec-about-03.webp", alt: "夜间树下的团队成员与小狗合影" },
    { src: "/about/lec-about-04.webp", alt: "身穿学士服的团队成员在校园合影" },
    { src: "/about/lec-about-05.webp", alt: "成员在橙白热气球装置前集体合影" },
    { src: "/about/lec-about-06.webp", alt: "户外树下手持风车与礼物的团队成员合影" },
  ],
  content: {
    heroMeta: "2010 年 6 月成立",
    heroCta: "认识我们的优秀成员 →",
    missionEyebrow: "Team Profile",
    missionTitle: "团队宗旨与日常",
    introduction: [
      "乐程软件工作室自 2010 年 6 月创立以来，已在软件开发和作品开发领域深耕了十余年。我们是学生科研领域的佼佼者，致力于多方向的技术学习与人才培养，涵盖前后端开发、算法竞赛、机器学习、游戏开发等多个领域。",
      "团队目前有成员30余人，采取每周28小时考勤制度，定期开展例会和学习交流促进团队发展，形成良好学风。同时也积极组织参与各级别比赛，团队项目曾多次成功获学院立项，更获省、国赛奖项百余项。大家因对技术的热爱相聚于此，在尊重和包容的团队氛围中，积极分享想法、大胆展现自我，携手攻克一个又一个技术难题。",
      "通过乐程的学习与培养，部分成员保研至电子科大、川大等知名大学继续深造。也有部分成员就职于字节、腾讯、阿里、美团等互联网行业领军企业。我们将本着\"学以致用，服务学校，走向社会\"的宗旨，用优秀的软件和细致的服务为我们的数字化生活提供便利，也为团队和每位成员带来更好的学习空间与成长机会。",
    ],
    footerTagline: "Built by LEC members",
  },
};
