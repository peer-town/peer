import { config } from "dotenv";
config();
import { ChannelType, Client, ThreadChannel } from "discord.js";
import { ComposeClient } from "@composedb/client";
import { definition, composeMutationHandler, composeQueryHandler } from "@devnode/composedb";
import {
  DISCORD_DO_NOT_CREATE_THREADS_IF_NOT_SIGNED,
  DISCORD_LOST_SESSION,
} from "../consts/replyMessages";
import { DIDSession } from "did-session";

export const compose = new ComposeClient({
  ceramic: String(process.env.NEXT_PUBLIC_CERAMIC_NODE),
  definition,
});

export const onThreadCreate = async (thread: ThreadChannel) => {

  const session = await DIDSession.fromSession("eyJzZXNzaW9uS2V5U2VlZCI6InN3b0l1TE4zTXpESmc2WjhPS25pZ0Rmc1AwU1hpQS9mU3lmOXBFd2F2Yjg9IiwiY2FjYW8iOnsiaCI6eyJ0IjoiZWlwNDM2MSJ9LCJwIjp7ImRvbWFpbiI6ImRldm5vZGUtd2ViLXN0YWdpbmcudXAucmFpbHdheS5hcHAiLCJpYXQiOiIyMDIzLTAxLTE2VDE0OjM2OjIzLjAwMVoiLCJpc3MiOiJkaWQ6cGtoOmVpcDE1NToxOjB4OGIyYTZhMjJlYzA1NTIyNUM0YzRiNTgxNWU3ZDlGNTY2YjhiZTY4RiIsImF1ZCI6ImRpZDprZXk6ejZNa3RLNG1wNXhld29WZlM3cXlCWE01THRtczNEQ2dYU0NkSHlLenB4R2dGVGVrIiwidmVyc2lvbiI6IjEiLCJub25jZSI6ImY5RVg2QmM3V1QiLCJleHAiOiIyMDI0LTEyLTE2VDE0OjM2OjIzLjAwMVoiLCJzdGF0ZW1lbnQiOiJHaXZlIHRoaXMgYXBwbGljYXRpb24gYWNjZXNzIHRvIHNvbWUgb2YgeW91ciBkYXRhIG9uIENlcmFtaWMiLCJyZXNvdXJjZXMiOlsiY2VyYW1pYzovLyoiXX0sInMiOnsidCI6ImVpcDE5MSIsInMiOiIweDU4MGE3Njg4M2U0ZmQyNGZmNzkzMGVhMWM5NDRhOGFjZGQ1YjBhZjc5OTRiNDJkMDU4NTczYjE2Y2E3NzM2YWU0YWZlZTE5YjNmYWY0MTRhNWQ4MThhNGVjZTdkYmI3MTUzZDY4MjUwZWM0OTI4MzdlMDUxZDQ0OGM1ZmJmODFlMWIifX19");
  compose.setDID(session.did);
  const queryHandler = await composeQueryHandler();
  const mutationhandler = await composeMutationHandler(compose);

  const threadOwner = await thread.fetchOwner();
  //We ignore bots
  if (threadOwner?.user?.bot) return;

  if(!threadOwner || !threadOwner.user) return;

  //We only care about public threads
  if (thread.type != ChannelType.PublicThread) return null;

  //We only care about threads in our channel
  if (thread.parent?.name != process.env.DISCORD_CHANNEL_NAME) return null;

  const existingThread = await queryHandler.fetchThreadDetails(thread.id);

  //If the user does not have a devnode account, delete it and tell the user to create one

  const user = await queryHandler.fetchUserDetailsFromPlatformId("discord", threadOwner.user.id);

  if (user == null || !user.node) {
    //User account does not exist at all
    await new Promise((r) => setTimeout(r, 3000));

    if (existingThread && existingThread.node) {
      threadOwner?.user
        ?.send(DISCORD_LOST_SESSION)
        .catch((e) => console.log(e));
      return null;
    } else {
      thread.delete();
      threadOwner?.user
        ?.send(DISCORD_DO_NOT_CREATE_THREADS_IF_NOT_SIGNED)
        .catch((e) => console.log(e));
      return null;
    }
  }

  //If we already stored this thread for some reason, ignore it
  if (existingThread && existingThread.node ) return;

  const socialPlatform = await queryHandler.fetchSocialPlatform(thread.guildId as string);
  const {communityID } = socialPlatform.node;

  const {id} = user.node;

  const threadDetails = {
    communityId: communityID as string,
    userID: id as string,
    threadId:thread.id,
    title: String(thread.name),
    createdFrom:"discord", 
    createdAt: thread.createdAt?.toISOString() as string,
  }

  //Store in Ceramic
  
  mutationhandler.createThread(threadDetails).then(async (r:any) => {
    console.log(r);
    if (!r || !r.data) return;
  })
  .catch((e:any) => console.log(e));
};
