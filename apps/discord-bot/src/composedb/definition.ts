// This is an auto-generated file, do not edit manually
import type { RuntimeCompositeDefinition } from "@composedb/types";
export const definition: RuntimeCompositeDefinition = {
  models: {
    Thread: {
      id: "kjzl6hvfrbw6c8zwpdnjdtn16p1kkxij8w3xj5obwi21vdgfuk1lkkkm9lm1rnm",
      accountRelation: { type: "list" },
    },
    Comment: {
      id: "kjzl6hvfrbw6c7gmbi9f3xfhjeom6940ote3qdwn28new5nyayh07kinemmuv05",
      accountRelation: { type: "list" },
    },
  },
  objects: {
    Thread: {
      title: { type: "string", required: true },
      author: { type: "view", viewType: "documentAccount" },
    },
    Comment: {
      text: { type: "string", required: true },
      threadID: { type: "streamid", required: true },
      author: { type: "view", viewType: "documentAccount" },
    },
  },
  enums: {},
  accountData: {
    threadList: { type: "connection", name: "Thread" },
    commentList: { type: "connection", name: "Comment" },
  },
};

export default definition;
