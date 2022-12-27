import { Layout } from "../components/Layout";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import Thread from "../components/Thread";
import Comment from "../components/Comment";
import { trpc } from "../utils/trpc";
import ThreadInformation from "../components/Thread/ThreadInformation";
import CommentInput from "../components/ThreadCard/CommentInput";

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

  return (
    <Layout>
      <main className="absolute inset-0 m-5 lg:m-0 lg:flex lg:gap-[50px]">
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
              <Thread data={thisThread} />
            </div>
            <div className="mt-[94px] pb-[40px]">
              <div className="border-b border-gray-200 pb-5 sm:pb-0"></div>
              <div className="mt-[40px] space-y-[40px]">
                {commentsForThread.map((item) => (
                  <Comment key={item.id} data={item} />
                ))}
              </div>
            </div>
            <div className="border-b border-gray-200 pb-5 sm:pb-0"></div>
            <CommentInput
              threadId={id}
              refresh={() => {
                allThreads.refetch();
                allComments.refetch();
              }}
            />
          </div>
        </div>

        {/* Right column */}
        <ThreadInformation allComments={allComments} />
      </main>
    </Layout>
  );
};

export default QuestionPage;
