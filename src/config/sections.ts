export interface SectionItem {
  id: string;
  label: string;
  num: string;
}

export const sections: SectionItem[] = [
  { id: "hero", label: "首页", num: "01" },
  { id: "mission", label: "宗旨", num: "02" },
  { id: "achievements", label: "成就", num: "03" },
  { id: "directions", label: "方向", num: "04" },
  { id: "members", label: "成员", num: "05" },
  { id: "alumni", label: "优秀成员", num: "06" },
  { id: "history", label: "历史", num: "07" },
  { id: "recruitment", label: "招新", num: "08" },
];
