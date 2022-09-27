import { Octokit } from "@octokit/rest";

export const octokit = new Octokit({
  auth: process.env.VUE_APP_GITHUB_ACCESS_TOKEN,
});
