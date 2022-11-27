import { config } from "dotenv";
config();
import { ChannelType, Client, ThreadChannel } from "discord.js";
import { prisma } from "@devnode/database";
import { DIDSession } from "did-session";
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

export const onThreadCreate = async (thread: ThreadChannel) => {
  const threadOwner = await thread.fetchOwner();
  //We ignore bots
  if (threadOwner?.user?.bot) return;

  //We only care about public threads
  if (thread.type != ChannelType.PublicThread) return null;

  //We only care about threads in our channel
  if (thread.parent?.name != process.env.DISCORD_CHANNEL_NAME) return null;

  const existingThread = await prisma.thread.findUnique({
    where: {
      discordId: thread.id,
    },
  });

  //If the user does not have a devnode account, delete it and tell the user to create one
  const user = await prisma.user
    .findUniqueOrThrow({
      where: {
        discordUsername: (await thread.fetchOwner())?.user?.tag,
      },
      select: {
        didSession: true,
      },
    })
    .catch(() => {
      return null;
    });
  if (user == null || !user.didSession) {
    //User account does not exist at all
    await new Promise((r) => setTimeout(r, 3000));

    if (existingThread) {
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
  if (existingThread) return;

  //Getting ready to store in Ceramic
  const session = await DIDSession.fromSession(user.didSession);
  compose.setDID(session.did);

  //Store in Ceramic
  await compose
    .executeQuery<{
      createThread: { document: { id: string } };
    }>(
      `mutation CreateThread($input: CreateThreadInput!) {
          createThread(input: $input) {
            document {
              id
              community
              title
              createdAt
            }
          }
        }`,
      {
        input: {
          content: {
            community: thread.guild.id,
            title: String(thread.name),
            createdAt: thread.createdAt?.toISOString(),
          },
        },
      }
    )
    .then(async (r) => {
      console.log(r);
      if (!r || !r.data) return;

      //Once stored in ceramic, store in our db as well
      await prisma.thread.upsert({
        where: { discordId: thread.id },
        update: {
          createdAt: thread.createdAt!,
          discordAuthor: String((await thread.fetchOwner())?.user?.tag),
          discordCommunity: thread.guild.id,
          title: String(thread.name),
        },
        create: {
          discordId: thread.id,
          streamId: r.data.createThread.document.id,
          createdAt: thread.createdAt!,
          discordAuthor: String((await thread.fetchOwner())?.user?.tag),
          discordCommunity: thread.guild.id,
          title: String(thread.name),
        },
      });
    })
    .catch((e) => console.log(e));
};
