import {config} from "../../../config";
import {RadicleRepoObject} from "../../types";
import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {left, right} from "../../../utils/fp";

const addRepoSchema = z.object({
  username: z.string(),
  repoUrl: z.string(),
  description: z.string(),
  branch: z.string(),
});


export const radicleRouter = router({
  addRepo: publicProcedure
    .input(addRepoSchema)
    .mutation(async ({input}) => {
      const response = await handleRadicleAddRepo(input as RadicleRepoObject);
      const data = await response.json();
      if (response.ok) {
        return right(data);
      } else {
        return left(data);
      }
    }),
});


const handleRadicleAddRepo = async (data: RadicleRepoObject) => {
  const endpoint = `${config.radicle.endpoint}/repos/publish`;
  return await fetch(endpoint, {
    body: JSON.stringify(data),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": config.radicle.apiKey,
    },
  });
};