import { config } from "dotenv";
config();
import { ChannelType, Message, MessageType } from "discord.js";
import { prisma } from "@devnode/database";
import { DIDSession } from "did-session";
import { ComposeClient } from "@composedb/client";
import { definition } from "@devnode/composedb";
import { Thread } from ".prisma/client";
import {
  DISCORD_CANNOT_DELETE_MESSAGE_PERMISSIONS,
  DISCORD_DO_NOT_CREATE_THREADS_IF_NOT_SIGNED,
  DISCORD_DO_NOT_WRITE_MESSAGES_OURSIDE_THREADS,
  DISCORD_LOST_SESSION,
} from "../consts/replyMessages";

export const compose = new ComposeClient({
  ceramic: String(process.env.CERAMIC_NODE),
  definition,
});

export const onMessageCreate = async (message: Message) => {
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
    const existingMessage = await prisma.comment.findUnique({
      where: {
        discordId: message.id,
      },
    });

    const user = await prisma.user
      .findUniqueOrThrow({
        where: {
          discordUsername: message.author.tag,
        },
        select: {
          didSession: true,
        },
      })
      .catch(() => {
        return null;
      });

    //If the user does not have a devnode account, delete it and tell the user to create one
    if (user == null || !user.didSession) {
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
      thread = await prisma.thread
        .findFirstOrThrow({
          where: {
            discordId: message.channel.id,
          },
        })
        .then((res) => {
          return res;
        })
        .catch((e) => {
          propagationDelay = true;
          console.log(e);
          return null;
        });
    }

    console.log(thread);

    if (propagationDelay) await new Promise((r) => setTimeout(r, 5000));

    //Getting ready to store in Ceramic
    const session = await DIDSession.fromSession(user.didSession);
    compose.setDID(session.did);

    //Store in Ceramic
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
              threadID: thread!.streamId,
              text: String(message.content),
              createdAt: message.createdAt.toISOString(),
            },
          },
        }
      )
      .then(async (r) => {
        if (!r || !r.data) return;
        if (!thread) return;

        //Once stored in ceramic, store in our db as well
        await prisma.comment.upsert({
          where: { discordId: message.id },
          update: {
            createdAt: message.createdAt,
            discordAuthor: String(message.author.tag),
            text: String(message.content),
          },
          create: {
            discordId: message.id,
            streamId: r.data.createComment.document.id,
            createdAt: message.createdAt,
            discordAuthor: String(message.author.tag),
            text: String(message.content),
            Thread: {
              connect: { id: thread.id },
            },
          },
        });

     
      })
      .catch((e) => console.log(e));
  }
};
