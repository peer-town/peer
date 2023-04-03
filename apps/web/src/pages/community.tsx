import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { ThreadCard } from "../components/ThreadCard";
import { ThreadSection } from "../components/ThreadSection";
import { trpc } from "../utils/trpc";

const ThreadPage = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const threadId = router.query.threadId as string;
  const [currentThread, setCurrentThread] = useState<string>(threadId);
  const threads = trpc.public.fetchAllCommunityThreads.useQuery({
    communityId,
  });

  useEffect(() => {
    if(threadId) setCurrentThread(threadId);
  }, [threadId]);

  useEffect(() => {
    if (!threadId && threads.data && threads.data[0]) {
      console.log("trying to update the thread with first one");
      setCurrentThread(threads.data[0].node.id);
    }
  }, [threadId, threads.data]);

  if (threads.isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex flex-row">
      <div className="scrollbar-hide mx-4 flex h-screen w-[40%] flex-col space-y-4 overflow-y-scroll pt-4">
        {threads.data &&
          threads.data.map((thread) => (
            <Link
              key={thread.node.id}
              href={{
                pathname: "/community",
                query: {
                  communityId,
                  threadId: thread.node.id,
                },
              }}
            >
              <ThreadCard key={thread.node.id} thread={thread.node} />
            </Link>
          ))}
      </div>
      <div className="w-full border-l">
        {currentThread && <ThreadSection threadId={currentThread} />}
      </div>
    </div>
  );
};

export default ThreadPage;
