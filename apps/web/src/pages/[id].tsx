import { Layout } from "../components/Layout";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Thread from "../components/Thread";
import Comment from "../components/Comment";
import { trpc } from "../utils/trpc";
import ThreadInformation from "../components/Thread/ThreadInformation";
import CommentInput from "../components/Thread/CommentInput";
import { useAccount } from "wagmi";
import useLocalStorage from "../hooks/useLocalStorage";

const QuestionPage =  () => {
  const router = useRouter();
  const id = router.query.id as string;

  const threads = trpc.public.fetchAllThreads.useQuery();

  const [didSession] = useLocalStorage("didSession","");
  const { isConnected } = useAccount();
  const [isDidSession, setDidSession] = useState(didSession?true:false);
  const [isDiscordUser, setDiscordUser] = useState(false);
  const [loading,setLoading] = useState(true);

  // todo we can write a custom hook for fetching all threads
  useEffect(()=>{
    if (threads.data && threads.data?.length>=0){
      setLoading(false);
    } 
  },[threads])
  
  if(loading){
    return <div>Loading...</div>;
  }

  const thisThread = threads.data.filter((thread) => thread.node.id == id)[0]
    .node;
  const commentsForThread = thisThread.node.comment.edge;

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
      <main className="absolute inset-0 m-5 lg:m-0 lg:flex lg:gap-[50px]">
        <div className="pt-[50px] lg:max-w-[75%] lg:border-r-[1px]">
          <Link href="/" legacyBehavior>
            <a className="flex w-fit items-center gap-[3px] text-[16px] font-[500] text-[#BAB2C4] hover:text-[#08010D]">
              <svg
                className="h-[20px] w-[20px]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M0 0h24v24H0z" stroke="none" />
                <path d="M5 12h14M5 12l4 4M5 12l4-4" />
              </svg>
              Back
            </a>
          </Link>
          <div className="mt-[80px] lg:mr-[50px]">
            <div>
            {thisThread.node && <Thread thread={thisThread.node} />}
            </div>
            <div className="mt-[94px] pb-[40px]">
              <div className="border-b border-gray-200 pb-5 sm:pb-0"></div>
              <div className="mt-[40px] space-y-[40px]">
                {commentsForThread && commentsForThread.length>0 && commentsForThread.map((item) => (
                  <Comment key={item.node.id} comment={item.node} />
                ))}
              </div>
            </div>
            <div className="border-b border-gray-200 pb-5 sm:pb-0"></div>
            {isConnected && isDidSession && isDiscordUser ?<CommentInput
              threadId={id}
              refresh={() => {
                threads.refetch();
              }}
            /> : checkConnected()}
          </div>
        </div>

        {/* Right column */}
        <ThreadInformation Comments={commentsForThread} />
      </main>
    </Layout>
  );
};

export default QuestionPage;
