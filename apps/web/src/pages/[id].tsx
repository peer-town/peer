import { Layout } from "../components/Layout";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { Message } from "../components/Message";

import { trpc } from "../utils/trpc";

const tabs = [
  { name: "Top Rate", href: "#", current: true },
  { name: "Most Recent", href: "#", current: false },
  { name: "Oldest", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const QuestionPage = () => {
  const router = useRouter();
  const id = router.query.id as string;

  const allThreads = trpc.public.getAllThreads.useQuery();
  const allComments = trpc.public.getAllComments.useQuery();

  if (!allComments.data || !allThreads.data) return <div>Loading</div>;

  const thisThread = allThreads.data.filter((thread) => thread.node.id == id)[0]
    .node;
  const commentsForThread = allComments.data
    .filter((comment) => comment.node.threadID == id)
    .map((comment) => comment.node);

  console.log(thisThread);
  console.log(commentsForThread);

  return (
    <Layout>
      <main className="absolute inset-0 m-5 lg:m-0 lg:flex lg:gap-[50px]">
        {/* Main 3 column grid */}

        {/* Left column */}
        <div className="pt-[50px] lg:max-w-[75%] lg:border-r-[1px]">
          <Link href="/" legacyBehavior>
            <a className="flex w-fit items-center gap-[3px] text-[16px] font-[500] text-[#BAB2C4] hover:text-[#08010D]">
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
              <Message data={thisThread} />
            </div>
            <div className="mt-[94px] pb-[40px]">
              <div className="border-b border-gray-200 pb-5 sm:pb-0">
                <div className="mt-3 sm:mt-4">
                  <div className="sm:hidden">
                    <select
                      id="current-tab"
                      name="current-tab"
                      className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base text-[#08010D] focus:border-black focus:outline-none focus:ring-black sm:text-sm"
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
                              : "border-transparent text-[#08010D4D] hover:border-[#08010D] hover:text-[#08010D]",
                            "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium"
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
                {commentsForThread.reverse().map((item) => (
                  <Message key={item.id} data={item} />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="hidden lg:flex lg:h-full lg:min-w-[25%] lg:pt-[165px]">
          <div className="h-full w-full space-y-[35px]">
            <div className="text-[24px] text-[#08010D]">Thread Information</div>
            <hr className="border-[#EAEAEA]" />
            <div className="space-y-[30px]">
              <div className="text-[20px] text-[#08010D]">General</div>
              <div className="space-y-[24px] text-[16px] font-[500] text-[#7A767E]">
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
              <div className="space-y-[24px] text-[16px] font-[500] text-[#716D76]">
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
                  <div className="rounded-[15px] border-[1px] border-[#EBEAEB] bg-white py-[4px] px-[9px] text-[14px]">
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
                  <div className="rounded-[15px] border-[1px] border-[#EBEAEB] bg-white py-[4px] px-[9px] text-[14px]">
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
