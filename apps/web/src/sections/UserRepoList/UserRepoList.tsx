import {BaseModal} from "../../components/Modal/BaseModal/BaseModal";
import {trpc} from "../../utils/trpc";
import {isEmpty} from "lodash";
import {NoData} from "../../components/NoData";
import {LoadMore} from "../../components/Button/LoadMore";
import {ContentCard} from "../../components/ContentCard";

interface Props {
  open: boolean;
  authorId: string;
  onClose?(): void;
}

export const UserRepoList = (props: Props) => {
  // @ts-ignore
  const {data, isFetching, fetchNextPage, hasNextPage} = trpc.radicle.fetchRepo.useInfiniteQuery({
      first: 10,
      authorId: props.authorId,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.pageInfo.hasNextPage)
          return lastPage?.pageInfo.endCursor;
        return undefined;
      },
    }
  );

  return (
    <BaseModal title={"Repos"} open={props.open} onClose={props.onClose}>
      <div className="flex flex-col mt-4 gap-2 max-w-lg h-[500px] overflow-y-scroll scrollbar-hide">
        {data?.pages?.map((page) => (
          page?.edges?.map((repo) => (
            <ContentCard key={repo.node.id} title={repo.node.name} body={repo.node.description} />
          ))
        ))}
        {isEmpty(data?.pages[0]?.edges) && (
          <NoData
            title={"User has no repo"}
            description={"create new repo by clicking on 'add repo'"}
          />
        )}
        <LoadMore
          title={"Load more repos"}
          isFetching={isFetching}
          hasNextPage={hasNextPage}
          next={fetchNextPage}
        />
      </div>
    </BaseModal>
  )
}
