import {get, isEmpty} from "lodash";
import Link from "next/link";
import {useRouter} from "next/router";
import {useEffect, useState} from "react";
import {Loader} from "../components/Loader";
import {ThreadCard} from "../components/ThreadCard";
import {ThreadSection} from "../sections";
import {trpc} from "../utils/trpc";
import {Search} from "../components/Search";
import {CreateThread} from "../components/Thread";
import {FlexRow} from "../components/Flex";
import {selectCommunity, useAppDispatch, useAppSelector} from "../store";
import {JoinCommunity} from "../components/JoinCommunity";
import {NoData} from "../components/NoData";
import {LoadMore} from "../components/Button/LoadMore";

const AddIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 96 960 960">
      <path
        d="M457.308 845.999V598.692H210.001v-45.384h247.307V306.001h45.384v247.307h247.307v45.384H502.692v247.307h-45.384Z"/>
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
  // @ts-ignore
  const {data, isLoading, isFetching, refetch, fetchNextPage, hasNextPage} = trpc.public.fetchAllCommunityThreads.useInfiniteQuery({
      first: 20,
      communityId: communityId,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.pageInfo.hasNextPage)
          return lastPage?.pageInfo.endCursor;
        return undefined;
      },
    }
  );
  const newlyCreatedThread = useAppSelector((state) => state.thread.newlyCreatedThread);
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
    if (!threadId && !isEmpty(data?.pages[0]?.edges)) {
      setCurrentThread(data.pages[0].edges[0]?.node.id);
    } else if (!threadId) {
      setCurrentThread(undefined);
    }
  }, [threadId, data?.pages]);

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    }
    fetchData();
  }, [newlyCreatedThread])

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="flex h-screen flex-col overflow-y-hidden">
      <JoinCommunity />
      <div className="flex flex-row grow overflow-y-auto">
      <div className="mx-4 flex flex-col w-[40%]">
          {communityName && (
            <p className="my-4 text-4xl font-medium">{communityName}</p>
          )}
          <FlexRow classes="gap-2">
            <div className="grow">
              <Search onQuery={() => {}} />
            </div>
            <button
              title="ask a question"
              className="h-[50px] min-w-[50px] rounded-xl border bg-white p-2 hover:border-gray-500"
              onClick={() => setQuestionModal(true)}
            >
              <AddIcon />
            </button>
          </FlexRow>
          <div className="mt-4 flex flex-col space-y-4 overflow-y-scroll scrollbar-hide pt-4 pb-[500px]">
            {data?.pages?.map((page) => (
               page?.edges?.map((thread) => (
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
                  <ThreadCard key={thread.node.id} thread={thread.node}/>
                </Link>
              ))
            ))}
            {isEmpty(data?.pages[0]?.edges) && (
              <NoData
                title={"Community has no threads"}
                description={"create new thread by clicking on add button"}
              />
            )}
            <LoadMore
              title={"Load more threads"}
              isFetching={isFetching}
              hasNextPage={hasNextPage}
              next={fetchNextPage}
            />
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
