import { Emission } from "./class/emission"
import { Media } from "./class/media"
import { Organisation } from "./class/organisation"
import { Player } from "./class/player"
import { Podcast } from "./class/podcast"

export function emptyPodcastData(): Podcast{
    return {
        podcastId:0,
        audioUrl: undefined as any,
        audioStorageUrl: undefined as any,
        imageUrl: undefined as any,
        animators: [] as any,
        guests: [] as any,
        emission: emptyEmissionData(),
        title: undefined as any,
        description: undefined as any,
        tags: [] as any,
        availability: {
          visibility: true,
          date: undefined as any,
        },
        monetisable: 'UNDEFINED',
        comments: 'inherit',
        organisation: {
          id: '' as any,
          name: ''
        },
        pubDate: undefined as any,
        conferenceId: 0,
        duration: 0,
        annotations: {},
    }
  }

  export function emptyEmissionData(): Emission{
    return {
        emissionId: undefined as any,
        name: undefined as any,
        description: undefined as any,
        imageUrl: undefined as any,
        iabIds: undefined as any,
        orga: {
          id: '' as any,
          name: ''
        },
        rubriqueIds: [] as any,
        monetisable: 'UNDEFINED',
    }
  }

  export interface General {
    metaTitle: string,
    education: Boolean,
    logoUrl: string,
  }

  export interface Authentication{
    isAuthenticated: Boolean,
    name: string,
    organisationId: string | undefined,
    organisationName: string | undefined,
    role: Array<string>,
  }

  export interface Filter{
    organisationId: string | undefined,
    imgUrl: string | undefined,
    typeMedia: string | undefined,
    sortOrder: string | undefined,
    sortField: string | undefined,
    live: any,
  }

  export interface StoreState{
    general: General,
    ui: {
        displayLeftMenu: boolean,
    },
    storage: {
      uri: string | undefined,
    },
    miniplayer: {
      uri: string | undefined,
    },
    player: Player,
  
    navigator: {
        isIE11: Boolean | undefined,
        isES6: Boolean,
    },
  
    api: {
        uri: string | undefined,
    },
  
    RssApi: {
        uri: string | undefined,
    },
    MediaApi: {
        uri: string | undefined,
    },
    CommentApi: {
        uri: string | undefined,
    },
    studioApi: {
        uri: string | undefined,
    },
    processor: {
        uri: string | undefined,
    },
    rtmp: {
        uri: string | undefined,
    },
    frontend: {
        uri: string | undefined,
    },
    keycloakApi:{
        uri:string | undefined,
    },

    hlsApi: {
        uri: string | undefined,
    },
  
    authentication: Authentication,
  
    oAuthParam: {
        accessToken: string | undefined,
        refreshToken: string | undefined,
        accessTokenUri: string | undefined,
        clientId: string | undefined,
        expiration:any,
    },
    media: Media,
  
    profile: {
        firstname: any,
        lastname: any,
        email: any,
        userId: any,
        imageUrl: any,
        description: any,
        attributes:any,
    },
  
    organisation: Organisation,
    categories: any,
    categoriesOrga: any,
  
    filter: Filter,
  
      liveUpdate: {
        isBeforeLive: Boolean,
      },
  
      uploadPodcastData: Podcast,
  
      comments: {
        knownIdentity: any,
        actualPodcastId: number | undefined,
        loadedComments: any,
        totalCount: any,
      },
  }

  export function AppStoreData(): StoreState{
    return {
        general: {
            metaTitle: 'Octopus by Saooti',
            education: false,
            logoUrl: '/img/logo_octopus.png',
          },
      
          ui: {
            displayLeftMenu: false,
          },
          storage: {
            uri: undefined as any,
          },
          miniplayer: {
            uri: undefined as any,
          },
          player: {
            status: 'STOPPED', //STOPPED, LOADING, PLAYING, PAUSED
            podcast: undefined as any,
            volume: 1, //From 0 to 1
            elapsed: 0, //From 0 to 1
            total: 0,
            media: undefined as any,
            live: undefined as any,
            stop: undefined as any,
          },
      
          navigator: {
            isIE11: undefined as any,
            isES6: true,
          },
      
          api: {
            uri: undefined as any,
          },
      
          RssApi: {
            uri: undefined as any,
          },
          MediaApi: {
            uri: undefined as any,
          },
          CommentApi: {
            uri: undefined as any,
          },
          studioApi: {
            uri: undefined as any,
          },
          processor: {
            uri: undefined as any,
          },
          rtmp: {
            uri: undefined as any,
          },
          frontend: {
            uri: undefined as any,
          },
          keycloakApi:{
            uri:undefined,
          },
      
          hlsApi: {
            uri: undefined as any,
          },
      
          authentication: {
            isAuthenticated: false,
            name: "",
            organisationId: undefined as any,
            organisationName: undefined as any,
            role: [""],
          },
      
          oAuthParam: {
            accessToken: undefined as any,
            refreshToken: undefined as any,
            accessTokenUri: undefined as any,
            clientId: undefined as any,
            expiration:undefined
          },
          media: {
            mediaId: 0,
            organisationId: '',
            title: '',
          },
      
          profile: {
            firstname: undefined as any,
            lastname: undefined as any,
            email: undefined as any,
            userId: undefined as any,
            imageUrl: undefined as any,
            description: undefined as any,
            attributes:undefined,
          },
      
          organisation: {
            id:'',
            name: undefined as any,
            imageUrl: undefined as any,
            description: undefined as any,
            monetisable: undefined as any,
            location: undefined as any,
            comments: undefined as any,
            attributes: {
              RSS_CONTACT: undefined as any,
            },
          },
      
          categories: [] as any,
      
          categoriesOrga: [] as any,
      
          filter: {
            organisationId: undefined as any,
            imgUrl: undefined as any,
            typeMedia: undefined as any,
            sortOrder: undefined as any,
            sortField: undefined as any,
            live: false,
          },
      
          liveUpdate: {
            isBeforeLive: true,
          },
      
          uploadPodcastData: emptyPodcastData(),
      
          comments: {
            knownIdentity: null,
            actualPodcastId: undefined as any,
            loadedComments: [] as any,
            totalCount:undefined as any,
          },
    }
  }