import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { ThreadCard } from "../components/ThreadCard";
import { ThreadSection } from "../components/ThreadSection";
import { trpc } from "../utils/trpc";
import { Search } from "../components/Search";
import {useAppSelector} from "../store";
import { flatten, isEmpty } from "lodash";
import { NoData } from "../components/NoData";

const FeedPage = () => {
  const router = useRouter();
  const threadId = router.query.threadId as string;
  const [currentThread, setCurrentThread] = useState<string>(threadId);
  const userStreamId = useAppSelector((state) => state.user.id);
  const feedData = trpc.user.getUserFeed.useQuery({userStreamId});

  const threads: any[] = feedData.data && flatten(feedData.data.edges.map((relation) => {
    return relation.node.community.threads.edges.map((thread) => thread);
  }));
 
  useEffect(() => {
    if (threadId) setCurrentThread(threadId);
  }, [threadId]);

 useEffect(() => {
    if (!threadId && threads && threads[0]) {
      setCurrentThread(threads[0].node.id);
    } else if (!threadId) {
      setCurrentThread(undefined);
    }
  }, [threadId, threads]);

  if (feedData.isLoading) {
    return <Loader />;
  }
 
   return (
    <div className="flex flex-row max-h-screen overflow-y-hidden">
      <div className="w-[30%] mx-4 hidden md:block">
        <p className="text-4xl font-medium my-4">your feed</p>
        <Search onQuery={() => {}}/>
        <div className="scrollbar-hide flex h-screen flex-col mt-4 space-y-4 overflow-y-scroll pt-4">
          {threads && threads.map((thread) => (
              <Link
                key={thread.node.id}
                href={{
                  pathname: "/feed",
                  query: {
                    threadId: thread.node.id,
                  },
                }}
              >
                <ThreadCard key={thread.node.id} thread={thread.node} />
              </Link>
            ))}
            {isEmpty(threads) && (
              <NoData
                title={"Community has no threads"}
                description={"create new thread by clicking on add button"}
              />
            )}
        </div>
      </div>
      <div className="w-full border-l">
        {currentThread ? (
            <ThreadSection threadId={currentThread} />
          ) : (
            <NoData
              title={"No thread selected"}
              description={"select a thread from the thread lists"}
            />
          )}
      </div>
    </div>
  );
};

export default FeedPage;
