import { Conference } from "@/store/class/conference";

export default {
    listConferences(store?:any,bool?:boolean,filterOrgaUsed?:any,state?:string){
        return [] as Array<Conference>;
    },
    deleteConference(store?:any,fetchConference?:any){
        return;
    },
    getRealConferenceStatus(store?:any,fetchConference?:any){
        return {};
    },
    getConference(store?:any,fetchConference?:any){
        return {};
    },
};
