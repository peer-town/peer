import { ComposeClient } from "@composedb/client";
import {
  CommentInput,
  SocialPlatformInput,
  ThreadInput,
  UserPlatformDetails,
} from "./type";

export const composeMutationHandler = async (compose:ComposeClient) => {
    
  return {
    createCommunity: function (communityName: string) {
      return compose.executeQuery<{
        createCommunity: { document: { id: string } };
      }>(
        `mutation CreateCommunity($input: CreateCommunityInput!) {
            createCommunity(input: $input) {
              document {
                id
                communityName
                author{
                  id
                }
              createdAt
              }
            }
          }`,
        {
          input: {
            content: {
              communityName: communityName,
              createdAt: new Date().toISOString(),
            },
          },
        }
      );
    },
    createSocialPlatform: function (socialPlatform: SocialPlatformInput) {
      const {
        userID,
        platform,
        platformId,
        communityAvatar,
        communityID,
        communityName,
      } = socialPlatform;
      return compose.executeQuery<{
        createSocialPlatform: { document: { id: string } };
      }>(
        `mutation CreateSocialPlatform($input: CreateSocialPlatformInput!) {
            createSocialPlatform(input: $input) {
              document {
                id
                userID
                platform
                platformId
                communityID
                communityName
                communityAvatar
                user{
                  id 
                  walletAddress
                }
                author{
                  id
                }
                community{
                  id
                }
              }
            }
          }`,
        {
          input: {
            content: {
              userID: userID,
              platform: platform,
              platformId: platformId,
              communityID: communityID,
              communityName: communityName,
              communityAvatar: communityAvatar,
            },
          },
        }
      );
    },
    createUser: function (
      userPlatformDetails: UserPlatformDetails,
      walletAddress: string
    ) {
      return compose.executeQuery<{
        createUser: { document: { id: string } };
      }>(
        `mutation CreateUser($input: CreateUserInput!) {
          createUser(input: $input) {
            document {
              id
              userPlatforms{
                platformId
                platormName
                platformAvatar
                platformUsername
              }
              walletAddress
              createdAt
            }
          }
        }`,
        {
          input: {
            content: {
              walletAddress: walletAddress,
              userPlatforms: [userPlatformDetails],
              createdAt: new Date().toISOString(),
            },
          },
        }
      );
    },
    createThread: function (threadInput: ThreadInput) {
      const { communityId, userID, title, createdFrom, createdAt, threadId } =
        threadInput;
      return compose.executeQuery<{
        createThread: { document: { id: string } };
      }>(
        `mutation CreateThread($input: CreateThreadInput!) {
          createThread(input: $input) {
            document {
              id
              title
              UserID
              createdAt
              communityID
              createdFrom
              threadID
            }
          }
        }`,
        {
          input: {
            content: {
              communityID: communityId, //streamId of community
              UserID: userID, //streamId of User
              threadID: threadId, //discord thread id
              title: title,
              createdFrom: createdFrom, //platform name
              createdAt: createdAt,
            },
          },
        }
      );
    },
    createComment: function (commentInput: CommentInput) {
      const { threadId, userID, comment, createdFrom, createdAt } =
        commentInput;

      return compose.executeQuery<{
        createComment: { document: { id: string } };
      }>(
        `mutation CreateComment($input: CreateCommentInput!) {
          createComment(input: $input) {
            document {
              id
              text
              UserID
              threadID
              createdFrom
              createdAt
            }
          }
        }`,
        {
          input: {
            content: {
              threadID: threadId,
              UserID: userID, //streamId of User
              text: comment, //comment text
              createdFrom: createdFrom, //platform name
              createdAt: createdAt,
            },
          },
        }
      );
    },
  };
};
