import { FlexColumn, FlexRow } from "../Flex";
import { AvatarCard } from "../AvatarCard";
import { get } from "lodash";
import { ThreadCardProps } from "./types";

export const ThreadCard = (props: ThreadCardProps) => {
  const { id, title, body, createdAt, user } = props.thread;

  return (
    <div className="rounded-2xl border bg-white p-4" onClick={props.onClick}>
      <FlexColumn classes="gap-2">
        <div className="text-xl line-clamp-2">{title}</div>
        <div className="text-gray-500 line-clamp-2">{body}</div>
        <FlexRow classes="text-sm gap-3">
          <AvatarCard
            imageSize={20}
            image={get(user, "userPlatforms[0].platformAvatar")}
            name={get(user, "userPlatforms[0].platformUsername")}
          />
          <div>&#8226;</div>
          <div>
            {new Date(createdAt).toLocaleDateString("en-gb", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </FlexRow>
      </FlexColumn>
    </div>
  );
};
