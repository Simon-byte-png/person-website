# Samuel 个人网站

这是一个 Next.js 全栈个人网站。V1.0 核心功能围绕数据库博客跑通：Clerk GitHub 登录、管理员发文、博客列表和详情、关键词搜索、评论、回复、文章点赞、评论点赞、浏览量、热榜和个人中心。

旧 GitHub Pages 地址仍可作为静态站保留，但 V1.0 的登录、评论、点赞和数据库写入功能需要部署到可运行 Node 服务和 PostgreSQL 的环境。当前推荐部署目标是阿里云 ECS Docker Compose。

## 技术栈

- Next.js App Router + TypeScript + Tailwind CSS
- Clerk：GitHub OAuth 登录
- PostgreSQL + Drizzle ORM
- Docker Compose + Nginx
- Vitest + ESLint

## 本地运行

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开：<http://localhost:3000>

本地如果没有配置 Clerk 和 PostgreSQL，静态页面可以浏览，但登录、发文、评论、点赞、热榜等数据库功能不会完整可用。

## 必要环境变量

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_CLERK_SIGN_IN_URL
NEXT_PUBLIC_CLERK_SIGN_UP_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
DATABASE_URL
DATABASE_SSL
DATABASE_POOL_MAX
ADMIN_EMAILS
NEXT_PUBLIC_SITE_URL
```

`ADMIN_EMAILS` 支持逗号分隔多个管理员邮箱。只有管理员可以访问 `/admin/posts/new` 创建数据库博客。

## 数据库

V1.0 使用 fresh schema，表结构在 [drizzle/0001_interactions.sql](/Users/samuelzhu/Desktop/codex/person-website/drizzle/0001_interactions.sql)：

- `users`
- `posts`
- `comments`
- `likes`
- `views`

在 PostgreSQL 中执行该 SQL，或使用 Drizzle migration 工具执行迁移。

## 内容说明

- `/blog` 只展示数据库 `posts`，支持 `?q=` 搜索标题、摘要、正文和标签。
- `/blog/[slug]` 优先读取数据库文章；未命中时 fallback 到旧静态 Markdown 博客，只读展示。
- 旧 `content/notes/*` 继续用于笔记模块。
- 新增博客通过 `/admin/posts/new` 写入 PostgreSQL，不再通过 GitHub Pages 静态发布流程。

## 质量检查

```bash
npm run build
npm test
npx tsc --noEmit
npm run lint
```

占位文案扫描也应无输出；避免在文档中保留触发词本身。

## 本地手动验收清单

本地配置 Clerk 和 PostgreSQL 后，按下面顺序验证 V1.0 闭环：

1. 未登录访问 `/blog` 正常。
2. 未登录访问数据库博客详情正常。
3. 未登录点击评论或点赞，会提示登录。
4. GitHub 登录成功。
5. 登录后用户写入 `users` 表。
6. 管理员访问 `/admin/posts/new` 成功。
7. 非管理员访问 `/admin/posts/new` 被拒绝。
8. 管理员新建一篇博客成功。
9. 新博客出现在 `/blog`。
10. 新博客详情页可以打开。
11. `/blog?q=关键词` 可以搜到新博客。
12. 登录用户可以评论。
13. 登录用户可以回复评论。
14. 登录用户可以点赞博客。
15. 再点一次可以取消点赞。
16. 登录用户可以点赞评论。
17. `/me` 能看到头像、邮箱、评论数、点赞数。
18. 热榜能显示有互动数据的文章。
19. 阿里云部署后在线重复以上流程。

## 部署

阿里云 ECS 部署步骤见 [ALIYUN_DEPLOYMENT.md](/Users/samuelzhu/Desktop/codex/person-website/ALIYUN_DEPLOYMENT.md)。

Vercel + Neon 的旧部署说明保留在 [DEPLOYMENT.md](/Users/samuelzhu/Desktop/codex/person-website/DEPLOYMENT.md)，不再作为当前推荐上线路径。
