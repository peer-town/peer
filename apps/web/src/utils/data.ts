import {Edges, Vote, Node} from "@devnode/composedb";
import {isEmpty, isNil} from "lodash";

export const getAbsVotes = (votes: Edges<Vote> | undefined): number => {
  if (isNil(votes) || isEmpty(votes.edges)) return 0;
  const upVotesCount = getUpVotes(votes.edges);
  const downVotesCount = getDownVotes(votes.edges);
  return upVotesCount - downVotesCount;
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
