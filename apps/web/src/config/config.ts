export const config = {
  appHome: process.env.NEXT_PUBLIC_APP_HOME || "",
  discordApiEndpoint: "https://discord.com/api",
  discordOAuth: {
    clientId: process.env.NEXT_PUBLIC_DISCORD_OAUTH_CLIENT_ID || "",
    clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET || "",
    permissions: process.env.NEXT_PUBLIC_DISCORD_OAUTH_PERMISSIONS || "326418131984",
    redirectUrl: process.env.NEXT_PUBLIC_DISCORD_OAUTH_REDIRECT_URL || "",
  },
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  },
  didSession: {
    expiresInSecs: 60 * 60 * 24 * 7 * 1, // 1 week
  },
  aggregator: {
    endpoint: process.env.NEXT_PUBLIC_AGGREGATOR_URL || "http://localhost:4000/api",
    apiKey: process.env.AGGREGATOR_API_KEY || "sample-api-key",
  },
  ceramic: {
    nodeUrl: process.env.CERAMIC_NODE || "",
    graphqlUrl: process.env.CERAMIC_GRAPH || "",
  },
};
