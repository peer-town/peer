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
