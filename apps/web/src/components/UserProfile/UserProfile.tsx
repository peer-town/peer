import {FlexColumn, FlexRow} from "../Flex";
import {AvatarCard} from "../AvatarCard";
import {trpc} from "../../utils/trpc";
import {UserProfileProps} from "./types";
import {useEffect, useState} from "react";
import {get, has} from "lodash";
import {constants} from "../../config";
import {getDiscordAuthUrl} from "../../utils";
import Image from "next/image";
import {SecondaryButton} from "../Button/SecondaryButton";
import {Loader} from "../Loader";
import {clearUserProfile, useAppDispatch} from "../../store";
import { Badge } from "../Badge";

const CloseIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke="currentColor"
      className="h-6 w-6 text-gray-500 hover:text-black">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"/>
    </svg>
  );
}

export const UserProfile = (props: UserProfileProps) => {
  const [profile, setProfile] = useState<any>();
  const [isDiscordConnected, setIsDiscordConnected] = useState(false);
  const points = [
    {tag: "python", points: 35},
    {tag: "web3", points: 35},
    {tag: "polygon", points: 13},
  ];

  const dispatch = useAppDispatch();
  const user = trpc.user.getUserByStreamId.useQuery({streamId: props.userStreamId});
  const communities = trpc.user.getUserCommunities.useQuery({streamId: props.userStreamId});

  useEffect(() => {
    if (has(user, "data.value.userPlatforms[0]")) {
      setProfile(get(user, "data.value.userPlatforms[0]"));
      const platforms = get(user, "data.value.userPlatforms");
      const isDiscordPlatform = platforms?.filter(
        (platform) => platform.platformName === constants.PLATFORM_DISCORD_NAME
      )[0];
      if (isDiscordPlatform) {
        setIsDiscordConnected(true);
      }
    }
  }, [user]);

  if (!profile || user.isLoading) {
    return <Loader/>;
  }

  const connectDiscord = () => {
    window.location.replace(getDiscordAuthUrl("user"));
  };

  return (
    <div className="w-full h-screen scrollbar-hide overflow-y-scroll">
      {/* user profile */}
      <button
        className="p-4"
        onClick={() => dispatch(clearUserProfile())}
      >
        <CloseIcon />
      </button>
      <div className="flex flex-row items-center m-4 gap-2">
        <Image
          className={"rounded-2xl border"}
          src={profile.platformAvatar}
          alt={`profile ${profile.platformUsername}`}
          width={85}
          height={85}
          style={{ width: 85, height: 85 }}
        />
        <p className="text-4xl my-4">{profile.platformUsername}</p>
        {!isDiscordConnected && (
          <>
            <FlexRow classes="justify-between">
              <SecondaryButton
                title={"connect with discord"}
                onClick={connectDiscord}
              />
            </FlexRow>
          </>
        )}
      </div>

      {/* communities */}
      <hr/>
      <div className="p-6">
        <p className="text-xl font-medium"> Communities</p>
        <FlexRow classes="flex-wrap mt-6 gap-2">
          {communities.data && communities.data.edges.map((community) => {
            return (
              <AvatarCard
                imageClasses="border"
                key={community.node.community.id}
                image={get(community, "node.community.socialPlatforms.edges[0].node.communityAvatar")}
                imageSize={44}
              />
            )
          })}
        </FlexRow>
      </div>

      {/* reputation */}
      <hr/>
      <div className="p-6">
        <p className="text-xl font-medium">Reputation</p>
        <FlexRow classes={"flex-wrap gap-2 my-4 bg-white text-gray-500"}>
          {points.map((point, index) => {
            return (
              <Badge text={`${point.tag} ${point.points} pts`} />
            );
          })}
        </FlexRow>
        <FlexRow classes={"justify-between"}>
          <p className="text-gray-500 font-semibold">Total Points</p>
          <p className="text-2xl text-right text-black">1,200</p>
        </FlexRow>
      </div>
      <hr/>

    </div>
  );
}
