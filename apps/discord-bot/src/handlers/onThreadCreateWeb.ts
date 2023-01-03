import { config } from "dotenv";
config();
import {
  ChannelType,
  Client,
  ForumChannel,
  TextChannel,
  ThreadAutoArchiveDuration,
  ThreadChannel,
} from "discord.js";
import { prisma } from "@devnode/database";
import { DIDSession } from "did-session";
import { ComposeClient } from "@composedb/client";
import { definition } from "@devnode/composedb";
export const compose = new ComposeClient({
  ceramic: String(process.env.CERAMIC_NODE),
  definition,
});

export type Response = {
  result: boolean;
  value: string | object;
};

export const onThreadCreateWeb = async (
  client: Client,
  threadTitle: string,
  community: string,
  discordUserName: string,
  didSession: string
): Promise<Response> => {
  let guild = await client.guilds.cache.get(community);

  if (!guild) return { result: false, value: "community missing" };

  let channel = guild.channels.cache.find(
    (channel) => channel.name == "devnode" && channel.guildId == community
  ) as ForumChannel;

  if (!channel) return { result: false, value: "channel missing" };

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      discordUsername: discordUserName,
    },
    select: {
      didSession: true,
    },
  });

  if (user == null || !user.didSession || user.didSession!==didSession) {
    return {
      result: false,
      value: "user not signed in from discord or did session has expired",
    };
  }

  const thread = await channel.threads
    .create({
      name: threadTitle,
      autoArchiveDuration: ThreadAutoArchiveDuration.OneWeek,
      message: {
        content: "This message was posted on web",
      },
      reason: "Created in Web",
    })
    .catch((e) => {
      console.log(e);
    });

  if (!(thread instanceof ThreadChannel))
    return { result: false, value: "could not create thread" };

  const session = await DIDSession.fromSession(user.didSession);
  compose.setDID(session.did);

  let composeResponse;
  try {
    composeResponse = await compose.executeQuery<{
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
            community: community,
            title: String(thread.name),
            createdAt: thread.createdAt?.toISOString(),
          },
        },
      }
    );
  } catch (res) {
    await thread.delete();
    return { result: false, value: "composedb failed" };
  }

  if (composeResponse.errors) console.log(composeResponse.errors);

  if (!composeResponse || !composeResponse.data) {
    await thread.delete();
    return { result: false, value: "composedb failed" };
  }

  await prisma.thread.upsert({
    where: { discordId: thread.id },
    update: {
      createdAt: thread.createdAt!,
      discordAuthor: discordUserName,
      discordCommunity: thread.guild.id,
      title: String(thread.name),
    },
    create: {
      discordId: thread.id,
      streamId: composeResponse.data.createThread.document.id,
      createdAt: thread.createdAt!,
      discordAuthor: discordUserName,
      discordCommunity: thread.guild.id,
      title: String(thread.name),
    },
  });

  return { result: true, value: "thread added" };
};
