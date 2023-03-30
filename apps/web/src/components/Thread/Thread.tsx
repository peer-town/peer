import {ThreadProps} from "./type";
import {FlexColumn, FlexRow} from "../Flex";
import Image from "next/image";

export const Thread = ({thread}: ThreadProps) => {
  const user = thread?.user?.userPlatforms[0];

  return (
    <div className="flex flex-row space-x-4">
      <div className="min-w-fit">
        <Image
          width={44}
          height={44}
          className="rounded-xl"
          src={user?.platformAvatar || "https://placekitten.com/200/200"}
          alt={`${user?.platformUsername} avatar`}
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
          <div className="text-md mt-4">
            {thread?.body}
          </div>
        </FlexColumn>
      </FlexColumn>
    </div>
  );
};
