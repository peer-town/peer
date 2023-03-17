import {Request, Response} from "express";
import {Clients, Comment, Node, SocialPlatform} from "../types";
import _ from "lodash";
import {constants} from "../../config";
import {Resp} from "../utils/response";
import {Client} from "discord.js";
import {commentHandler as discordCommentHandler} from "../../bots/discord";
import {composeQueryHandler} from "@devnode/composedb";

export const communityHasSocial = (socials: Node<SocialPlatform>[], platform: string) => {
  const discord = socials.filter((d) => d.node.platform === platform);
  return discord.length > 0;
}

export const getSocialCommunityId = (socials: Node<SocialPlatform>[], platform: string) => {
  const discord = socials.filter((d) => d.node.platform === platform);
  return discord[0].node.platformId;
}

export const postComment = async (clients: Clients, req: Request, res: Response) => {
  const {commentId} = req.body;
  const comment: Node<Comment> = await composeQueryHandler().fetchCommentDetails(commentId);
  const socials = _.get(comment, "node.thread.community.socialPlatforms.edges");

  if (communityHasSocial(socials, constants.PLATFORM_DISCORD_NAME)) {
    postCommentToDiscord(clients.discord, comment);
  } else {
    return Resp.notOk(res, "No discord for this community, bailing out!");
  }
  return Resp.ok(res, "Posted to socials!");
};

export const postCommentToDiscord = (discordClient: Client, comment: Node<Comment>) => {
  const text = _.get(comment, "node.text");
  const socials = _.get(comment, "node.thread.community.socialPlatforms.edges");
  const threadStreamId = _.get(comment, "node.threadId");
  const userName = _.get(comment, "node.user.userPlatforms[0].platformUsername");
  const serverId = getSocialCommunityId(socials, constants.PLATFORM_DISCORD_NAME);
  const threadId = _.get(comment, "node.thread.threadId");

  discordCommentHandler.postComment(discordClient, {
    text, userName, serverId, threadId, threadStreamId,
  });
}
