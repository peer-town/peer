import { Layout } from "../components/Layout";
import Link from "next/link";
import Image from "next/image";
import { Message } from "../components/Message";

const tabs = [
  { name: "Top Rate", href: "#", current: true },
  { name: "Most Recent", href: "#", current: false },
  { name: "Oldest", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const question = {
  id: 1,
  author: {
    avatar: "/Hardrock.png",
    username: "Hard Rock Nick",
    walletAddress: "0x45..eed",
  },
  likes: 247,
  message:
    "I have a  div with two images and an  h1 . All of them need to be vertically aligned within the  div , next to each other. One of the images needs to be absolute positioned within the   div. What is the CSS needed for this to work on common browsers?",
};

const comments = [
  {
    id: 1,
    author: {
      avatar: "/nas.png",
      username: "nas",
      walletAddress: "nas.eth",
    },
    likes: 17,
    timePassed: "3 hours ago",
    message:
      "Just use a one-cell table inside the div! Just set the cell and table height and with to 100% and you can use the vertical-align. A one-cell table inside the div handles the vertical-align and is backward compatible back to the Stone Age!",
  },

  {
    id: 1,
    author: {
      avatar: "/Hardrock.png",
      username: "Hard Rock Nick",
      walletAddress: "0x45..ed",
    },
    likes: 17,
    timePassed: "3 hours ago",
    message:
      "Just use a one-cell table inside the div! Just set the cell and table height and with to 100% and you can use the vertical-align. A one-cell table inside the div handles the vertical-align and is backward compatible back to the Stone Age!",
  },
];

const QuestionPage = () => {
  return (
    <Layout>
      <main className="m-5 absolute inset-0 lg:m-0 lg:flex lg:gap-[50px]">
        {/* Main 3 column grid */}

        {/* Left column */}
        <div className="pt-[50px] lg:border-r-[1px] lg:max-w-[75%]">
          <Link href="/">
            <a className="w-fit text-[#BAB2C4] text-[16px] font-[500] flex items-center gap-[3px] hover:text-[#08010D]">
              <svg
                className="h-[20px] w-[20px]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M0 0h24v24H0z" stroke="none" />
                <path d="M5 12h14M5 12l4 4M5 12l4-4" />
              </svg>
              Back
            </a>
          </Link>
          <div className="mt-[80px] lg:mr-[50px]">
            <div>
              <Message data={question} />
            </div>
            <div className="mt-[94px] pb-[40px]">
              <div className="pb-5 border-b border-gray-200 sm:pb-0">
                <div className="mt-3 sm:mt-4">
                  <div className="sm:hidden">
                    <select
                      id="current-tab"
                      name="current-tab"
                      className="block w-full pl-3 pr-10 py-2 text-base text-[#08010D] border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                      defaultValue={tabs.find((tab) => tab.current).name}
                    >
                      {tabs.map((tab) => (
                        <option key={tab.name}>{tab.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="hidden sm:block">
                    <nav className="-mb-px flex space-x-8">
                      {tabs.map((tab) => (
                        <a
                          key={tab.name}
                          href={tab.href}
                          className={classNames(
                            tab.current
                              ? "border-black  text-[#08010D]"
                              : "border-transparent text-[#08010D4D] hover:text-[#08010D] hover:border-[#08010D]",
                            "whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm"
                          )}
                          aria-current={tab.current ? "page" : undefined}
                        >
                          {tab.name}
                        </a>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
              <div className="mt-[40px] space-y-[40px]">
                {comments.map((item) => (
                  <Message key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="hidden lg:pt-[165px] lg:min-w-[25%] lg:h-full lg:flex">
          <div className="h-full w-full space-y-[35px]">
            <div className="text-[24px] text-[#08010D]">Thread Information</div>
            <hr className="border-[#EAEAEA]" />
            <div className="space-y-[30px]">
              <div className="text-[20px] text-[#08010D]">General</div>
              <div className="text-[16px] text-[#7A767E] font-[500] space-y-[24px]">
                <div className="flex justify-between">
                  <div>Status</div>
                  <div className="text-[#211F31]">Answered</div>
                </div>
                <div className="flex justify-between">
                  <div>Started</div>
                  <div className="text-[#211F31]">23rd Feb 2022</div>
                </div>
                <div className="flex justify-between">
                  <div>Last active</div>
                  <div className="text-[#211F31]">4 hours ago</div>
                </div>
                <div className="flex justify-between">
                  <div>Views</div>
                  <div className="text-[#211F31]">1.3K</div>
                </div>
              </div>
            </div>
            <hr className="border-[#EAEAEA]" />
            <div className="space-y-[30px]">
              <div className="text-[20px] text-[#08010D]">Contributors</div>
              <div className="text-[16px] text-[#716D76] font-[500] space-y-[24px]">
                <div className="flex items-center gap-[11px]">
                  <div className="flex items-center">
                    <Image
                      width="28"
                      height="28"
                      src="/Hardrock.png"
                      alt="Hard Rock Nick Profile Picture"
                    />
                  </div>
                  <div className="text-[#211F31]">Hard Rock Nick</div>
                  <div className="py-[4px] px-[9px] text-[14px] bg-white border-[#EBEAEB] border-[1px] rounded-[15px]">
                    0x45..eed
                  </div>
                </div>
                <div className="flex items-center gap-[11px]">
                  <div className="flex items-center">
                    <Image
                      width="28"
                      height="28"
                      src="/nas.png"
                      alt="Nas Profile Picture"
                    />
                  </div>
                  <div className="text-[#211F31]">Nas</div>
                  <div className="py-[4px] px-[9px] text-[14px] bg-white border-[#EBEAEB] border-[1px] rounded-[15px]">
                    Nas.eth
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default QuestionPage;
