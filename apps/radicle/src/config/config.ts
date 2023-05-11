export const config = {
  server: {
    port: process.env.RADICLE_PORT || 4001,
    apiKey: process.env.RADICLE_API_KEY || "sample-api-key",
  },
  rad: {
    repoDir: process.env.RADICLE_REPOS_DIR || "~/radicle-repos",
  },
};
