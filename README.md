# Samuel 个人网站（Next.js 14）

一个中文主导、极简风格的个人网站，定位为长期内容空间：

- 读书
- 笔记（技术 / 商业 / 文艺 / 一路走来）
- 做过的事
- 快速写作入口

## 技术栈

- Next.js 14（App Router）
- TypeScript
- Tailwind CSS
- Markdown 内容驱动
- GitHub Pages 自动部署（GitHub Actions）

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
  blog/                 # 旧版博客（兼容）
  notes/
    tech/               # 技术笔记
    business/           # 商业笔记
    art/                # 文艺笔记
    journey/            # 一路走来
```

## 新增一篇笔记（最常用）

1. 在对应目录新增 `.md` 文件，比如：
   - `content/notes/tech/my-note.md`
2. 使用 frontmatter：

```md
---
title: "标题"
date: "2026-04-12"
type: "note"
category: "tech"
excerpt: "一句摘要"
tags: ["标签1", "标签2"]
---

正文内容...
```

3. 提交并推送后，网站自动更新。

## 自动发布流程（GitHub Pages）

工作流文件：`.github/workflows/deploy.yml`  
触发条件：`main` 分支 push

发布地址（项目子路径）：

- <https://simon-byte-png.github.io/person-website/>

> 需要在 GitHub 仓库设置中确认：
> `Settings -> Pages -> Source` 使用 `GitHub Actions`。

## 非技术发布方式

打开站内 `/write`：

1. 粘贴文字
2. 选择类型与分类
3. 复制生成的 Markdown
4. 保存到 `content/notes/...` 后提交

## 暂缓项

- 本轮未实现 Obsidian 自动同步脚本（后续可单独接入）。

