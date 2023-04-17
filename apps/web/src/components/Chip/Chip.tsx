import {ChipProps} from "./types";

export const Chip = (props: ChipProps) => {
  return (
    <div
      className={`flex flex-row gap-2 items-center px-3 py-2 block w-max rounded-md border border-gray-300 ${props.classes || ''}`}
      id="chip"
    >
      <span>{props.text}</span>
      <div
        id="close-icon"
        className="cursor-pointer"
        onClick={props.onClose}
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.0625 3.9375L3.9375 10.0625" stroke="#97929B" strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round"/>
          <path d="M3.9375 3.9375L10.0625 10.0625" stroke="#97929B" strokeWidth="1.5" strokeLinecap="round"
                strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}
