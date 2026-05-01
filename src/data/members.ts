export interface Member {
  id: string;
  name: string;
  cohort: number;
  role: string;
  status: "current" | "alumni";
  avatar: string;
  bio?: string;
}

const makeAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/pixel-art/svg?seed=${seed}&radius=50`;

export const members: Member[] = [
  // 2025 级 (大一，current)
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `2025-${i + 1}`,
    name: `2025级成员 ${i + 1}`,
    cohort: 2025,
    role: "2025 级",
    status: "current" as const,
    avatar: makeAvatar(`member-2025-${i}`),
  })),
  // 2024 级 (current)
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `2024-${i + 1}`,
    name: `2024级成员 ${i + 1}`,
    cohort: 2024,
    role: "2024 级",
    status: "current" as const,
    avatar: makeAvatar(`member-2024-${i}`),
  })),
  // 2023 级 (大二，current)
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `2023-${i + 1}`,
    name: `2023级成员 ${i + 1}`,
    cohort: 2023,
    role: "2023 级",
    status: "current" as const,
    avatar: makeAvatar(`member-2023-${i}`),
  })),
  // 2022 级 (大三，current)
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `2022-${i + 1}`,
    name: `2022级成员 ${i + 1}`,
    cohort: 2022,
    role: "2022 级",
    status: "current" as const,
    avatar: makeAvatar(`member-2022-${i}`),
  })),
  // 2021 级 (已毕业，alumni)
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `2021-${i + 1}`,
    name: `2021级成员 ${i + 1}`,
    cohort: 2021,
    role: "2021 级",
    status: "alumni" as const,
    avatar: makeAvatar(`member-2021-${i}`),
  })),
  // 2020 级 (已毕业，alumni)
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `2020-${i + 1}`,
    name: `2020级成员 ${i + 1}`,
    cohort: 2020,
    role: "2020 级",
    status: "alumni" as const,
    avatar: makeAvatar(`member-2020-${i}`),
  })),
  // 2019 级 (已毕业，alumni)
  ...Array.from({ length: 11 }, (_, i) => ({
    id: `2019-${i + 1}`,
    name: `2019级成员 ${i + 1}`,
    cohort: 2019,
    role: "2019 级",
    status: "alumni" as const,
    avatar: makeAvatar(`member-2019-${i}`),
  })),
];
