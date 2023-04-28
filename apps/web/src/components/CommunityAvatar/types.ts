export interface CommunityAvatarProps {
  width?: number;
  height?: number;
  name: string;
  image: string;
  onClick?(): void;
  selected?: boolean;
  classes?: string;
  style?: object;
}
