import {Edges, Vote, Node, SocialPlatform} from "@devnode/composedb";
import {isEmpty, isNil, get} from "lodash";
import {constants} from "../config";

export const getAbsVotes = (votes: Edges<Vote> | undefined): number => {
  if (isNil(votes) || isEmpty(votes.edges)) return 0;
  const upVotesCount = getUpVotes(votes.edges);
  const downVotesCount = getDownVotes(votes.edges);
  return upVotesCount - downVotesCount;
}

export const getUserVote = (votes: Edges<Vote> | undefined, userId: string | undefined) => {
  if (isNil(votes) || isEmpty(votes.edges) || isNil(userId)) return undefined;
  return votes.edges.find((vote) => vote.node.userId === userId);
}

export const isUpVoted = (vote: Node<Vote> | undefined): boolean => {
  if (isNil(vote) || isNil(get(vote, "node.vote"))) return false;
  return vote.node.vote;
}

export const isDownVoted = (vote: Node<Vote> | undefined): boolean => {
  if (isNil(vote) || isNil(get(vote, "node.vote"))) return false;
  return !vote.node.vote;
}

const getUpVotes = (votes: Node<Vote>[]): number => {
  let count = 0;
  for (let i = 0, len = votes.length; i < len; i++) {
    if (votes[i].node.vote) {
      count++;
    }
  }
  return count;
}

const getDownVotes = (votes: Node<Vote>[]): number => {
  let count = 0;
  for (let i = 0, len = votes.length; i < len; i++) {
    if (!votes[i].node.vote) {
      count++;
    }
  }
  return count;
}

export const getDevnodeSocialPlatform = (socialPlatforms: Node<SocialPlatform>[] | undefined): Node<SocialPlatform>  => {
  if (isNil(socialPlatforms) || isEmpty(socialPlatforms)) return undefined;
  return socialPlatforms.find((platform) => platform.node.platformId === constants.PLATFORM_DEVNODE_ID);
}

export const extractProjectName = (gitUrl: string): string | null => {
  const regex = /(?:.*\/)?(.+?)(?:\.git|$)/;
  const match = gitUrl.match(regex);
  if (match) {
    return match[1];
  }
  return null;
}

export const keepOrAppendGit = (gitUrl: string): string => {
  if(gitUrl.split(".").pop() === 'git') return gitUrl;
  return gitUrl.concat(".git");
}
