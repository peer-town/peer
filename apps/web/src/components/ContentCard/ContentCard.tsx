import { FlexColumn } from "../Flex";
import {ContentCardProps} from "./types";

export const ContentCard = (props: ContentCardProps) => {
  const { title, body, subtitle, onClick } = props;

  return (
    <div id="content-card" className="rounded-2xl w-full border bg-white p-4 hover:border-gray-300" onClick={onClick}>
      <FlexColumn classes="gap-1">
        <div className="text-md text-gray-800 line-clamp-2">{title}</div>
        {subtitle && <div className="text-sm line-clamp-2">{subtitle}</div>}
        <div className="text text-gray-500 line-clamp-2">{body}</div>
      </FlexColumn>
    </div>
  );
};
