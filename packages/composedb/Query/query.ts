import { GraphQLClient, gql } from "graphql-request";
import {Thread, Node, Edges, Community} from "./type";

const client = new GraphQLClient(String(process.env.CERAMIC_GRAPH), {});

export const composeQueryHandler = () => {
  return {
    fetchAllUsers: async function () {
      const query = gql`
        {
          userIndex(first: 100) {
            edges {
              node {
                id
                createdAt
                walletAddress
                userPlatforms {
                  platformId
                  platformName
                  platformAvatar
                  platformUsername
                }
                author {
                  id
                }
              }
            }
          }
        }
      `;
      const allUsers = await client.request(query);
      return allUsers.userIndex?.edges;
    },
    fetchAllCommunities: async function () {
      const query = gql`
        {
          communityIndex(first: 100) {
            edges {
              node {
                id
                createdAt
                communityName
                author {
                  id
                }
                socialPlatforms(first: 100) {
                  edges {
                    node {
                      id
                      userId
                      platform
                      platformId
                      communityId
                      communityName
                      communityAvatar
                      user {
                        id
                        walletAddress
                        author {
                          id
                        }
                        userPlatforms {
                          platformId
                          platformName
                          platformAvatar
                          platformUsername
                        }
                        createdAt
                      }
                      author {
                        id
                      }
                      community {
                        id
                        createdAt
                        communityName
                        author {
                          id
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;
      const allCommunities = await client.request(query);
      return allCommunities.communityIndex?.edges;
    },
    fetchAllSocialPlatforms: async function () {
      const query = gql`
        {
          socialPlatformIndex(first: 100) {
            edges {
              node {
                id
                userId
                platform
                platformId
                communityId
                communityName
                communityAvatar
                user {
                  id
                  walletAddress
                  author {
                    id
                  }
                  userPlatforms {
                    platformId
                    platformName
                    platformAvatar
                    platformUsername
                  }
                  createdAt
                }
                author {
                  id
                }
                community {
                  id
                  createdAt
                  communityName
                  author {
                    id
                  }
                }
              }
            }
          }
        }
      `;
      const allsocialPlatforms = await client.request(query);
      return allsocialPlatforms.socialPlatformIndex?.edges;
    },
    fetchAllThreads: async function () {
      const query = gql`
        {
          threadIndex(first: 100) {
            edges {
              node {
                id
                title
                body
                userId
                threadId
                createdAt
                communityId
                createdFrom
                author {
                  id
                }
                user {
                  id
                  walletAddress
                  author {
                    id
                  }
                  userPlatforms {
                    platformId
                    platformName
                    platformAvatar
                    platformUsername
                  }
                  createdAt
                }
                community {
                  id
                  createdAt
                  communityName
                  author {
                    id
                  }
                }
                comments(first: 100) {
                  edges {
                    node {
                      id
                      text
                      userId
                      threadId
                      createdAt
                      createdFrom
                      user {
                        id
                        walletAddress
                        author {
                          id
                        }
                        userPlatforms {
                          platformId
                          platformName
                          platformAvatar
                          platformUsername
                        }
                        createdAt
                      }
                      thread {
                        id
                        title
                        userId
                        createdAt
                        communityId
                        createdFrom
                        author {
                          id
                        }
                        user {
                          id
                          walletAddress
                          author {
                            id
                          }
                          userPlatforms {
                            platformId
                            platformName
                            platformAvatar
                            platformUsername
                          }
                          createdAt
                        }
                      }
                      author {
                        id
                      }
                    }
                  }
                }
              }
            }
          }
        }
      `;
      const allThreads = await client.request(query);
      return allThreads.threadIndex?.edges;
    },
    fetchAllComments: async function () {
      const query = gql`
      {
        commentIndex(first: 100) {
          edges {
            node {
              id
              text
              userId
              threadId
              createdAt
              createdFrom
              user {
                id
                walletAddress
                author {
                  id
                }
                userPlatforms {
                  platformId
                  platformName
                  platformAvatar
                  platformUsername
                }
                createdAt
              }
              thread {
                id
                title
                userId
                threadId
                createdAt
                community {
                  socialPlatforms(first: 10) {
                    edges {
                      node {
                        platformId
                        platform
                      }
                    }
                  }
                 }
                communityId
                createdFrom
                author {
                  id
                }
                user {
                  id
                  walletAddress
                  author {
                    id
                  }
                  userPlatforms {
                    platformId
                    platformName
                    platformAvatar
                    platformUsername
                  }
                  createdAt
                }
              }
              author {
                id
              }
            }
          }
        }
      }
      `;
      const allComments = await client.request(query);
      return allComments.commentIndex?.edges;
    },
    fetchUserDetails: async function (walletAddress: string) {
      const allUsers = await this.fetchAllUsers();
      const user = allUsers.filter(
        (user: any) => user?.node.walletAddress === walletAddress
      )[0];
      return user;
    },
    fetchUserByPlatformDetails: async function (
      platformName: string,
      platformId: string
    ) {
      const allUsers = await this.fetchAllUsers();
      return allUsers.find((user: any) => {
        return user.node.userPlatforms.some((platform: any) =>
          platform.platformName === platformName && platform.platformId === platformId
        );
      });
    },
    fetchUserDetailsFromPlatformId: async function (
      platformName: string,
      platformId: string
    ) {
      const allUsers = await this.fetchAllUsers();
      const user = allUsers.map(
        (user: any) => {
          const userExists = user?.node.userPlatforms.filter(
            (platform: any) =>
              platform.platformName === platformName &&
              platform.platformId === platformId
          )[0];
          if(Object.keys(userExists).length !== 0){
            return user;
          }
          })[0];
      return user;
    },
    fetchThreadDetails: async function (threadId: string) {
      const query = gql`
      query ($id: ID!) {
        node(id: $id) {
          ... on Thread {
            id
            title
            body
            userId
            threadId
            createdAt
            communityId
            createdFrom
            author {
              id
            }
            user {
              id
              walletAddress
              author {
                id
              }
              userPlatforms {
                platformId
                platformName
                platformAvatar
                platformUsername
              }
              createdAt
            }
            community {
              id
              createdAt
              communityName
              socialPlatforms(first: 10) {
                edges {
                  node {
                    platformId
                    platform
                  }
                }
              }
              author {
                id
              }
            }
            comments(first: 100) {
              edges {
                node {
                  id
                  text
                  userId
                  threadId
                  createdAt
                  createdFrom
                  user {
                    id
                    walletAddress
                    author {
                      id
                    }
                    userPlatforms {
                      platformId
                      platformName
                      platformAvatar
                      platformUsername
                    }
                    createdAt
                  }
                  thread {
                    id
                    title
                    userId
                    createdAt
                    communityId
                    createdFrom
                    author {
                      id
                    }
                    user {
                      id
                      walletAddress
                      author {
                        id
                      }
                      userPlatforms {
                        platformId
                        platformName
                        platformAvatar
                        platformUsername
                      }
                      createdAt
                    }
                  }
                  author {
                    id
                  }
                }
              }
            }
          }
        }
      }
      `;
      return await client.request(query, {id: threadId});
    },
    fetchCommentDetails: async function (commentId: string) {
      const query = gql`
        query ($id: ID!) {
          node(id: $id) {
            ... on Comment {
              id
              text
              userId
              threadId
              createdAt
              createdFrom
              user {
                id
                walletAddress
                author {
                  id
                }
                userPlatforms {
                  platformId
                  platformName
                  platformAvatar
                  platformUsername
                }
                createdAt
              }
              thread {
                id
                title
                userId
                threadId
                createdAt
                community {
                  socialPlatforms(first: 10) {
                    edges {
                      node {
                        platformId
                        platform
                      }
                    }
                  }
                }
                communityId
                createdFrom
                author {
                  id
                }
                user {
                  id
                  walletAddress
                  author {
                    id
                  }
                  userPlatforms {
                    platformId
                    platformName
                    platformAvatar
                    platformUsername
                  }
                  createdAt
                }
              }
              author {
                id
              }
            }
          }
        }
      `
      return await client.request(query, {id: commentId});
    },
    fetchSocialPlatform: async function (platformId: string) {
      const allSocialPlatforms = await this.fetchAllSocialPlatforms();
      const socialPlatform = allSocialPlatforms.filter(
        (socialPlatform: any) => socialPlatform.node.platformId === platformId
      )[0];
      return socialPlatform;
    },
    fetchAuthorPlatformDetails: async function (
      walletAddress: string,
      usersPlatform: string
    ) {
      const userDetails = await this.fetchUserDetails(walletAddress);
      const platfromAuthor = userDetails && userDetails.node.userPlatforms.filter(
        (platform: any) => platform && platform.platformName === usersPlatform
      )[0];
      return platfromAuthor;
    },
    fetchAllCommunitiesPlatformDetails: async function (
      communityPlatform?: string
    ) {
      const allCommunities = await this.fetchAllCommunities();
      if (!communityPlatform) {
        return allCommunities.map((community: any) => {
          if (community && community.node!== undefined)
            return community.node?.socialPlatforms.edges;
        });
      }
      const communities = allCommunities.map((community: any) =>
        community.node.socialPlatforms.edges.filter((socialPlatform: any) => {
          if (socialPlatform && socialPlatform.node!== undefined)
            return socialPlatform.node.platform === communityPlatform;
        })[0]
      );
      return communities;
    },
    fetchAllUserThreads: async function (walletAddress: string) {
      const allThreads = await this.fetchAllThreads();
      return allThreads.filter((thread: any) => thread.node.user.walletAddress === walletAddress);
    },
    fetchAllCommunityThreads: async function (communityId: string) {
      const allThreads = await this.fetchAllThreads();
      return allThreads.filter((thread: any) => thread.node.communityId === communityId);
    },
    fetchThreadBySocialThreadId: async function (threadId: string) {
      const allThreads = await this.fetchAllThreads();
      return allThreads.find((thread: Node<Thread>) => thread.node.threadId === threadId);
    },
    fetchCommunityUsingPlatformId: async function (platformId: string) {
      const allCommunities: Node<Community>[] = await this.fetchAllCommunities();
      return allCommunities.find((community: any) => {
        return community.node?.socialPlatforms.edges.some(
          (platform: any) => platform.node?.platformId === platformId
        );
      });
  },
  };
};
