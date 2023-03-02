interface WebOnBoardData {
  name: string;
  imageUrl: string;
}

export interface ModalProps {
  open: boolean;
  // will be called when user clicks Esc or outside the dialog
  onClose(): void;
}

export interface WebOnBoardProps extends ModalProps {
  onSubmit(data: WebOnBoardData): void;
}
