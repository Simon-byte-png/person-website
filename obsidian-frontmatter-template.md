---
title: "{{TITLE}}"
slug: "{{english-kebab-slug}}"
date: "{{DATE:YYYY-MM-DD}}"
type: "note"
category: "tech"
excerpt: "{{ONE_LINE_SUMMARY}}"
tags: ["标签1", "标签2"]
---

在这里写正文。

## category 可选值

- tech
- business
- art
- journey

## slug 规则（必填）

- 必须使用英文小写 + 连字符：`a-z`、`0-9`、`-`
- 示例：`openclaw-reflection`、`ai-agent-notes`
- 不要用中文、空格、下划线、大写字母

> 同步脚本会优先读取 `slug` 作为文件名；没有 `slug` 或格式不合法会跳过该笔记。
