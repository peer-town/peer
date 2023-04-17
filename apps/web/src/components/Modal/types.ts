import { ReactElement } from "react";

interface WebOnBoardData {
  name: string;
  imageUrl: string;
}

interface CommunityOnBoardData extends WebOnBoardData {
  description: string;
  tags: {id:string,tag:string}[];
}

export interface ModalProps {
  open: boolean;
  // will be called when user clicks Esc or outside the dialog
  onClose(): void;
  children?: ReactElement;
}

export interface InterfaceModelProps extends ModalProps {
  type: "user" | "community";
}
export interface BaseModalProps extends ModalProps {
  title: string;
  classNameTitle?: string;
  classNameContent?: string;
}

export interface WebOnBoardProps extends ModalProps {
  onSubmit(data: WebOnBoardData): Promise<void>;
}

export interface CommunityOnBoardProps extends ModalProps {
  onSubmit(data: CommunityOnBoardData): Promise<void>;
}
