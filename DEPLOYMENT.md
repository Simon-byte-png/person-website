# Vercel + Neon 旧部署说明

本文档保留 Vercel + Clerk + Neon 的旧部署路径，方便回溯。当前推荐上线路径已迁移为阿里云 ECS Docker Compose，见 [ALIYUN_DEPLOYMENT.md](/Users/samuelzhu/Desktop/codex/person-website/ALIYUN_DEPLOYMENT.md)。

不要把旧 GitHub Pages 地址当作 V1.0 功能验收地址，GitHub Pages 只能承载静态内容，不能运行登录、评论、点赞和数据库写入。

## 1. 创建 Neon 数据库

1. 在 Neon 创建一个 Postgres 项目。
2. 创建生产分支和数据库。
3. 复制连接字符串，格式通常类似：

```bash
postgres://USER:PASSWORD@HOST/db?sslmode=require
```

4. 在本地 `.env.local` 和 Vercel 环境变量中配置为 `DATABASE_URL`。

## 2. 执行数据库 migration

V1.0 以 fresh schema 为准，SQL 文件是：

```bash
drizzle/0001_interactions.sql
```

最直接方式是在 Neon SQL Editor 粘贴并执行该文件内容。执行后应创建：

- `users`
- `posts`
- `comments`
- `likes`
- `views`
- `like_target_type` enum

也可以使用 Drizzle Kit 连接同一个 `DATABASE_URL` 执行迁移，但当前验收路径以 SQL Editor 为最稳。

## 3. 配置 Clerk GitHub OAuth

1. 在 Clerk 创建应用。
2. 开启 GitHub OAuth provider。
3. 在 Clerk 的 Redirect URLs 中加入本地和线上地址，例如：

```text
http://localhost:3000/sign-in/sso-callback
http://localhost:3000/sign-up/sso-callback
https://YOUR-VERCEL-DOMAIN.vercel.app/sign-in/sso-callback
https://YOUR-VERCEL-DOMAIN.vercel.app/sign-up/sso-callback
```

4. 复制 Clerk key 到环境变量。

## 4. 配置 Vercel 环境变量

在 Vercel Project Settings -> Environment Variables 配置：

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_or_test_...
CLERK_SECRET_KEY=sk_live_or_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
DATABASE_URL=postgres://USER:PASSWORD@HOST/db?sslmode=require
ADMIN_EMAILS=admin@example.com
NEXT_PUBLIC_SITE_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
```

`ADMIN_EMAILS` 支持逗号分隔多个邮箱。邮箱必须和 Clerk 登录后的 primary email 匹配，否则无法进入 `/admin/posts/new`。

## 5. 部署到 Vercel

1. 将仓库导入 Vercel。
2. Framework preset 选择 Next.js。
3. 确认 Build Command 为：

```bash
npm run build
```

4. 确认没有配置 GitHub Pages 的 `basePath` 或静态导出。
5. 部署完成后，用 Vercel 域名进行验收。

## 6. GitHub Pages 旧地址和 Vercel 新地址

- 旧地址：`https://simon-byte-png.github.io/person-website/`
- 作用：保留静态站兼容。
- 限制：不能运行 Clerk 登录、Neon 写入、评论、点赞、浏览量。
- V1.0 验收地址：Vercel 生成的域名或绑定的自定义域名。

## 7. 常见错误排查

### 登录后跳转失败

检查 Clerk Redirect URLs 是否包含线上域名的 `/sign-in/sso-callback` 和 `/sign-up/sso-callback`。

### 页面提示后端未配置

检查 `DATABASE_URL`、`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` 和 `CLERK_SECRET_KEY` 是否都已配置，并重新部署。

### 管理员无法发文

检查 `ADMIN_EMAILS` 是否包含当前 Clerk primary email。多个邮箱用英文逗号分隔。

### 数据库连接失败

确认 Neon 连接串包含 `sslmode=require`，并确认 Vercel 环境变量没有多余空格或引号。

### 点赞重复或计数异常

确认 migration 中存在唯一约束：

```sql
CREATE UNIQUE INDEX "likes_user_target_unique" ON "likes" USING btree ("user_id","target_type","target_id");
```

### 热榜浏览量可能被刷高

V1.0 当前以最小可用为目标，博客详情页会记录 view。防刷能力较弱，后续可以基于 `viewerKey + postId + 30 分钟窗口` 增加唯一约束或缓存防抖。

## 8. 线上验收清单

1. 未登录访问 `/blog` 正常。
2. 未登录访问数据库博客详情正常。
3. 未登录点击评论或点赞，会提示登录。
4. GitHub 登录成功。
5. 登录后用户写入 `users` 表。
6. 管理员访问 `/admin/posts/new` 成功。
7. 非管理员访问 `/admin/posts/new` 被拒绝。
8. 管理员新建博客成功并跳转详情页。
9. 新博客出现在 `/blog`。
10. `/blog?q=关键词` 可以搜到新博客。
11. 登录用户可以评论和回复。
12. 登录用户可以点赞或取消点赞博客。
13. 登录用户可以点赞或取消点赞评论。
14. `/me` 能看到头像、邮箱、评论数、点赞数、最近评论和最近点赞文章。
15. 热榜能显示有互动数据的文章。
