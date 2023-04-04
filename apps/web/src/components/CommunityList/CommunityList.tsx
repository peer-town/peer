import { CommunityAvatar } from "../CommunityAvatar";
import { trpc } from "../../utils/trpc";
import * as utils from "../../utils";
import { has, get, isNil, isEmpty } from "lodash";
import { selectCommunity, useAppDispatch, useAppSelector } from "../../store";
import { useState } from "react";
import { toast } from "react-toastify";
import { isRight } from "../../utils/fp";
import { constants } from "../../config";

const CommunityList = () => {
  // const [clicked, setClicked] = useState<boolean>(false);
  // const dispatch = useAppDispatch();
  // const communityId = useAppSelector(
  //   (state) => state.community.selectedCommunity
  // );
  // const didSession = useAppSelector((state) => state.user.didSession);
  // const userId = useAppSelector((state) => state.user.id);

  // //fetch user joined communities
  // let communities :any;

  // const handleOnCommunityClick = (communityDetails: {
  //   selectedCommunity: string;
  //   communityName: string;
  //   communityAvatar: string;
  // }) => {
  //   dispatch(selectCommunity(communityDetails));
  // };


  // const getCommunityList = () => {
  //   if (isNil(communities.data) || isEmpty(communities.data)) {
  //     return <></>;
  //   }

  //   if (isEmpty(communityId) && has(communities, "data[0].node.id")) {
  //     const communityDetails = {
  //       selectedCommunity: get(communities, "data[0].node.id"),
  //       communityName: get(communities, "data[0].node.communityName"),
  //       communityAvatar: get(
  //         communities,
  //         "data[0].node.socialPlatforms.edges[0].node.communityAvatar"
  //       ),
  //     };
  //     handleOnCommunityClick(communityDetails);
  //   }

  //   return communities.data.map((community, index) => {
  //     if (!community.node) return null;

  //     const communityDetails = {
  //       selectedCommunity: community.node.id,
  //       communityName: community.node.communityName,
  //       communityAvatar: get(
  //         community,
  //         "node.socialPlatforms.edges[0].node.communityAvatar"
  //       ),
  //     };
  //     const name = community.node.communityName;
  //     const image =
  //       get(community, "node.socialPlatforms.edges[0].node.communityAvatar") ||
  //       "https://placekitten.com/200/200";
  //     const selected = community.node.id == communityId;
  //     return (
  //       <CommunityAvatar
  //         classes={""}
  //         key={index}
  //         name={name}
  //         image={image}
  //         selected={selected}
  //         onClick={() => handleOnCommunityClick(communityDetails)}
  //       />
  //     );
  //   });
  // };

  return (
    <div className="box-border flex min-h-screen w-full flex-col">
      {/* <div className="flex flex-row">
        <div className="flex h-screen flex-col gap-7 border-r py-10 sm:hidden md:flex ">
          {getCommunityList()}
        </div>
      </div> */}
    </div>
  );
};
export default CommunityList;
