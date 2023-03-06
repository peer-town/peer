import {BadgeProps} from "./types";

export const Badge = (props: BadgeProps) => {
  return (
    <span
      id="badge"
      className={`cursor-pointer inline-block text-ellipsis rounded-full bg-white border-2 border-gray-100 px-2 py-1 text-center text-sm leading-none text-gray-500 hover:border-blue-200 ${props.classes || ''}`}
      onClick={props.onClick}
    >
    {props.text}
    </span>
  );
}
