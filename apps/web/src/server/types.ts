export interface Author {
  id: string;
}

export interface UserPlatform {
  platformId: string;
  platformName: string;
  platformAvatar: string;
  platformUsername: string;
}

export interface User {
  id: string;
  walletAddress: string;
  author: Author;
  userPlatforms: UserPlatform[];
  createdAt: Date;
}

export interface Community {
  id: string;
  createdAt: Date;
  communityName: string;
  author: Author;
}

export interface Comment {
  node: {
    id: string;
    text: string;
    userId: string;
    threadId: string;
    createdAt: Date;
    createdFrom: string;
    user: User;
    thread: Thread;
    author: Author;
  }
}

export interface Comments {
  edges: Comment[];
}

export interface Tag {
  node: {
    id: string;
    tag: {
      tag: string
    }
  }
}
export interface Tags {
  edges: Tag[];
}
export interface Thread {
  id: string;
  title: string;
  body: string;
  userId: string;
  threadId: string;
  createdAt: Date;
  communityId: string;
  createdFrom: string;
  author: Author;
  user: User;
  community: Community;
  comments: Comments;
  tags: Tags
}

export interface SocialThreadId {
  platformName: string;
  threadId: string;
}

export interface SocialCommentId {
  platformName: string;
  commentId: string;
}
