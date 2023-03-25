import { AvatarCard } from "../../components/AvatarCard";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Back } from "../../components/Button/Back/Back";
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import ThreadCard from "../../components/ThreadCard";
import * as utils from "../../utils";
import { FlexColumn, FlexRow } from "../../components/Flex";
import { Search } from "../../components/Search";
import { Chip } from "../../components/Chip";
import { useAppSelector } from "../../store";
import { AccentButton } from "../../components/Button";
import { getDiscordAuthUrl } from "../../utils";
import { trpc, trpcProxy } from "../../utils/trpc";
import { get, has, isNil } from "lodash";
import { config } from "../../config";
import { toast } from "react-toastify";
import { NavBar } from "../../components/NavBar";

const Profile = () => {
  const [categories] = useState({
    Newest: [],
    Active: [],
    Unanswered: [],
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [image, setImage] = useState("");
  const [name, setName] = useState("");

  const state = useAppSelector((state) => ({
    community: state.community,
    user: state.user,
  }));
  const communityId = state.community.selectedCommunity;

  useEffect(() => {
    setImage(state.community.communityAvatar);
    setName(state.community.communityName);
    const checkCommunity = async () => {
      const communityNode =
        await trpcProxy.community.fetchCommunityUsingStreamId.query({
          streamId: communityId,
        });
      if (has(communityNode, "value.node.id")) {
        //below statement should be optimised . INstead checking 1st index of array it should be checked for discord paltform.It is just a fix for now.
        if (has(communityNode, "value.node.socialPlatforms.edges[1]")) {
          return;
        }
        const devnodePlatform = get(
          communityNode,
          "value.node.socialPlatforms.edges[0]"
        );
        const userStreamId = get(devnodePlatform, "node.userId");
        console.log(
          "userStreamId",
          userStreamId,
          "state.user.id",
          state.user.id
        );
        if (userStreamId === state.user.id) {
          setIsAdmin(true);
        }
      } else {
        window.location.replace(config.appHome);
      }
    };
    checkCommunity();
  }, [communityId]);

  const tabs = ["Newest", "Active", "Unanswered"];

  const connectDiscord = () => {
    if (isNil(communityId)) {
      toast.error("Can not connect with discord. Pleaes try after some time.");
      return;
    }

    window.location.replace(getDiscordAuthUrl("community"));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex flex-row">
        <div className="h-screen w-full border-x px-12">
          <div className="mt-14">
            <Back link={"/"} />
            <FlexRow classes="mt-6  justify-between">
              <FlexRow>
                <AvatarCard image={image} imageSize={76} />
                <FlexColumn classes="ml-7 gap-2">
                  <span className="text-4xl">{name && name}</span>
                </FlexColumn>
              </FlexRow>
              <FlexRow>
                <span>
                  followers <br></br> 30,003
                </span>
                <AccentButton
                  classes={"float-right ml-7"}
                  title={"follow"}
                  onClick={() => {}}
                />
              </FlexRow>
            </FlexRow>
          </div>
          <div className="mt-7 w-full px-2 pb-16 sm:px-0">
            <Tab.Group>
              <Tab.List className="flex space-x-7 border-b px-1">
                {tabs &&
                  tabs.map((name) => (
                    <Tab
                      as={"div"}
                      key={name}
                      className={({ selected }) =>
                        utils.classNames(
                          "w-max px-1 py-2.5 text-sm font-medium leading-5",
                          selected
                            ? "hove:ring-0 border-b-2 border-b-black"
                            : ""
                        )
                      }
                    >
                      {name}
                    </Tab>
                  ))}
              </Tab.List>
              <Tab.Panels className="mt-11">
                {Object.values(categories).map((threads, idx) => (
                  <Tab.Panel key={idx}>
                    <ul>
                      {threads.map((thread, index) => (
                        <ThreadCard key={index} thread={thread} />
                      ))}
                    </ul>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>

        {/* right panel */}
        <div className="w-full max-w-sm p-12">
          {isAdmin && (
            <>
              <FlexRow classes="justify-between">
                <AccentButton
                  classes="!bg-[#5865F2] !hover:bg-[#5865F2]"
                  title={"connect with discord"}
                  onClick={connectDiscord}
                />
              </FlexRow>
              <hr className="my-6" />
            </>
          )}
          <FlexRow classes="justify-between">
            <p className="text-2xl">Filters</p>
            <p className="cursor-pointer text-gray-500">Clear all</p>
          </FlexRow>

          <hr className="my-6" />
          <p className="mt-10 mb-8 text-2xl">Tags</p>
          <Search barHeight={40} iconSize={20} onQuery={() => {}} />
          <FlexRow classes="mt-4 mb-8 gap-2">
            <Chip text={"Solidity"} />
            <Chip text={"Next.js"} />
          </FlexRow>

          <hr className="my-6" />
          <p className="mt-10 mb-8 text-2xl">Contributors</p>
          <Search barHeight={40} iconSize={20} onQuery={() => {}} />
          <div className="my-4 rounded-md border border-gray-300 font-light text-gray-500">
            <AvatarCard
              classes={"py-2 px-4 border-b"}
              image={undefined}
              imageSize={20}
              name={"abc.eth"}
            />
            <AvatarCard
              classes={"py-2 px-4 border-b"}
              image={undefined}
              imageSize={20}
              name={"xyz.eth"}
            />
            <AvatarCard
              classes={"py-2 px-4 border-b"}
              image={undefined}
              imageSize={20}
              name={"mnop.eth"}
            />
            <AvatarCard
              classes={"py-2 px-4"}
              image={undefined}
              imageSize={20}
              name={"jkl.eth"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
