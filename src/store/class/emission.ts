import { Organisation } from "./organisation";
import { Person } from "./person";


export interface Emission{
    imageUrl: string;
    annotations?: any;
    description: string;
    emissionId: number;
    iabIds?: Array<number>;
    lastPodcastDate?: string;
    monetisable: string;
    name: string;
    orga: Organisation;
    rubriqueIds: Array<number>;
    score?: number;
    soundcastTag?: string;
    publisher?: Person;
}
  