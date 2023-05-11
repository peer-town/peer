import {FlexRow} from "../Flex";
import Image from "next/image";
import {Badge} from "../Badge";
import {CommunityCardProps} from "./types";
import * as utils from "../../utils";
import {md_screen_image, md_screen_wrapper, sm_screen_image, sm_screen_wrapper} from "./style";

export const CommunityCard = (props: CommunityCardProps) => {
  return (
    <div
      onClick={props.onClick}
      className={`flex flex-col-reverse h-full min-h-[246px] border hover:drop-shadow-xl rounded-2xl bg-white mx-auto ${md_screen_wrapper} ${sm_screen_wrapper}`}>
      <div className={"flex flex-col grow"}>
        <div className="flex flex-col justify-start px-6 py-7">
          <h2 className="mb-2 text-2xl font-medium line-clamp-1 break-all">
            {props.communityName}
          </h2>
          <p className="mb-4 text-gray-500 overflow-hidden max-h-[50px] break-all line-clamp-3">
            {props.about}
          </p>
          <FlexRow classes={"gap-2 flex-wrap"}>
            {props.tags && props.tags
              .slice(0, 4)
              .map((tag, index) =>
                <Badge key={index} text={tag}/>
              )
            }
          </FlexRow>
        </div>
        <hr/>
        <div className="flex flex-col px-6 py-4">
          <FlexRow classes={"gap-4 text-sm text-gray-500"}>
            <span>members: {utils.formatNumber(props.members)}</span>
            <span>questions: {utils.formatNumber(props.questions)}</span>
          </FlexRow>
        </div>
      </div>
      <Image
        className={`rounded-tr-2xl w-[100%] max-h-[auto]  border-l rounded-b-2xl object-cover ${md_screen_image} ${sm_screen_image}`}
        src={props.communityAvatar}
        width={229}
        height={0}
        alt="community avatar"/>
    </div>
  );
};
