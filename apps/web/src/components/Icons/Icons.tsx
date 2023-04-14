import * as utils from "../../utils";
import {IconProps} from "./types";
import {SVGProps} from "react";

export const Spinner = (props: IconProps) => {
  return (
    <svg
      id="spinner"
      className={utils.classNames(
        "cursor-wait animate-spin mr-2 h-5 w-5",
        props.color || "text-black",
      )}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
};

export const UpVote = (props: SVGProps<any>) => {
  return (
    <svg
      id="up-vote"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer hover:fill-[#ff225b]"
      width={18} height={18}
      viewBox="0 0 20 20" fill="currentColor"
      {...props}
    >
      <g clipPath="url(#clip0_472_1110)">
        <path
          d="M12.877 19H7.123A1.125 1.125 0 016 17.877V11H2.126a1.114 1.114 0 01-1.007-.7 1.249 1.249 0 01.171-1.343L9.166.368a1.128 1.128 0 011.668.004l7.872 8.581a1.252 1.252 0 01.176 1.348 1.114 1.114 0 01-1.005.7H14v6.877A1.125 1.125 0 0112.877 19zM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8zM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016z"></path>
      </g>
      <defs>
        <clipPath id="clip0_472_1110">
          <path d="M0 0h20v20H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};

export const DownVote = (props: SVGProps<any>) => {
  return (
    <svg
      id="down-vote"
      xmlns="http://www.w3.org/2000/svg"
      className="cursor-pointer rotate-180 hover:fill-[#ff225b]"
      width={18} height={18}
      viewBox="0 0 20 20" fill="currentColor"
      {...props}
    >
      <g clipPath="url(#clip0_472_1110)">
        <path
          d="M12.877 19H7.123A1.125 1.125 0 016 17.877V11H2.126a1.114 1.114 0 01-1.007-.7 1.249 1.249 0 01.171-1.343L9.166.368a1.128 1.128 0 011.668.004l7.872 8.581a1.252 1.252 0 01.176 1.348 1.114 1.114 0 01-1.005.7H14v6.877A1.125 1.125 0 0112.877 19zM7.25 17.75h5.5v-8h4.934L10 1.31 2.258 9.75H7.25v8zM2.227 9.784l-.012.016c.01-.006.014-.01.012-.016z"></path>
      </g>
      <defs>
        <clipPath id="clip0_472_1110">
          <path d="M0 0h20v20H0z"></path>
        </clipPath>
      </defs>
    </svg>
  );
};
