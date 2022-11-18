export interface MessageProps {
  data: {
    id: number;
    author: {
      id: string;
    };
    text: string;
    title: string;
    createdAt: string;
  };
}
