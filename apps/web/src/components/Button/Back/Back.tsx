import Link from "next/link";
import {BackLinkProps} from "./types";

export const Back = (props: BackLinkProps) => {
  return (
    <Link id="back-button" href={props.link} legacyBehavior>
      <a className="flex w-fit items-center gap-[3px] text-[16px] font-[500] text-[#BAB2C4] hover:text-[#08010D]">
        <svg
          className="h-[20px] w-[20px]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
          aria-hidden="true"
        >
          <path d="M0 0h24v24H0z" stroke="none" />
          <path d="M5 12h14M5 12l4 4M5 12l4-4" />
        </svg>
        Back
      </a>
    </Link>
  )
}
