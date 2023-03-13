import {CommunityAvatarProps} from "./types";
import Image from "next/image";
import * as utils from "../../utils";

export const CommunityAvatar = (props: CommunityAvatarProps) => {
  return (
    <div
      id="community-avatar"
      className={utils.classNames(
        "group relative",
        props.classes
      )}
      onClick={props.onClick}
    >
      <span
        id="tooltip"
        className="absolute hidden group-hover:flex top-1.5 left-14 w-max px-2 py-1 bg-black rounded-lg text-center text-white">
        {props.name}
      </span>
      <Image
        width={44}
        height={44}
        className={props.selected ? `rounded-xl` : `rounded-full hover:rounded-xl`}
        src={props.image}
        alt={`${props.name} community`}
      />
    </div>
  );
}
