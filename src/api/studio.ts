import { Conference } from "@/store/class/conference";

export default {
    listConferences(store?: any,bool?: boolean,filterOrgaUsed?: any,state?: string): any{
        return [] as Array<Conference>;
    },
    deleteConference(store?: any,fetchConference?: any): any{
        return;
    },
    getRealConferenceStatus(store?: any,fetchConference?: any): any{
        return {};
    },
    getConference(store?: any,fetchConference?: any): any{
        return {};
    },
};
