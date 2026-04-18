import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS && !process.env.PLAYWRIGHT_TEST;
let repo = 'talk_hub';
let owner = 'LennartKDeveloper';

// Get the repo name if we are inside GitHub Actions
if (process.env.GITHUB_REPOSITORY) {
  const parts = process.env.GITHUB_REPOSITORY.split('/');
  owner = parts[0].toLowerCase();
  repo = parts[1];
}

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  transpilePackages: ["@gdg/ui-theme"],
  basePath: isGithubActions ? `/${repo}` : '',
  env: {
    NEXT_PUBLIC_BASE_PATH: isGithubActions ? `/${repo}` : '',
    NEXT_PUBLIC_GITHUB_URL: isGithubActions ? `https://${owner}.github.io` : '',
  },
};

export default nextConfig;
