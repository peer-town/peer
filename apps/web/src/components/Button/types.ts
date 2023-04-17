export interface ButtonProps {
  title: string;
  classes?: string;
  disabled?: boolean;
  loading?: boolean;
  onClick(): void;
}
