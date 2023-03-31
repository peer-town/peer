import { CommunityAvatarProps } from "./types";
import Image from "next/image";
import * as utils from "../../utils";

export const CommunityAvatar = (props: CommunityAvatarProps) => {
  return (
    <div
    className={utils.classNames(
      " inline-block ",
      props.selected ? " border-r-[3px] rounded-r-sm border-black" : ""
    )}
    >
      <div
        id="community-avatar"
        className={utils.classNames(
          "group relative flex h-12 w-12 cursor-pointer items-center justify-center z-2 mx-auto",
          props.classes
        )}
        onClick={props.onClick}
      >
        <span
          id="tooltip"
          className="absolute top-1.5 left-20 z-50 hidden w-max rounded-lg bg-gray-300 px-2 py-1 text-center text-white group-hover:flex"
        >
          {props.name}
        </span>
        <Image
          width={props.width ?? 45}
          height={props.width ?? 45}
          className={
            props.selected ? `rounded-xl` : `rounded-full hover:rounded-xl`
          }
          src={props.image}
          alt={`${props.name} community`}
        />
      </div>
    </div>
  );
};
