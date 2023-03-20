import {ComposeClient} from "@composedb/client";
import {Client as DiscordClient} from "discord.js";

export type Clients = {
  compose: ComposeClient,
  discord: DiscordClient,
};

export interface Edges<T> {
  edges: Node<T>[];
}

export interface Node<T> {
  node: T;
}

export interface Comment {
  id: string;
  text: string;
  userId: string;
  threadId: string;
  createdAt: string;
  createdFrom: string;
  user: User;
  thread: Thread;
  author: Author;
}

export interface Author {
  id: string;
}

export interface Thread {
  id: string;
  title: string;
  body: string;
  userId: string;
  threadId: string;
  createdAt: string;
  community: Community;
  communityId: string;
  createdFrom: string;
  author: Author;
  user: User;
}

export interface Community {
  id: string;
  socialPlatforms: Edges<SocialPlatform>;
}

export interface SocialPlatform {
  platformId: string;
  platform: string;
}

export interface User {
  id: string;
  walletAddress: string;
  author: Author;
  userPlatforms: UserPlatform[];
  createdAt: Date;
}

export interface UserPlatform {
  platformId: string;
  platformName: string;
  platformAvatar: string;
  platformUsername: string;
}

export interface PostCommentToSocialPayload {
  text: string;
  threadStreamId: string;
  userName: string;
  userAvatar: string;
  userProfileLink: string;
  redirectLink: string;
  serverId: string;
  threadId: string;
}

export interface PostThreadToSocialPayload {
  title: string;
  body: string;
  userName: string;
  userAvatar: string;
  userProfileLink: string;
  redirectLink: string;
  threadStreamId: string;
  serverId: string;
}
