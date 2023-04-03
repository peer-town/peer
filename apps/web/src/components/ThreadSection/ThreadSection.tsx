import {ThreadSectionProps} from "./types";
import {trpc} from "../../utils/trpc";
import {Thread} from "../Thread";
import {Comment} from "../Comment";
import {useRef, useState} from "react";
import {useAppSelector} from "../../store";
import {toast} from "react-toastify";
import {constants} from "../../config";
import {isRight} from "../../utils/fp";
import {Loader} from "../Loader";

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
  const comments = trpc.comment.fetchCommentsByThreadId.useQuery({
    threadId, first: 20, after: undefined
  });
  if (currentThread.isLoading) {
    return <Loader />;
  }

  const handleOnCommentSubmit = async () => {
    if (comment.length === 0) {
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
      await comments.refetch();
    } else {
      toast.error("Failed to post message. Try again in a while!");
    }
  }

  return (
    <div className="flex flex-col h-screen p-4">
      <div className="overflow-y-scroll h-screen py-4 scrollbar-hide">
        {currentThread.data?.node && <Thread thread={currentThread.data.node}/>}
        <div className="mt-[40px] space-y-[40px]">
          {comments.data && comments.data.edges.map((item) => (
            <Comment key={item.node.id} comment={item.node}/>
          ))}
        </div>
      </div>
      <div className="flex flex-row py-2 px-4 bottom-8 rounded-xl border h-auto bg-white mt-4">
        <textarea
          id="chat"
          ref={commentBoxRef}
          rows={1}
          className="block min-h-[50x] mx-4 p-2.5 w-full resize-none scrollbar-hide focus:outline-none"
          placeholder="Send message"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          onKeyUp={(event: any) => {
            const numberOfLineBreaks = (event.target.value.match(/\n/g) || []).length;
            // min-height + lines x line-height + padding + border
            const newHeight = 25 + numberOfLineBreaks * 20 + 12 + 1;
            if (commentBoxRef.current) {
              commentBoxRef.current.style.height = `${newHeight}px`;
            }
          }}
        />
        <button
          onClick={handleOnCommentSubmit}
          disabled={isCommenting}
          className="inline-flex h-max justify-center p-2 rounded-full cursor-pointer bg-gray-600 disabled:opacity-20">
          <SendIcon/>
        </button>
      </div>
    </div>
  );
}
