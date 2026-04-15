# Samuel 个人网站（Next.js 14）

这是一个以内容为中心的个人网站，技术栈为 Next.js 14 + TypeScript + Tailwind CSS，部署在 GitHub Pages。

线上地址：<https://simon-byte-png.github.io/person-website/>

## 本地运行

```bash
npm install
npm run dev
```

打开：<http://localhost:3000>

## 质量检查

```bash
npm run lint
npm run build
```

## 内容目录

```text
content/
  blog/                 # 历史 blog 内容（兼容）
  notes/
    tech/
    business/
    art/
    journey/
```

## 新增一篇笔记（手动方式）

1. 在对应分类目录新建 `.md` 文件（建议文件名也用英文 slug）。
2. frontmatter 至少包含以下字段：

```md
---
title: "标题"
slug: "english-kebab-slug"
date: "2026-04-15"
type: "note"
category: "tech"
excerpt: "一句摘要"
tags: ["标签1", "标签2"]
---
```

3. 提交并 push 到 `main`，GitHub Actions 会自动发布。

## Obsidian 同步（推荐）

脚本文件：`sync-obsidian.ps1`

目录映射（已内置）：

- `C:\Users\dhpan\Documents\Obsidian Vault\技术笔记` -> `content/notes/tech`
- `C:\Users\dhpan\Documents\Obsidian Vault\商业笔记` -> `content/notes/business`
- `C:\Users\dhpan\Documents\Obsidian Vault\文艺笔记` -> `content/notes/art`
- `C:\Users\dhpan\Documents\Obsidian Vault\一路走来` -> `content/notes/journey`

执行命令：

```powershell
.\sync-obsidian.ps1
```

脚本会自动：

- 同步 Obsidian `.md` 到站点 `content/notes/*`
- `git add content/notes`
- `git commit -m "notes: sync from obsidian"`
- `git push origin main`

### Slug 规则（关键）

- 同步脚本会读取 frontmatter 的 `slug` 作为目标文件名和网页 URL。
- `slug` 必须是英文 kebab-case：`^[a-z0-9]+(?:-[a-z0-9]+)*$`
- 没有 `slug` 或格式不合法的笔记会被跳过并显示警告。

模板文件：`obsidian-frontmatter-template.md`

## GitHub Pages 自动部署

- 工作流：`.github/workflows/deploy.yml`
- 触发：`main` 分支 push
- 仓库设置：`Settings -> Pages -> Source` 选择 `GitHub Actions`

## 说明

- 本站现在统一使用英文 slug，避免中文 URL 编码导致的路由 404。
- 旧中文详情链接不做兼容（按当前约定）。
