import {ThreadProps} from "./type";
import {AvatarCard} from "../AvatarCard";
import {FlexRow} from "../Flex";

export const Thread = ({thread}: ThreadProps) => {
  const user = thread?.user?.userPlatforms[0];

  return (
    <div className="">
      <div className="text-[36px] font-medium text-gray-700">
        {thread?.title}
      </div>
      <FlexRow classes={"mt-4"}>
        <AvatarCard
          name={user?.platformUsername}
          image={user?.platformAvatar}
          imageSize={28}
          address={thread?.user.walletAddress}
        />
        <div className="text-sm ml-2 text-gray-400">
          {new Date(thread?.createdAt).toLocaleString()}
        </div>
      </FlexRow>
      <div className="text-gray-500 mt-12">
        {thread?.body}
      </div>
    </div>
  );
};
