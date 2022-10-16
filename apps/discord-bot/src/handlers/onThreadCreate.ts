import { ChannelType, Client, ThreadChannel } from "discord.js";
import { prisma } from "@devnode/database";
import { DIDSession } from "did-session";
import { compose } from "./onMessageCreate";

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

  if (!ceramicThread.data || !ceramicThread.data.createThread.document.id)
    return null;

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
