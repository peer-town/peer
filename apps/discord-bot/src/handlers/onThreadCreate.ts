import { config } from "dotenv";
config();
import { ChannelType, Client, ThreadChannel } from "discord.js";
import { prisma } from "@devnode/database";
import { DIDSession } from "did-session";
import { ComposeClient } from "@composedb/client";
import { definition } from "@devnode/composedb";

export const compose = new ComposeClient({
  ceramic: String(process.env.CERAMIC_NODE),
  definition,
});

export const onThreadCreate = async (thread: ThreadChannel, client: Client) => {
  if (thread.type != ChannelType.PublicThread) return null;
  if (thread.parent?.name != process.env.DISCORD_CHANNEL_NAME) return null;

  const user = await prisma.user
    .findUniqueOrThrow({
      where: {
        discord: (await thread.fetchOwner())?.user?.tag,
      },
      select: {
        didSession: true,
      },
    })
    .catch(() => {
      return null;
    });
  if (user == null || !user.didSession) {
    await new Promise((r) => setTimeout(r, 3000));
    thread.delete();
    return null;
  }

  const threadExists = await prisma.thread.findUnique({
    where: {
      discordId: thread.id,
    },
  });

  if (threadExists) return threadExists.streamId;

  const session = await DIDSession.fromSession(user.didSession);
  compose.setDID(session.did);

  const ceramicThread = await compose.executeQuery<{
    createThread: { document: { id: string } };
  }>(
    `mutation CreateThread($input: CreateThreadInput!) {
          createThread(input: $input) {
            document {
              id
              title
            }
          }
        }`,
    {
      input: {
        content: { title: String(thread.name) },
      },
    }
  );

  if (!ceramicThread.data || !ceramicThread.data.createThread) return null;

  if (!ceramicThread.data.createThread.document.id) return null;

  await prisma.thread.upsert({
    where: { discordId: thread.id },
    update: {
      timestamp: String(thread.createdTimestamp),
      discordUser: String((await thread.fetchOwner())?.user?.tag),
      title: String(thread.name),
    },
    create: {
      discordId: thread.id,
      streamId: ceramicThread.data.createThread.document.id,
      timestamp: String(thread.createdTimestamp),
      discordUser: String((await thread.fetchOwner())?.user?.tag),
      title: String(thread.name),
    },
  });
};
