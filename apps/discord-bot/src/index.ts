import {
  ChannelType,
  Client,
  GatewayIntentBits,
  Message,
  MessageType,
  Partials,
} from "discord.js";
import { config } from "dotenv";
config();

import { PrismaClient } from "@prisma/client";
import { randomString } from "@stablelib/random";
const prisma = new PrismaClient();

const DISCORD_INVOCATION_STRING = "devnode";
const DISCORD_BOT_NAME = "devnode-bot";
const DISCORD_SERVER_ERROR = "Whoops... we had an internal issue";
const DISCORD_CHALLENGE_SUCCESS = "Great! Your challenge code is: ";
const DISCORD_INVALID_DID =
  "Oops! That doesn't look right. It looks like this: `did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA`";
const DISCORD_REPLY = `Please check your DMs`;
const DISCORD_INITIAL_PROMPT = `Hi there! Lets get you verified. Reply with your did. It should look similar to this example: \`did:key:z6MkkyAkqY9bPr8gyQGuJTwQvzk8nsfywHCH4jyM1CgTq4KA\``;

// TODO: remove and replace with redis code
const API_ENDPOINT =
  "https://r27sfer037.execute-api.us-west-2.amazonaws.com/develop";
// const API_ENDPOINT = "http://localhost:3000";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildMessageTyping,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.DirectMessageReactions,
    GatewayIntentBits.DirectMessageTyping,
  ],
  partials: [Partials.Channel],
});

console.log("discord-bot start");

client.once("ready", async () => {
  console.log("Ready!");
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
      did = message.content.match(/did:[a-zA-z0-9]{48}/)![0];
    } catch (e) {
      if (!did.length) {
        user.send(DISCORD_INVALID_DID);
        return;
      }
    }

    let challengeCode = randomString(32);

    const data = {
      did,
      username,
      timestamp: Date.now(),
      challengeCode,
      userId,
    };

    await prisma.discordChallenge.upsert({
      where: {
        did: did,
      },
      update: {
        did: did,
        data: JSON.stringify(data),
      },
      create: {
        did: did,
        data: JSON.stringify(data),
      },
    });

    user.send(`${DISCORD_CHALLENGE_SUCCESS} \`${challengeCode}\``);

    /////////////////////////////
    // INVOCATION IN PULIC CHANNEL
    /////////////////////////////
  } else if (message.content === DISCORD_INVOCATION_STRING) {
    // console.log(message);
    message.reply(DISCORD_REPLY);
    message.author.send(DISCORD_INITIAL_PROMPT);
  }
});

client.login(process.env.DISCORD_TOKEN!).catch((e) => console.log(e));

export {};
