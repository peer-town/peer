import { type NextPage } from "next";
import { useState } from "react";
import { Layout } from "../components/Layout";
import NewThread from "../components/Thread/NewThread";
import ThreadCard from "../components/ThreadCard";
import { useAccount } from "wagmi";
import useLocalStorage from "../hooks/useLocalStorage";

import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const threads = trpc.public.getAllThreads.useQuery();
  const [didSession] = useLocalStorage("didSession","");
  const { isConnected } = useAccount();
  const [isDidSession, setDidSession] = useState(didSession?true:false);
  const [isDiscordUser, setDiscordUser] = useState(false);

  if (!threads.data) return <div>Loading...</div>;

  const handleDidSession = (value) =>{
    setDidSession(value)
  }
  const handleDiscordUser = (value) => {
    setDiscordUser(value)
  }
  
  const checkConnected = () =>{
    if (!isConnected)
    return (
      <div className="flex w-full justify-center bg-white py-6">
        <div className=" bg-white text-base font-normal text-gray-700">
          Please connect to publish comments.
        </div>
      </div>
    );

    if (!isDidSession)
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
  }
  return (
    <Layout
    handleDiscordUser = {handleDiscordUser}
    handleDidSession = {handleDidSession}
    >
      <main className="h-full">
        <div className="pt-[50px]">
          <div className="space-y-[50px] border-b border-gray-200 pb-5 sm:pb-0">
            <div className="text-[48px] font-medium text-[#08010D]">
              Discover
            </div>
          </div>
          <div className="flex flex-col space-y-[36px] py-[40px]">
            {threads.data.map((thread) => (
              <ThreadCard key={thread.id} thread={thread.node} />
            ))}
          </div>

          <div className="flex flex-col space-y-[36px] py-[40px]">
            {isConnected && isDidSession && isDiscordUser ? <NewThread
              isDidSession= {isDidSession}
              isDiscordUser= {isDiscordUser} 
              refresh={() => {
                threads.refetch();
              }}
            /> : checkConnected()}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
