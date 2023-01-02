import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useLocalStorage from "../../hooks/useLocalStorage";
import { DIDSession } from "did-session";
import { trpc } from "../../utils/trpc";
import { ComposeClient } from "@composedb/client";
import { definition } from "@devnode/composedb";

export const compose = new ComposeClient({
  ceramic: String(process.env.NEXT_PUBLIC_CERAMIC_NODE),
  definition,
});

const CommentInput = (props: { threadId: string; refresh: () => void }) => {
  const { isConnected } = useAccount();
  const [did, setDid] = useState("");
  const [didSession] = useLocalStorage("didSession", "");

  const [comment, setComment] = useState("");

  useEffect(() => {
    const getData = async () => {
      if (didSession) {
        let session = await DIDSession.fromSession(didSession);
        setDid(session.did.id);
      }
    };
    getData();
  }, [didSession]);

  const authorDiscord = trpc.public.getDiscordUser.useQuery({
    didSession: didSession,
  });

  const isDiscordUser = authorDiscord.data?.discordUsername;
  const discordUserName = authorDiscord.data?.discordUsername ?? "Anonymous";

  const onCommentSubmit = async () => {
    const session = await DIDSession.fromSession(didSession);
    compose.setDID(session.did);

    await fetch(
      `${String(process.env.NEXT_PUBLIC_DISCORD_BOT_URL)}webcomment`,
      {
        body: JSON.stringify({
          threadId: props.threadId,
          comment: String(comment),
          discordUserName: String(discordUserName),
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    await compose
      .executeQuery<{
        createComment: { document: { id: string } };
      }>(
        `mutation CreateComment($input: CreateCommentInput!) {
          createComment(input: $input) {
            document {
              id
              threadID
              text
              createdAt
            }
          }
        }`,
        {
          input: {
            content: {
              threadID: props.threadId,
              text: String(comment),
              createdAt: new Date().toISOString(),
            },
          },
        }
      )
      .then((r) => {
        props.refresh();
        setComment("");
        console.log(r);
      })
      .catch((e) => console.log(e));
  };

  if (!isConnected)
    return (
      <div className="flex w-full justify-center bg-white py-6">
        <div className=" bg-white text-base font-normal text-gray-700">
          Please connect to publish comments.
        </div>
      </div>
    );

  if (!didSession)
    return (
      <div className="flex w-full justify-center bg-white py-6">
        <div className=" bg-white text-base font-normal text-gray-700">
          Please create a DID session
        </div>
      </div>
    );

  if (!isDiscordUser)
    return (
      <div className="flex w-full justify-center bg-white py-6">
        <div className=" bg-white text-base font-normal text-gray-700">
          Please connect to Discord
        </div>
      </div>
    );

  return (
    <div className="block w-full bg-white p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onCommentSubmit();
        }}
      >
        <div>Posting as {did}</div>
        <div className="form-group mb-6">
          <textarea
            className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
            id="exampleFormControlTextarea13"
            placeholder="Message"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>
        <button
          className="w-full rounded bg-blue-600 px-6 py-2.5 text-xs font-medium uppercase leading-tight text-white shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
          type="submit"
        >
          Send
        </button>
      </form>
    </div>
  );
};
export default CommentInput;
