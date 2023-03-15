export const config = {
  appHome: process.env.NEXT_PUBLIC_APP_HOME || "",
  discordApiEndpoint: "https://discord.com/api",
  discordOAuth: {
    clientId: process.env.NEXT_PUBLIC_DISCORD_OAUTH_CLIENT_ID || "",
    clientSecret: process.env.DISCORD_OAUTH_CLIENT_SECRET || "",
    redirectUrl: process.env.NEXT_PUBLIC_DISCORD_OAUTH_REDIRECT_URL || "",
  },
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  },
  didSession: {
    expiresInSecs: 60 * 60 * 24 * 7 * 100, // 100 weeks
  },
  ceramic: {
    nodeUrl: process.env.CERAMIC_NODE || "",
    graphqlUrl: process.env.CERAMIC_GRAPH || "",
  }
}
