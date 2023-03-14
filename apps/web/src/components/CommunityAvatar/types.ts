export interface CommunityAvatarProps {
  name: string;
  image: string;
  onClick?(): void;
  selected?: boolean;
  classes?: string;
}
