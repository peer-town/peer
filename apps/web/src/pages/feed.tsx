import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { ThreadCard } from "../components/ThreadCard";
import { ThreadSection } from "../components/ThreadSection";
import { trpc } from "../utils/trpc";
import { Search } from "../components/Search";
import {useAppSelector} from "../store";
import {flatten} from "lodash";

const FeedPage = () => {
  const router = useRouter();
  const threadId = router.query.threadId as string;
  const [currentThread, setCurrentThread] = useState<string>(threadId);
  const userStreamId = useAppSelector((state) => state.user.id);
  const feedData = trpc.user.getUserFeed.useQuery({userStreamId});

  useEffect(() => {
    if (threadId) setCurrentThread(threadId);
  }, [threadId]);

  if (feedData.isLoading) {
    return <Loader />;
  }

  const threads = feedData.data && flatten(feedData.data.edges.map((relation) => {
    return relation.node.community.threads.edges.map((thread) => thread);
  }));

  return (
    <div className="flex flex-row max-h-screen overflow-y-hidden">
      <div className="w-[40%] mx-4 hidden md:block">
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
        </div>
      </div>
      <div className="w-full border-l">
        {currentThread && <ThreadSection threadId={currentThread} />}
      </div>
    </div>
  );
};

export default FeedPage;
