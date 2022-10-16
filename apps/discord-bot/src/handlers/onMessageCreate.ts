import { ChannelType, Client, Message } from "discord.js";
import { prisma } from "@devnode/database";
import { DIDSession } from "did-session";
import { ComposeClient } from "@composedb/client";
import { definition } from "@devnode/composedb";

export const compose = new ComposeClient({
  ceramic: String(process.env.CERAMIC_NODE),
  definition,
});

export const onMessageCreate = async (message: Message, client: Client) => {
  if (!message.channel.isThread) {
    console.log("no thread");
    return null;
  }

  if (message.channel.type != ChannelType.PublicThread) return null;

  if (message.channel.parent?.name != process.env.DISCORD_CHANNEL_NAME) {
    console.log("bad channel");
    return null;
  }

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

  if (commentExists) return null;

  let foundThread = false;

  while (!foundThread) {
    let thread = await prisma.thread
      .findFirstOrThrow({
        where: {
          discordId: message.thread?.id,
        },
      })
      .then(() => {
        foundThread = true;
      })
      .catch(() => {
        foundThread = false;
      });
  }

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
          threadID: thread.streamId,
          text: String(message.content),
        },
      },
    }
  );

  if (!ceramicComment.data || !ceramicComment.data.createComment.document.id)
    return null;

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
