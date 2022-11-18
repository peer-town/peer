import { type NextPage } from "next";
import { Layout } from "../components/Layout";
import { QuestionCard } from "../components/QuestionCard";

import { trpc } from "../utils/trpc";

const tabs = [
  { name: "Newest", href: "#", current: true },
  { name: "Active", href: "#", current: false },
  { name: "Unanswered", href: "#", current: false },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

const Home: NextPage = () => {
  const threads = trpc.public.getAllThreads.useQuery();

  if (!threads.data) return <div>Loading...</div>;

  return (
    <Layout>
      <main className="h-full">
        <div className="pt-[50px]">
          <div className="space-y-[50px] border-b border-gray-200 pb-5 sm:pb-0">
            <div className="text-[48px] font-medium text-[#08010D]">
              Discover
            </div>
            <div className="mt-3 sm:mt-4">
              <div className="sm:hidden">
                <select
                  id="current-tab"
                  name="current-tab"
                  className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base text-[#08010D] focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                  defaultValue={tabs.find((tab) => tab.current)?.name}
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
                          : "border-transparent text-[#08010D4D] hover:border-gray-300 hover:text-gray-700",
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
          <div className="space-y-[36px] py-[40px]">
            {threads.data.map((thread) => (
              <QuestionCard key={thread.id} thread={thread.node} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
