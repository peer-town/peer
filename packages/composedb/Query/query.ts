import { GraphQLClient, gql } from "graphql-request";

const client = new GraphQLClient(String(process.env.CERAMIC_GRAPH), {});

export const composeQueryHandler = () => {
  return {
    fetchAllUsers: async function () {
      const query = gql`
            userIndex(first: 100){
              edges{
                node{
                  id
                  createdAt,
                  walletAddress,
                  userPlatforms{
                    platformId
                    platormName
                    platformAvatar
                    platformUsername
                  },
                  author{
                    id
                  }
                }
              }
            }`;
      const allUsers = await client.request(query);
      return allUsers.userIndex?.edges;
    },
    fetchAllCommunities: async function () {
      const query = gql`
      communityIndex(first: 100){
              edges{
                node{
                  id
                  createdAt,
                  communityName
                  author{
                    id
                  }
                  socialPlatforms(first:100){
                    edges{
                      node{
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
                          author {
                            id
                          } 
                          userPlatforms{
                            platformId
                            platormName
                            platformAvatar
                            platformUsername
                          }
                          createdAt
                        }
                        author{
                          id
                        }
                        community{
                          id
                        createdAt
                        communityName
                        author{
                          id
                        }
                        }
                      }
                    }
                  }
                }
              }
            }`;
      const allCommunities = await client.request(query);
      return allCommunities.communityIndex?.edges;
    },
    fetchAllSocialPlatforms: async function () {
      const query = gql`
      socialPlatformIndex(first: 100){
              edges{
                node{
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
                    author {
                      id
                    } 
                    userPlatforms{
                      platformId
                      platormName
                      platformAvatar
                      platformUsername
                    }
                    createdAt
                  }
                  author{
                    id
                  }
                  community{
                    id
                  createdAt
                  communityName
                  author{
                    id
                  }
                  }
                }
              }
            }`;
      const allsocialPlatforms = await client.request(query);
      return allsocialPlatforms.socialPlatformIndex?.edges;
    },
    fetchAllThreads: async function () {
      const query = gql`
        threadIndex(first: 100){
              edges{
                node{
                  id
                  title
                  UserID
                  threadID
                  createdAt
                  communityID
                  createdFrom
                  author{
                    id
                  }
                  User{
                    id
                    walletAddress
                    author {
                      id
                    } 
                    userPlatforms{
                      platformId
                      platormName
                      platformAvatar
                      platformUsername
                    }
                    createdAt
                  }
                  community{
                    id
                    createdAt
                    communityName
                    author{
                      id
                    }
                  }
                  comments(first:100){
                    edge{
                      node{
                        id
                        text
                        UserID
                        threadID
                        createdAt
                        createdFrom
                        User{
                          id
                          walletAddress
                          author {
                            id
                          } 
                          userPlatforms{
                            platformId
                            platormName
                            platformAvatar
                            platformUsername
                          }
                          createdAt
                        }
                        thread{
                          id
                          title
                          UserID
                          createdAt
                          communityID
                          createdFrom
                          author{
                            id
                          }
                          User{
                            id
                            walletAddress
                            author {
                              id
                            } 
                            userPlatforms{
                              platformId
                              platormName
                              platformAvatar
                              platformUsername
                            }
                            createdAt
                          }
                        }
                        author{
                          id
                        }

                      }
                    }
                  }
                }
              }
            }`;
      const allThreads = await client.request(query);
      return allThreads.threadIndex?.edges;
    },
    fetchAllComments: async function () {
      const query = gql`
        comments(first:100){
          edge{
            node{
              id
              text
              UserID
              threadID
              createdAt
              createdFrom
              User{
                id
                walletAddress
                author {
                  id
                } 
                userPlatforms{
                  platformId
                  platormName
                  platformAvatar
                  platformUsername
                }
                createdAt
              }
              thread{
                id
                title
                UserID
                createdAt
                communityID
                createdFrom
                author{
                  id
                }
                User{
                  id
                  walletAddress
                  author {
                    id
                  } 
                  userPlatforms{
                    platformId
                    platormName
                    platformAvatar
                    platformUsername
                  }
                  createdAt
                }
              }
              author{
                id
              }

            }
          }
        }`;
      const allComments = await client.request(query);
      return allComments.commentIndex?.edges;
    },
    fetchUserDetails: async function (walletAddress: string) {
      const allUsers = await this.fetchAllUsers();
      const user = allUsers.filter(
        (user: any) => user.node.walletAddress === walletAddress
      )[0];
      return user;
    },
    fetchUserDetailsUsingPlatform: async function (
      platformName: string,
      platformId: string
    ) {
      const allUsers = await this.fetchAllUsers();
      const user = allUsers.map(
        (user: any) =>
          user.node.userPlatforms.filter(
            (platform: any) =>
              platform.platormName === platformName &&
              platform.platformId === platformId
          )[0]
      )[0];
      return user;
    },
    fetchThreadDetails: async function (threadPlatformId: string) {
      const allThreads = await this.fetchAllThreads();
      const thread = allThreads.filter(
        (thread: any) => thread.threadId === threadPlatformId
      )[0];
      return thread;
    },
    fetchCommentDetails: async function (commentPlatformId: string) {
      const allComments = await this.fetchAllComments();
      const comment = allComments.filter(
        (comment: any) => comment.commentId === commentPlatformId
      )[0];
      return comment;
    },
    fetchSocialPlatform: async function (platformId: string) {
      const allSocialPlatforms = await this.fetchAllSocialPlatforms();
      const socialPlatform = allSocialPlatforms.filter(
        (socialPlatform: any) => socialPlatform.platformId === platformId
      )[0];
      return socialPlatform;
    },
    fetchAuthorPlatformDetails: async function (
      walletAddress: string,
      usersPlatform: string
    ) {
      const userDetails = await this.fetchUserDetails(walletAddress);
      const platfromAuthor = userDetails.node.userPlatforms.filter(
        (platform: any) => platform.platormName === usersPlatform
      )[0];
      return platfromAuthor;
    },
    fetchAllCommunitiesPlatformDetails: async function (
      communityPlatform?: string
    ) {
      const allCommunities = await this.fetchAllCommunities();
      if (!communityPlatform) {
        return allCommunities.map(
          (community: any) => community.node.socialPlatforms.edge
        );
      }
      const platfromAuthor = allCommunities.map((community: any) =>
        community.node.socialPlatforms.edge.filter(
          (socialPlatform: any) =>
            socialPlatform.node.platform === communityPlatform
        )
      );
      return platfromAuthor;
    },
  };
};
