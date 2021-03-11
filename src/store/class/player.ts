import { Podcast } from "./podcast";

export interface Player{
    status: string; //STOPPED, LOADING, PLAYING, PAUSED
    podcast: Podcast|undefined;
    volume?: number; //From 0 to 1
    elapsed?: number; //From 0 to 1
    total?: number;
    media: any;
    live: any;
    stop?: any;
  }