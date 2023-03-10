import {AvatarCard} from "../../components/AvatarCard";
import {useRouter} from "next/router";
import {Layout} from "../../components/Layout";
import {Back} from "../../components/Button/Back/Back";
import {useState} from "react";
import {Tab} from "@headlessui/react";
import ThreadCard from "../../components/ThreadCard";
import * as utils from "../../utils";
import {FlexRow} from "../../components/Flex";
import {Search} from "../../components/Search";
import {Chip} from "../../components/Chip";

const Profile = () => {
  const router = useRouter();
  const communityId = router.query.id as string;

  const tabs = ["Newest", "Active", "Unanswered"];

  let [categories] = useState({
    Newest: [
      {
        id: '1',
        title: 'Does drinking coffee make you smarter?',
        author: {id: '1'},
        createdAt: Date.now(),
      },
    ],
    Active: [
      {
        id: '1',
        title: 'Is tech making coffee better or worse?',
        author: {id: '1'},
        createdAt: Date.now(),
      },
    ],
    Unanswered: [
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
      handleDiscordUser={() => {
      }}
      handleDidSession={() => {
      }}
    >
      <div className="flex flex-row">
        <div className="w-full h-screen border-x px-12">
          <div className="mt-14">
            <Back link={"/"}/>
            <p className="text-4xl mt-5">Developer DAO</p>
          </div>
          <div className="w-full px-2 mt-7 pb-16 sm:px-0">
            <Tab.Group>
              <Tab.List className="flex space-x-7 px-1 border-b">
                {tabs && tabs.map((name) => (
                  <Tab as={"div"} key={name} className={({selected}) =>
                    utils.classNames(
                      'w-max px-1 py-2.5 text-sm font-medium leading-5',
                      selected
                        ? 'border-b-2 border-b-black hove:ring-0'
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
        </div>

        {/* right panel */}
        <div className="max-w-sm w-full p-12">
          <FlexRow classes="justify-between">
            <p className="text-2xl">Filters</p>
            <p className="cursor-pointer text-gray-500">Clear all</p>
          </FlexRow>

          <hr className="my-6"/>
          <p className="mt-10 mb-8 text-2xl">Tags</p>
          <Search barHeight={40} iconSize={20} onQuery={() => {
          }}/>
          <FlexRow classes="mt-4 mb-8 gap-2">
            <Chip text={"Solidity"}/>
            <Chip text={"Next.js"}/>
          </FlexRow>

          <hr className="my-6"/>
          <p className="mt-10 mb-8 text-2xl">Contributors</p>
          <Search barHeight={40} iconSize={20} onQuery={() => {
          }}/>
          <div className="my-4 border border-gray-300 font-light text-gray-500 rounded-md">
            <AvatarCard classes={"py-2 px-4 border-b"} image={undefined} imageSize={20} name={"abc.eth"}/>
            <AvatarCard classes={"py-2 px-4 border-b"} image={undefined} imageSize={20} name={"xyz.eth"}/>
            <AvatarCard classes={"py-2 px-4 border-b"} image={undefined} imageSize={20} name={"mnop.eth"}/>
            <AvatarCard classes={"py-2 px-4"} image={undefined} imageSize={20} name={"jkl.eth"}/>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Profile;
