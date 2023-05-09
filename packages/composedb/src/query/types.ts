import { Node, PageInfo } from "../../Query";

export interface PartialThreadData {
    id: string;
    communityId: string;
    userId: string;
    title: string;
    body: string;
}

export interface RepoData {
  id: string;
  userId: string;
  name : string;
  description: string;
  url: string;
  radId: string;
}

export interface UserThreadResponse {
  pageInfo: PageInfo;
  edges: Node<PartialThreadData>[];
}

export interface UserRepoResponse {
  pageInfo: PageInfo;
  edges: Node<RepoData>[];
}
