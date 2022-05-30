export interface MessageProps {
  data: {
    id: number;
    author: {
      avatar: string;
      username: string;
      walletAddress: string;
    };
    likes: number;
    timePassed?: string;
    message: string;
  };
}
