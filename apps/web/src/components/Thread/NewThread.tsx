import { DIDSession } from "did-session";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import useLocalStorage from "../../hooks/useLocalStorage";
import { trpc } from "../../utils/trpc";
import { toast } from "react-toastify";
import { Platform } from "./type";
const NewThread = (props) => {
  const { isConnected, address } = useAccount();
  const [did, setDid] = useState("");
  const [didSession] = useLocalStorage("didSession", "");
  const [community, setCommunity] = useState("");
  const [thread, setThread] = useState("");
  
  const communities = trpc.public.fetchCommunities.useQuery();
  const authorPlatformDetails = trpc.public.getAuthorDiscord.useQuery({address:address});

  useEffect(() => {
    const getData = async () => {
      if (!didSession || !isConnected) return;
      const session = await DIDSession.fromSession(didSession);
      setDid(session.did.id);
    };
    getData();
  }, [didSession, isConnected]);

  const discordUserName = authorPlatformDetails.data?.platformUsername;

  const onThreadSumbit = async () => {
    if (thread?.length === 0) {
      toast.error("Empty thread");
      return;
    }
    await fetch(`${String(process.env.NEXT_PUBLIC_DISCORD_BOT_URL)}webthread`, {
      body: JSON.stringify({
        threadTitle: thread,
        community: community,
        discordUserName: discordUserName,
        didSession: String(didSession),
        platformId: authorPlatformDetails.data.platformId,
      }),
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (!response.ok) {
        toast.error("Community missing or Api failed");
      }
      setThread("");
      props.refresh();
    });
  };

  return (
    <div className="block w-full bg-white p-6">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onThreadSumbit();
        }}
      >
        <div>Posting as {did}</div>
        <select
          id="fromDao"
          onChange={(e) => {
            setCommunity(e.target.value);
          }}
        >
          <option key="any" value="any">
            Any
          </option>
          {communities?.data?.map((community) => {
            return (
              <option key={community?.node?.id} value={community?.node?.platformId}>
                {community?.node?.communityName}
              </option>
            );
          })}
        </select>
        <div className="form-group mb-6">
          <textarea
            className="form-control m-0 block w-full rounded border border-solid border-gray-300 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 focus:border-blue-600 focus:bg-white focus:text-gray-700 focus:outline-none"
            id="exampleFormControlTextarea13"
            placeholder="Thread title"
            value={thread}
            onChange={(e) => setThread(e.target.value)}
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

export default NewThread;
