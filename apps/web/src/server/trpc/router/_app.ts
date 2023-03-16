import { router } from "../trpc";
import { publicRouter } from "./public";
import {userRouter} from "./user";
import {commentRouter} from "./comment";

export const appRouter = router({
  public: publicRouter,
  user: userRouter,
  comment: commentRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
