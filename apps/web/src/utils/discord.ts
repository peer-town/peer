import { config } from "../config";

export const getDiscordAuthUrl = (type): string => {
  const userParams = new URLSearchParams({
    client_id: config.discordOAuth.clientId,
    redirect_uri: config.discordOAuth.redirectUrl,
    scope: "identify",
    response_type: "code",
  });
  const communityParams = new URLSearchParams({
    client_id: config.discordOAuth.clientId,
    redirect_uri: config.discordOAuth.redirectUrl,
    scope: "guilds bot applications.commands identify",
    response_type: "code",
  });
  const data = type === "user" ? userParams : communityParams;
  return `${config.discordApiEndpoint}/oauth2/authorize?${data}`;
};

export const getDiscordAvatarUrl = (
  userId: string,
  avatarId: string
): string => {
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarId}.jpg`;
};

export const getDiscordUsername = (
  username: string,
  discriminator: string
): string => {
  return `${username}#${discriminator}`;
};
