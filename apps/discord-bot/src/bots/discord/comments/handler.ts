import {Client, Message, ThreadChannel} from "discord.js";
import {PostCommentToSocialPayload} from "../../../core/types";
import {buildMessage} from "../utils";

export const handleNewComment = async (message: Message<boolean>) => {

};

export const postComment = async (client: Client, payload: PostCommentToSocialPayload) => {
  const server = client.guilds.cache.get(payload.serverId);
  if (!server) {
    throw new Error("unknown server");
  }

  const thread = server.channels.cache.get(payload.threadId) as ThreadChannel;
  if (!thread) {
    throw new Error("unknown thread")
  }

  return await thread.send(buildMessage({...payload, body: payload.text}));
};
