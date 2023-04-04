import { get } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { ThreadCard } from "../components/ThreadCard";
import { ThreadSection } from "../components/ThreadSection";
import { trpc } from "../utils/trpc";
import { Search } from "../components/Search";

const CommunityPage = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const threadId = router.query.threadId as string;
  const [currentThread, setCurrentThread] = useState<string>(threadId);

  const community = trpc.community.fetchCommunityUsingStreamId.useQuery({streamId: communityId});
  const communityName = get(community, "data.value.node.communityName");
  const threads = trpc.public.fetchAllCommunityThreads.useQuery({
    communityId,
  });

  useEffect(() => {
    if (threadId) setCurrentThread(threadId);
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
    <div className="flex flex-row max-h-screen overflow-y-hidden">
      <div className="w-[40%] mx-4 hidden md:block">
        {communityName && <p className="text-4xl font-medium my-4">{communityName}</p>}
        <Search onQuery={() => {}}/>
        <div className="scrollbar-hide flex h-screen flex-col mt-4 space-y-4 overflow-y-scroll pt-4">
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
      </div>
      <div className="w-full border-l">
        {currentThread && <ThreadSection threadId={currentThread} />}
      </div>
    </div>
  );
};

export default CommunityPage;
