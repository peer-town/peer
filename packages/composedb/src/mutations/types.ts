export interface UpdateCommunityPayload {
  communityId: string;
  communityName: string;
  description: string;
}

export interface UpdateSocialPlatformPayload {
  socialPlatformId: string;
  communityName: string;
  communityAvatar: string;
}
