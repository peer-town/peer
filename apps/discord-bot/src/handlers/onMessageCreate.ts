import { ChannelType, Client, Message, ThreadChannel } from "discord.js";

export const onMessageCreate = (message: Message, client: Client) => {
  console.log(message.content);
};
