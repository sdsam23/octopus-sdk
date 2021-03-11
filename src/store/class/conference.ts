export interface Conference{
    album?: string;
    artist?: string;
    conferenceId: number;
    conferenceUrlIdentifier?: string;
    date?: string;
    debriefingDate?: string;
    deletionAttempts?: number;
    directCode?: string;
    hostname?: string;
    jingleDuration?: number;
    jingleFilePath?: string;
    jingleId?: number;
    mediaId?: number;
    messages?: any;
    organisationId?: string;
    participants?: any;
    phone?: string;
    podcastId?: number;
    prefix?: any;
    queueCode?: string;
    recordDate?: string;
    recordingPort?: number;
    status?: string;
    title: string;
    token?: string;
}