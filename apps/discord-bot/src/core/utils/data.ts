import {Node, SocialPlatform} from "../types";

export const communityHasSocial = (socials: Node<SocialPlatform>[], platform: string) => {
  const social = socials.filter((d) => d.node.platform === platform);
  return social.length > 0;
}

export const getSocialCommunityId = (socials: Node<SocialPlatform>[], platform: string) => {
  const social = socials.filter((d) => d.node.platform === platform);
  return social[0].node.platformId;
}
