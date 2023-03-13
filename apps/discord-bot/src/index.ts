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


import express, { response } from "express";
import cors from "cors";
import { DIDSession } from "did-session";
import { ComposeClient } from "@composedb/client";
import { definition, composeMutationHandler } from "@devnode/composedb";

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const port = process.env.PORT ?? 4000;

const INVOCATION_STRING = "devnode";
const INVOCATION_CHANNEL = "devnode_signin";

const compose = new ComposeClient({
  ceramic: String(process.env.NEXT_PUBLIC_CERAMIC_NODE),
  definition,
});

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
    await fetch(String(process.env.NEXT_PUBLIC_CERAMIC_NODE))
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
    
    const session = await DIDSession.fromSession("eyJzZXNzaW9uS2V5U2VlZCI6InN3b0l1TE4zTXpESmc2WjhPS25pZ0Rmc1AwU1hpQS9mU3lmOXBFd2F2Yjg9IiwiY2FjYW8iOnsiaCI6eyJ0IjoiZWlwNDM2MSJ9LCJwIjp7ImRvbWFpbiI6ImRldm5vZGUtd2ViLXN0YWdpbmcudXAucmFpbHdheS5hcHAiLCJpYXQiOiIyMDIzLTAxLTE2VDE0OjM2OjIzLjAwMVoiLCJpc3MiOiJkaWQ6cGtoOmVpcDE1NToxOjB4OGIyYTZhMjJlYzA1NTIyNUM0YzRiNTgxNWU3ZDlGNTY2YjhiZTY4RiIsImF1ZCI6ImRpZDprZXk6ejZNa3RLNG1wNXhld29WZlM3cXlCWE01THRtczNEQ2dYU0NkSHlLenB4R2dGVGVrIiwidmVyc2lvbiI6IjEiLCJub25jZSI6ImY5RVg2QmM3V1QiLCJleHAiOiIyMDI0LTEyLTE2VDE0OjM2OjIzLjAwMVoiLCJzdGF0ZW1lbnQiOiJHaXZlIHRoaXMgYXBwbGljYXRpb24gYWNjZXNzIHRvIHNvbWUgb2YgeW91ciBkYXRhIG9uIENlcmFtaWMiLCJyZXNvdXJjZXMiOlsiY2VyYW1pYzovLyoiXX0sInMiOnsidCI6ImVpcDE5MSIsInMiOiIweDU4MGE3Njg4M2U0ZmQyNGZmNzkzMGVhMWM5NDRhOGFjZGQ1YjBhZjc5OTRiNDJkMDU4NTczYjE2Y2E3NzM2YWU0YWZlZTE5YjNmYWY0MTRhNWQ4MThhNGVjZTdkYmI3MTUzZDY4MjUwZWM0OTI4MzdlMDUxZDQ0OGM1ZmJmODFlMWIifX19");
    compose.setDID(session.did);
    const handler = await composeMutationHandler(compose) 

    const owner = await (await guild.fetch()).fetchOwner();

    const userDetails ={
        platformId: owner.user.id,
        platormName: "discord",
        platformAvatar: owner.user.avatarURL() as string || owner.user.defaultAvatarURL,
        platformUsername: `${owner.user.username}#${owner.user.discriminator}`
    }
    const userRespose = await handler.createUser(userDetails,"not Added");
    if (!userRespose || !userRespose.data) {
      return ;
    } 
    const communityRespose = await handler.createCommunity(guild.name);
    if (!communityRespose || !communityRespose.data) {
      return ;
    } 


    const socialPlatformInput = {
      userID: userRespose.data.createUser.document.id as string,
      platform: "discord",
      platformId: guild?.id as string,
      communityID: communityRespose.data.createCommunity.document.id as string,
      communityName: guild.name,
      communityAvatar: guild.iconURL() || "",
  };

  const socialPlatform =  await handler.createSocialPlatform(socialPlatformInput);

})
}
// apis
app.post("/webcomment", async (req, res) => {
  const { threadId, comment, discordUserName, didSession,platformId } = req.body;
  const response = await onCommentCreateWeb(
    client,
    threadId,
    comment,
    discordUserName,
    didSession,
    platformId
  );
  console.log(response);
  if (response.result) {
    res.status(200).send(response.value);
  } else {
    res.status(400).send(response.value);
  }
});

app.post("/webthread", async (req, res) => {
  const { threadTitle, community, discordUserName, didSession, platformId } = req.body;

  const response = await onThreadCreateWeb(
    client,
    threadTitle,
    community,
    discordUserName,
    didSession,
    platformId
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
