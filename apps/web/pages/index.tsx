import { Layout } from "../components/Layout";
import { QuestionCard } from "../components/QuestionCard";

const tabs = [
  { name: "Newest", href: "#", current: true },
  { name: "Active", href: "#", current: false },
  { name: "Unanswered", href: "#", current: false },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

const questions = [
  {
    id: 1,
    title: "How do I center div?",
    body: "I have a  div with two images and an  h1 . All of them need to be vertically aligned within the  div , next to each other. One of the images needs to be absolute positioned within the  div. What is the CSS needed for this to work on all browsers? ",
    author: {
      avatar: "./pp.png",
      name: "jazza.eth",
    },
    timePassed: "44 min",
    datePosted: "31st Jan 2021",
    likes: 102,
    comments: 4,
  },
  {
    id: 2,
    title: "How do I tie my shoelaces?",
    body: "I have a  div with two images and an  h1 . All of them need to be vertically aligned within the  div , next to each other. One of the images needs to be absolute positioned within the  div. What is the CSS needed for this to work on all browsers? ",
    author: {
      avatar: "./pp.png",
      name: "jazza.eth",
    },
    timePassed: "4 hours",
    datePosted: "1st Feb 2020",
    likes: 1,
    comments: 4,
  },
  {
    id: 3,
    title: "Hardhat install issues",
    body: "I have a  div with two images and an  h1 . All of them need to be vertically aligned within the  div , next to each other. One of the images needs to be absolute positioned within the  div. What is the CSS needed for this to work on all browsers? ",
    author: {
      avatar: "./pp.png",
      name: "jazza.eth",
    },

    timePassed: "7 hours",
    datePosted: "4th May 2018",
    likes: 32,
    comments: 4,
  },
];

const index = () => {
  return (
    <Layout>
      <main className="h-full">
        <div className="pt-[50px]">
          <div className="pb-5 border-b border-gray-200 space-y-[50px] sm:pb-0">
            <div className="text-[48px] text-[#08010D] font-medium">
              Discover
            </div>
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
                          : "border-transparent text-[#08010D4D] hover:text-gray-700 hover:border-gray-300",
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
          <div className="py-[40px] space-y-[36px]">
            {questions.map((data) => (
              <QuestionCard key={data.id} question={data} />
            ))}
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default index;
