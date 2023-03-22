import {ChannelType, Guild} from "discord.js";
import {config, constants} from "../../../config";
import {logger} from "../../../core/utils/logger";

export const handleServerJoin = async (guild: Guild) => {
  let category = guild.channels.cache.find((channel) => (
    channel.name === config.discord.channelCategory &&
    channel.type === ChannelType.GuildCategory
  ));
  const channel = guild.channels.cache.find((channel) => (
    channel.name === config.discord.channel &&
    channel.type === ChannelType.GuildCategory
  ));

  if (!category) {
    category = await guild.channels.create({
      name: config.discord.channelCategory,
      type: ChannelType.GuildCategory,
    });
  }

  if (!channel) {
    await guild.channels.create({
      name: config.discord.channel,
      type: ChannelType.GuildText,
      reason: constants.newChannelReason,
      topic: constants.newChannelReason,
      parent: category.id,
    }).then((channel) => channel.send(constants.welcomeMessage))
      .catch((e) => logger.error('discord', {e}));
  }
}
