import {FlexRow} from "../Flex";
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
import {Badge} from "../Badge";
import {ContentCard} from "../ContentCard";
import {CloseIcon} from "../Icons";
import {UserThreadList} from "../../sections/UserThreadList/UserThreadList";
import Link from "next/link";
import AddRepoModal from "../Modal/AddRepoModal/AddRepoModal";
import {UserRepoList} from "../../sections/UserRepoList/UserRepoList";

export const UserProfile = (props: UserProfileProps) => {
  const [profile, setProfile] = useState<any>();
  const [isUserThreadListOpen, setUserThreadListOpen] = useState<boolean>(false);
  const [isUserRepoListOpen, setUserRepoListOpen] = useState<boolean>(false);
  const [isDiscordConnected, setIsDiscordConnected] = useState(false);
  const [openAddRepoModal, setOpenAddRepoModal] = useState(false);
  const points = [
    {tag: "python", points: 35},
    {tag: "web3", points: 35},
    {tag: "polygon", points: 13},
  ];

  const dispatch = useAppDispatch();
  const user = trpc.user.getUserByStreamId.useQuery({streamId: props.userStreamId});
  const communities = trpc.user.getUserCommunities.useQuery({streamId: props.userStreamId});
  const userThreads = trpc.user.getUserThreads.useQuery({last: 2, authorId: get(user, "data.value.author.id")});
  const userRepos = trpc.radicle.fetchRepo.useQuery({first: 20, authorId: get(user, "data.value.author.id")});

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

  const handleOnRepoAdded = () => {
    setOpenAddRepoModal(false);
    user.refetch();
    userRepos.refetch();
  }

  return (
    <div className="w-full h-screen scrollbar-hide overflow-y-scroll">
      {/* user profile */}
      <button
        className="p-4"
        onClick={() => dispatch(clearUserProfile())}
      >
        <CloseIcon/>
      </button>
      <div className="flex flex-row items-center m-4 gap-2">
        <Image
          className={"rounded-2xl border"}
          src={profile.platformAvatar}
          alt={`profile ${profile.platformUsername}`}
          width={85}
          height={85}
          style={{width: 85, height: 85}}
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
      <div className="p-4">
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
      <div className="p-4">
        <p className="text-xl font-medium">Reputation</p>
        <FlexRow classes={"flex-wrap gap-2 my-4 bg-white text-gray-500"}>
          {points.map((point, index) => {
            return (
              <Badge key={index} text={`${point.tag} ${point.points} pts`}/>
            );
          })}
        </FlexRow>
        <FlexRow classes={"justify-between"}>
          <p className="text-gray-500 font-semibold">Total Points</p>
          <p className="text-2xl text-right text-black">1,200</p>
        </FlexRow>
      </div>
      <hr/>

      {/* user threads */}
      <div className="p-4">
        <FlexRow classes={"gap-4"}>
          <p className="text-xl font-medium">Questions</p>
          <p className="text-lg text-gray-500">{get(user, "data.value.threadCount")}</p>
          <p
            className="text-sm text-gray-400 hover:text-gray-600 ml-auto cursor-pointer"
            onClick={() => setUserThreadListOpen(true)}
          >
            see more
          </p>
        </FlexRow>
        <div className="flex flex-col gap-2 mt-2">
          {userThreads.data?.edges?.map((thread) => (
            <Link
              key={thread.node.id}
              href={{
                pathname: "/community",
                query: {
                  communityId: thread.node.communityId,
                  threadId: thread.node.id,
                },
              }}
            >
              <ContentCard key={thread.node.id} title={thread.node.title} body={thread.node.body}/>
            </Link>
          ))}
        </div>
      </div>

      {/* radicle integration */}
      <hr/>
      <div className="p-4">
        <FlexRow classes={"gap-4"}>
          <p className="text-xl font-medium">Repos</p>
          <p className="text-lg text-gray-500">{get(user, "data.value.userRepoCount")}</p>
          <p
            className="text-sm text-gray-400 hover:text-gray-600 ml-auto cursor-pointer"
            onClick={() => setOpenAddRepoModal(true)}
          >
            add new
          </p>
          <p
            className="text-sm text-gray-400 hover:text-gray-600 cursor-pointer"
            onClick={() => setUserRepoListOpen(true)}
          >
            see more
          </p>
        </FlexRow>
        <FlexRow classes={"flex-wrap gap-2 my-4 bg-white text-gray-500"}>
          {userRepos.data?.edges?.map((repo) => (
            <ContentCard key={repo.node.id} title={repo.node.name} subtitle={repo.node.radId} body={repo.node.description}/>
          ))}
        </FlexRow>
      </div>
      <hr/>

      <AddRepoModal
        open={openAddRepoModal}
        onClose={() => setOpenAddRepoModal(false)}
        onDone={handleOnRepoAdded}
        title="add repo"
      />

      <UserThreadList
        open={isUserThreadListOpen}
        authorId={get(user, "data.value.author.id")}
        onClose={() => setUserThreadListOpen(false)}
      />

      <UserRepoList
        open={isUserRepoListOpen}
        authorId={get(user, "data.value.author.id")}
        onClose={() => setUserRepoListOpen(false)}
      />
    </div>
  );
}
