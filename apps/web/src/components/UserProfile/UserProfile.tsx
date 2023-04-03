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

export const UserProfile = (props: UserProfileProps) => {
  const [profile, setProfile] = useState<any>();
  const [isDiscordConnected, setIsDiscordConnected] = useState(false);
  const points = [
    {tag: "python", points: 35},
    {tag: "web3", points: 35},
    {tag: "polygon", points: 13},
  ];

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

  if (!profile) {
    return <p>Loading...</p>;
  }

  const connectDiscord = () => {
    window.location.replace(getDiscordAuthUrl("user"));
  };

  return (
    <div className="w-full max-w-sm h-screen scrollbar-hide overflow-y-scroll">
      {/* user profile */}
      <div className="flex flex-col items-center my-12">
        <Image
          className={"rounded-2xl"}
          src={profile.platformAvatar}
          alt={`profile ${profile.platformUsername}`}
          width={126}
          height={126}
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

      {/* reputation */}
      <hr/>
      <div className="p-6">
        <p className="text-2xl">Reputation</p>

        <div className="my-4 rounded-md border bg-white text-gray-500">
          {points.map((point, index) => {
            return (
              <FlexRow key={index} classes={"justify-between p-2 border-b"}>
                <p>{point.tag}</p>
                <p>{`${point.points} pts`}</p>
              </FlexRow>
            );
          })}
        </div>
        <FlexRow classes={"justify-between"}>
          <p className="text-gray-500">Total Points</p>
          <p className="text-2xl text-right text-black">1,200</p>
        </FlexRow>
      </div>

      {/* communities */}
      <hr/>
      <div className="p-6">
        <p className="text-2xl"> Communities</p>
        <FlexColumn classes="mt-6 gap-6">
          {communities.data && communities.data.edges.map((community) => {
            return (
              <AvatarCard
                key={community.node.id}
                image={get(community, "node.socialPlatforms.edges[0].node.communityAvatar")}
                imageSize={44}
                name={get(community, "node.socialPlatforms.edges[0].node.communityName")}
              />
            )
          })}
        </FlexColumn>
      </div>
    </div>
  );
}
