import {ComposeClient} from "@composedb/client";
import {
  CommentInput,
  CommunityDetails,
  CreateVoteInput,
  SocialCommentId,
  SocialPlatformInput,
  SocialThreadId,
  ThreadInput,
  UserCommunityRelation,
  UserPlatformDetails,
} from "./type";

import {composeQueryHandler} from "./query";
import {gql} from "graphql-request";

export const composeMutationHandler = async (compose: ComposeClient) => {
  return {
    createCommunity: function (communityDetails: CommunityDetails) {
      const {communityName, description} = communityDetails;
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
      const {userId, communityId} = userCommunityRelation;
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
        socialThreadIds,
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
              socialThreadIds: socialThreadIds || [],
              createdFrom: createdFrom, //platform name
              createdAt: createdAt,
            },
          },
        }
      );
    },
    createComment: function (commentInput: CommentInput) {
      const {threadId, userId, comment, createdFrom, createdAt, socialCommentIds} =
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
              socialCommentIds {
                commentId
                platformName
              }
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
              socialCommentIds: socialCommentIds || [],
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
          content: {
            socialThreadIds: socialThread
          },
        },
      });
    },
    updateCommentWithSocialCommentId: async function (
      streamId: string,
      socialCommentId: SocialCommentId,
    ) {
      const query = gql`
       mutation UpdateComment($input: UpdateCommentInput!) {
        updateComment(input: $input) {
          document {
            id
            socialCommentIds {
              commentId
              platformName
            }
          }
        }
      }
      `;
      return await compose.executeQuery(query, {
        input: {
          id: streamId,
          content: {
            socialCommentIds: socialCommentId
          },
        },
      });
    },
    createTag: async function (
      tag: string
    ) {
      const query = gql`
       mutation CreateTag($input: CreateTagInput!){
        createTag(input: $input){
          document{
            id
          }
        }
       }`;
      return await compose.executeQuery(query, {
        input: {
          content: {
            tag: tag
          },
        },
      });
    },
    createCommunityTags: async function (
      tagId: string,
      communityId: string
    ) {
      const query = gql`
       mutation CreateCommunityTag($input:CreateCommunityTagInput!){
        createCommunityTag(input:$input){
          document{
            id
            tagId
            communityId
          }
        }
      }`;
      return await compose.executeQuery(query, {
        input: {
          content: {
            tagId: tagId,
            communityId: communityId,
          }
        }
      });
    },
  };
};

export const createThreadTags = async  (
  compose: ComposeClient,
  tagId: string,
  threadId: string
) => {
  const query = gql`
       mutation createThreadTags($input:CreateThreadTagInput!){
        createThreadTag(input:$input){
          document{
            id
            tagId
            threadId
          }
        }
      }`;
  return await compose.executeQuery(query, {
    input: {
      content: {
        tagId: tagId,
        threadId: threadId,
      }
    }
  });
}

const createVoteComment = async (compose: ComposeClient, input: CreateVoteInput) => {
  const query = gql`
    mutation UpVoteComment($input: CreateVoteInput!) {
      createVote(input: $input) {
        document {
          id
          userId
          commentId
          vote
        }
      }
    }
  `;
  return await compose.executeQuery(query, {
    input: {
      content: input,
    }
  });
}

export const updateVoteComment = async (compose: ComposeClient, voteId: string, vote: boolean) => {
  const query = gql`
    mutation UpdateVoteComment($input: UpdateVoteInput!) {
      updateVote(input: $input) {
        document {
          id
          vote
        }
      }
    }
  `;
  return await compose.executeQuery(query, {
    input: {
      id: voteId,
      content: {vote}
    },
  });
}

export const upVoteComment = async (compose: ComposeClient, commentId: string, userId: string) => {
  return createVoteComment(compose, {
    vote: true, commentId, userId,
  });
}

export const downVoteComment = async (compose: ComposeClient, commentId: string, userId: string) => {
  return createVoteComment(compose, {
    vote: false, commentId, userId,
  });
}
