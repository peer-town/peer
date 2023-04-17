import {ThreadSectionProps} from "./types";
import {trpc} from "../../utils/trpc";
import {Thread} from "../../components/Thread";
import {Comment} from "../../components/Comment";
import {useRef, useState} from "react";
import {useAppSelector} from "../../store";
import {toast} from "react-toastify";
import {constants} from "../../config";
import {isRight} from "../../utils/fp";
import {Loader} from "../../components/Loader";
import {LoadMore} from "../../components/Button/LoadMore";
import {get, has, isNil} from "lodash";

const SendIcon = () => {
  return (
    <svg aria-hidden="true" className="w-6 h-6 rotate-90" fill="white" viewBox="0 0 20 20"
         xmlns="http://www.w3.org/2000/svg">
      <path
        d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"></path>
    </svg>
  );
}

export const ThreadSection = (props: ThreadSectionProps) => {
  const threadId = props.threadId;
  const user = useAppSelector((state) => state.user);

  const commentBoxRef = useRef<HTMLTextAreaElement>(null);
  const [comment, setComment] = useState("");
  const [isCommenting, setIsCommenting] = useState(false);

  const currentThread = trpc.public.fetchThreadDetails.useQuery({threadId});
  const createComment = trpc.comment.createComment.useMutation();
  const upVoteComment = trpc.comment.upVoteComment.useMutation();
  const downVoteComment = trpc.comment.downVoteComment.useMutation();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    refetch
    // @ts-ignore
  } = trpc.comment.fetchCommentsByThreadId.useInfiniteQuery({
      threadId: threadId,
      first: 20,
    },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage?.pageInfo.hasNextPage)
          return lastPage?.pageInfo.endCursor;
        return undefined;
      },
    }
  );

  if (currentThread.isLoading) {
    return <Loader/>;
  }

  const handleOnSend = () => {
    handleOnCommentSubmit().finally(() => {
      // setting default height for comment box
      if (commentBoxRef.current) {
        commentBoxRef.current.style.height = `20px`;
      }
    });
  }

  const handleOnCommentSubmit = async () => {
    if (comment.trim().length === 0) {
      toast.warn("Comment cannot be empty");
      return;
    }
    if (!user.id || !user.didSession) {
      toast.warn("Please login to send a comment");
      return;
    }

    setIsCommenting(true);
    const result = await createComment.mutateAsync({
      session: user.didSession,
      threadId: threadId,
      userId: user.id,
      comment: comment,
      createdFrom: constants.CREATED_FROM_DEVNODE,
      createdAt: new Date().toISOString()
    }).finally(() => setIsCommenting(false));

    if (isRight(result)) {
      setComment("");
      toast.success("Comment posted successfully!");
      await refetch();
    } else {
      toast.error("Failed to post message. Try again in a while!");
    }
  }

  const handleUpVote = async (commentId: string) => {
    if (!has(user, "id") || isNil(get(user, "didSession")) || isNil(get(user, "author.id"))) {
      toast.error("Please re-connect with your wallet!");
      return;
    }
    const result = await upVoteComment.mutateAsync({
      session: get(user, "didSession"),
      userId: get(user, "id"),
      userAuthorId: get(user, "author.id"),
      commentId: commentId,
    });
    if (isRight(result)) {
      await refetch();
    } else {
      toast.error("Up vote failed to add");
    }
  }

  const handleDownVote = async (commentId: string) => {
    if (!has(user, "id") || isNil(get(user, "didSession")) || isNil(get(user, "author.id"))) {
      toast.error("Please re-connect with your wallet!");
      return;
    }
    const result = await downVoteComment.mutateAsync({
      session: get(user, "didSession"),
      userId: get(user, "id"),
      userAuthorId: get(user, "author.id"),
      commentId: commentId,
    });
    if (isRight(result)) {
      await refetch();
    } else {
      toast.error("Down vote failed to add");
    }
  }

  return (
    <div className="flex flex-col h-full px-4">
      <div className="overflow-y-scroll h-full py-4 scrollbar-hide box-border ">
        {currentThread.data?.node && <Thread thread={currentThread.data.node}/>}
        <div className="mt-[40px] space-y-[40px] mb-[120px]">
          {data?.pages?.map((page) => (
            page?.edges.map((item) => (
              <Comment
                key={item.node.id}
                comment={item.node}
                currentUserId={get(user, "id")}
                onUpVote={handleUpVote}
                onDownVote={handleDownVote}
              />
            ))
          ))}
          <LoadMore
            title={"Load more comments"}
            isFetching={isFetching}
            hasNextPage={hasNextPage}
            next={fetchNextPage}
          />
        </div>
      </div>
      <div className="relative pb-[20px] h-auto bg-[#FBFBFB] mt-4 w-full">
      <div className="flex flex-row py-2 px-4 rounded-xl bg-white border h-auto items-center">
        <textarea
          id="chat"
          ref={commentBoxRef}
          spellCheck={true}
          rows={1}
          className="block min-h-[20px] max-h-72 mx-4 w-full resize-none scrollbar-hide focus:outline-none"
          placeholder="Send message"
          value={comment}
          onChange={(e) => {
            setComment(e.target.value);
            const numberOfLineBreaks = (e.target.value.match(/\n/g) || []).length;
            // min-height + lines x line-height + padding + border
            const newHeight = 20 + numberOfLineBreaks * 20;
            if (commentBoxRef.current) {
              commentBoxRef.current.style.height = `${newHeight}px`;
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              handleOnSend();
            }
          }}
        />
          <button
            onClick={handleOnSend}
            disabled={isCommenting}
            className="inline-flex h-max justify-center p-2 rounded-full cursor-pointer bg-gray-600 disabled:opacity-20">
            <SendIcon/>
          </button>
        </div>
      </div>
    </div>
  );
}
