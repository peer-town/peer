import {trpc} from "../utils/trpc";
import {CommunityCard} from "../components/CommunityCard";
import {Search} from "../components/Search";
import Link from "next/link";

const Temp = () => {
  const { data, fetchNextPage } = trpc.public.fetchCommunities.useInfiniteQuery(
    {
      first: 1,
      after: undefined,
    },{
      getNextPageParam: (lastPage) => {
        if (lastPage.pageInfo.hasNextPage) {
          return { cursor: {
            after: lastPage.pageInfo.endCursor,
            first: 1,
          }};
        } else {
          return null;
        }
      },
  });

  return (
    <div className="container mx-auto">
      <h1 className="text-4xl font-medium m-4">discover</h1>
      <div className="mx-4 max-w-[682px]">
        <Search label={"Search by name or tags"} onQuery={() => {}} />
      </div>
      <div className="grid lg:grid-cols-2 md:grid-cols-1 gap-8 mt-12 m-4">
        {data && data.pages && data.pages.map((page) => {
          return page && page.edges.map((community, index) => {
          const about = " this is huge text and cannot fit in a regular div and looks not so awesome event with text overflow flags its disgusting" +
            " this is huge text and cannot fit in a regular div and looks not so awesome event with text overflow flags its disgusting" +
            "this is huge text and cannot fit in a regular div and looks not so awesome event with text overflow flags its disgusting"
          return (
            <Link key={index} href={"/"} >
              <CommunityCard
                key={index}
                communityName={community.node.communityName}
                about={about}
                communityAvatar={community.node.socialPlatforms.edges[0].node.communityAvatar}
                members={20}
                questions={10}
                tags={["solidity", "finance", "Next.js", "Another", "One", "More", "Two"]}
              />
            </Link>
          );
        })
        })}
      </div>
      <p className="w-full text-center mx-4 my-12 cursor-pointer py-4 border rounded-2xl" onClick={fetchNextPage}>Load more...</p>
    </div>
  );
}

export default Temp;
