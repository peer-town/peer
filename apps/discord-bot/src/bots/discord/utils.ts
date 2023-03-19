import {
  ActionRowBuilder,
  ButtonBuilder,
  EmbedBuilder,
  GuildTextThreadCreateOptions, MessageCreateOptions,
  ThreadAutoArchiveDuration
} from "discord.js";
import {DiscordMessage} from "./types";

export const buildThread = (title: string): GuildTextThreadCreateOptions<any> => {
  return {
    name: title,
    reason: "thread was created on devnode platform",
    autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
  }
}

export const buildMessage = (message: DiscordMessage): MessageCreateOptions => {
  const {body, userName, userAvatar, userProfileLink, redirectLink} = message;
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(buildLinkButton(redirectLink));
  return {
    embeds: [buildUserEmbed(userName, body, userAvatar, userProfileLink)],
    components: [row],
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
