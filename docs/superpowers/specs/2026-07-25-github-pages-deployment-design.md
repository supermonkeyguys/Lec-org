# GitHub Pages 自动部署设计

## 目标

当 `main` 分支更新时，自动构建该 Next.js 静态站点并发布到 GitHub Pages。部署后的默认地址为 `https://lec-org.github.io/LecOrg/`。

## 范围

- 新增一个 GitHub Actions 工作流，支持 `main` 推送和手动触发。
- 使用 `npm ci` 和 `npm run build` 生成现有静态导出目录 `out/`。
- 使用 GitHub 官方 Pages artifact 和部署动作发布构建产物。
- 为仓库项目页的 `/LecOrg` 子路径配置生产构建，并使 `public/logo.jpg` 在该路径下正常加载。

不包含自定义域名、预览环境、服务器端部署或环境变量密钥。

## 架构与数据流

1. 向 `main` 推送会触发 `.github/workflows/deploy-pages.yml`。
2. 构建任务检出代码，设置 Node.js，恢复 npm 缓存，执行 `npm ci` 与 `npm run build`。
3. 构建任务将 `out/` 上传为 GitHub Pages artifact。
4. 部署任务仅下载该 artifact，并发布到 Pages 环境。

工作流将使用最小权限：构建任务只读仓库内容；部署任务只具有 Pages 写入和 OIDC token 权限。并发组确保同一 Pages 环境只保留最新一次部署。

## 路径策略

仓库名为 `LecOrg`，因此 GitHub Pages 项目站点会位于 `/LecOrg`。生产构建会在 Next.js 配置中启用该 `basePath`，并通过一个小型资源路径辅助函数为 `public` 目录图片添加相同前缀。开发环境保持根路径，因而本地 `npm run dev` 的行为不变。

启用 `trailingSlash`，静态路由将输出为目录中的 `index.html`，以符合 GitHub Pages 的路由解析方式。

## 错误处理与验证

- 依赖锁文件与 Node.js 安装不一致时，`npm ci` 会使构建任务失败，避免部署不确定的依赖树。
- 构建失败时不会上传 artifact 或更新线上页面。
- 本地执行 `npm run build`，并检查 `out/index.html`、`out/LecOrg` 资源引用和工作流 YAML 语法，确认发布产物与路径配置正确。
