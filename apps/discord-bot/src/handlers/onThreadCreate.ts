import { ChannelType, Client, Message, ThreadChannel } from "discord.js";

export const onThreadCreate = (
  thread: ThreadChannel,
  message: Message,
  client: Client
) => {
  if (thread.type == ChannelType.PublicThread) {
    // When a new forum post is created
    console.log(thread.parentId); // The forum channel ID
    console.log(thread.id); // The forum post ID
    console.log(thread.name); // The name of the forum post
    console.log(message);
  }
};
