export type SocialPlatformInput = {
  userID: string;
  platform: string;
  platformId: string;
  communityID: string;
  communityName: string;
  communityAvatar: string;
};
export type UserPlatformDetails = {
  platformId: string;
  platormName: string;
  platformAvatar: string;
  platformUsername: string;
};
export type ThreadInput = {
  communityId: string;
  userID:string,
  title: string,
  createdFrom:string, 
  createdAt: string,
  threadId:string
}
export type CommentInput = {
  threadId: string,
  userID: string, 
  comment: string, 
  createdFrom: string, 
  createdAt: string,
}
