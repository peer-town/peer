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
import { onCommentCreateWeb } from "./handlers/onCommentCreateWeb";
import { onThreadCreateWeb } from "./handlers/onThreadCreateWeb";
import fetch from "cross-fetch";

import { prisma } from "@devnode/database";

import express, { response } from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT ?? 4000;

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
  await updateCommunities();
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

client.on("guildCreate", async () => {
  await updateCommunities();
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

const updateCommunities = async () => {
  (await client.guilds.fetch()).map(async (guild) => {
    await prisma.community.upsert({
      where: {
        discordId: guild.id,
      },
      update: {
        communityName: guild.name,
        communityAvatar: guild.iconURL() ?? "http://placekitten.com/200/200",
      },
      create: {
        discordId: guild.id,
        communityName: guild.name,
        communityAvatar: guild.iconURL() ?? "http://placekitten.com/200/200",
      },
    });
  });
};

// apis
app.post("/webcomment", async (req, res) => {
  const { threadId, comment, discordUserName, didSession } = req.body;
  console.log({ threadId: threadId, comment: comment });
  const response = await onCommentCreateWeb(
    client,
    threadId,
    comment,
    discordUserName,
    didSession
  );
  console.log(response);
  if (response.result) {
    res.status(200).send(response.value);
  } else {
    res.status(400).send(response.value);
  }
});

app.post("/webthread", async (req, res) => {
  const { threadTitle, community, discordUserName, didSession } = req.body;
  console.log({
    threadTitle: threadTitle,
    community: community,
    discordUserName: discordUserName,
  });
  const response = await onThreadCreateWeb(
    client,
    threadTitle,
    community,
    discordUserName,
    didSession
  );
  console.log(response);
  if (response.result) {
    res.status(200).send(response.value);
  } else {
    res.status(400).send(response.value);
  }
});

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
export {};
