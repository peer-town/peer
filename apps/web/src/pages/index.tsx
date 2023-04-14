import {type NextPage} from "next";
import {trpc} from "../utils/trpc";
import Link from "next/link";
import {Search} from "../components/Search";
import {CommunityCard} from "../components/CommunityCard";
import {LoadMore} from "../components/Button/LoadMore";
import {useEffect} from "react";
import {useAppSelector} from "../store";
import {isEmpty, isNil} from "lodash";

const Home: NextPage = () => {
  const newlyCreatedCommunity = useAppSelector((state) => state.community.newlyCreatedCommunity);

  // @ts-ignore
  const {data, fetchNextPage, hasNextPage, refetch, isFetching} = trpc.public.fetchCommunities.useInfiniteQuery({
      first: 10,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.pageInfo.hasNextPage)
          return lastPage?.pageInfo.endCursor;
        return undefined;
      },
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      await refetch();
    }
    fetchData();
  }, [newlyCreatedCommunity])

  return (
    <div className="container mx-auto">
      <h1 className="p-4 text-4xl font-medium">discover</h1>
      <div className="mx-4 max-w-[682px]">
        <Search label={"Search by name or tags"} onQuery={() => {
        }}/>
      </div>

      <div className="m-4 mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {data?.pages?.map((page) => {
          return (
            page?.edges?.map((community, index) => {
              if (isNil(community.node)) return <></>;
              if (isEmpty(community.node?.socialPlatforms.edges)) return <></>;
              let tags: any;
              if (isEmpty(community.node?.tags.edges)) {
                tags = ["no tags"]
              }
              else {
                tags = community.node?.tags?.edges.map((tag) => tag?.node?.tag?.tag);
              }

              return (
                <Link
                  key={index}
                  href={{
                    pathname: "/community",
                    query: {communityId: community.node?.id},
                  }}
                >
                  <CommunityCard
                    key={index}
                    communityName={community.node?.communityName}
                    about={community.node?.description}
                    communityAvatar={
                      community.node?.socialPlatforms.edges[0]?.node
                        .communityAvatar
                    }
                    members={20}
                    questions={10}
                    tags={tags}
                  />
                </Link>
              );
            })
          );
        })}
      </div>
      <LoadMore
        title={"Load more"}
        isFetching={isFetching}
        hasNextPage={hasNextPage}
        next={fetchNextPage}
      />
    </div>
  );
};

export default Home;
