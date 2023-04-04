import { CommunityAvatar } from "../CommunityAvatar";
import { trpc } from "../../utils/trpc";
import * as utils from "../../utils";
import { get, has } from "lodash";
import {
  fetchUserDetails,
  selectCommunity,
  useAppDispatch,
  useAppSelector,
} from "../../store";
import { CommunityOnBoardModal, InterfacesModal } from "../Modal";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { isRight } from "../../utils/fp";
import { constants } from "../../config";
import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { CommunityDiscordDetails } from "./types";

const Layout = (props) => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { address } = useAccount();
  const [clicked, setClicked] = useState<boolean>(false);
  const [communityOnboarding, setCommunityOnboarding] =
    useState<boolean>(false);
  const [socialInterfaces, setSocialInterfaces] = useState(false);
  const [communityDiscordDetails, setCommunityDiscordDetails] = useState<CommunityDiscordDetails>();

  const code = router.query.code as string;
  const guild = router.query.guild_id as string;

  const didSession = useAppSelector((state) => state.user.didSession);
  const userId = useAppSelector((state) => state.user.id);
  const userPlatforms = useAppSelector((state) => state.user.userPlatforms);
  const communityAndUserDetails = useAppSelector((state) => {
    const { user, community } = state;
    return {
      user,
      community,
    };
  });

  const communities = trpc.public.fetchAllCommunities.useQuery();
  const createCommunity = trpc.community.createCommunity.useMutation();
  const createSocialPlatform =
    trpc.community.createSocialPlatform.useMutation();

  const updateUser = trpc.user.updateUser.useMutation();
  const currentUser = trpc.user.getUser.useQuery({ address });

  useEffect(() => {
    dispatch(fetchUserDetails(address));
  }, [address]);

  useEffect(() => {
    if (code && guild) {
      handleCommunityDiscordAuthCallback(code, guild).catch(console.log);
    }
  }, [code, guild]);

  const handleCommunityDiscordAuthCallback = async (
    code: string,
    guild: string
  ) => {
    const response = await fetch(
      `/api/community/discord-auth/profile?code=${code}&guildId=${guild}`
    );
    if (!response) {
      return;
    }

    const data = await response.json();

    const discordPlatform = userPlatforms.filter(
      (platform) => platform.platformName === "discord"
    )[0];

    if (!has(discordPlatform, "platformId")) {
      await updateUserProfileWithDiscord(data.profile);
    }
    const details = data.guild;
    console.log("details",details);
    const communityDiscordData: CommunityDiscordDetails = {
      id : details.id,
      name : details.name,
      icon: details.icon
    }
    console.log("details",details);
    setCommunityDiscordDetails(communityDiscordData);
    setSocialInterfaces(false);
    setCommunityOnboarding(true);
  };

  const updateUserProfileWithDiscord = async (profile) => {
    const user = await updateUser.mutateAsync({
      session: didSession,
      userPlatformDetails: {
        platformId: profile.id,
        platformName: constants.PLATFORM_DISCORD_NAME,
        platformUsername: utils.getDiscordUsername(
          profile.username,
          profile.discriminator
        ),
        platformAvatar: utils.getDiscordAvatarUrl(profile.id, profile.avatar),
      },
      walletAddress: address,
    });
    if (isRight(user)) {
      currentUser.refetch().then((response) => {
        if (has(response, "data.value.id")) {
          dispatch(fetchUserDetails(address));
        }
      });
      toast.success("Updated profile with discord info!");
    }
  };

  const updateCommunityDetailsWithDiscord = async (details) => {
    const response = await createSocialPlatform.mutateAsync({
      session: didSession,
      socialPlatform: {
        platformId: details.id,
        platform: constants.PLATFORM_DISCORD_NAME,
        communityName: details.name,
        userId: communityAndUserDetails.user.id,
        communityId: details.id,
        communityAvatar: details.icon,
      },
    });

    if (isRight(response)) {
      toast.success("Updated community with discord info!");
    }
    else{
      toast.success("could not create social platform");
    }
    setCommunityOnboarding(false);
  };

  const handleSubmit = async ({ name, imageUrl, description }) => {
    const createCommunityResp = await createCommunity.mutateAsync({
      session: didSession,
      communityName: name,
      description: description,
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
        description: get(
          createCommunityResp.value,
          "createCommunity.document.descripton"
        ),
      };
      dispatch(selectCommunity(communityDetails));
      communities.refetch();
      
      await updateCommunityDetailsWithDiscord({...communityDiscordDetails, id:communityDetails.selectedCommunity});
    }
  };

  const handleCreateCommunity = () => {
    if (!userId || !didSession) {
      toast.error("Please re-connect with your wallet!");
      return;
    }
    setSocialInterfaces(true);
    setClicked(true);
  };

  return (
    <>
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
    </>
  );
};

export default Layout;
