import { config } from "dotenv";
config();
import { ChannelType, Client, TextChannel, ThreadChannel } from "discord.js";
import { prisma } from "@devnode/database";
import { DIDSession } from "did-session";
import { ComposeClient } from "@composedb/client";
import { definition } from "@devnode/composedb";
import { Response } from "../type";
export const compose = new ComposeClient({
  ceramic: String(process.env.CERAMIC_NODE),
  definition,
});

export const onThredCreateWeb = async (
  client: Client,
  threadTitle: string,
  community: string,
  discordUserName: string
): Promise<Response> => {
  let channel = client.channels.cache
    .filter(
      (channel) =>
        channel.type == ChannelType.GuildText &&
        channel.name == process.env.DISCORD_CHANNEL_NAME &&
        channel.id == community
    )
    .first() as TextChannel;

  const user = await prisma.user.findUniqueOrThrow({
    where: {
      discordUsername: discordUserName,
    },
    select: {
      didSession: true,
    },
  });

  if (user == null || !user.didSession) {
    return {
      result: "false",
      value: "user not signed in from discord or did session has expired",
    };
  }

  let thread: ThreadChannel;

  try {
    thread = await channel.threads.create({
      name: threadTitle,
      reason: "Created in Web",
    });
  } catch {
    return { result: "false", value: "could not create thread" };
  }

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
            community: thread.guild.id,
            title: String(thread.name),
            createdAt: thread.createdAt?.toISOString(),
          },
        },
      }
    );
  } catch {
    await thread.delete();
    return { result: "false", value: "composedb failed" };
  }

  if (!composeResponse || !composeResponse.data) {
    await thread.delete();
    return { result: "false", value: "composedb failed" };
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

  return { result: "true", value: "thread added" };
};
