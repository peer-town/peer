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

export interface CreateReputationPayload {
  userId: string;
  tagId: string;
  score: number;
}

export interface UpdateReputationPayload {
  id: string;
  score: number;
}
