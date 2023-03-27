import {Request, Response} from "express";
import {Clients, Comment, Node} from "../types";
import _ from "lodash";
import {config, constants} from "../../config";
import {Resp} from "../utils/response";
import {Client} from "discord.js";
import {commentHandler as discordCommentHandler} from "../../bots/discord";
import {logger} from "../utils/logger";
import {communityHasSocial, getSocialCommunityId} from "../utils/data";

export const postComment = async (clients: Clients, req: Request, res: Response) => {
  const {commentId} = req.body;
  logger.info('core', {body: req.body});
  const comment: Node<Comment> = await clients.composeQuery().fetchCommentDetails(commentId);
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
  const userId = _.get(comment, "node.user.walletAddress");
  const userAvatar = _.get(comment, "node.user.userPlatforms[0].platformAvatar");
  const userProfileLink = config.devnodeWebsite.concat(`/${userId}/profile`);
  const serverId = getSocialCommunityId(socials, constants.PLATFORM_DISCORD_NAME);
  const threadId = _.get(comment, "node.thread.threadId");

  const payload = {text, userName, serverId, threadId, threadStreamId, userAvatar, userProfileLink};
  discordCommentHandler.postComment(discordClient, payload)
    .catch((e) => logger.error('core', {payload, e}));
}
