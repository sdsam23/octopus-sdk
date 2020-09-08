<template>
  <div>
    <div class="page-box" v-if="loaded && !error">
      <h1>{{ $t('Playlist') }}</h1>
      <div class="d-flex">
        <div class="d-flex flex-column flex-grow">
          <EditBox :playlist='playlist' :isReady='isReady' v-if="editRight && isEditBox"></EditBox>
          <div class="module-box">
            <h2>{{ name }}</h2>
            <div class="mb-5 mt-3 descriptionText">
              <img 
                :src="imageUrl" 
                :alt="$t('Playlist name image', { name: name })" 
                class="img-box shadow-element float-left mr-3 mb-3"
                /><p v-html="urlify(description)"></p>
            </div>
          </div>
        </div>
        <div class="d-flex flex-column share-container">
          <ShareButtons v-if="isShareButtons"></ShareButtons>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-if="!loaded">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading content ...') }}</h3>
    </div>
    <div class="text-center" v-if="error">
      <h3>{{ $t("Playlist doesn't exist") }}</h3>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import EditBox from "@/components/display/edit/EditBox.vue";
import ShareButtons from "../display/sharing/ShareButtons.vue";
import octopusApi from "@saooti/octopus-api";
import {state} from "../../store/paramStore.js";

export default {
  components: {
    ShareButtons,
    EditBox,
  },

  mounted() {
    this.getPlaylistDetails();
  },

  props: ["playlistId"],

  data() {
    return {
      loaded: false,
      playlist: undefined,
      error: false,
      isReady: true,
    };
  },

  computed: {
    organisationId(){
      return state.generalParameters.organisationId;
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
    isEditBox(){
      return state.podcastPage.EditBox;
    },
    isShareButtons(){
      return state.podcastPage.ShareButtons;
    },
    isSharePlayer(){
      return state.podcastPage.SharePlayer;
    },
    name() {
      return this.playlist ? this.playlist.title : "";
    },

    imageUrl() {
      return this.playlist ? this.playlist.imageUrl : "";
    },

    description() {
      return this.playlist ? this.playlist.description : "";
    },

    editRight() {
      if (this.authenticated) {
        if (this.organisationId === this.playlist.organisation.id && this.$store.state.authentication.role.includes("PLAYLIST")) {
          return true;
        }
        if (state.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
    },
  },

  watch: {
    playlistId(val) {
      this.loaded = false;
      this.error = false;
      this.getPlaylistDetails(val);
    }
  },

  methods: {
    async getPlaylistDetails() {
      try {
        const data = await octopusApi.fetchPlaylist(this.playlistId);
        this.playlist = data;
        this.$emit('playlistTitle', this.playlist.title);
        this.loaded = true;
      } catch {
        this.error = true;
        this.loaded = true;
      }
    },
    urlify(text) {
      let urlRegex = /(https?:\/\/[^\s]+)/g;
      if(text){
        return text.replace(urlRegex, (url) =>{
          return '<a href="' + url + '">' + url + '</a>';
        });
      }else{
        return '';
      }
    }
  }
};
</script>
