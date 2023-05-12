import {type NextPage} from "next";
import {trpc} from "../utils/trpc";
import Link from "next/link";
import {Search} from "../components/Search";
import {CommunityCard} from "../components/CommunityCard";
import {LoadMore} from "../components/Button/LoadMore";
import {useEffect} from "react";
import {toggleLeftPanel, useAppDispatch, useAppSelector} from "../store";
import {isEmpty, isNil} from "lodash";
import {index_title, md_index_container, md_index_grid} from "../styles/app_styles";

const Home: NextPage = () => {
  const newlyCreatedCommunity = useAppSelector((state) => state.community.newlyCreatedCommunity);
  const dispatch = useAppDispatch();
  const isLeftPanelVisible = useAppSelector((state) => state.responsiveToggles.leftPanelToggle)
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

  const handleLeftpanelToggle = () =>{
    dispatch(toggleLeftPanel(!isLeftPanelVisible))
  }
  return (
    <div className={`.container mx-auto ${md_index_container}`}>
      <div className={"flex row gap-[10px] items-center mx-4"} >
        <div className={` ${index_title}`} onClick={handleLeftpanelToggle}>
          <img src={"/hamburger.png"} alt={"hamburger"} width={"100%"} height={"100%"}/>
        </div>
        <h1 className="p-4 text-4xl font-medium">discover</h1>
      </div>

      {/*<div className="mx-4 max-w-[682px] ">*/}
      {/*  <Search label={"Search by name or tags"} onQuery={() => {*/}
      {/*  }}/>*/}
      {/*</div>*/}

      <div className={`m-4 mt-12 grid gap-8 ${md_index_grid}`}>
        {data?.pages?.map((page) => {
          return (
            page?.edges?.map((community) => {
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
                  key={community.node?.id}
                  href={{
                    pathname: "/community",
                    query: {communityId: community.node?.id},
                  }}
                >
                  <CommunityCard
                    communityName={community.node?.communityName}
                    about={community.node?.description}
                    communityAvatar={
                      community.node?.socialPlatforms.edges[0]?.node
                        .communityAvatar
                    }
                    members={community.node?.userCount}
                    questions={community.node?.threadCount}
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
