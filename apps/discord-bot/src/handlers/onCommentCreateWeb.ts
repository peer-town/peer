import { config } from "dotenv";
config();
import { ChannelType, Client, TextChannel, ThreadChannel } from "discord.js";
import { ComposeClient } from "@composedb/client";
import { definition ,composeMutationHandler, composeQueryHandler } from "@devnode/composedb";
import { DIDSession } from "did-session";

export const compose = new ComposeClient({
  ceramic: String(process.env.CERAMIC_NODE),
  definition,
});

export type Response = {
  result: boolean;
  value: string | object;
};

export const onCommentCreateWeb = async (
  client: Client,
  threadId: string,
  comment: string,
  discordUserName: string,
  didSession: string,
  platformId:string
): Promise<Response> => {

  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);

  const queryHandler = await composeQueryHandler();
  const mutationhandler = await composeMutationHandler(compose);

  const existhreaingThread = await queryHandler
    .fetchThreadDetails(threadId)
    .catch((e) => {
      console.log(e);
    });

  const user = await queryHandler.fetchUserDetailsFromPlatformId("discord",platformId )

  if (user == null || !user.node ) {
    return {
      result: false,
      value: "user not signed in from discord or did session has expired",
    };
  }

  const {id} = user.node;

  if (existhreaingThread) {
    const thread = client.channels.cache.get(
      existhreaingThread.node.threadId
    ) as ThreadChannel;

    const message = await thread.send(
      `From WEB \n ${discordUserName} : ${comment}`
    );

  const commentInput ={
    threadId: threadId ,
    userId:id as string,//streamId of User
    comment:String(comment),//comment text
    createdFrom:"discord", //platform name
    createdAt: thread.createdAt?.toISOString() as string,
  }

    let composeResponse;

    try {
      composeResponse = await mutationhandler.createComment(commentInput);

    } catch {
      message.delete();
      return { result: false, value: "compose failed" };
    }

    if (!composeResponse && composeResponse?.errors) {
      await message.delete();
      return { result: false, value: composeResponse?.errors };
    }
  }
  else{
    return { result: false, value: "thread not found" };
  }

  return { result: true, value: "comment added" };
};
