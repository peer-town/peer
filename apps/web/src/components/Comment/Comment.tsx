import {FlexRow} from "../Flex";
import {AvatarCard} from "../AvatarCard";

export const Comment = ({ comment }) => {
  const user = comment?.user?.userPlatforms[0];

  return (
    <div className="space-y-[15px]">
      <div className="flex items-center gap-[11px]">
        <FlexRow classes={"mt-4"}>
          <AvatarCard
            name={user?.platformUsername}
            image={user?.platformAvatar}
            imageSize={28}
            address={comment?.user.walletAddress}
          />
          <div className="text-sm ml-2 text-gray-400">
            {new Date(comment?.createdAt).toLocaleString()}
          </div>
        </FlexRow>
      </div>
      <div className="text-gray-500">
        {comment?.text}
      </div>
    </div>
  );
};
