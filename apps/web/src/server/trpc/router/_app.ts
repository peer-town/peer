import { router } from "../trpc";
import { communityRouter } from "./community";
import { publicRouter } from "./public";
import {userRouter} from "./user";
import {commentRouter} from "./comment";
import {threadRouter} from "./thread";
import {tagRouter} from "./tags";


export const appRouter = router({
  public: publicRouter,
  user: userRouter,
  comment: commentRouter,
  community: communityRouter,
  thread: threadRouter,
  tag: tagRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
