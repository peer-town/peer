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
      width={18}
      height={18}
      className="cursor-pointer hover:fill-[#ff225b]"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
    </svg>
  );
};

export const DownVote = (props: SVGProps<any>) => {
  return (
    <svg
      id="down-vote"
      width={18}
      height={18}
      className="cursor-pointer rotate-180 hover:fill-accent"
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M12.781 2.375c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10zM15 12h-1v8h-4v-8H6.081L12 4.601 17.919 12H15z" />
    </svg>
  );
};

export const UpVoteFilled = (props: SVGProps<any>) => {
  return (
    <svg
      id="up-vote-filled"
      width={18}
      height={18}
      className="cursor-pointer fill-[#ff225b]"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" />
    </svg>
  );
};

export const DownVoteFilled = (props: SVGProps<any>) => {
  return (
    <svg
      id="down-vote-filled"
      width={18}
      height={18}
      className="cursor-pointer rotate-180 fill-[#ff225b]"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path d="M4 14h4v7a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-7h4a1.001 1.001 0 0 0 .781-1.625l-8-10c-.381-.475-1.181-.475-1.562 0l-8 10A1.001 1.001 0 0 0 4 14z" />
    </svg>
  );
};
