import _ from "lodash";
import {Node, SocialPlatform, SocialThreadId} from "../types";

export const communityHasSocial = (socials: Node<SocialPlatform>[], platform: string) => {
  const social = socials.filter((d) => d.node.platform === platform);
  return social.length > 0;
}

export const getSocialCommunityId = (socials: Node<SocialPlatform>[], platform: string) => {
  const social = socials.filter((d) => d.node.platform === platform);
  return social[0].node.platformId;
}

export const getSocialThreadId = (socials: SocialThreadId[], platformName: string) => {
  const id = socials.find((s) => s.platformName === platformName);
  return _.get(id,"threadId", "");
}

export const getBoolean = (value: string | undefined | null) => {
  if (_.isNil(value)) return false;
  if (value === 'true') return true;
  return false;
}
