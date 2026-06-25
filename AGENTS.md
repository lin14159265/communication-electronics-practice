# 工程地图

## 项目目标

这是一个独立的“通信电子线路刷题系统”静态网站，只包含通信电子线路题库，不属于 `mcu-exam-practice`，也不应导入或保留单片机题库。

## 目录结构

- `index.html`：网页入口。
- `styles.css`：页面样式。
- `app.js`：刷题交互、判题、统计与 localStorage 记录逻辑。
- `questions.js`：通信电子线路题库数据。
- `assets/`：题目图片、公式图等静态资源。
- `manifest.webmanifest`、`service-worker.js`、`icon.svg`：PWA 与图标资源。
- `.github/workflows/pages.yml`：GitHub Pages Actions 部署流程。
- `README.md`、`AUDIT.md`、`DEPLOY.md`：项目说明、题库审计与部署说明。

## 构建与运行

本项目是纯静态网页，无构建步骤。

- 本地预览：在项目根目录启动任意静态服务器，例如 `python -m http.server 8000`。
- GitHub Pages：推送到 `main` 后由 `.github/workflows/pages.yml` 部署。

## 验证重点

- 页面能显示“通信电子线路刷题系统”。
- 题库统计应为总题数 206，单选题 152，多选题 5，填空题 49。
- 顺序练习、随机练习、判题、统计和 localStorage 学习记录应可用。
- `assets/` 中图片/公式资源应能正常加载。
- 不应出现旧单片机题库或 `mcu-exam-practice` 依赖。

## 改动约束

- 默认保持最小改动，不做无关重构或批量格式化。
- 不修改题库内容，除非是在修复明确的路径、部署或静态资源引用问题。
- 不把本项目合并进其他仓库、子目录或分支。
