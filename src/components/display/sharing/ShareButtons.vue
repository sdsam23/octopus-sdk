<template>
  <div class="module-box text-center-mobile">
    <h3 v-if="!bigRound">{{ $t('Share') }}</h3>
    <div class="d-flex" :class="bigRound && !audioUrl?'justify-content-center':''">
      <a class="btn btn-bigRound" :title="$t('Downloading')" :href="audioUrl"  target="_blank" download  v-if="audioUrl">
        <div class="saooti-download-bounty"></div>
      </a>
      <a target="_blank" :href="facebookURL" :class="bigRound?'btn btn-bigRound':'btn btn-circle m-3 btn-facebook share-btn'">
        <span class="saooti-facebook-bounty" v-if="!bigRound"></span>
        <div class="saooti-facebook-bounty" v-else></div>
      </a>
      <a target="_blank" :class="bigRound?'btn btn-bigRound':'btn btn-circle m-3 btn-twitter share-btn'" :href="twitterURL">
        <span class="saooti-twitter-bounty" v-if="!bigRound"></span>
        <div class="saooti-twitter-bounty" v-else></div>
      </a>
      <a target="_blank" :class="bigRound?'btn btn-bigRound':'btn btn-circle m-3 btn-linkedin share-btn'" :href="linkedinURL">
        <span class="saooti-linkedin1" v-if="!bigRound"></span>
        <div class="saooti-linkedin1" v-else></div>
      </a>
      <a target="_blank" :class="bigRound?'btn btn-bigRound':'btn btn-circle m-3 btn-rss share-btn'" :href="rssUrl" :title="$t('Subscribe to this emission')" v-if="rssUrl">
        <span class="saooti-rss-bounty" v-if="!bigRound"></span>
        <div class="saooti-rss-bounty" v-else></div>
      </a>
    </div>
  </div>
</template>

<style lang="scss">
</style>

<script>
import {state} from "../../../store/paramStore.js";
export default {
  props: [
    "podcastId",
    "emissionId",
    "participantId",
    "organisationId",
    'bigRound',
    'audioUrl'
  ],

  data() {
    return {
      facebookURL: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      twitterURL: `https://twitter.com/intent/tweet?text=${window.location.href}`,
      linkedinURL: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
      iFrameModel: this.podcastId ? "default" : "emission",
      iFrameNumberPriv: "1"
    };
  },

  computed: {
    rssUrl() {
      if (this.emissionId) {
        return state.generalParameters.ApiUri + "rss/emission/" + this.emissionId;
      }
      if (this.organisationId) {
        return state.generalParameters.ApiUri + "rss/productor/" + this.organisationId;
      }
      if (this.participantId) {
        return state.generalParameters.ApiUri + "rss/participant/" + this.participantId;
      }
      return null;
    },

    iFrameNumber: {
      get() {
        return this.iFrameNumberPriv;
      },
      set(value) {
        let val = parseInt(value, 10);
        if (!isNaN(val) && val >= 1 && val <= 10) {
          this.iFrameNumberPriv = value;
        }
      }
    },

    iFrameWidth() {
      switch (this.iFrameModel) {
        case "large":
          return "730px";
        default:
          return "355px";
      }
    },

    iFrameHeight() {
      switch (this.iFrameModel) {
        case "large":
          return "165px";
        case "emission":
          return "530px";
        default:
          return "494px";
      }
    }
  },

  methods: {
    async onCopyCode() {
      const iFrame = `<iframe src="${this.iFrameSrc}" width="${this.iFrameWidth}" height="${this.iFrameHeight}" scrolling="no" frameborder="0"></iframe>`;
      await navigator.clipboard.writeText(iFrame);
    }
  }
};
</script>
