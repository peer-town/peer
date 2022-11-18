import { router } from "../trpc";
import { publicRouter } from "./public";

export const appRouter = router({
  public: publicRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
