import { DIDSession } from "did-session";
import { ChannelType, Client, ThreadChannel } from "discord.js";
import { prisma } from "@devnode/database";
import { ComposeClient } from "@composedb/client";
import definition from "@devnode/composedb";

export const compose = new ComposeClient({
  ceramic: "http://localhost:7007",
  definition,
});

export const onStart = async (client: Client) => {
  let threadChannels = await client.channels.cache.filter(
    (channel) =>
      channel.type == ChannelType.PublicThread &&
      channel.parent?.name == "hello-yellow"
  );

  for (const threadChannel of threadChannels) {
    const channel = client.channels.cache.get(
      threadChannel[1].id
    ) as ThreadChannel;

    let starterMessage = await channel.fetchStarterMessage();
    let owner = await channel.fetchOwner();
    let messages = await channel.messages.fetch({ limit: 100 });
    //console.log(`${owner?.user?.tag} - ${starterMessage?.content}`);

    const user = (
      await prisma.user.findMany({
        where: {
          discord: {
            equals: owner?.user?.tag,
          },
        },
      })
    )[0];

    if (!user) return;
    const session = await DIDSession.fromSession(user.didSession);
    compose.setDID(session.did);

    const thread = await compose.executeQuery<{
      createThread: { document: { id: string } };
    }>(
      `mutation CreateThread($input: CreateThreadInput!) {
          createThread(input: $input) {
            document {
              title
              id
            }
          }
        }`,
      {
        input: {
          content: { title: String(starterMessage?.content.slice(0, 40)) },
        },
      }
    );

    console.log(`thread id: ${thread.data?.createThread.document.id}`);

    let dbThread = await prisma.thread.upsert({
      where: { discordId: channel.id },
      update: {
        timestamp: String(channel.createdTimestamp),
        discordUser: String(owner?.user?.tag),
        content: String(starterMessage?.content),
      },
      create: {
        discordId: channel.id,
        timestamp: String(channel.createdTimestamp),
        discordUser: String(owner?.user?.tag),
        content: String(starterMessage?.content),
      },
    });

    for (const message of messages) {
      await prisma.user
        .findMany({
          where: {
            discord: {
              equals: owner?.user?.tag,
            },
          },
        })
        .then(async (user: any) => {
          const session = await DIDSession.fromSession(user[0].didSession);
          compose.setDID(session.did);

          const comment = await compose.executeQuery<{
            createComment: { document: { id: string } };
          }>(
            `mutation CreateComment($input: CreateCommentInput!) {
          createComment(input: $input) {
            document {
              threadID
              text
            }
          }
        }`,
            {
              input: {
                content: {
                  threadID: thread.data?.createThread.document.id,
                  text: String(message[1].content),
                },
              },
            }
          );

          console.log(`comment id: ${comment.data?.createComment.document.id}`);
        });

      await prisma.message.upsert({
        where: { discordId: message[1].id },
        update: {
          timestamp: String(message[1].createdTimestamp),
          discordUser: String(message[1].author.tag),
          content: String(message[1].content),
        },
        create: {
          discordId: message[1].id,
          timestamp: String(message[1].createdTimestamp),
          discordUser: String(message[1].author.tag),
          content: String(message[1].content),
          threadId: dbThread.id,
        },
      });
      //console.log(message[1].content);
    }
  }
};
