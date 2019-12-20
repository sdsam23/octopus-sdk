<template>
  <div>
    <div class="page-box" v-if="loaded && !error">
      <h1>{{ $t('Animator') }}</h1>
      <div class="d-flex w-100 flex-column align-items-center justify-content-center">
        <div class="img-box-circle mb-3" :style="{'background-image': 'url(\'' + participant.imageUrl + '\')', }"></div>
        <h2 class="text-capitalize">{{ name }}</h2>
        <div class="h6">{{ description }}</div>
        <div class="d-flex">
           <div class="module-box" v-if="editRight">
            <h3 class="text-center-mobile">{{$t('Suppress')}}</h3>
            <button class="btn btn-primary admin-button  d-inline-flex align-items-center" @click="onDeleteParticipant()">
              <div class="saooti-delete font-weight-bold"></div>
          </button>
          </div>
          <ShareButtons :participantId="participantId"></ShareButtons>
        </div>
      </div>
      <PodcastFilterList
        :participantId="participantId"
        :name="name"
        :categoryFilter="true"
      />
    </div>
    <div class="d-flex justify-content-center" v-if="!loaded">
      <div class="spinner-border mr-3"></div>
      <h3>{{ $t('Loading content ...') }}</h3>
    </div>
    <div class="text-center" v-if="error">
      <h3>{{ $t("Animator doesn't exist") }}</h3>
    </div>
    <!-- <PodcastDeleter
      :participant="participantToDelete"
      v-if="!!participantToDelete"
      @cancel="cleanParticipantToDelete"
      @done="removeDeletedParticipant"
    /> -->
  </div>
</template>

<style lang="scss">

</style>

<script>
// @ is an alias to /src
import ShareButtons from "../display/sharing/ShareButtons.vue";
import octopusApi from "@saooti/octopus-api";
import PodcastFilterList from '../display/podcasts/PodcastFilterList.vue';
/* import PodcastDeleter from "@/components/display/backoffice/PodcastDeleter.vue"; */
import {state} from "../../store/AppStore.js";

export default {
  components: {
    ShareButtons,
    PodcastFilterList,
    /* PodcastDeleter */
  },

  mounted() {
    this.getParticipantDetails(this.participantId);
  },

  props: ['participantId'],

  data() {
    return {
      loaded: false,
      participant: undefined,
      participantToDelete: undefined,
      error: false,
    };
  },

  computed: {
    organisationId(){
      return state.generalParameters.organisationId;
    },
    authenticated(){
      return state.generalParameters.authenticated;
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
    editRight() {
      if (this.authenticated) {
        if (this.organisationId === this.participant.orga.id) {
          return true;
        }
        if (state.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
    }
  },

  methods: {
    getParticipantDetails(participantId) {
      octopusApi.fetchParticipant(participantId).then(data => {
        this.participant = data;
        this.loaded = true;
      })
      .catch(() =>{
        this.error = true;
        this.loaded = true;
      });
    },
    onDeleteParticipant() {
      this.participantToDelete = this.participant;
    },
    cleanParticipantToDelete() {
      this.participantToDelete = undefined;
    },
    removeDeletedParticipant() {
      if(window.history.length > 1){
        this.$router.go(-1);
      } else{
        this.$router.push('/main/pub/participants');
      }
    }
  },
};
</script>
