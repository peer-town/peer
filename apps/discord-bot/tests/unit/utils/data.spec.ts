import {SocialPlatform, Node} from "../../../src/core/types";
import {expect} from "../../setup";
import {communityHasSocial, getSocialCommunityId} from "../../../src/core/utils/data";

describe('socialFunctions', () => {
  const socialPlatforms: Node<SocialPlatform>[] = [
    {
      node: {
        platform: 'Discord',
        platformId: '1234567890',
      },
    },
    {
      node: {
        platform: 'Discourse',
        platformId: '0987654321',
      },
    },
  ];

  describe('communityHasSocial', () => {
    it('returns true when the community has the specified social platform', () => {
      const hasSocial = communityHasSocial(socialPlatforms, 'Discord');
      expect(hasSocial).to.eq(true);
    });

    it('returns false when the community does not have the specified social platform', () => {
      const hasSocial = communityHasSocial(socialPlatforms, 'Instagram');
      expect(hasSocial).to.eq(false);
    });
  });

  describe('getSocialCommunityId', () => {
    it('returns the platformId of the specified social platform', () => {
      const platformId = getSocialCommunityId(socialPlatforms, 'Discourse');
      expect(platformId).to.eq('0987654321');
    });

    it('throws an error when the specified social platform does not exist', () => {
      expect(() => getSocialCommunityId(socialPlatforms, 'Instagram')).throw();
    });
  });
});
