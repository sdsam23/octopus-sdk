<template>
  <li class="participant-item-container">
    <router-link v-bind:to="'/main/pub/participant/' + participant.participantId" class="mt-3" >
      <div class="img-box-circle" :style="{ 'background-image': 'url(\'' + participant.imageUrl + '\')' }"></div>
    </router-link>
    <router-link v-bind:to="'/main/pub/participant/' + participant.participantId" class="text-dark mt-3">
      <div class="participant-name">
      <img src="/img/caution.png" class="icon-caution" v-if="!activeParticipant && !isPodcastmaker"/>{{ name }}</div>
      <div class="participant-description">{{ description }}</div>
    </router-link>
    <router-link v-bind:to="'/main/pub/productor/' + participant.orga.id" class="text-dark participant-producer" v-if="!isPodcastmaker">
      <div class="participant-producer primary-color">© {{ participant.orga.name }}</div>
    </router-link>
  </li>
</template>

<style lang="scss">
.participant-item-container {
  list-style: none;
  border-radius: 2rem;
  display: flex;
  flex-direction: column;
  margin: 1rem 0;
  align-items: flex-start;

  .participant-name{
    font-size: 0.9rem;
    font-weight: 600;
  }
 
  .participant-description {
    font-weight: 500;
    white-space: pre-wrap;
    font-size: 0.8em;
    margin: 1em 0 0.5em;
  }
  .participant-producer {
    font-weight: 300;
    font-size: 0.6rem;
  }
}
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import {state} from "../../../store/paramStore.js";
export default {
  name: 'ParticpantItem',

  props: ['participant'],

  created(){
    this.hasPodcast();
  },

  data() {
    return {
      activeParticipant: true,
    };
  },

  computed: {
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },

    description() {
      let description;
      description = this.participant.description || '';
      if (state.generalParameters.isIE11) {
        return description.substring(0, 50) + '...';
      } else {
        return description;
      }
    },

    name() {
      const fullName = (
        (this.participant.firstName || '') +
        ' ' +
        (this.participant.lastName || '')
      ).trim();
      if (state.generalParameters.isIE11) {
        return fullName.substring(0, 50) + '...';
      } else {
        return fullName;
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
        if (this.organisationId === this.emission.orga.id) {
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
    hasPodcast(){
      octopusApi
        .fetchPodcasts({
          participantId: this.participant.participantId,
        })
        .then((data) => {
          if(data.count === 0 && this.editRight){
            this.activeParticipant = false;
          }
        });
    }
  },
};
</script>
