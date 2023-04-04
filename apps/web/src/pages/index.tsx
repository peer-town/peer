import { type NextPage } from "next";
import { trpc } from "../utils/trpc";
import Link from "next/link";
import { Search } from "../components/Search";
import { CommunityCard } from "../components/CommunityCard";

const Home: NextPage = () => {
  // @ts-ignore
  const { data, fetchNextPage } = trpc.public.fetchCommunities.useInfiniteQuery(
    {
      first: 20,
      after: undefined,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.pageInfo.hasNextPage) {
          return {
            cursor: {
              after: lastPage.pageInfo.endCursor,
              first: 1,
            },
          };
        } else {
          return null;
        }
      },
    }
  );

  return (
    <div className="container mx-auto">
      <h1 className="p-4 text-4xl font-medium">discover</h1>
      <div className="mx-4 max-w-[682px]">
        <Search label={"Search by name or tags"} onQuery={() => {}} />
      </div>
      <div className="m-4 mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-2">
        {data &&
          data.pages &&
          data.pages.map((page) => {
            return (
              page &&
              page.edges.map((community, index) => {
                return (
                  <Link
                    key={index}
                    href={{
                      pathname: "/community",
                      query: { communityId: community.node.id },
                    }}
                  >
                    <CommunityCard
                      key={index}
                      communityName={community.node.communityName}
                      about={community.node.description}
                      communityAvatar={
                        community.node.socialPlatforms.edges[0].node
                          .communityAvatar
                      }
                      members={20}
                      questions={10}
                      tags={[
                        "solidity",
                        "finance",
                        "Next.js",
                        "Another",
                        "One",
                        "More",
                        "Two",
                      ]}
                    />
                  </Link>
                );
              })
            );
          })}
      </div>
    </div>
  );
};

export default Home;
