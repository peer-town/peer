import {AnyThreadChannel, TextChannel} from "discord.js";
import {Clients, PostThreadToSocialPayload} from "../../../core/types";
import {config, getBotDid} from "../../../config";
import {composeMutationHandler} from "@devnode/composedb";
import {logger} from "../../../core/utils/logger";
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

  // updating discord thread id to compose
  compose.setDID(await getBotDid());
  const mutation = await composeMutationHandler(compose);
  await mutation.updateThreadWithSocialThreadId(payload.threadStreamId, thread.id)
    .catch((e) => {
      logger.error('compose', {e, payload, msg: "failed to update threadId on compose"});
      thread.delete();
    });
};
