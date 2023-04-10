

export interface DropDownProps {
  selected: string;
  placeholder: string;
  buttonClass?:string;
  dropdownClass?:string;
  children: JSX.Element | JSX.Element[];
  disableDropdown: boolean;
}