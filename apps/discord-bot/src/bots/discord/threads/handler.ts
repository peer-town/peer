import {AnyThreadChannel, TextChannel} from "discord.js";
import {Clients, PostThreadToSocialPayload} from "../../../core/types";
import {config} from "../../../config";
import {buildMessage, buildThread} from "../utils";

export const handleNewThread = async (thread: AnyThreadChannel<boolean>) => {

};

export const postThread = async ({discord, compose}: Clients, payload: PostThreadToSocialPayload) => {
  const server = discord.guilds.cache.get(payload.serverId);
  if (!server) {
    throw new Error("unknown server");
  }

  const channel = server.channels.cache.find((channel) => channel.name ==  config.discord.channel) as TextChannel;
  if (!channel) {
    throw new Error("channel not found");
  }

  const thread = await channel.threads.create(buildThread(payload.title));
  await thread.send(buildMessage({...payload}));
  return thread.id;
};
