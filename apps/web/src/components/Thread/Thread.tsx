import {ThreadProps} from "./type";
import {FlexColumn, FlexRow} from "../Flex";
import {showUserProfile, useAppDispatch} from "../../store";
import {AvatarCard} from "../AvatarCard";
import {Markdown} from "../Markdown";
import {Badge} from "../Badge";
import {isEmpty, isNil} from "lodash";
import {mobile_title_font} from "../../styles/app_styles";

export const Thread = ({thread}: ThreadProps) => {
  const userId = thread?.user?.id;
  const tags = thread?.tags?.edges;
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
          <div className={`text-[36px] font-medium text-gray-700 ${mobile_title_font}`}>
            {thread?.title}
          </div>
          <div className="text-md mt-3 text-gray-500">
            <Markdown markdown={thread?.body}/>
          </div>
        </FlexColumn>
        <FlexRow classes={"mt-4 gap-2 flex-wrap"}>
          {tags && tags
            .slice(0, 4)
            .map((tag, index) => {
                if (isNil(tag.node) || isEmpty(tag.node)) {
                  return <Badge key={index} text={"no tags"}/>
                } else {
                  return <Badge key={index} text={tag.node.tag.tag}/>
                }
              }
            )
          }
        </FlexRow>
      </FlexColumn>
    </div>
  );
};
