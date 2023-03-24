import { type NextPage } from "next";
import { useEffect, useState } from "react";
import { Layout } from "../components/Layout";
import { toast } from "react-toastify";
import ThreadCard from "../components/ThreadCard";
import { useAccount } from "wagmi";
import { trpc } from "../utils/trpc";
import { Modal } from "../components/Modal";
import { useAppSelector } from "../store";
import { PrimaryButton } from "../components/Button";
import { CreateThread } from "../components/Thread";
import { AvatarCard } from "../components/AvatarCard";
import { get } from "lodash";
import Link from "next/link";

const Home: NextPage = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(true);
  const [questionModel, setQuestionModel] = useState(false);

  const communityId = useAppSelector(
    (state) => state.community.selectedCommunity
  );
  const didSession = useAppSelector((state) => state.user.didSession);
  const communityAndUserDetails = useAppSelector((state) => {
    const { user, community } = state;
    return {
      user,
      community,
    };
  });

  const threads = trpc.public.fetchAllCommunityThreads.useQuery({
    communityId,
  });

  useEffect(() => {
    if (threads.data && threads.data?.length >= 0 && loading) {
      setLoading(false);
    }
  }, [threads]);

  if (loading) {
    return <div>Loading...</div>;
  }

  const refetchThread = async () =>{
    await threads.refetch();
  }
  const handleQuestionModel = () => {
    const userId = communityAndUserDetails.user.id;
    const communityId = communityAndUserDetails.community.selectedCommunity;
    if (!address) {
      toast.error("Please connect with your wallet!");
      return;
    }
    if (!userId || !didSession) {
      toast.error("Please re-connect with your wallet!");
      return;
    }
    if (!communityId) {
      toast.error("Please select community");
      return;
    }
    setQuestionModel(true);
  };

  return (
    <Layout handleDiscordUser={() => {}} handleDidSession={() => {}}>
      <main className="h-full">
        <div className="pt-[50px]">
          <div className="flex w-full w-full justify-between items-center gap-[100px] border-b border-gray-200 pb-5 sm:pb-0">
            <div className="text-[48px] font-medium text-[#08010D]">
              <AvatarCard
                href={{
                  pathname: communityId ? `/[id]/community` : `/`,
                  query: { id: communityId },
                }}
                image={get(
                  communityAndUserDetails,
                  "community.communityAvatar"
                )}
                imageSize={45}
                name={get(communityAndUserDetails, "community.communityName")}
              />
            </div>
            <div className="hidden gap-[16px] lg:flex lg:w-max lg:items-end lg:justify-end">
              <PrimaryButton
                title={"Ask a question"}
                onClick={handleQuestionModel}
              />
              <Link href={{
                  pathname: communityId ? `/[id]/community` : `/#`,
                  query: { id: communityId },
                }} >
                <PrimaryButton title={"Community Profile"} onClick={() => {}} />
              </Link>
            </div>
          </div>
          <div className="flex flex-col space-y-[36px] py-[40px]">
            {threads.data &&
              threads.data.map((thread) => (
                <ThreadCard key={thread.node.id} thread={thread.node} />
              ))}
          </div>
        </div>
        <CreateThread
          title={"Ask Question"}
          open={questionModel}
          onClose={() => setQuestionModel(false)}
          did={communityAndUserDetails.user.did}
          user={communityAndUserDetails.user}
          community={communityAndUserDetails.community}
          didSession={didSession}
          refetch = {refetchThread}
        />
      </main>
    </Layout>
  );
};

export default Home;
