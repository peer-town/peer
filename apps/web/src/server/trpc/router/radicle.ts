import {config} from "../../../config";
import {RadicleRepoComposeObject, RadicleRepoObject} from "../../types";
import {publicProcedure, router} from "../trpc";
import {z} from "zod";
import {isRight, left, right} from "../../../utils/fp";
import {extractProjectName} from "../../../utils";
import {
  composeQueryHandler,
  definition,
  createRadicleRepo,
  getUserRepos
} from "@devnode/composedb";
import { ComposeClient } from "@composedb/client";
import { DIDSession } from "did-session";
import {isNil, omit} from "lodash";


export const compose = new ComposeClient({
  ceramic: config.ceramic.nodeUrl,
  definition,
});

export const queryHandler = composeQueryHandler();

const getCompose = async (didSession: string) => {
  const session = await DIDSession.fromSession(didSession);
  compose.setDID(session.did);
  return compose;
};

const addRepoSchema = z.object({
  session: z.string(),
  username: z.string(),
  repoUrl: z.string(),
  description: z.string(),
  branch: z.string(),
  userId: z.string(),
});


export const radicleRouter = router({
  addRepo: publicProcedure
    .input(addRepoSchema)
    .mutation(async ({input}) => {
      const payload = omit(input, ["session","userId"]);
      const repoName = extractProjectName(input.repoUrl);
      if (isNil(repoName)) return left("Not a valid git url");
      const response = await handleRadicleAddRepo(payload as any);
      const data = await response.json();
      console.log("data",data);

      if (response.ok) {
        const composeInput = {
          session: input.session,
          name: `${input.username}/${repoName}`,
          url: input.repoUrl,
          description: input.description,
          radId: data?.data.radId,
          userId:input.userId,
        }
        createRadicleRepoOnCompose(composeInput);
        return right(data);
      } else {
        return left(data);
      }
    }),
  fetchRepo :  publicProcedure
    .input(z.object({
      authorId: z.string(),
      first: z.number().min(1).max(100),
      cursor: z.string().nullish(),
    }))
    .query(async ({input}) => {
      const {authorId, first, cursor} = input;
      return await getUserRepos(authorId, first, cursor);
    })
});

export const createRadicleRepoOnCompose = async (data: RadicleRepoComposeObject) => {
  try {
    const compose = await getCompose(data.session);
    const payload = omit(data, ["session"])
    const response = await createRadicleRepo(compose, payload);
    console.log("responseRadicleRepo", response);
    return response.errors && response.errors.length > 0
      ? left(response.errors)
      : right(response.data);
  }
  catch(e){
    return left(e);
  }

}

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
