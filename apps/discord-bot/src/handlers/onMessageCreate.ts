import { config } from "dotenv";
config();
import { ChannelType, Message, MessageType } from "discord.js";
import { ComposeClient } from "@composedb/client";
import { definition ,composeMutationHandler, composeQueryHandler } from "@devnode/composedb";
import { Thread } from ".prisma/client";
import {
  DISCORD_CANNOT_DELETE_MESSAGE_PERMISSIONS,
  DISCORD_DO_NOT_CREATE_THREADS_IF_NOT_SIGNED,
  DISCORD_DO_NOT_WRITE_MESSAGES_OURSIDE_THREADS,
  DISCORD_LOST_SESSION,
} from "../consts/replyMessages";
import { DIDSession } from "did-session";

export const compose = new ComposeClient({
  ceramic: String(process.env.CERAMIC_NODE),
  definition,
});

export const onMessageCreate = async (message: Message) => {
  
  const session = await DIDSession.fromSession("eyJzZXNzaW9uS2V5U2VlZCI6InN3b0l1TE4zTXpESmc2WjhPS25pZ0Rmc1AwU1hpQS9mU3lmOXBFd2F2Yjg9IiwiY2FjYW8iOnsiaCI6eyJ0IjoiZWlwNDM2MSJ9LCJwIjp7ImRvbWFpbiI6ImRldm5vZGUtd2ViLXN0YWdpbmcudXAucmFpbHdheS5hcHAiLCJpYXQiOiIyMDIzLTAxLTE2VDE0OjM2OjIzLjAwMVoiLCJpc3MiOiJkaWQ6cGtoOmVpcDE1NToxOjB4OGIyYTZhMjJlYzA1NTIyNUM0YzRiNTgxNWU3ZDlGNTY2YjhiZTY4RiIsImF1ZCI6ImRpZDprZXk6ejZNa3RLNG1wNXhld29WZlM3cXlCWE01THRtczNEQ2dYU0NkSHlLenB4R2dGVGVrIiwidmVyc2lvbiI6IjEiLCJub25jZSI6ImY5RVg2QmM3V1QiLCJleHAiOiIyMDI0LTEyLTE2VDE0OjM2OjIzLjAwMVoiLCJzdGF0ZW1lbnQiOiJHaXZlIHRoaXMgYXBwbGljYXRpb24gYWNjZXNzIHRvIHNvbWUgb2YgeW91ciBkYXRhIG9uIENlcmFtaWMiLCJyZXNvdXJjZXMiOlsiY2VyYW1pYzovLyoiXX0sInMiOnsidCI6ImVpcDE5MSIsInMiOiIweDU4MGE3Njg4M2U0ZmQyNGZmNzkzMGVhMWM5NDRhOGFjZGQ1YjBhZjc5OTRiNDJkMDU4NTczYjE2Y2E3NzM2YWU0YWZlZTE5YjNmYWY0MTRhNWQ4MThhNGVjZTdkYmI3MTUzZDY4MjUwZWM0OTI4MzdlMDUxZDQ0OGM1ZmJmODFlMWIifX19");
  compose.setDID(session.did);
  const queryHandler = await composeQueryHandler();
  const mutationhandler = await composeMutationHandler(compose);

  //We ignore bots
  if (message.author.bot) return;

  //If not in a text channel or thread channel, ignore it
  if (
    message.channel.type != ChannelType.GuildText &&
    message.channel.type != ChannelType.PublicThread
  )
    return;

  //If not in our channel, ignore it
  if (
    message.channel.name != process.env.DISCORD_CHANNEL_NAME &&
    message.channel.parent?.name != process.env.DISCORD_CHANNEL_NAME
  )
    return;

  //If it's a normal message and it does not create a thread, delete it and tell the user he can't do that
  if (
    message.channel.type != ChannelType.PublicThread &&
    message.type != MessageType.ThreadCreated
  ) {
    await new Promise((r) => setTimeout(r, 3000));

    message.delete().catch((e) => {
      message.reply(DISCORD_CANNOT_DELETE_MESSAGE_PERMISSIONS);
    });

    message.author
      .send(DISCORD_DO_NOT_WRITE_MESSAGES_OURSIDE_THREADS)
      .catch((e) => console.log(e));
    return;
  }

  //If it's a thread message, now we care about it
  if (message.channel.type == ChannelType.PublicThread) {
    const existingMessage = await queryHandler.fetchCommentDetails(message.channel.id);

    const user =  await queryHandler.fetchUserDetailsFromPlatformId("discord", message.author.id)
      .catch(() => {
        return null;
      });
    const {id} = user.node;
    //If the user does not have a devnode account, delete it and tell the user to create one
    if (user == null || !user.node) {
      await new Promise((r) => setTimeout(r, 3000));

      if (existingMessage) {
        message.author.send(DISCORD_LOST_SESSION).catch((e) => console.log(e));
        return;
      } else {
        message.delete().catch((e) => console.log());
        message.author
          .send(DISCORD_DO_NOT_CREATE_THREADS_IF_NOT_SIGNED)
          .catch((e) => console.log(e));
        return;
      }
    }

    //If we already stored this message for some reason, ignore it
    if (existingMessage) return null;

    // Find the thread for this message in our DB.
    // If this is the first message of a thread, the thread entry in the DB is probably not yet ready
    // So keep doing it until you find it
    // Also add a delay so we make sure the thread propagates to Ceramic
    let thread: Thread | null = null;
    let propagationDelay = false;

    while (!thread) {
      thread = await queryHandler.fetchThreadDetails(message.channel.id)
        .then((res:any) => {
          return res;
        })
        .catch((e:any) => {
          propagationDelay = true;
          console.log(e);
          return null;
        });
    }

    if (propagationDelay) await new Promise((r) => setTimeout(r, 5000));

    const commentInput ={
      threadId: String(thread.id) ,
      userId:id as string,//streamId of User
      comment:String(message.content),//comment text
      createdFrom:"discord", //platform name
      createdAt: thread.createdAt?.toISOString(),
    }
    //Store in Ceramic
    await mutationhandler.createComment(commentInput)
      .then(async (r:any) => {
        if (!r || !r.data) return;
        if (!thread) return;
      })
      .catch((e:any) => console.log(e));
  }
};
