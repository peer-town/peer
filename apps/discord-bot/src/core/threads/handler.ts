import {Request, Response} from "express";
import {Clients, Node, Thread} from "../types";
import _ from "lodash";
import {communityHasSocial, getSocialCommunityId} from "../utils/data";
import {config, constants} from "../../config";
import {Resp} from "../utils/response";
import {threadHandler as discordThreadHandler} from "../../bots/discord";
import {logger} from "../utils/logger";

export const postThread = async (clients: Clients, req: Request, res: Response) => {
  try {
    logger.info('core', {body: req.body});
    const {threadId} = req.body;
    const thread: Node<Thread> = await clients.composeQuery().fetchThreadDetails(threadId);
    const socials = _.get(thread, "node.community.socialPlatforms.edges");

    if (communityHasSocial(socials, constants.PLATFORM_DISCORD_NAME)) {
      const threadId = await postThreadToDiscord(clients, thread);
      return Resp.okD(res, {threadId}, "Created thread on socials");
    } else {
      return Resp.notOk(res, "No discord for this community, bailing out!");
    }
  } catch (e) {
    logger.error('core', {e, body: req.body});
    return Resp.error(res, "Server error occurred");
  }
};

export const postThreadToDiscord = async (clients: Clients, thread: Node<Thread>) => {
  const title = _.get(thread, "node.title");
  const body = _.get(thread, "node.body");
  const threadStreamId = _.get(thread, "node.id");
  const socials = _.get(thread, "node.community.socialPlatforms.edges");
  const userName = _.get(thread, "node.user.userPlatforms[0].platformUsername");
  const userId = _.get(thread, "node.user.walletAddress");
  const userAvatar = _.get(thread, "node.user.userPlatforms[0].platformAvatar");
  const userProfileLink = config.devnodeWebsite.concat(`/${userId}/profile`);
  const redirectLink = config.devnodeWebsite.concat(`/${threadStreamId}`);
  const serverId = getSocialCommunityId(socials, constants.PLATFORM_DISCORD_NAME);
  const payload = {title, body, userName, serverId, threadStreamId, userAvatar, userProfileLink, redirectLink};
  return await discordThreadHandler.postThread(clients, payload);
}
