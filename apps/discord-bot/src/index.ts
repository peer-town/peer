import { config } from "dotenv";
config();

import {
  ChannelType,
  Client,
  GatewayIntentBits,
  Message,
  Partials,
} from "discord.js";

import { onDm } from "./handlers/onDm";
import { onInvoke } from "./handlers/onInvoke";
import { onMessageCreate } from "./handlers/onMessageCreate";
import { onStart } from "./handlers/onStart";
import { onThreadCreate } from "./handlers/onThreadCreate";
import fetch from "cross-fetch";

const INVOCATION_STRING = "devnode";
const INVOCATION_CHANNEL = "devnode_signin";

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

console.log("bot start");

client.login(process.env.DISCORD_TOKEN!).catch((e) => console.log(e));

client.once("ready", async () => {
  console.log("Ready!");

  let nodeReady = false;
  while (!nodeReady) {
    console.log("ceramic node not ready");
    await fetch(String(process.env.CERAMIC_NODE))
      .then(() => {
        nodeReady = true;
        console.log("ceramic node connected");
        onStart(client);
      })
      .catch(() => {
        nodeReady = false;
      });
    await new Promise((r) => setTimeout(r, 1000));
  }
});

client.on("messageCreate", async (message: Message) => {
  if (message.channel.type == ChannelType.DM) {
    onDm(message);
  } else if (
    message.content === INVOCATION_STRING &&
    message.channel.name == INVOCATION_CHANNEL
  ) {
    onInvoke(message);
  } else {
    onMessageCreate(message);
  }
});

client.on("threadCreate", async (thread) => {
  onThreadCreate(thread);
});

export {};
