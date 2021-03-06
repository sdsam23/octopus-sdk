<template>
  <div>
    <div class="page-box" v-if="loaded && !error">
      <h1 v-if="!lightStyle">{{ $t('Animator') }}</h1>
      <div class="d-flex w-100 flex-column align-items-center justify-content-center">
        <div class="img-box-circle mb-3" :style="{'background-image': 'url(\'' + participant.imageUrl + '\')', }"></div>
        <h2 class="text-capitalize">{{ name }}</h2>
        <div class="h6" v-html="description">{{ description }}</div>
        <div class="d-flex justify-content-center" v-if="isRssButton">
          <a class="btn btn-bigRound" :title="$t('Subscribe to this participant')" :aria-label="$t('Subscribe to this participant')" :href="rssUrl" target="_blank">
            <div class="saooti-rss-bounty"></div>
          </a>
        </div>
        <div class="d-flex">
          <EditBox :participant='participant' v-if="editRight && isEditBox" @participantUpdate="getParticipantDetails"></EditBox>
          <ShareButtons :participantId="participantId" v-if="isShareButtons"></ShareButtons>
        </div>
      </div>
      <PodcastFilterList
        :participantId="participantId"
        :name="name"
        :categoryFilter="true"
        :reload="reload"
        v-if="!lightStyle"
      />
      <PodcastList :first="0" :size="15" :participantId="participantId" :reload="reload" v-else/>
    </div>
    <div class="d-flex justify-content-center" v-if="!loaded">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading content ...') }}</h3>
    </div>
    <div class="text-center" v-if="error">
      <h3>{{ $t("Animator doesn't exist") }}</h3>
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
import PodcastFilterList from '../display/podcasts/PodcastFilterList.vue';
import PodcastList from '../display/podcasts/PodcastList.vue';
import {state} from "../../store/paramStore.js";

export default {
  components: {
    ShareButtons,
    PodcastFilterList,
    EditBox,
    PodcastList
  },

  mounted() {
    this.getParticipantDetails();
  },

  props: ['participantId'],

  data() {
    return {
      loaded: false,
      participant: undefined,
      error: false,
      reload: false,
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
    lightStyle(){
      return state.intervenantPage.lightStyle;
    },
    isRssButton(){
      return state.intervenantPage.rssButton;
    },
    rssUrl(){
      return state.generalParameters.ApiUri + 'rss/participant/' + this.participantId;
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
    getParticipantDetails() {
      octopusApi.fetchParticipant(this.participantId).then(data => {
        this.participant = data;
        this.$emit('participantTitle', this.name);
        this.loaded = true;
      })
      .catch(() =>{
        this.error = true;
        this.loaded = true;
      });
    },
  },
  watch:{
    participant(){
      this.reload = !this.reload;
    }
  }
};
</script>
