import {Client, Message, ThreadChannel} from "discord.js";
import {PostCommentToSocialPayload} from "../../../core/types";

export const handleNewComment = async (message: Message<boolean>) => {

};

export const postComment = async (client: Client, message: PostCommentToSocialPayload) => {
  const server = client.guilds.cache.get(message.serverId);
  if (!server) {
    console.log("unknown server");
    return;
  }

  const thread = server.channels.cache.get(message.threadId) as ThreadChannel;
  if (!thread) {
    console.log("unknown thread");
    return;
  }

  const msg = `\`from devnode web ${message.userName} says\` \n ${message.text} \n \`Follow for more at${message.threadStreamId}\``;
  const result = await thread.send(msg);
  console.log("result of post comment to discord ", result);
};
