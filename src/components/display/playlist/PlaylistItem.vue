<template>
  <li class="mt-3 emission-item-container shadow-element">
    <router-link 
    :to="{ name: 'playlist', params: {playlistId:playlist.emissionId}, query:{productor: $store.state.filter.organisationId}}"
    :aria-label="$t('Playlist')"
    class="text-dark">
      <div class="img-box" :style="{ 'background-image': 'url(\'' + playlist.imageUrl +'?dummy='+dummyParam+ '\')' }"></div>
    </router-link>
    <div class="emission-item-text">
      <router-link 
      :to="{ name: 'playlist', params: {playlistId:playlist.emissionId}, query:{productor: $store.state.filter.organisationId}}"
      class="text-dark">
        <div class="emission-name">
        <img class="icon-caution" src="/img/caution.png" v-if="!activePlaylist && !isPodcastmaker" :title="$t('Playlist have not podcasts')"/>{{ name }}</div>
        <div class="emission-description" v-html="description">{{ description }}</div>
      </router-link>
      <div class="flex-grow"></div>
      <router-link 
      :to="{ name: 'productor', params: {productorId:playlist.orga.id}, query:{productor: $store.state.filter.organisationId}}"
      class="text-dark" v-if="!isPodcastmaker">
        <div class="emission-producer primary-color">© {{ playlist.orga.name }}</div>
      </router-link>
    </div>
  </li>
</template>

<style lang="scss">
</style>

<script>
import {state} from "../../../store/paramStore.js";
/* import octopusApi from "@saooti/octopus-api"; */
export default {
  name: 'PlaylistItem',

  props: ['playlist'],

  created(){
    this.hasPodcast();
  },

  data() {
    return {
      activePlaylist: true,
      dummyParam : new Date().getTime().toString(),
    };
  },

  computed: {
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },

    organisation() {
      return '' + this.playlist.publisher.organisation.name;
    },

    lightItems(){
      return state.emissionsPage.lightItems;
    },

    description() {
      let description;
      description = this.playlist.description || '';
      if (state.generalParameters.isIE11) {
        return description.substring(0, 50) + '...';
      } else {
        return description;
      }
    },

    name() {
      if (state.generalParameters.isIE11) {
        return this.playlist.name.substring(0, 50) + '...';
      } else {
        return this.playlist.name;
      }
    },

    organisationId(){
      return state.generalParameters.organisationId;
    },

    authenticated(){
      return state.generalParameters.authenticated;
    },

    editRight() {
      if (this.authenticated) {
        if (this.organisationId === this.playlist.orga.id && this.$store.state.authentication.role.includes("PLAYLIST")) {
          return true;
        }
        if (state.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
    }
  },

   methods:{
    async hasPodcast(){
      /* const data = await octopusApi.fetchPodcasts({emissionId: this.emission.emissionId,});
      if(data.count === 0 && this.editRight){
        this.activePlaylist = false;
      } */
    }
  },
};
</script>
