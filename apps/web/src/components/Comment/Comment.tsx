import {FlexColumn, FlexRow} from "../Flex";
import {showUserProfile, useAppDispatch} from "../../store";
import {AvatarCard} from "../AvatarCard";
import {DownVote, Spinner, UpVote} from "../Icons";
import {useState} from "react";
import * as utils from "../../utils";
import {Markdown} from "../Markdown";

interface CommentProps {
  comment: any;
  onUpVote(commentId: string): Promise<void>;
  onDownVote(commentId: string): Promise<void>;
}

export const Comment = (props: CommentProps) => {
  const {comment, onUpVote, onDownVote} = props;
  const userId = comment?.user?.id;
  const user = comment?.user?.userPlatforms[0];
  const absVotes = utils.getAbsVotes(comment?.votes);

  const dispatch = useAppDispatch();
  const [isUpVoting, setIsUpVoting] = useState(false);
  const [isDownVoting, setIsDownVoting] = useState(false);

  const handleUpVote = () => {
    setIsUpVoting(true);
    onUpVote(comment.id).finally(() => setIsUpVoting(false));
  }

  const handleDownVote = () => {
    setIsDownVoting(true);
    onDownVote(comment.id).finally(() => setIsDownVoting(false));
  }

  return (
    <div className="flex flex-row space-x-4">
      <div
        className="min-w-fit cursor-pointer"
        id="profile"
        onClick={() => {
          dispatch(showUserProfile({userProfileId: userId}));
        }}
      >
        <AvatarCard
          imageClasses="!rounded-xl"
          imageSize={44}
          image={user?.platformAvatar}
        />
      </div>
      <FlexColumn classes="space-y-3">
        <FlexRow classes="text-md text-gray-500 space-x-2">
          <div>{user?.platformUsername}</div>
          <div>&#8226;</div>
          <div>
            {new Date(comment?.createdAt).toLocaleDateString(
              'en-gb',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )}
          </div>
        </FlexRow>
        <div className="text-md">
          <Markdown markdown={comment?.text} />
        </div>
        <FlexRow classes="space-x-2 text-sm text-gray-500">
          {isUpVoting ? <Spinner/> : <UpVote onClick={handleUpVote}/>}
          <span>{utils.formatNumber(absVotes)}</span>
          {isDownVoting ? <Spinner/> : <DownVote onClick={handleDownVote}/>}
        </FlexRow>
      </FlexColumn>
    </div>
  );
};
