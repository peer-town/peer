import { DIDSession } from "did-session";
import { ChannelType, Client, Message, ThreadChannel } from "discord.js";
import { ComposeClient } from "@composedb/client";
import { definition } from "@devnode/composedb";
import { prisma } from "@devnode/database";

export const compose = new ComposeClient({
  ceramic: "http://localhost:7007",
  definition,
});

const foundThread = async (thread: ThreadChannel) => {
  let author = (await thread.fetchStarterMessage())?.author;

  const user = await prisma.user
    .findUniqueOrThrow({
      where: {
        discord: author?.tag,
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
      discordUser: String(author?.tag),
      title: String(thread.name),
    },
    create: {
      discordId: thread.id,
      streamId: ceramicThread.data.createThread.document.id,
      timestamp: String(thread.createdTimestamp),
      discordUser: String(author?.tag),
      title: String(thread.name),
    },
  });

  return ceramicThread.data.createThread.document.id;
};

const foundMessage = async (message: Message, threadStreamId: string) => {
  const user = await prisma.user
    .findUniqueOrThrow({
      where: {
        discord: message.author.tag,
      },
      select: {
        didSession: true,
      },
    })
    .catch(() => {
      return null;
    });
  if (user == null || !user.didSession) {
    message.delete();
    return null;
  }

  const session = await DIDSession.fromSession(user.didSession);
  compose.setDID(session.did);

  const commentExists = await prisma.comment.findUnique({
    where: {
      discordId: message.id,
    },
  });

  if (commentExists) return commentExists.streamId;

  const ceramicComment = await compose.executeQuery<{
    createComment: { document: { id: string } };
  }>(
    `mutation CreateComment($input: CreateCommentInput!) {
          createComment(input: $input) {
            document {
              id
              threadID
              text
            }
          }
        }`,
    {
      input: {
        content: {
          threadID: threadStreamId,
          text: String(message.content),
        },
      },
    }
  );

  if (!ceramicComment.data || !ceramicComment.data.createComment.document.id)
    return null;

  const thread = await prisma.thread.findFirstOrThrow({
    where: {
      streamId: threadStreamId,
    },
  });

  await prisma.comment.upsert({
    where: { discordId: message.id },
    update: {
      timestamp: String(message.createdTimestamp),
      discordUser: String(message.author.tag),
      content: String(message.content),
    },
    create: {
      discordId: message.id,
      streamId: ceramicComment.data.createComment.document.id,
      timestamp: String(message.createdTimestamp),
      discordUser: String(message.author.tag),
      content: String(message.content),
      Thread: {
        connect: { id: thread.id },
      },
    },
  });
};

export const onStart = async (client: Client) => {
  let threadChannels = await client.channels.cache.filter(
    (channel) =>
      channel.type == ChannelType.PublicThread &&
      channel.parent?.name == process.env.DISCORD_CHANNEL_NAME
  );

  for (const threadChannel of threadChannels) {
    const thread = client.channels.cache.get(
      threadChannel[1].id
    ) as ThreadChannel;

    const threadCeramicStreamId = await foundThread(thread);

    let messages = await thread.messages.fetch({ limit: 100 });

    for (const message of messages.values()) {
      if (threadCeramicStreamId) foundMessage(message, threadCeramicStreamId);
    }
  }
};
