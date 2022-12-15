import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useLocalStorage from "../../hooks/useLocalStorage";
import { DIDSession } from "did-session";
import { trpc } from "../../utils/trpc";

const CommentInput = (props: { threadId: string }) => {
  const { isConnected } = useAccount();
  const [did, setDid] = useState("");
  const [didSession] = useLocalStorage("didSession", "");

  const [comment, setComment] = useState("");

  useEffect(() => {
    const getData = async () => {
      const session = await DIDSession.fromSession(didSession);
      setDid(session.did.id);
    };
    getData();
  }, [didSession]);

  const authorDiscord = trpc.public.getDiscordUser.useQuery({
    didSession: didSession
  });

  const discordUserName = authorDiscord.data?.discordUsername ?? "Anonymous";

  const onCommentSubmit = async () => {
    // api to add comment to discord
   await fetch(`${String(process.env.DISCORD_BOT_URL)}webcomment`,
    {
      body:JSON.stringify({
        threadId:props.threadId,
        comment: String(comment),
        discordUserName: String(discordUserName)
      }),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
  };

  return isConnected && didSession ? (
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
  ) : (
    <div className="flex w-full justify-center bg-white py-6">
      <div className=" bg-white text-base font-normal text-gray-700">
        Please connect to publish comments.
      </div>
    </div>
  );
};
export default CommentInput;