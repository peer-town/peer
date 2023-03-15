import {CommunityAvatarProps} from "./types";
import Image from "next/image";
import * as utils from "../../utils";

export const CommunityAvatar = (props: CommunityAvatarProps) => {
  return (
    <div
      id="community-avatar"
      className={utils.classNames(
        "group relative cursor-pointer",
        props.classes
      )}
      onClick={props.onClick}
    >
      <span
        id="tooltip"
        className="absolute hidden z-50 group-hover:flex top-1.5 left-20 w-max px-2 py-1 bg-black rounded-lg text-center text-white">
        {props.name}
      </span>
      <Image
        width={45}
        height={45}
        className={props.selected ? `rounded-xl` : `rounded-full hover:rounded-xl`}
        src={props.image}
        alt={`${props.name} community`}
      />
    </div>
  );
}
