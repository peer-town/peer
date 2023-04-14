import {
  ButtonBuilder,
  Client,
  EmbedBuilder,
  GuildTextThreadCreateOptions, MessageCreateOptions,
  ThreadAutoArchiveDuration
} from "discord.js";
import {DiscordMessage} from "./types";
import {config} from "../../config";

export const buildThread = (title: string): GuildTextThreadCreateOptions<any> => {
  return {
    name: title,
    reason: "thread was created on devnode platform",
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
  }
}

export const buildMessage = (message: DiscordMessage): MessageCreateOptions => {
  const {body, userName, userAvatar, userProfileLink} = message;
  return {
    embeds: [buildUserEmbed(userName, body, userAvatar, userProfileLink)],
  }
}

export const buildUserEmbed = (name: string, body: string, avatar: string, url: string) => {
  return new EmbedBuilder()
    .setColor(0x323338)
    .setAuthor({ name, url, iconURL: avatar})
    .setDescription(body);
}

export const buildLinkButton = (url: string) => {
  return new ButtonBuilder()
    .setLabel('View on Devnode')
    .setURL(url)
    .setStyle(5)
}

export const logErrorToDev = (client: Client, errors: any) => {
  if (!config.features.devLogs) return;
  config.debug.devs.map((id) => {
    client.users.fetch(id).then((user) => {
      user.send(JSON.stringify(errors));
    });
  });
}
