import { FlexColumn } from "../Flex";
import {ContentCardProps} from "./types";

export const ContentCard = (props: ContentCardProps) => {
  const { title, body, onClick } = props;

  return (
    <div id="content-card" className="rounded-2xl border bg-white p-4 hover:border-gray-300" onClick={onClick}>
      <FlexColumn classes="gap-1">
        <div className="text-md line-clamp-2">{title}</div>
        <div className="text text-gray-500 line-clamp-2">{body}</div>
      </FlexColumn>
    </div>
  );
};
