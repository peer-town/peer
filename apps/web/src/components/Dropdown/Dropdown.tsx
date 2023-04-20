import {useState} from "react";
import {isEmpty, isNil} from "lodash";
import {DropDownProps} from "./types";

const Dropdown = (props: DropDownProps) => {
  const [open, setOpen] = useState<boolean>(false);
  const toggleDropdown = () => {
    // @ts-ignore
    !props.disableDropdown && setOpen((prevState) => !prevState);
  }
  const isNotSelected = (props.selected === "") || isNil(props.selected) || isEmpty(props.selected);
  return (
      <div className="relative inline-block dropdown">
        <button
            className={`inline-flex px-5 items-center justify-between w-full bg-white border-none outline-none dropdown-trigger ${props.buttonClass} ${isNotSelected && "text-sm font-normal text-base text-[#A2A8B4]"}`}
            aria-haspopup="true" aria-expanded="false" onClick={toggleDropdown}>
          { isNotSelected ? props.placeholder : props.selected}
          <svg className="w-4 h-4 " viewBox="0 0 20 20" fill="black">
            <path fill-rule="evenodd" d="M10 14l-5-5h10l-5 5z" clip-rule="evenodd"/>
          </svg>
        </button>
        {open && <div
            className={`absolute right-0 z-50 h-auto max-h-[170px] overflow-scroll w-full mt-2 origin-top-right rounded-md shadow-lg dropdown-menu scrollbar-hide ${props.dropdownClass}`}
            id="dropdown-menu">
            <div className="bg-white rounded-md shadow-xs" onClick={toggleDropdown}>
              {props.children}
            </div>
        </div>}
      </div>
  )
}

export default Dropdown;