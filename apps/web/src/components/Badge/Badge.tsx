import {BadgeProps} from "./types";

export const Badge = (props: BadgeProps) => {
  return (
    <span
      id="badge"
      className={`cursor-pointer max-w-max inline-block text-ellipsis rounded-full bg-white border px-2 py-1 text-center text-sm leading-none  hover:border-blue-200 ${props.classes || ''}`}
      onClick={props.onClick}
    >
    {props.text}
    </span>
  );
}
