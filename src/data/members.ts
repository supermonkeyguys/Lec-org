export interface Member {
  id: string;
  name: string;
  cohort: number;
  role: string;
  status: "current";
  avatar: string;
  bio?: string;
}

export const membersContent = {
  eyebrow: "Our People",
  title: "成员",
  subtitle: "当前在读成员 Mock 展示",
  statusLabel: "在读",
  emptyMessage: "在读成员资料整理中",
} as const;

const makeAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&radius=50`;

const makeCohort = (cohort: number, count: number): Member[] =>
  Array.from({ length: count }, (_, index) => ({
    id: `${cohort}-${index + 1}`,
    name: `${cohort}级成员 ${index + 1}`,
    cohort,
    role: `${cohort} 级`,
    status: "current",
    avatar: makeAvatar(`member-${cohort}-${index}`),
  }));

// Current-member mock data. Replace this array with formal current-member records.
export const members: Member[] = [
  ...makeCohort(2025, 10),
  ...makeCohort(2024, 10),
  ...makeCohort(2023, 10),
];
