import {AccentButton} from "../../components/Button";
import {Badge} from "../../components/Badge";
import {AvatarCard} from "../../components/AvatarCard";
import {useRouter} from "next/router";
import {Layout} from "../../components/Layout";
import {Back} from "../../components/Button/Back/Back";
import {useState} from "react";
import {Tab} from "@headlessui/react";
import ThreadCard from "../../components/ThreadCard";
import * as utils from "../../utils";
import {FlexColumn, FlexRow} from "../../components/Flex";

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const Profile = () => {
  const router = useRouter();
  const profileId = router.query.id as string;

  const tabs = ["All", "Questions", "Answers"];

  let [categories] = useState({
    All: [
      {
        id: '1',
        title: 'Does drinking coffee make you smarter?',
        author: {id: '1'},
        createdAt: Date.now(),
      },
    ],
    Questions: [
      {
        id: '1',
        title: 'Is tech making coffee better or worse?',
        author: {id: '1'},
        createdAt: Date.now(),
      },
    ],
    Answers: [
      {
        id: '1',
        title: 'Ask Me Anything: 10 answers to your questions about coffee',
        author: {id: '1'},
        createdAt: Date.now(),
      },
    ],
  })

  return (
    <Layout
      handleDiscordUser={() => {}}
      handleDidSession={() => {}}
    >
      <div className="mt-14">
        <Back link={"/"}/>
        <FlexRow classes="mt-6  justify-between">
          <FlexRow>
            <AvatarCard image={undefined} imageSize={76}/>
            <FlexColumn classes="ml-7 gap-2">
              <span className="text-xl">Atul Patare</span>
              <Badge
                text={utils.formatWalletAddress("0x7c98C2DEc5038f00A2cbe8b7A64089f9c0b51991")}
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
          <Tab.List className="flex space-x-7 p-1">
            {tabs && tabs.map((name) => (
              <Tab key={name} className={({selected}) =>
                classNames(
                  'w-max px-1 py-2.5 text-sm font-medium leading-5',
                  selected
                    ? 'border-b-2 border-black rounded-t-lg'
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
                  {threads.map((thread, index) => (
                    <ThreadCard key={index} thread={thread}/>
                  ))}
                </ul>
              </Tab.Panel>
            ))}
          </Tab.Panels>
        </Tab.Group>
      </div>

    </Layout>
  )
}

export default Profile;
