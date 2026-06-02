# 阿里云 ECS 部署说明

本文档用于把当前 Next.js 全栈个人网站部署到阿里云 ECS。当前 V1.0 不再依赖 Vercel 或 Neon 运行，运行形态是 Docker Compose + PostgreSQL + Nginx + Clerk。

Docker 基础镜像使用 `docker.m.daocloud.io/library/*` 前缀，避免国内 ECS 直接拉 Docker Hub 超时。

## 1. ECS 准备

建议使用 Ubuntu 22.04/24.04 或 Alibaba Cloud Linux 3，开放安全组端口：

- `22`：SSH
- `80`：HTTP
- `443`：HTTPS，配置证书后再开启

安装 Docker 和 Compose：

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER
docker compose version
```

如果使用 Alibaba Cloud Linux，请用系统对应的包管理器安装 Docker，确认 `docker compose version` 可用即可。

## 2. 上传代码

推荐直接在 ECS 拉取仓库分支：

```bash
git clone <YOUR_REPO_URL> person-website
cd person-website
git checkout feat/auth-comments-likes
```

也可以本地打包上传，但不要上传 `.env.local`、`.env.production`、`.git`、`node_modules`、`.next`。

## 3. 配置环境变量

复制模板：

```bash
cp .env.aliyun.example .env.production
```

编辑 `.env.production`，至少修改：

```bash
POSTGRES_PASSWORD=<strong-password>
DATABASE_URL=postgres://person_website:<strong-password>@postgres:5432/person_website
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<clerk-publishable-key>
CLERK_SECRET_KEY=<clerk-secret-key>
ADMIN_EMAILS=<admin-primary-email>
NEXT_PUBLIC_SITE_URL=http://<ECS_PUBLIC_IP_OR_DOMAIN>
```

如果改了 `POSTGRES_DB` 或 `POSTGRES_USER`，必须同步修改 `DATABASE_URL`。

如果后续使用阿里云 RDS PostgreSQL，可以保留 `app` 和 `nginx` 服务，把 `DATABASE_URL` 改为 RDS 连接串；如 RDS 要求 SSL，再设置：

```bash
DATABASE_SSL=true
```

## 4. 启动服务

首次构建并启动：

```bash
docker compose --env-file .env.production up -d --build
```

修改 `NEXT_PUBLIC_*` 环境变量后必须重新执行带 `--build` 的启动命令，因为这些值会写入 Next.js 前端构建产物。

查看状态和日志：

```bash
docker compose --env-file .env.production ps
docker compose --env-file .env.production logs -f app
docker compose --env-file .env.production logs -f postgres
docker compose --env-file .env.production logs -f nginx
```

## 5. 执行数据库 migration

V1.0 使用 fresh schema，SQL 文件是：

```bash
drizzle/0001_interactions.sql
```

在 ECS 上执行：

```bash
docker compose --env-file .env.production exec -T postgres \
  psql -U person_website -d person_website < drizzle/0001_interactions.sql
```

如果你修改了 `POSTGRES_DB` 或 `POSTGRES_USER`，把命令里的 `person_website` 替换成实际值。

检查表是否存在：

```bash
docker compose --env-file .env.production exec postgres \
  psql -U person_website -d person_website -c "\\dt"
```

应看到：

- `users`
- `posts`
- `comments`
- `likes`
- `views`

## 6. 配置 Clerk

在 Clerk Dashboard 保留 GitHub OAuth，并把阿里云访问地址加入允许列表。

本地开发：

```text
http://localhost:3000
http://localhost:3000/sign-in/sso-callback
http://localhost:3000/sign-up/sso-callback
```

阿里云生产：

```text
http://<ECS_PUBLIC_IP_OR_DOMAIN>
http://<ECS_PUBLIC_IP_OR_DOMAIN>/sign-in/sso-callback
http://<ECS_PUBLIC_IP_OR_DOMAIN>/sign-up/sso-callback
```

如果配置 HTTPS，则把上面的 `http` 改为 `https`，并同步更新 `.env.production` 的 `NEXT_PUBLIC_SITE_URL`。

## 7. 验收

打开：

```text
http://<ECS_PUBLIC_IP_OR_DOMAIN>
```

按顺序检查：

1. 首页正常打开。
2. `/blog` 正常打开。
3. GitHub 登录成功，并回跳到阿里云站点。
4. 登录后 `users` 表出现当前用户。
5. `ADMIN_EMAILS` 对应账号能进入 `/admin/posts/new`。
6. 管理员新建博客成功。
7. 新博客出现在 `/blog`。
8. 博客详情页能评论、回复、点赞文章、点赞评论。
9. 刷新后评论和点赞仍然存在。
10. `/me` 能展示头像、昵称、邮箱、评论数、点赞数。

## 8. 运维命令

重启：

```bash
docker compose --env-file .env.production restart
```

更新代码并重新部署：

```bash
git pull
docker compose --env-file .env.production up -d --build
```

备份数据库：

```bash
docker compose --env-file .env.production exec -T postgres \
  pg_dump -U person_website person_website > backup.sql
```

恢复数据库：

```bash
docker compose --env-file .env.production exec -T postgres \
  psql -U person_website -d person_website < backup.sql
```

## 9. 常见问题

### 页面能打开但登录失败

检查 Clerk allowed origins 和 redirect URLs 是否包含阿里云地址，协议、域名/IP、路径必须一致。

### 页面提示数据库未配置

检查 `.env.production` 是否存在 `DATABASE_URL`，并确认 `docker compose --env-file .env.production up -d --build` 使用了正确 env 文件。

### 数据库连接失败

先看日志：

```bash
docker compose --env-file .env.production logs app
docker compose --env-file .env.production logs postgres
```

确认 `POSTGRES_PASSWORD` 和 `DATABASE_URL` 密码一致。如果连接外部 RDS，确认安全组允许 ECS 访问 RDS。

### 管理员无法发文

`ADMIN_EMAILS` 必须等于 Clerk 登录用户的 primary email。多个邮箱用英文逗号分隔。

### 需要 HTTPS

可以在 ECS 上用 Certbot 申请证书，再扩展 `nginx.conf` 的 443 server。V1 先提供 HTTP 反代，证书配置单独处理，避免阻塞核心功能验收。
