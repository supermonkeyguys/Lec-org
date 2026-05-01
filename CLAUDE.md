@AGENTS.md

---

# LEC 实验室官网

## 项目概览

- **用途**: LEC 实验室信息展示官网（纯静态，Vercel/Cloudflare 部署）
- **技术栈**: Next.js 16 Pages Router + TypeScript + Tailwind CSS v4 + Framer Motion
- **风格**: 手绘笔记本风格（sketchy-border、奶油纸色背景、Patrick Hand + Space Mono 字体）
- **设计参考**: https://coderserio.github.io/vue-source-book/

## 目录结构

```
src/
├── components/    # UI 组件，一文件一组件
├── config/        # 共享配置：动画常量、section 定义
├── data/          # 纯数据文件，改内容只改这里
├── pages/         # Next.js Pages Router 入口
└── styles/        # globals.css = Tailwind v4 主题变量 + 全局样式
```

## 核心约定

- **改内容 → `src/data/`**: 成员、里程碑、团队信息，不改组件代码
- **改样式 → `src/styles/globals.css`**: 颜色/字体变量在 `@theme inline`，改一处全局生效
- **改动画 → `src/config/animations.ts`**: 所有 framer-motion 动画参数集中管理
- **改结构 → `src/config/sections.ts`**: section 的 id/label/num 单一定义，新增 section 先改这里
- **数据驱动**: Members.tsx 中 `currentCohorts`/`alumniCohorts` 由数据 `status` 字段自动分组，不要硬编码届级分类

## 设计令牌（Tailwind v4 @theme inline）

| 变量 | 用途 | 类名示例 |
|---|---|---|
| `--color-cream: #fff8e7` | 页面背景 | `bg-cream` |
| `--color-ink: #2c3e50` | 主文字/标题色 | `text-ink`, `bg-ink`, `border-ink` |
| `--color-muted: #64748b` | 次级文字 | `text-muted` |
| `--color-fade: #94a3b8` | 三级文字 | `text-fade` |
| `--color-card: #ffffff` | 卡片背景 | `bg-card` |
| `--font-hand` | 手写体（正文） | `font-hand` |
| `--font-mono` | 等宽字体（标签/数字） | `font-mono` |

## 边界声明：不要做的事

1. **不要引入新依赖** — framer-motion + tailwind + typescript 已经够用。不加 UI 库、不加状态管理、不加 CSS 方案
2. **不要加路由** — 这是单页信息展示，不需要多页面路由。不要用 App Router，保持 Pages Router
3. **不要加后端** — 纯静态 `output: "export"`，数据在 TS 文件中。不需要 API routes、数据库、CMS
4. **不要用硬编码颜色** — 用 `text-ink` 而不是 `text-[#2c3e50]`。新增颜色先加到 `@theme inline`
5. **不要用内联 `style={{ fontFamily: ... }}`** — 用 `font-mono` 或 `font-hand` 类名
6. **不要重复动画样板** — 用 `src/config/animations.ts` 的 `sectionFade` / `itemFade()`
7. **不要在组件里硬编码 section 信息** — 从 `src/config/sections.ts` 引用
8. **不要改 Members 的届级分类逻辑** — 它是数据驱动的，改 `status` 字段即可
9. **不要删除 `no-scrollbar`** — 它是 snap-scroll 布局的关键，隐藏滚动条
10. **不要改动 `snap-start` / `snap-y` / `snap-proximity`** — 这些是 snap-scroll 布局的骨架。`snap-proximity` 保证内容未滚动完时不会强制跳到下一块
11. **不要删除 TocFloating** — 它是主要的导航方式（桌面端）
12. **不要引入 JS 动画库替代 framer-motion** — 项目已统一使用 framer-motion

## 常用命令

```bash
npm run dev     # 开发服务器 (localhost:3000)
npm run build   # 生产构建 + 静态导出 → out/
npm run lint    # ESLint
```

## 部署

- 构建输出目录: `out/`
- 可直接部署到 Vercel（自动检测 Next.js）或 Cloudflare Pages（静态站点）
- `next.config.ts` 已配置 `output: "export"` + `images.unoptimized: true`
