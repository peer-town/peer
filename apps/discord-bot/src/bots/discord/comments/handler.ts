import {ChannelType, Client, Message, MessageType, ThreadChannel} from "discord.js";
import {Clients, PostCommentToSocialPayload} from "../../../core/types";
import {buildMessage, logErrorToDev} from "../utils";
import {config, constants, getBotDid} from "../../../config";
import {composeMutationHandler} from "@devnode/composedb";
import {logger} from "../../../core/utils/logger";

export const handleNewComment = async (clients: Clients, message: Message<boolean>) => {
  if (message.author.bot) return; // ignoring bots

  switch (message.channel.type) {
    case ChannelType.GuildText:
    case ChannelType.PublicThread:
      break;
    default:
      return; // not in text or thread channel
  }

  if (
    message.channel.name !== config.discord.channel &&
    message.channel.parent?.name !== config.discord.channel
  ) return; // not in devnode channel

  switch (message.type) {
    case MessageType.ThreadCreated:
      break;
    case MessageType.Default:
      if (message.channel.type !== ChannelType.PublicThread) { // early exit if not in thread
        await deleteMessage(message);
        await message.author.send(constants.replies.noMsgOutOfThread);
        return;
      }
      break;
    default:
      return;
  }

  const queryHandler = clients.composeQuery();
  const user = await queryHandler.fetchUserByPlatformDetails(constants.PLATFORM_DISCORD_NAME, message.author.id);
  if (!user) {
    await deleteMessage(message);
    await message.author.send(constants.replies.userUnknown);
    return;
  }

  const thread = await queryHandler.fetchThreadBySocialThreadId(message.channel.id);
  if (!thread) return;

  clients.compose.setDID(await getBotDid());
  const mutation = await composeMutationHandler(clients.compose);
  const result = await mutation.createComment({
    threadId: thread.node.id,
    userId: user.node.id,
    comment: message.content,
    socialCommentIds: [{
      platformName: constants.PLATFORM_DISCORD_NAME,
      commentId: message.id,
    }],
    createdFrom: constants.PLATFORM_DISCORD_NAME,
    createdAt: message.createdAt.toISOString(),
  });
  if(result.errors && result.errors.length > 0) {
    logger.error('discord', {e: result.errors});
    await message.delete().catch((e) => logger.error('discord', {e}));
    await message.channel.send(constants.replies.composeError);
    logErrorToDev(clients.discord, result.errors);
  }
};

async function deleteMessage(message: Message<boolean>) {
  await message.delete().catch(() => {
    message.reply(constants.replies.noPermsToDel);
  });
}

export const postComment = async (client: Client, payload: PostCommentToSocialPayload) => {
  const server = client.guilds.cache.get(payload.serverId);
  const thread = server?.channels.cache.get(payload.threadId) as ThreadChannel;

  if (!server || !thread) {
    throw new Error("unknown server or thread!");
  }

  const message = await thread.send(buildMessage({...payload, body: payload.text}));
  return message.id;
};
