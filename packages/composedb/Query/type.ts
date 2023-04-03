export type SocialPlatformInput = {
  userId: string;
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
  userId: string;
  title: string;
  body: string;
  createdFrom: string;
  createdAt: string;
  threadId: string;
};
export type CommentInput = {
  threadId: string;
  userId: string;
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
  body: string;
  userId: string;
  threadId: string;
  createdAt: string;
  communityId: string;
  createdFrom: string;
  author: {
    id: string;
  };
  user: User;
  community: Community;
  comments: Comments;
  };

export interface SocialPlatform {
  id: string;
  platform: string;
  platformId: string;
  communityName: string;
  communityAvatar: string;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  threadId: string;
  createdAt: string;
  createdFrom: string;
  user: User;
  author: {
    id: string;
  };
}

export interface UserFeedResponse {
  community: {
    threads: Edges<Thread>;
  }
}

export interface Node<T> {
  node: T;
}

export interface Edges<T> {
  edges: Node<T>[]
}

export interface PageResponse<T> {
  pageInfo: PageInfo;
  edges: Node<T>[];
}

export interface PageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  startCursor: string;
  endCursor: string;
}

export interface Communities {
  pageInfo: PageInfo;
  edges: Node<Community>[];
}
