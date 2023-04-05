import {SocialPlatform, Node, SocialThreadId} from "../../../src/core/types";
import {expect} from "../../setup";
import {communityHasSocial, getSocialCommunityId, getSocialThreadId} from "../../../src/core/utils/data";

describe('utils.data', () => {
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

  const socialThreadIds: SocialThreadId[] = [
    { threadId: "123", platformName: "discord" },
    { threadId: "456", platformName: "discourse" },
  ]

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

  describe('getSocialThreadId', () => {
    it("returns thread id for matching platform name", () => {
      expect(getSocialThreadId(socialThreadIds, "discord")).to.eq("123");
      expect(getSocialThreadId(socialThreadIds, "discourse")).to.eq("456");
      expect(getSocialThreadId(socialThreadIds, "twitter")).to.eq("");
    });
  });
});
