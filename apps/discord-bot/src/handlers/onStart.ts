import { config } from "dotenv";
config();
import { ChannelType, Client, TextChannel, ThreadChannel } from "discord.js";
import { onThreadCreate } from "./onThreadCreate";
import { onMessageCreate } from "./onMessageCreate";
import { channel } from "diagnostics_channel";

export const onStart = async (client: Client) => {
  //Find our devnode channel
  let devnodeChannel = (await client.channels.cache
    .filter(
      (channel) =>
        channel.type == ChannelType.GuildText &&
        channel.name == process.env.DISCORD_CHANNEL_NAME
    )
    .first()) as TextChannel;

  //Get all stray messages
  let strayMessages = await devnodeChannel.messages.fetch({ limit: 100 });
  for (const strayMessage of strayMessages.values()) {
    await onMessageCreate(strayMessage);
  }

  //Find all threads inside our devnode channel
  let threadChannels = await client.channels.cache
    .filter(
      (channel) =>
        channel.type == ChannelType.PublicThread &&
        channel.parent?.name == process.env.DISCORD_CHANNEL_NAME
    )
    .values();

  for (const threadChannel of threadChannels) {
    const thread = client.channels.cache.get(threadChannel.id) as ThreadChannel;

    await onThreadCreate(thread);

    try {
      //If thread still exists after onThreadCreate. It might not exist anymore if it didn't meet the rules
      let messages = await thread.messages.fetch({ limit: 100 });

      for (const message of messages.values()) {
        await onMessageCreate(message);
      }
    } catch {}
  }
};
