import { AccentButton } from "../../components/Button";
import { Badge } from "../../components/Badge";
import { AvatarCard } from "../../components/AvatarCard";
import { useRouter } from "next/router";
import { Layout } from "../../components/Layout";
import { Back } from "../../components/Button/Back/Back";
import { useEffect, useState } from "react";
import { Tab } from "@headlessui/react";
import { ThreadCard } from "../../components/ThreadCard";
import * as utils from "../../utils";
import { FlexColumn, FlexRow } from "../../components/Flex";
import { trpc } from "../../utils/trpc";
import { has, get, constant } from "lodash";
import { getDiscordAuthUrl } from "../../utils";
import { NavBar } from "../../components/NavBar";
import { constants } from "../../config";

const Profile = () => {
  const router = useRouter();
  const address = router.query.id as string;
  const user = trpc.user.getUser.useQuery({ address });
  const questions = trpc.public.fetchAllUserThreads.useQuery({ address }).data;
  const [profile, setProfile] = useState<any>();
  const tabs = ["Questions", "Answers"];
  const [categories, setCategories] = useState({
    Questions: questions,
    Answers: [],
  });
  const [isDiscordConnected, setIsDiscordConnected] = useState(false);

  useEffect(() => {
    if (has(user, "data.value.userPlatforms[0]")) {
      setProfile(get(user, "data.value.userPlatforms[0]"));
      const platforms = get(user, "data.value.userPlatforms");
      const isDiscordPlatform = platforms?.filter(
        (platform) => platform.platformName === constants.PLATFORM_DISCORD_NAME
      )[0];
      if(isDiscordPlatform){
        setIsDiscordConnected(true);
      }
    }
  }, [user]);

  useEffect(() => {
    if (questions) {
      setCategories((prev) => {
        return { ...prev, Questions: questions };
      });
    }
  }, [questions]);

  const connectDiscord = () => {
    window.location.replace(getDiscordAuthUrl("user"));
  };

  return (
    <div className="flex min-h-screen flex-col">
      <NavBar />
      <div className="flex flex-row">
        <div className="h-screen w-full border-r px-12">
          <div className="mt-14">
            <Back link={"/"} />
            <FlexRow classes="mt-6  justify-between">
              <FlexRow>
                <AvatarCard
                  image={profile && profile.platformAvatar}
                  imageSize={76}
                />
                <FlexColumn classes="ml-7 gap-2">
                  <span className="text-xl">
                    {profile && profile.platformUsername}
                  </span>
                  <Badge
                    text={utils.formatWalletAddress(address)}
                    onClick={() => {}}
                  />
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
          <div className="w-full px-2 py-16 sm:px-0">
            <Tab.Group>
              <Tab.List className="flex space-x-7 border-b px-1">
                {tabs &&
                  tabs.map((name) => (
                    <Tab
                      as={"div"}
                      key={name}
                      className={({ selected }) =>
                        utils.classNames(
                          "w-max cursor-pointer px-1 py-2.5 text-sm font-medium leading-5 focus:outline-none",
                          selected
                            ? "hove:ring-0 border-b-2 border-b-black "
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
                    <ul className="flex flex-col space-y-[36px]">
                      {threads &&
                        threads.map((thread, index) => (
                          <ThreadCard key={index} thread={thread.node} />
                        ))}
                    </ul>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
        <div className="w-full max-w-sm p-12">
          {!isDiscordConnected && (
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
          <p className="text-2xl">Communities</p>
          <FlexColumn classes="mt-6 gap-6">
            <AvatarCard image={undefined} imageSize={44} name={"Radicle"} />
            <AvatarCard image={undefined} imageSize={44} name={"RedStar"} />
          </FlexColumn>

          <hr className="my-6" />
          <p className="mt-14 text-2xl">Reputation</p>
          <table className="mt-6 w-full table-auto text-gray-500">
            <tbody>
              <tr>
                <td className="align-top">Topics</td>
                <td className="flex flex-col items-end gap-1">
                  <Badge text={"python-35pts"} />
                  <Badge text={"web-90pts"} />
                  <Badge text={"polygon-20pts"} />
                </td>
              </tr>
              <tr>
                <td>Total Points</td>
                <td className="text-right text-black">1,200</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Profile;
