import {config} from "../config";

export const getDiscordAuthUrl = (): string => {
  const data = new URLSearchParams({
    client_id: config.discordOAuth.clientId,
    redirect_uri: config.discordOAuth.redirectUrl,
    scope: "identify",
    response_type: "code",
  });
  return `${config.discordApiEndpoint}/oauth2/authorize?${data}`;
}

export const getDiscordAvatarUrl = (userId: string, avatarId: string): string => {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.jpg`;
}

export const getDiscordUsername = (username: string, discriminator: string): string => {
  return `${username}#${discriminator}`;
}
