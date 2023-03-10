import {ButtonProps} from "../types";

export const PrimaryButton = (props: ButtonProps) => {
  return (
    <button
      type="button"
      id="primary-button"
      className={`cursor-pointer rounded-[10px] h-[48px] bg-[#08010D] px-8 py-3 text-sm font-medium text-white hover:bg-gray-800 ${props.classes || ''}`}
      disabled={props.disabled}
      onClick={props.onClick}
    >
      {props.title}
    </button>
  )
}
