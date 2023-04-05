import { get, isEmpty } from "lodash";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Loader } from "../components/Loader";
import { ThreadCard } from "../components/ThreadCard";
import { ThreadSection } from "../components/ThreadSection";
import { trpc } from "../utils/trpc";
import { Search } from "../components/Search";
import { CreateThread } from "../components/Thread";
import { FlexRow } from "../components/Flex";
import { selectCommunity, useAppDispatch } from "../store";
import { JoinCommunity } from "../components/JoinCommunity";
import { NoData } from "../components/NoData";

const AddIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
      <path d="M457.308 845.999V598.692H210.001v-45.384h247.307V306.001h45.384v247.307h247.307v45.384H502.692v247.307h-45.384Z" />
    </svg>
  );
};

const CommunityPage = () => {
  const router = useRouter();
  const communityId = router.query.communityId as string;
  const threadId = router.query.threadId as string;
  const [currentThread, setCurrentThread] = useState<string>(threadId);
  const [questionModal, setQuestionModal] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const community = trpc.community.fetchCommunityUsingStreamId.useQuery({
    streamId: communityId,
  });
  const communityName = get(community, "data.value.node.communityName");
  const threads = trpc.public.fetchAllCommunityThreads.useQuery({
    communityId,
  });
  //clean up function is getting called even when the component is mounted
  //until i find any solution, below is the quick fix.
  let mounted = false;
  useEffect(() => {
    return () => {
      if (mounted) {
        dispatch(selectCommunity(null));
      }
      mounted = true;
    };
  }, []);

  useEffect(() => {
    if (threadId) setCurrentThread(threadId);
  }, [threadId]);

  useEffect(() => {
    if (!threadId && threads.data && threads.data.edges[0]) {
      setCurrentThread(threads.data.edges[0].node.id);
    } else if (!threadId) {
      setCurrentThread(undefined);
    }
  }, [threadId, threads.data]);

  if (threads.isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex h-full max-h-full flex-col overflow-y-hidden">
      <JoinCommunity />
      <div className="flex h-full flex-row overflow-y-hidden">
        <div className="mx-4 hidden w-[30%] md:block">
          {communityName && (
            <p className="my-4 text-4xl font-medium">{communityName}</p>
          )}
          <FlexRow classes="gap-2">
            <Search onQuery={() => {}} />
            <button
              title="ask a question"
              className="h-[50px] min-w-[50px] rounded-xl border bg-white p-2 hover:border-gray-500"
              onClick={() => setQuestionModal(true)}
            >
              <AddIcon />
            </button>
          </FlexRow>
          <div className="scrollbar-hide mt-4 flex h-full flex-col space-y-4 overflow-y-scroll pt-4">
            {threads.data &&
              threads.data.edges.map((thread) => (
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
            {threads.data && isEmpty(threads.data.edges) && (
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
        <CreateThread
          title={"Ask Question"}
          open={questionModal}
          onClose={() => setQuestionModal(false)}
          community={{ communityName, communityId }}
        />
      </div>
    </div>
  );
};

export default CommunityPage;
