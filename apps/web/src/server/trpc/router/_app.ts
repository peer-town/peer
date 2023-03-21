import { router } from "../trpc";
import { communityRouter } from "./community";
import { publicRouter } from "./public";
import {userRouter} from "./user";
import {commentRouter} from "./comment";


export const appRouter = router({
  public: publicRouter,
  user: userRouter,
  comment: commentRouter,
  community: communityRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
