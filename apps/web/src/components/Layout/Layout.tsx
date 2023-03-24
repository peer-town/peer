import { NavBar } from "../NavBar";
import { CommunityAvatar } from "../CommunityAvatar";
import { trpc } from "../../utils/trpc";
import * as utils from "../../utils";
import { has, get, isNil, isEmpty } from "lodash";
import { selectCommunity, useAppDispatch, useAppSelector } from "../../store";
import { CommunityOnBoardModal, InterfacesModal } from "../Modal";
import { useState } from "react";
import { toast } from "react-toastify";
import { isRight } from "../../utils/fp";
import { constants } from "../../config";

const Layout = (props) => {
  const dispatch = useAppDispatch();
  const communityId = useAppSelector(
    (state) => state.community.selectedCommunity
  );
  const didSession = useAppSelector((state) => state.user.didSession);
  const userId = useAppSelector((state) => state.user.id);

  const communities = trpc.public.fetchAllCommunities.useQuery();
  const createCommunity = trpc.community.createCommunity.useMutation();

  const [clicked, setClicked] = useState<boolean>(false);
  const [communityOnboarding, setCommunityOnboarding] =
    useState<boolean>(false);
  const [socialInterfaces, setSocialInterfaces] = useState(false);

  const handleOnCommunityClick = (communityDetails: {
    selectedCommunity: string;
    communityName: string;
    communityAvatar: string;
  }) => {
    dispatch(selectCommunity(communityDetails));
  };

  const handleSubmit = async ({ name, imageUrl }) => {
    const createCommunityResp = await createCommunity.mutateAsync({
      session: didSession,
      communityName: name,
      socialPlatform: {
        platformId: constants.PLATFORM_DEVNODE_ID,
        platform: constants.PLATFORM_DEVNODE_NAME,
        communityName: name,
        userId: userId,
        communityAvatar: imageUrl,
      },
    });
    if (isRight(createCommunityResp)) {
      const communityDetails = {
        selectedCommunity: get(
          createCommunityResp.value,
          "createCommunity.document.id"
        ),
        communityName: get(
          createCommunityResp.value,
          "createCommunity.document.communityName"
        ),
        communityAvatar: get(
          createCommunityResp.value,
          "createSocialPlatform.document.communityAvatar"
        ),
      };
      dispatch(selectCommunity(communityDetails));
      communities.refetch();
      setCommunityOnboarding(false);
      setSocialInterfaces(true);
    }
  };

  const handleCreateCommunity = () => {
    if (!userId || !didSession) {
      toast.error("Please re-connect with your wallet!");
      return;
    }
    setCommunityOnboarding(true);
    setClicked(true);
  };

  const getCommunityList = () => {
    if (isNil(communities.data) || isEmpty(communities.data)) {
      return <></>;
    }

    if (isEmpty(communityId) && has(communities, "data[0].node.id")) {
      const communityDetails = {
        selectedCommunity: get(communities, "data[0].node.id"),
        communityName: get(communities, "data[0].node.communityName"),
        communityAvatar: get(
          communities,
          "data[0].node.socialPlatforms.edges[0].node.communityAvatar"
        ),
      };
      handleOnCommunityClick(communityDetails);
    }

    return communities.data.map((community, index) => {
      if (!community.node) return null;

      const communityDetails = {
        selectedCommunity: community.node.id,
        communityName: community.node.communityName,
        communityAvatar: get(
          community,
          "node.socialPlatforms.edges[0].node.communityAvatar"
        ),
      };
      const name = community.node.communityName;
      const image =
        get(community, "node.socialPlatforms.edges[0].node.communityAvatar") ||
        "https://placekitten.com/200/200";
      const selected = community.node.id == communityId;
      return (
        <CommunityAvatar
          classes={""}
          key={index}
          name={name}
          image={image}
          selected={selected}
          onClick={() => handleOnCommunityClick(communityDetails)}
        />
      );
    });
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex flex-row">
        <div className="flex h-screen flex-col gap-7 border-r py-10 sm:hidden md:flex ">
          <CommunityAvatar
            key={"create"}
            classes={utils.classNames(
              "bg-slate-300	w-full rounded-full hover:rounded-xl hover:bg-slate-500"
            )}
            width={25}
            name={"create community"}
            image={"/plus.png"}
            selected={clicked}
            onClick={handleCreateCommunity}
          />
          {getCommunityList()}
        </div>

        <div className="relative mx-auto w-full grow px-6">
          {props.children}
        </div>

        <CommunityOnBoardModal
          open={communityOnboarding}
          onClose={() => {
            setCommunityOnboarding(false);
            setClicked(false);
          }}
          onSubmit={handleSubmit}
        />

        <InterfacesModal
          type={"community"}
          open={socialInterfaces}
          onClose={() => setSocialInterfaces(false)}
        />
      </div>
    </div>
  );
};

export default Layout;
