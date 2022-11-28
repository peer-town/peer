import { type NextPage } from "next";
import { Layout } from "../components/Layout";
import NewThread from "../components/Thread/NewThread";
import ThreadCard from "../components/ThreadCard";

import { trpc } from "../utils/trpc";

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
          </div>
          <div className="flex flex-col space-y-[36px] py-[40px]">
            {threads.data.map((thread) => (
              <ThreadCard key={thread.id} thread={thread.node} />
            ))}
          </div>

          <div className="flex flex-col space-y-[36px] py-[40px]">
            <NewThread
              refresh={() => {
                threads.refetch();
              }}
            />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Home;
