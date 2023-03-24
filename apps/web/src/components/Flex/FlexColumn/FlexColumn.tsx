import {FlexProps} from "../types";

export const FlexColumn = (props: FlexProps) => {
  return (
    <div id="flex-column" className={`flex flex-col ${props.classes || ''}`}>
      {props.children}
    </div>
  )
}
