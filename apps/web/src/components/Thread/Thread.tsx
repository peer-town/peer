import {ThreadProps} from "./type";
import {FlexColumn, FlexRow} from "../Flex";
import {showUserProfile, useAppDispatch} from "../../store";
import {AvatarCard} from "../AvatarCard";

export const Thread = ({thread}: ThreadProps) => {
  const userId = thread?.user?.id;
  const user = thread?.user?.userPlatforms[0];
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-row space-x-4">
      <div
        className="min-w-fit cursor-pointer"
        id="profile"
        onClick={() => {
          dispatch(showUserProfile({userProfileId: userId}));
        }}>
        <AvatarCard
          imageClasses="!rounded-xl"
          imageSize={44}
          image={user?.platformAvatar}
        />
      </div>
      <FlexColumn>
        <FlexRow classes="text-md text-gray-500 space-x-3">
          <div>{user?.platformUsername}</div>
          <div>&#8226;</div>
          <div>
            {new Date(thread?.createdAt).toLocaleDateString(
              'en-gb',
              {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }
            )}
          </div>
        </FlexRow>
        <FlexColumn>
          <div className="text-[36px] font-medium text-gray-700">
            {thread?.title}
          </div>
          <div className="text-md mt-3 text-gray-500">
            {thread?.body}
          </div>
        </FlexColumn>
      </FlexColumn>
    </div>
  );
};
