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

export interface CreateRadicleRepoPayload {
  userId: string;
  name: string;
  description: string;
  url: string;
  radId: string;
}
