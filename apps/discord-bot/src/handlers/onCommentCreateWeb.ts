import { config } from "dotenv";
config();
import { ChannelType, Client, TextChannel, ThreadChannel } from "discord.js";
import { prisma } from "@devnode/database";
import { DIDSession } from "did-session";
import { Response } from "../type"
import { ComposeClient } from "@composedb/client";
import { definition } from "@devnode/composedb";
import {
  DISCORD_DO_NOT_CREATE_THREADS_IF_NOT_SIGNED,
  DISCORD_LOST_SESSION,
} from "../consts/replyMessages";

export const compose = new ComposeClient({
  ceramic: String(process.env.CERAMIC_NODE),
  definition,
});

export const onCommentCreateWeb = async (client:Client, threadId:string, comment:string, discordUserName:string):Promise<Response> => {

  const existhreaingThread = await prisma.thread.findUnique({
    where: {
      streamId: threadId,
    },
  }).catch((e)=>{
    console.log(e);
  });

  const user = await prisma.user
      .findUniqueOrThrow({
        where: {
          discordUsername: discordUserName,
        },
        select: {
          didSession: true,
        },
      })

    if (user == null || !user.didSession) {
        return {result: 'false', value:'user not signed in from discord or did session has expired'};
    }

    if(existhreaingThread){
      
      const thread = client.channels.cache.get(existhreaingThread?.discordId) as ThreadChannel;
      const message = await thread.send(`From WEB \n ${discordUserName} : ${comment}`);

      const session = await DIDSession.fromSession(user.didSession);
      compose.setDID(session.did);

      try{
        await compose
        .executeQuery<{
          createComment: { document: { id: string } };
        }>(
          `mutation CreateComment($input: CreateCommentInput!) {
            createComment(input: $input) {
              document {
                id
                threadID
                text
                createdAt
              }
            }
          }`,
          {
            input: {
              content: {
                threadID: threadId,
                text: comment,
                createdAt: new Date().toISOString(),
              },
            },
          }
        )
      }
      catch{
        message.delete();
        return {result: 'false', value:'compose failed'};
      }
    }

    return {result: 'true', value:'comment added'};
};
