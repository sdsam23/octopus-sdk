<template>
  <div>
    <div class="page-box" v-if="loaded && !error">
      <h1>{{ $t('Emission') }}</h1>
      <div class="d-flex">
        <div class="d-flex flex-column flex-grow">
          <EditBox :emission='emission' :rssEmission='rssEmission' v-if="editRight && isEditBox"></EditBox>
          <div class="module-box">
            <h2>{{ name }}</h2>
            <div class="mb-5 h6">
              <img 
                :src="imageUrl" 
                :alt="$t('Emission name image', { name: name })" 
                class="img-box shadow-element float-left mr-3 mb-3" />
                {{description}}
            </div>
          </div>
        </div>
        <div class="d-flex flex-column">
          <SharePlayer :emissionId="emissionId" :exclusive="exclusive" :organisationId='organisationId' v-if="isSharePlayer"></SharePlayer>
          <ShareButtons :emissionId="emissionId" v-if="isShareButtons"></ShareButtons>
        </div>
      </div>
      <div v-if="editRight">
        <ShareDistribution :emissionId="emissionId" v-if="isShareDistribution"></ShareDistribution>
      </div>
      <PodcastFilterList :emissionId="emissionId" :categoryFilter="false" />
    </div>
    <div class="d-flex justify-content-center" v-if="!loaded">
      <div class="spinner-border mr-3"></div>
      <h3>{{ $t('Loading content ...') }}</h3>
    </div>
    <div class="text-center" v-if="error">
      <h3>{{ $t("Emission doesn't exist") }}</h3>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import EditBox from "../display/edit/EditBox.vue";
import SharePlayer from '../display/sharing/SharePlayer.vue';
import ShareButtons from "../display/sharing/ShareButtons.vue";
import ShareDistribution from '../display/sharing/ShareDistribution.vue';
import PodcastFilterList from '../display/podcasts/PodcastFilterList.vue';
import octopusApi from "@saooti/octopus-api";
import {state} from "../../store/AppStore.js";

export default {
  components: {
    PodcastFilterList,
    SharePlayer,
    ShareButtons,
    ShareDistribution,
    EditBox
  },

  mounted() {
    this.getEmissionDetails(this.emissionId);
  },

  props: ["emissionId"],

  data() {
    return {
      loaded: false,
      title: "",
      emission: undefined,
      error: false,
      rssEmission: false,
      exclusive: false
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
    isShareDistribution(){
      return state.podcastPage.ShareDistribution;
    },

    name() {
      return this.emission ? this.emission.name : "";
    },

    imageUrl() {
      return this.emission ? this.emission.imageUrl : "";
    },

    description() {
      return this.emission ? this.emission.description : "";
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

  watch: {
    emissionId(val) {
      this.loaded = false;
      this.error = false;
      this.getEmissionDetails(val);
    }
  },

  methods: {
    getEmissionDetails(emissionId) {
      octopusApi
        .fetchEmission(emissionId)
        .then(data => {
          this.emission = data;
          this.loaded = true;
          if (this.emission.annotations) {
            if (this.emission.annotations.RSS) {
              this.rssEmission = true;
            }
            if (this.emission.annotations.exclusive) {
              this.exclusive =
                this.emission.annotations.exclusive == "true" ? true : false;
              this.exclusive =
                this.exclusive && this.organisationId !== this.emission.orga.id;
            }
          }
        })
        .catch(() => {
          this.error = true;
          this.loaded = true;
        });
    },
  }
};
</script>
