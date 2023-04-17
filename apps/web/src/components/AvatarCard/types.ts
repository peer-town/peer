export interface AvatarCardProps {
  image: string;
  imageSize: number;
  name?: string;
  address?: string;
  classes?: string;
  imageClasses?: string;
  onAddressClick?(address: string): void;
  onClick?(): void;
}
