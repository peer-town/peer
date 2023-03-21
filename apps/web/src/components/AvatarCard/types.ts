export interface AvatarCardProps {
  image: string;
  imageSize: number;
  href?: any;
  name?: string;
  address?: string;
  classes?: string;
  onAddressClick?(address: string): void;
}
