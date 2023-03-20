import { config } from "dotenv";
config();
import { ChannelType, Client, TextChannel, ThreadChannel } from "discord.js";
import { onThreadCreate } from "./onThreadCreate";
import { onMessageCreate } from "./onMessageCreate";

export const onStart = async (client: Client) => {
  // TODO:  this function is responsible to submit missed message on ceramic to discord and vice versa.
  // when the bot starts we will look up a file which will store the last processed message and only
  // fetch new ones, based on that we write logic to either keep process the message
  //Find our devnode channel
  let devnodeChannel = (await client.channels.cache
    .filter(
      (channel) =>
        channel.type == ChannelType.GuildText &&
        channel.name == process.env.DISCORD_CHANNEL_NAME
    )
    .first()) as TextChannel;

  //Get all stray messages
  try {
    let strayMessages = await devnodeChannel.messages.fetch({ limit: 100 });
    for (const strayMessage of strayMessages.values()) {
      await onMessageCreate(strayMessage);
    }
  } catch {
    console.log("no stray messages?");
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
