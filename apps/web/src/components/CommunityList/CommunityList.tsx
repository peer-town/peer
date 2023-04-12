import {CommunityAvatar} from "../CommunityAvatar";
import {trpc} from "../../utils/trpc";
import * as utils from "../../utils";
import {get, isNil, isEmpty} from "lodash";
import {selectCommunity, useAppDispatch, useAppSelector} from "../../store";
import Link from "next/link";
import {useEffect} from "react";

const CommunityList = () => {
  const dispatch = useAppDispatch();
  const communityId = useAppSelector(
      (state) => state.community.selectedCommunity
  );
  const userId = useAppSelector((state) => state.user.id);
  const newlyCreatedCommunity = useAppSelector((state) => state.community.newlyCreatedCommunity);

  //fetch user joined communities
  const communities = trpc.user.getUserCommunities.useQuery({
    streamId: userId,
    first: 10,
  });

  useEffect(() => {
    const fetchData = async () => {
      await communities.refetch();
    }
    fetchData();
  }, [newlyCreatedCommunity]);
  const handleOnCommunityClick = (communityDetails: {
    selectedCommunity: string;
    communityName: string;
    communityAvatar: string;
    description: string;
  }) => {
    dispatch(selectCommunity(communityDetails));
  };

  const getCommunityList = () => {
    if (isNil(communities.data) || isEmpty(communities.data)) {
      return <></>;
    }

    return communities.data.edges.map((communityNode, index) => {
      if (!communityNode.node) return null;

      const communityDetails = {
        selectedCommunity: communityNode.node?.community?.id,
        communityName: communityNode.node?.community?.communityName,
        communityAvatar: get(
            communityNode,
            "node.community.socialPlatforms.edges[0].node.communityAvatar"
        ),
        description: communityNode.node?.community?.description,
      };
      const name = communityNode.node?.community?.communityName;
      const image =
          get(
              communityNode,
              "node.community.socialPlatforms.edges[0].node.communityAvatar"
          ) || "https://placekitten.com/200/200";
      const selected = communityNode.node?.community?.id == communityId;
      return (
          <Link
              className={'w-full'}
              key={index}
              href={{
                pathname: "/community",
                query: {communityId: communityNode.node?.community?.id},
              }}
          >
            <CommunityAvatar
                classes={utils.classNames(
                    "bg-slate-100	w-full rounded-full hover:rounded-xl hover:bg-slate-100 px-auto"
                )}
                key={index}
                name={name}
                image={image}
                selected={selected}
                onClick={() => handleOnCommunityClick(communityDetails)}
            />
          </Link>
      );
    });
  };

  return (
      <div className={"flex w-full flex-col items-center gap-[15px]"}>
        {getCommunityList()}
      </div>
  );
};
export default CommunityList;
