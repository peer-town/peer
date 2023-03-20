import {ChannelType, Client, Message, MessageType, ThreadChannel} from "discord.js";
import {PostCommentToSocialPayload} from "../../../core/types";
import {buildMessage} from "../utils";
import {config, constants, getBotDid} from "../../../config";
import {composeMutationHandler, composeQueryHandler} from "@devnode/composedb";
import {ComposeClient} from "@composedb/client";
import {logger} from "../../../core/utils/logger";

export const handleNewComment = async (compose: ComposeClient, message: Message<boolean>) => {
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

  const user = await composeQueryHandler().fetchUserByPlatformDetails(constants.PLATFORM_DISCORD_NAME, message.author.id);
  if (!user) {
    await deleteMessage(message);
    await message.author.send(constants.replies.userUnknown);
    return;
  }

  const thread = await composeQueryHandler().fetchThreadBySocialThreadId(message.channel.id);
  if (!thread) return;

  const comment = {
    threadId: thread.node.id,
    userId: user.node.id,
    comment: message.content,
    createdFrom: constants.PLATFORM_DISCORD_NAME,
    createdAt: message.createdAt.toISOString(),
  };

  compose.setDID(await getBotDid());
  const mutation = await composeMutationHandler(compose);
  const result = await mutation.createComment(comment);
  if(result.errors && result.errors.length > 0) {
    logger.error('discord', {e: result.errors});
    await message.delete().catch((e) => logger.error('discord', {e}));
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

  if (!server) {
    throw new Error("unknown server");
  }

  return await thread.send(buildMessage({...payload, body: payload.text}));
};
