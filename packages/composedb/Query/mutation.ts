import { ComposeClient } from "@composedb/client";
import {
  CommentInput,
  SocialPlatformInput,
  ThreadInput,
  UserPlatformDetails,
} from "./type";

import {composeQueryHandler} from "./query";
import {gql} from "graphql-request";

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
        userId,
        platform,
        platformId,
        communityAvatar,
        communityId,
        communityName,
      } = socialPlatform;
      return compose.executeQuery<{
        createSocialPlatform: { document: { id: string } };
      }>(
        `mutation CreateSocialPlatform($input: CreateSocialPlatformInput!) {
            createSocialPlatform(input: $input) {
              document {
                id
                userId
                platform
                platformId
                communityId
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
              userId: userId,
              platform: platform,
              platformId: platformId,
              communityId: communityId,
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
                platformName
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
      const { communityId, userId, title, body, createdFrom, createdAt, threadId } =
        threadInput;
      return compose.executeQuery<{
        createThread: { document: { id: string } };
      }>(
        `mutation CreateThread($input: CreateThreadInput!) {
          createThread(input: $input) {
            document {
              id
              title
              body
              userId
              createdAt
              communityId
              createdFrom
              threadId
            }
          }
        }`,
        {
          input: {
            content: {
              communityId: communityId, //streamId of community
              userId: userId, //streamId of User
              threadId: threadId, //discord thread id
              title: title,
              body: body,
              createdFrom: createdFrom, //platform name
              createdAt: createdAt,
            },
          },
        }
      );
    },
    createComment: function (commentInput: CommentInput) {
      const { threadId, userId, comment, createdFrom, createdAt } =
        commentInput;

      return compose.executeQuery<{
        createComment: { document: { id: string } };
      }>(
        `mutation CreateComment($input: CreateCommentInput!) {
          createComment(input: $input) {
            document {
              id
              text
              userId
              threadId
              createdFrom
              createdAt
            }
          }
        }`,
        {
          input: {
            content: {
              threadId: threadId,
              userId: userId, //streamId of User
              text: comment, //comment text
              createdFrom: createdFrom, //platform name
              createdAt: createdAt,
            },
          },
        }
      );
    },
    updateUser: async function (
      userPlatformDetails: UserPlatformDetails,
      walletAddress: string
    ) {

      const userExists = await composeQueryHandler().fetchUserDetails(walletAddress);
      if(!userExists){
        return ;
      }
      const userPlatforms = [...userExists.node.userPlatforms, userPlatformDetails]
      const userId = userExists.node.id;
      return compose.executeQuery<{
        updateUser: { document: { id: string } };
      }>(
        `mutation UpdateUser($input: UpdateUserInput!) {
          updateUser(input: $input) {
            document {
              id
              userPlatforms{
                platformId
                platformName
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
            id: userId,
            content: {
              userPlatforms: userPlatforms,
              createdAt: new Date().toISOString(),
            },
          },
        }
      );
    },
    updateThreadWithSocialThreadId: async function (streamId: string, threadId: string) {
      const query = gql`
      mutation UpdateThread($input: UpdateThreadInput!) {
        updateThread(input: $input) {
          document {
            id
            threadId
          }
        }
      }
      `;
      return await compose.executeQuery(query, {
        input: {
          id: streamId,
          content: { threadId },
        }
      });
    },
  };
};
