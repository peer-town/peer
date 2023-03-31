export interface Thread {
    id: string;
    title: string;
    body: string;
    createdAt: string;
    user: any;
}

export interface ThreadCardProps {
    thread: Thread;
    onClick?(): void;
}
