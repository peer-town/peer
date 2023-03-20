import {AnyThreadChannel, ChannelType, TextChannel} from "discord.js";
import {Clients, Node, PostThreadToSocialPayload, User} from "../../../core/types";
import {config, constants, getBotDid} from "../../../config";
import {buildMessage, buildThread} from "../utils";
import {composeMutationHandler, composeQueryHandler} from "@devnode/composedb";
import {logger} from "../../../core/utils/logger";
import {ComposeClient} from "@composedb/client";

export const handleNewThread = async (compose: ComposeClient, thread: AnyThreadChannel<boolean>) => {
  const threadOwner = await thread.fetchOwner();
  if (!threadOwner || !threadOwner.user || threadOwner.user.bot) return; //We ignore bots
  if (thread.type !== ChannelType.PublicThread) return;//We only care about public threads
  if (thread.parent?.name !== config.discord.channel) return;//We only care about threads in our channel

  const queryHandler = composeQueryHandler();
  const user: Node<User> = await queryHandler.fetchUserByPlatformDetails(constants.PLATFORM_DISCORD_NAME, threadOwner.user.id);
  if (!user) {
    await thread.delete().catch((e) => logger.error('discord', {e}));
    await threadOwner.user.send(constants.replies.userUnknown);
    return;
  }

  compose.setDID(await getBotDid());
  const mutation = await composeMutationHandler(compose);
  const community = await queryHandler.fetchCommunityUsingPlatformId(thread.guildId);
  if (!community) {
    await thread.delete().catch((e) => logger.error('discord', {e}));
    await threadOwner.user.send("No such community exists!");
    return;
  }

  const threadPayload = {
    communityId: community.node.id,
    userId: user.node.id,
    threadId: thread.id,
    title: thread.name,
    body: thread.lastMessage?.content || "  ",
    createdFrom: constants.PLATFORM_DISCORD_NAME,
    createdAt: thread.createdAt?.toISOString() || new Date().toISOString(),
  }

  const result = await mutation.createThread(threadPayload);
  if(result.errors && result.errors.length > 0) {
    logger.error('discord', {e: result.errors});
    await thread.delete().catch((e) => logger.error('discord', {e}));
  }
};

export const postThread = async ({discord, compose}: Clients, payload: PostThreadToSocialPayload) => {
  const server = discord.guilds.cache.get(payload.serverId);
  if (!server) {
    throw new Error("unknown server");
  }

  const channel = server.channels.cache.find((channel) => channel.name == config.discord.channel) as TextChannel;
  if (!channel) {
    throw new Error("channel not found");
  }

  const thread = await channel.threads.create(buildThread(payload.title));
  await thread.send(buildMessage({...payload}));
  return thread.id;
};
