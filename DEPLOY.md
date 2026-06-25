# GitHub Pages 部署说明

本项目是纯静态网页，不需要构建命令。

## 推荐方式 A：GitHub Pages 从 main 分支部署

1. 在 GitHub 新建一个空仓库，例如：`communication-electronics-practice`。
2. 上传本目录内所有文件到仓库根目录，不要再套一层外层文件夹。
3. 打开仓库 `Settings -> Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main`，目录选择 `/root`。
6. 保存后等待 Pages 构建完成。

访问地址通常为：

```text
https://<你的 GitHub 用户名>.github.io/communication-electronics-practice/
```

## 方式 B：使用 GitHub Actions 部署

仓库中已经带有 `.github/workflows/pages.yml`。如果仓库 Pages 设置支持 GitHub Actions，可选择 Source 为 `GitHub Actions`，推送到 `main` 后自动部署。

## 注意

- 不要把本项目上传到原单片机刷题仓库里，避免两个课程题库混在一个项目中。
- 本网站的学习记录保存在浏览器 localStorage，换设备前请先导出学习记录。
