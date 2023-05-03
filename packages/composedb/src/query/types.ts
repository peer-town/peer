import { Node, PageInfo } from "../../Query";

export interface PartialThreadData {
    id: string;
    communityId: string;
    userId: string;
    title: string;
    body: string;
}

export interface UserThreadResponse {
  pageInfo: PageInfo;
  edges: Node<PartialThreadData>[];
}
