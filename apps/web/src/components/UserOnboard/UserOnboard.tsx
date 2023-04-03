import { get, has, isEmpty, isNil } from "lodash";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { constants } from "../../config";
import { fetchUserDetails, useAppDispatch, useAppSelector } from "../../store";
import { isRight } from "../../utils/fp";
import { trpc, trpcProxy } from "../../utils/trpc";
import * as utils from "../../utils";
import { ConnectWalletButton } from "../Button";
import { InterfacesModal, WebOnBoardModal } from "../Modal";
import { toast } from "react-toastify";

const UserOnboard = () => {
  const { address, isConnected } = useAccount();
  const [webOnboarding, setWebOnBoarding] = useState(false);
  const [connected, setConected] = useState(false);
  const [notAUser, setNotAUser] = useState(false);
  const [notADiscordUser, setNotADiscordUser] = useState(false);
  const [socialInterfaces, setSocialInterfaces] = useState(false);
  const router = useRouter();
  const code = router.query.code as string;

  const dispatch = useAppDispatch();
  const didSession = useAppSelector((state) => state.user.didSession);
  const userPlatforms = useAppSelector((state) => state.user.userPlatforms);

  const createUser = trpc.user.createUser.useMutation();
  const updateUser = trpc.user.updateUser.useMutation();
  const currentUser = trpc.user.getUser.useQuery({ address });

  useEffect(() => {
    setConected(isConnected);
  }, [isConnected]);

  useEffect(() => {
    dispatch(fetchUserDetails(address));
  }, [address]);

  useEffect(() => {
   if (code) {
      handleDiscordAuthCallback(code).catch(console.log);
    }
  }, [code]);

  useEffect(() => {
    const checkUser = () => {
      if (address && (isNil(userPlatforms) || isNil(userPlatforms[0].platformId))) {
        setWebOnBoarding(true);
      }
      else{
        setWebOnBoarding(false);
      }
    };
    checkUser();
  }, [userPlatforms]);

  useEffect(() => {
    const checkDiscordUser = () => {
      if (address && (!isNil(userPlatforms) && !isNil(userPlatforms[0].platformId))) {
        const hasDiscord = userPlatforms.find(
          (platform) => platform.platformName === "discord"
        );
        if(isNil(hasDiscord)){
          setSocialInterfaces(true);
        }
        else{
          setSocialInterfaces(false);
        }
      } 
    };
    checkDiscordUser();
  }, [userPlatforms]);

  const handleDiscordAuthCallback = async (code: string) => {
    const response = await fetch(`/api/user/discord-auth/profile?code=${code}`);
    if (!response.ok) {
      return;
    }
    const profile = await response.json();
    const hasDiscord = userPlatforms.filter(
      (platform) => platform.platformName === "discord"
    )[0];
    if (hasDiscord) {
      return;
    }
    await updateUserProfileWithDiscord(profile);
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
          setSocialInterfaces(false);
          dispatch(fetchUserDetails(address));
        }
      });
      toast.success("Updated profile with discord info!");
    }
  };

  const handleOnUserConnected = async () => {
    const existingUser = await trpcProxy.user.getUser.query({ address });
    if (isRight(existingUser) && !existingUser.value.id) {
      setWebOnBoarding(true);
    } else {
      if (has(existingUser, "value.userPlatforms")) {
        const platforms = get(existingUser, "value.userPlatforms");
        const hasDiscord = platforms.filter(
          (platform) =>
            platform.platformName === constants.PLATFORM_DISCORD_NAME
        );
        if (isEmpty(hasDiscord)) {
          setSocialInterfaces(true);
        }
      }
    }
  };

  const handleWebOnboardSubmit = async (details) => {
    const user = await createUser.mutateAsync({
      session: didSession,
      userPlatformDetails: {
        platformId: constants.PLATFORM_DEVNODE_ID,
        platformName: constants.PLATFORM_DEVNODE_NAME,
        platformUsername: details.name,
        platformAvatar: details.imageUrl,
      },
      walletAddress: address,
    });
    if (isRight(user)) {
      currentUser.refetch().then((response) => {
        if (has(response, "data.value.id")) {
          dispatch(fetchUserDetails(address));
        }
        setWebOnBoarding(false);
        setSocialInterfaces(true);
      });
    }
  };

  const getUserAvatar = (user) => {
    if (!user) {
      return;
    }
    if (has(user, "data.value.userPlatforms[0].platformAvatar")) {
      return get(user, "data.value.userPlatforms[0].platformAvatar");
    }
  };

  return (
    <div>
      <ConnectWalletButton onSessionCreated={handleOnUserConnected} />
        <WebOnBoardModal
          onSubmit={handleWebOnboardSubmit}
          open={webOnboarding}
          onClose={() => setWebOnBoarding(false)}
        />
      <InterfacesModal
        type={"user"}
        open={socialInterfaces}
        onClose={() => setSocialInterfaces(false)}
      />
    </div>
  );
};
export default UserOnboard;
