// This is an auto-generated file, do not edit manually
import type { RuntimeCompositeDefinition } from "@composedb/types";
export const definition: RuntimeCompositeDefinition = {
  models: {
    Thread: {
      id: "kjzl6hvfrbw6c8rovlhjhet6ccmf143i3ny452a12xliruruit81i105i3ck0g4",
      accountRelation: { type: "list" },
    },
    Comment: {
      id: "kjzl6hvfrbw6catlvnyvvt1z9bwhntutqon91kzlbi82blvnt3b9b0au9six1jt",
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
