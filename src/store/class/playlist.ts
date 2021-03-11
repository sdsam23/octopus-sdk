import { Organisation } from "./organisation";
import { Podcast } from "./podcast";


export interface Playlist{
  imageUrl: string;
  description: string;
  organisation: Organisation;
  playlistId: number;
  podcasts: Array<Podcast>;
  score: number;
  title: string;
}