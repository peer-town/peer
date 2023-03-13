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
import { ComposeClient } from "@composedb/client";
import { definition, composeMutationHandler, composeQueryHandler } from "@devnode/composedb";
import { DIDSession } from "did-session";
export const compose = new ComposeClient({
  ceramic: String(process.env.NEXT_PUBLIC_CERAMIC_NODE),
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
  didSession: string,
  platformId:string
): Promise<Response> => {
  
  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);
  const queryHandler = await composeQueryHandler();
  const mutationhandler = await composeMutationHandler(compose);

  let guild =  client.guilds.cache.get(community);
  
  if (!guild) return { result: false, value: "community missing" };

  let channel = guild.channels.cache.find(
    (channel) => channel.name == "devnode" && channel.guildId == community
  ) as ForumChannel;

  if (!channel) return { result: false, value: "channel missing" };

  const user = await queryHandler.fetchUserDetailsFromPlatformId("discord", platformId);
  if (user == null || !user.node ) {
    return {
      result: false,
      value: "user not signed in from discord or did session has expired",
    };
  }
  
  const {id} = user.node;

  const socialPlatform = await queryHandler.fetchSocialPlatform(community as string);
  const {communityID } = socialPlatform.node;

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

  const threadDetails = {
    communityId: communityID as string,
    userID: id as string,
    threadId:thread.id,
    title: String(thread.name),
    createdFrom:"discord", 
    createdAt: thread.createdAt?.toISOString() as string,
  }

  let composeResponse;
  try {
    composeResponse = await mutationhandler.createThread(threadDetails);
  } catch (res) {
    await thread.delete();
    return { result: false, value: "composedb failed" };
  }

  if (composeResponse.errors) console.log(composeResponse.errors);

  if (!composeResponse || !composeResponse.data) {
    await thread.delete();
    return { result: false, value: "composedb failed" };
  }

  return { result: true, value: "thread added" };
};
