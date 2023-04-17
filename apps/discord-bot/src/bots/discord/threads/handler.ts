import {AnyThreadChannel, ChannelType, TextChannel} from "discord.js";
import {Clients, Node, PostThreadToSocialPayload, User} from "../../../core/types";
import {config, constants, getBotDid} from "../../../config";
import {buildMessage, buildThread, logErrorToDev} from "../utils";
import {composeMutationHandler} from "@devnode/composedb";
import {logger} from "../../../core/utils/logger";

export const handleNewThread = async (clients: Clients, thread: AnyThreadChannel<boolean>) => {
  const threadOwner = await thread.fetchOwner();
  if (!threadOwner || !threadOwner.user || threadOwner.user.bot) return; //We ignore bots
  if (thread.type !== ChannelType.PublicThread) return;//We only care about public threads
  if (thread.parent?.name !== config.discord.channel) return;//We only care about threads in our channel

  const queryHandler = clients.composeQuery();
  const user: Node<User> = await queryHandler.fetchUserByPlatformDetails(constants.PLATFORM_DISCORD_NAME, threadOwner.user.id);
  if (!user) {
    await thread.delete().catch((e) => logger.error('discord', {e}));
    await threadOwner.user.send(constants.replies.userUnknown);
    return;
  }

  clients.compose.setDID(await getBotDid());
  const mutation = await composeMutationHandler(clients.compose);
  const community = await queryHandler.fetchCommunityUsingPlatformId(thread.guildId);
  if (!community) {
    await thread.delete().catch((e) => logger.error('discord', {e}));
    await threadOwner.user.send("No such community exists!");
    return;
  }

  const result = await mutation.createThread({
    communityId: community.node.id,
    userId: user.node.id,
    socialThreadIds: [{
      threadId: thread.id,
      platformName: constants.PLATFORM_DISCORD_NAME,
    }],
    title: thread.name,
    body: thread.lastMessage?.content || "  ",
    createdFrom: constants.PLATFORM_DISCORD_NAME,
    createdAt: thread.createdAt?.toISOString() || new Date().toISOString(),
  });

  if(result.errors && result.errors.length > 0) {
    logger.error('discord', {e: result.errors});
    await thread.delete().catch((e) => logger.error('discord', {e}));
    await thread.send(constants.replies.composeError);
    logErrorToDev(clients.discord, result.errors);
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
