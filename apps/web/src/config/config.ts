export const config = {
  appHome: process.env.NEXT_PUBLIC_APP_HOME || "",
  discordApiEndpoint: "https://discord.com/api",
  discordOAuth: {
    clientId: process.env.NEXT_PUBLIC_DISCORD_OAUTH_CLIENT_ID || "",
    clientSecret: process.env.NEXT_PUBLIC_DISCORD_OAUTH_CLIENT_SECRET || "",
    redirectUrl: process.env.NEXT_PUBLIC_DISCORD_OAUTH_REDIRECT_URL || "",
  },
  walletConnect: {
    projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",
  }
}

export const getDiscordAuthUrl = (): string => {
  const data = new URLSearchParams({
    client_id: config.discordOAuth.clientId,
    redirect_uri: config.discordOAuth.redirectUrl,
    scope: "identify",
    response_type: "code",
  });
  return `${config.discordApiEndpoint}/oauth2/authorize?${data}`;
}
