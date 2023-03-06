export interface AvatarCardProps {
  image: string;
  imageSize: number;
  name?: string;
  address?: string;
  classes?: string;
  addressOnClick?(address: string): void;
}
