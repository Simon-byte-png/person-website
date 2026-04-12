/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";
const repo = "person-website";
const basePath = isProd ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  basePath,
  assetPrefix: isProd ? `${basePath}/` : undefined,
};

export default nextConfig;

