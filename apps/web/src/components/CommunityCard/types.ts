export interface CommunityCardProps {
  communityName: string;
  about: string;
  communityAvatar: string;
  members: number;
  questions: number;
  tags: string[];
  onClick?(): void;
}
