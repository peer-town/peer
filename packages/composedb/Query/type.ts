export type SocialPlatformInput = {
  userID: string;
  platform: string;
  platformId: string;
  communityId: string;
  communityName: string;
  communityAvatar: string;
};
export type UserPlatformDetails = {
  platformId: string;
  platformName: string;
  platformAvatar: string;
  platformUsername: string;
};
export type ThreadInput = {
  communityId: string;
  userID: string;
  title: string;
  createdFrom: string;
  createdAt: string;
  threadId: string;
};
export type CommentInput = {
  threadId: string;
  userID: string;
  comment: string;
  createdFrom: string;
  createdAt: string;
};
export type User = {
  id: string;
  walletAddress: string;
  author: {
    id: string;
  };
  userPlatforms: UserPlatformDetails;
  createdAt: string;
};
export type Community = {
  id: string;
  createdAt: string;
  communityName: string;
  author: {
    id: string;
  };
};
export type Comments = {
  edges: {
    node: [
      {
        id: string;
        text: string;
        userId: string;
        threadId: string;
        createdAt: string;
        createdFrom: string;
        User: User;
        thread: {
          id: string;
          title: string;
          userId: string;
          threadId: string;
          createdAt: string;
          communityId: string;
          createdFrom: string;
          author: {
            id: string;
          };
          User: User;
          community: Community;
        };
        author: {
          id: string;
        };
      }
    ];
  }
}
;
export type Thread = {
  id: string;
  title: string;
  userId: string;
  threadId: string;
  createdAt: string;
  communityId: string;
  createdFrom: string;
  author: {
    id: string;
  };
  User: User;
  community: Community;
  comments: Comments;
  };

