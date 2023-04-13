import {FlexColumn, FlexRow} from "../Flex";
import {showUserProfile, useAppDispatch} from "../../store";
import {AvatarCard} from "../AvatarCard";

export const Comment = ({comment}) => {
  const userId = comment?.user?.id;
  const user = comment?.user?.userPlatforms[0];
  const dispatch = useAppDispatch();

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
      <FlexColumn>
        <FlexRow classes="text-md text-gray-500 space-x-3">
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
        <div className="text-md mt-3">
          {comment?.text}
        </div>
      </FlexColumn>
    </div>
  );
};
