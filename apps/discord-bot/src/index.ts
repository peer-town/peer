import {
  ChannelType,
  Client,
  GatewayIntentBits,
  Message,
  Partials,
  ThreadChannel,
} from "discord.js";
import { config } from "dotenv";
config();

import { PrismaClient } from "@prisma/client";
import { randomString } from "@stablelib/random";
const prisma = new PrismaClient();

const DISCORD_INVOCATION_STRING = "devnode";
const DISCORD_BOT_NAME = "devnode-bot";
const API_ENDPOINT = "http://localhost:3000/api/user/discord-auth";

const DISCORD_SERVER_ERROR = "Whoops... we had an internal issue";
const DISCORD_CHALLENGE_SUCCESS = `Great! Your challenge code is: ${API_ENDPOINT}/`;
const DISCORD_INVALID_DID =
  "Oops! That doesn't look right. It looks like this: `did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA`";
const DISCORD_REPLY = `Please check your DMs`;
const DISCORD_INITIAL_PROMPT = `Hi there! Lets get you verified. Reply with your did. It should look similar to this example: \`did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA\``;

//devnode invite link
// https://discord.com/api/oauth2/authorize?client_id=1005099848988627055&permissions=3072&scope=bot

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [Partials.Channel],
});

console.log("discord-bot start");

client.once("ready", async () => {
  console.log("Ready!");

  let threadChannels = await client.channels.cache.filter(
    (channel) => channel.type == ChannelType.PublicThread
  );

  threadChannels.forEach(async (threadChannel) => {
    const channel = client.channels.cache.get(
      threadChannel.id
    ) as ThreadChannel;

    let starterMessage = await channel.fetchStarterMessage();
    let owner = await channel.fetchOwner();
    let messages = await channel.messages.fetch({ limit: 100 });
    console.log(`${owner?.user?.tag} - ${starterMessage?.content}`);

    let dbThread = await prisma.thread.upsert({
      where: { discordId: channel.id },
      update: {
        timestamp: Number(channel.createdTimestamp),
        discordUser: String(owner?.user?.tag),
        content: String(starterMessage?.content),
      },
      create: {
        discordId: channel.id,
        timestamp: Number(channel.createdTimestamp),
        discordUser: String(owner?.user?.tag),
        content: String(starterMessage?.content),
      },
    });

    for (const message of messages) {
      await prisma.message.upsert({
        where: { discordId: message[1].id },
        update: {
          timestamp: Number(message[1].createdTimestamp),
          discordUser: String(message[1].author.tag),
          content: String(message[1].content),
        },
        create: {
          discordId: message[1].id,
          timestamp: Number(message[1].createdTimestamp),
          discordUser: String(message[1].author.tag),
          content: String(message[1].content),
          threadId: dbThread.id,
        },
      });
      console.log(message[1].content);
    }
  });
});

client.on("messageCreate", async (message: Message) => {
  /////////////////////////////
  // VERIFICATION IN DIRECT MESSAGE
  /////////////////////////////
  if (message.channel.type == ChannelType.DM) {
    const user = await client.users.fetch(message.author.id);

    const { username: handle, discriminator, id: userId } = message.author;
    if (handle === DISCORD_BOT_NAME) return;
    const username = `${handle}#${discriminator}`;

    let did = "";
    try {
      did = message.content.match(/did:[a-zA-z0-9:]{65}/)![0];
    } catch (e) {
      if (!did.length) {
        user.send(DISCORD_INVALID_DID);
        return;
      }
    }

    let challengeCode = randomString(32);

    await prisma.discordChallenge.upsert({
      where: {
        did: did,
      },
      update: {
        did: did,
        username: username,
        timestamp: new Date(),
        challengeCode: challengeCode,
        userId: userId,
      },
      create: {
        did: did,
        username: username,
        timestamp: new Date(),
        challengeCode: challengeCode,
        userId: userId,
      },
    });

    user.send(`${DISCORD_CHALLENGE_SUCCESS}${challengeCode}`);

    /////////////////////////////
    // INVOCATION IN PULIC CHANNEL
    /////////////////////////////
  } else if (message.content === DISCORD_INVOCATION_STRING) {
    console.log("got a new msg");
    // console.log(message);
    message.reply(DISCORD_REPLY);
    message.author.send(DISCORD_INITIAL_PROMPT);
  }
});

client.on("threadCreate", async (thread) => {
  if (thread.type == ChannelType.PublicThread) {
    // When a new forum post is created
    console.log(thread.parentId); // The forum channel ID
    console.log(thread.id); // The forum post ID
    console.log(thread.name); // The name of the forum post
  }
});

client.login(process.env.DISCORD_TOKEN!).catch((e) => console.log(e));

export {};
