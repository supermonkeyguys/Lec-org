export interface SectionItem {
  id: string;
  label: string;
  num: string;
}

export const sections: SectionItem[] = [
  { id: "hero", label: "首页", num: "01" },
  { id: "mission", label: "宗旨", num: "02" },
  { id: "members", label: "成员", num: "03" },
  { id: "alumni", label: "优秀成员", num: "04" },
  { id: "history", label: "历史", num: "05" },
];
