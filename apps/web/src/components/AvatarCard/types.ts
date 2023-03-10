export interface AvatarCardProps {
  image: string;
  imageSize: number;
  name?: string;
  address?: string;
  classes?: string;
  onAddressClick?(address: string): void;
}
