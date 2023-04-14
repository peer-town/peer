export type multiSelectProps = {
  dataArray:object[],
  selectedData: object[],
  setData :  React.Dispatch<React.SetStateAction<{id: string, tag: string}[]>>
  NoDataComponent? : (query:string) => JSX.Element;
  maxLimit: number;
  attribute: string;
}