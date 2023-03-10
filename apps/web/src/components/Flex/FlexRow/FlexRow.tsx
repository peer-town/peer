import {FlexProps} from "../types";

export const FlexRow = (props: FlexProps) => {
  return (
    <div id="flex-row" className={`flex flex-row items-center ${props.classes || ''}`}>
      {props.children}
    </div>
  )
}
