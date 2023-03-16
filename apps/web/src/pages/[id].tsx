import {Layout} from "../components/Layout";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {Thread} from "../components/Thread";
import {Comment} from "../components/Comment";
import {trpc} from "../utils/trpc";
import ThreadInformation from "../components/Thread/ThreadInformation";
import {Back} from "../components/Button/Back/Back";
import {SecondaryButton} from "../components/Button/SecondaryButton";
import {useAccount} from "wagmi";
import {get, has} from "lodash";
import {toast} from "react-toastify";
import useLocalStorage from "../hooks/useLocalStorage";
import {constants} from "../config";
import {isRight} from "../utils/fp";
import {DIDSession} from "did-session";
import {config} from "../config";

const QuestionPage = () => {
  const router = useRouter();
  const threadId = router.query.id as string;
  const {address} = useAccount();
  const [did, setDid] = useState("");
  const [didSession] = useLocalStorage("didSession", "");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [canComment, setCanComment] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);

  const currentThread = trpc.public.fetchThreadDetails.useQuery({threadId});
  const currentUser = trpc.user.getUser.useQuery({address});
  const createComment = trpc.comment.createComment.useMutation();

  // todo: replace this with updated aggregator call
  const authorPlatformDetails = trpc.public.getAuthorDiscord.useQuery({
    address: address,
  });
  const discordUserName = authorPlatformDetails.data?.platformUsername ;

  useEffect(() => {
    const loadSession = async () => {
      if (didSession) {
        const session = await DIDSession.fromSession(didSession);
        setDid(session.did.id);
      }
    };
    loadSession().catch(console.log);
  }, [didSession]);

  useEffect(() => {
    if (currentThread.data && currentThread.data.node) {
      setLoading(false);
    }
  }, [currentThread])

  if (loading) {
    return <div>Loading...</div>;
  }

  const thisThread = currentThread.data.node;
  const commentsForThread = thisThread.comments.edges;

  const handleOnAnswerClick = () => {
    if (has(currentUser, "data.value.id")) {
      setCanComment(true);
    } else {
      toast.warn("You need an account to post a comment");
    }
  }

  const handleOnCommentSubmit = async () => {
    if (comment.length === 0) {
      toast.warn("Comment cannot be empty");
      return;
    }
    if (!has(currentUser, "data.value.id")) {
      return;
    }

    setIsCommenting(true);
    const result = await createComment.mutateAsync({
      session: didSession,
      threadId: threadId,
      userId: get(currentUser, "data.value.id"),
      comment: comment,
      createdFrom: constants.CREATED_FROM_DEVNODE,
      createdAt: new Date().toISOString()
    }).finally(() => setIsCommenting(false));

    if (isRight(result)) {
      setComment("");
      toast.success("Comment posted successfully!");
      await currentThread.refetch();
      await handleWebToAggregator();
    } else {
      toast.error("Failed to post message. Try again in a while!");
    }
  }

  const handleWebToAggregator = async () => {
    const endpoint = `${config.aggregator.endpoint}/webcomment`;
    await fetch(endpoint, {
        body: JSON.stringify({
          threadId: threadId,
          comment: String(comment),
          discordUserName: String(discordUserName),
          didSession:String(didSession),
          platformId: authorPlatformDetails.data.platformId,
        }),
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }

  return (
    <Layout
      handleDiscordUser={() => {}}
      handleDidSession={() => {}}
    >
      <main className="absolute inset-0 m-5 lg:m-0 lg:flex">
        <div className="pt-[50px] px-12 lg:w-full lg:border-r-[1px]">
          <Back link={"/"}/>
          <div className="mt-[80px]">
            <div>
              {thisThread && <Thread thread={thisThread}/>}
            </div>
            {
              canComment ?
                <div className="block w-full bg-white my-12">
                  <div className="text-xs text-gray-400">Posting as {did}</div>
                  <div className="form-group mb-6">
                      <textarea
                        className="form-control block w-full min-h-[120px] rounded-[10px] border border-solid border-gray-400 bg-white bg-clip-padding px-3 py-1.5 text-base font-normal text-gray-700 focus:border-gray-600 focus:bg-white focus:text-gray-700 focus:outline-none"
                        placeholder="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                    <SecondaryButton
                      classes={"ml-auto mt-4"}
                      loading={isCommenting}
                      title={isCommenting ? "Posting..." : "Post Comment"}
                      onClick={handleOnCommentSubmit}
                    />
                  </div>
                </div>
                :
                <SecondaryButton classes={"ml-auto my-8"} title={"Answer question"} onClick={handleOnAnswerClick}/>
            }

            {/* comments section */}
            <hr className="border-[#EAEAEA]"/>
            <div className="pb-[40px]">
              <div className="mt-[40px] space-y-[40px]">
                {commentsForThread && commentsForThread?.length > 0 && commentsForThread.map((item) => (
                  <Comment key={item.node.id} comment={item.node}/>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* right panel */}
        <div className="max-w-sm w-full pl-12">
          <ThreadInformation comments={commentsForThread}/>
        </div>
      </main>
    </Layout>
  );
};

export default QuestionPage;
