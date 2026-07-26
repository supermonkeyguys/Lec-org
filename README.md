This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 内容维护

- 团队信息：`src/data/team.ts`
- 普通成员：`src/data/members.ts`
- 优秀成员：`src/data/alumni.ts`
- 里程碑：`src/data/milestones.ts`
- 团队成就：`src/data/achievements.ts`
- 技术方向：`src/data/directions.ts`
- 招新信息：`src/data/recruitment.ts`
- 团队图片：`public/about/`
- 招新二维码：`public/recruitment/`

Excel 或正式资料到来后，只需替换以上数据文件与本地资源。

## 成员 Excel 导入与 CI

成员数据由开发期脚本读取外部工作簿，并生成版本控制中的
`src/data/member-records.generated.ts`；网站运行时不会读取 Excel。

```bash
export MEMBER_SOURCE_WORKBOOK="/absolute/path/to/LEC近三年人员信息.xlsx"
npm run import:members -- "$MEMBER_SOURCE_WORKBOOK"
```

CI 必须先通过受控挂载、密钥存储或其他安全方式提供原始工作簿，并把
`MEMBER_SOURCE_WORKBOOK` 设置为该可读文件的绝对路径，再运行 `npm test`。
若 CI 中变量缺失或路径不可读，真实来源集成测试会明确失败；非 CI
本地环境没有可用来源文件时，该单项测试会跳过，其余临时工作簿安全测试仍会执行。

仓库不会提交原始工作簿或其副本。生成模块是可审查的 golden output，真实来源测试会
核对 23 名在读成员、65 名校友、代表性记录，并要求重新生成的内容与该文件逐字节一致。

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
