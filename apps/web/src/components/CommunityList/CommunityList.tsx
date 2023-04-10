import { CommunityAvatar } from "../CommunityAvatar";
import { trpc } from "../../utils/trpc";
import * as utils from "../../utils";
import { has, get, isNil, isEmpty } from "lodash";
import { selectCommunity, useAppDispatch, useAppSelector } from "../../store";
import { useState } from "react";
import { toast } from "react-toastify";
import { isRight } from "../../utils/fp";
import { constants } from "../../config";
import Link from "next/link";

const CommunityList = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const dispatch = useAppDispatch();
  const communityId = useAppSelector(
    (state) => state.community.selectedCommunity
  );
  const didSession = useAppSelector((state) => state.user.didSession);
  const userId = useAppSelector((state) => state.user.id);

  //fetch user joined communities
  const communities = trpc.user.getUserCommunities.useQuery({
    streamId: userId,
    first: 10,
  });

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

    return communities.data.edges.map((community, index) => {
      if (!community.node) return null;

      const communityDetails = {
        selectedCommunity: community.node?.community?.id,
        communityName: community.node?.community?.communityName,
        communityAvatar: get(
          community,
          "node.community.socialPlatforms.edges[0].node.communityAvatar"
        ),
        description: community.node?.community?.description,
      };
      const name = community.node?.community?.communityName;
      const image =
        get(
          community,
          "node.community.socialPlatforms.edges[0].node.communityAvatar"
        ) || "https://placekitten.com/200/200";
      const selected = community.node?.community?.id == communityId;
      return (
        <Link
        className={'w-full'}
          key={index}
          href={{
            pathname: "/community",
            query: { communityId: community.node?.community?.id },
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
