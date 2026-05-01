export interface Value {
  title: string;
  description: string;
}

export interface TeamInfo {
  name: string;
  nameEn: string;
  founded: number;
  mission: string;
  values: Value[];
}

export const teamInfo: TeamInfo = {
  name: "LEC 实验室",
  nameEn: "LEC Lab",
  founded: 2014,
  mission:
    "探索计算机科学的边界，培养热爱技术、敢于实践的工程师。我们相信最好的学习方式是动手创造，在解决真实问题的过程中成长。",
  values: [
    {
      title: "实践驱动",
      description:
        "不以理论为终点，以能跑通的代码、能上线的产品作为学习的闭环。",
    },
    {
      title: "开放协作",
      description:
        "知识在传递中增值。每周技术分享、代码 review 互评、学长带学弟。",
    },
    {
      title: "长期主义",
      description:
        "不追逐速成技巧，关注计算机科学的本质与工程能力的内化。",
    },
    {
      title: "传承精神",
      description:
        "每一届既是学习者也是传承者。10 年积累，一届一届的文档、代码和经验沉淀下来。",
    },
  ],
};
