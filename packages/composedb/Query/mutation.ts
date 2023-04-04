import { ComposeClient } from "@composedb/client";
import {
  CommentInput,
  CommunityDetails,
  SocialPlatformInput, SocialThreadId,
  ThreadInput,
  UserCommunityRelation,
  UserPlatformDetails,
} from "./type";

import { composeQueryHandler } from "./query";
import { gql } from "graphql-request";

export const composeMutationHandler = async (compose: ComposeClient) => {
  return {
    createCommunity: function (communityDetails: CommunityDetails) {
      const { communityName, description } = communityDetails;
      return compose.executeQuery<{
        createCommunity: { document: { id: string } };
      }>(
        `mutation CreateCommunity($input: CreateCommunityInput!) {
            createCommunity(input: $input) {
              document {
                id
                communityName
                description
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
              description: description,
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
    createUserCommunityRelation: function (
      userCommunityRelation: UserCommunityRelation
    ) {
      const { userId, communityId } = userCommunityRelation;
      return compose.executeQuery<{
        createUserCommunity: { document: { id: string } };
      }>(
        `mutation CreateUserCommunity($input: CreateUserCommunityInput!) {
            createUserCommunity(input:$input){
              document{
                id
              }
            }
          }`,
        {
          input: {
            content: {
              userId: userId,
              communityId: communityId,
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
      const {
        communityId,
        userId,
        title,
        body,
        createdFrom,
        createdAt,
      } = threadInput;
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
              socialThreadIds {
                threadId
                platformName
              }          
              createdAt
              communityId
              createdFrom
            }
          }
        }`,
        {
          input: {
            content: {
              communityId: communityId, //streamId of community
              userId: userId, //streamId of User
              title: title,
              body: body,
              socialThreadIds: [],
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
      const userExists = await composeQueryHandler().fetchUserDetails(
        walletAddress
      );
      if (!userExists) {
        return;
      }
      const userPlatforms = [
        ...userExists.node.userPlatforms,
        userPlatformDetails,
      ];
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
    updateThreadWithSocialThreadId: async function (
      streamId: string,
      socialThread: SocialThreadId,
    ) {
      const query = gql`
        mutation UpdateThread($input: UpdateThreadInput!) {
          updateThread(input: $input) {
            document {
              id
              socialThreadIds {
                threadId
                platformName
              }
            }
          }
        }
      `;
      return await compose.executeQuery(query, {
        input: {
          id: streamId,
          content: socialThread,
        },
      });
    },
  };
};
