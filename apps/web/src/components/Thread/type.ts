import {Thread} from "../../server/types";

export type Platform = {
    platformId : string,
    platformName : string,
    platformAvatar : string,
    platformUsername : string
}

export interface ThreadProps {
    thread: Thread;
}

export interface CreateThreadProps {
    title:string,
    open:boolean,
    onClose():void
    community: {
        communityName: string;
        communityId: string;
    },
}

export interface GlobalCreateThreadProps {
    title:string,
    open:boolean,
    onClose():void
}

export interface SelectedCommunity {
        communityName: string;
        communityId: string;
}