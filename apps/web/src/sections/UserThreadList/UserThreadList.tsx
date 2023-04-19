import {BaseModal} from "../../components/Modal/BaseModal/BaseModal";
import {trpc} from "../../utils/trpc";
import {isEmpty} from "lodash";
import Link from "next/link";
import {NoData} from "../../components/NoData";
import {LoadMore} from "../../components/Button/LoadMore";
import {ContentCard} from "../../components/ContentCard";

interface Props {
  open: boolean;
  authorId: string;
  onClose?(): void;
}

export const UserThreadList = (props: Props) => {
  // @ts-ignore
  const {data, isFetching, fetchNextPage, hasNextPage} = trpc.user.getUserThreads.useInfiniteQuery({
      last: 10,
      authorId: props.authorId,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.pageInfo.hasPreviousPage)
          return lastPage?.pageInfo.startCursor;
        return undefined;
      },
    }
  );

  return (
    <BaseModal title={"Questions"} open={props.open} onClose={props.onClose}>
      <div className="flex flex-col mt-4 gap-2 max-w-lg h-[500px] overflow-y-scroll scrollbar-hide">
        {data?.pages?.map((page) => (
          page?.edges?.map((thread) => (
            <Link
              key={thread.node.id}
              onClick={props.onClose}
              href={{
                pathname: "/community",
                query: {
                  communityId: thread.node.communityId,
                  threadId: thread.node.id,
                },
              }}
            >
              <ContentCard title={thread.node.title} body={thread.node.body} />
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
    </BaseModal>
  )
}
