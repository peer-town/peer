import {ButtonProps} from "../types";

export const AccentButton = (props: ButtonProps) => {
  return (
    <button
      type="button"
      id="accent-button"
      className={`cursor-pointer rounded-3xl bg-[#FF0D0D] px-8 py-3 text-sm font-medium text-white hover:bg-red-500 disabled:bg-red-400 ${props.classes || ''}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.title}
    </button>
  )
}
