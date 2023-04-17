
export type tagSelectProp = {
  selectedData: {id: string, tag: string}[],
  setData :  React.Dispatch<React.SetStateAction<{id: string, tag: string}[]>>
  placeholder: string
}

export interface CreateTagProps {
  title: string;
  classes?: string;
  disabled?: boolean;
  loading?: boolean;
  tag: string;
  onClick?: () => void;
  refetch: () => void;
}