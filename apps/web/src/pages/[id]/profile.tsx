import {AccentButton} from "../../components/Button";
import {Badge} from "../../components/Badge";
import {AvatarCard} from "../../components/AvatarCard";
import {useRouter} from "next/router";
import {Layout} from "../../components/Layout";
import {Back} from "../../components/Button/Back/Back";
import {useEffect, useState} from "react";
import {Tab} from "@headlessui/react";
import ThreadCard from "../../components/ThreadCard";
import * as utils from "../../utils";
import {FlexColumn, FlexRow} from "../../components/Flex";
import {trpc} from "../../utils/trpc";
import {isRight} from "../../utils/fp";

const Profile = () => {
  const router = useRouter();
  const address = router.query.id as string;
  const user = trpc.user.getUser.useQuery({address});
  const questions = trpc.public.fetchAllUserThreads.useQuery({address}).data;
  const [profile, setProfile] = useState<any>();
  const tabs = ["Questions", "Answers"];
  const [categories, setCategories] = useState({
    Questions: questions,
    Answers: [],
  });

  useEffect(() => {
    if (user.data && isRight(user.data)) {
      setProfile(user.data.value.userPlatforms[0]);
    }
  }, [user]);

  useEffect(() => {
    if (questions) {
      setCategories((prev) => {
        return {...prev, Questions: questions}
      });
    }
  }, [questions]);

  return (
    <Layout
      handleDiscordUser={() => {
      }}
      handleDidSession={() => {
      }}
    >
      <div className="flex flex-row">
        <div className="w-full h-screen border-x px-12">
          <div className="mt-14">
            <Back link={"/"}/>
            <FlexRow classes="mt-6  justify-between">
              <FlexRow>
                <AvatarCard image={profile && profile.platformAvatar} imageSize={76}/>
                <FlexColumn classes="ml-7 gap-2">
                  <span className="text-xl">{profile && profile.platformUsername}</span>
                  <Badge
                    text={utils.formatWalletAddress(address)}
                    onClick={() => {
                    }}
                  />
                </FlexColumn>
              </FlexRow>
              <FlexRow>
                <span>followers <br></br> 30,003</span>
                <AccentButton classes={"float-right ml-7"} title={"follow"} onClick={() => {
                }}/>
              </FlexRow>
            </FlexRow>
          </div>
          <div className="w-full px-2 py-16 sm:px-0">
            <Tab.Group>
              <Tab.List className="flex space-x-7 px-1 border-b">
                {tabs && tabs.map((name) => (
                  <Tab as={"div"} key={name} className={({selected}) =>
                    utils.classNames(
                      'cursor-pointer w-max px-1 py-2.5 text-sm font-medium leading-5 focus:outline-none',
                      selected
                        ? 'border-b-2 border-b-black hove:ring-0 '
                        : ''
                    )}
                  >
                    {name}
                  </Tab>
                ))}
              </Tab.List>
              <Tab.Panels className="mt-11">
                {Object.values(categories).map((threads, idx) => (
                  <Tab.Panel key={idx}>
                    <ul>
                      {threads && threads.map((thread, index) => (
                        <ThreadCard key={index} thread={thread.node}/>
                      ))}
                    </ul>
                  </Tab.Panel>
                ))}
              </Tab.Panels>
            </Tab.Group>
          </div>
        </div>
        <div className="max-w-sm w-full p-12">
          <p className="text-2xl">Communities</p>
          <FlexColumn classes="mt-6 gap-6">
            <AvatarCard image={undefined} imageSize={44} name={"Radicle"}/>
            <AvatarCard image={undefined} imageSize={44} name={"RedStar"}/>
          </FlexColumn>

          <hr className="my-6"/>
          <p className="mt-14 text-2xl">Reputation</p>
          <table className="mt-6 text-gray-500 w-full table-auto">
            <tbody>
            <tr>
              <td className="align-top">Topics</td>
              <td className="flex flex-col gap-1 items-end">
                <Badge text={"python-35pts"}/>
                <Badge text={"web-90pts"}/>
                <Badge text={"polygon-20pts"}/>
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
    </Layout>
  )
}

export default Profile;
