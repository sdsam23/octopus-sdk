<template>
  <div class="module-box text-center-mobile">
    <h3>{{ $t('Share') }}</h3>
    <div class="d-flex flex-wrap justify-content-center">
      <a target="_blank" :href="facebookURL" class="btn btn-circle m-3 btn-facebook share-btn">
        <span class="saooti-facebook-bounty"></span>
      </a>
      <a target="_blank" class="btn btn-circle m-3 btn-twitter share-btn" :href="twitterURL">
        <span class="saooti-twitter-bounty"></span>
      </a>
      <a target="_blank" class="btn btn-circle m-3 btn-linkedin share-btn" :href="linkedinURL">
        <span class="saooti-linkedin1"></span>
      </a>
      <a target="_blank" class="btn btn-circle m-3 btn-rss share-btn" v-if="rssUrl" @click="openPopup()">
        <span class="saooti-rss-bounty"></span>
      </a>
      <a target="_blank" class="btn btn-circle m-3 btn-applePodcast share-btn" :href="applePodcast" v-if="applePodcast">
        <span class="saooti-apple"></span>
      </a>
      <a target="_blank" class="btn btn-circle m-3 btn-deezer share-btn" :href="deezer" v-if="deezer">
        <span class="saooti-deezer"></span>
      </a>
      <a target="_blank" class="btn btn-circle m-3 btn-spotify share-btn" :href="spotify" v-if="spotify">
        <span class="saooti-spotify"></span>
      </a>
      <a target="_blank" class="btn btn-circle m-3 btn-tunein share-btn" :href="tunein" v-if="tunein">
        <span class="saooti-tunin"></span>
      </a>
      <a target="_blank" class="btn btn-circle m-3 btn-tootak share-btn" :href="tootak" v-if="tootak">
        <span class="saooti-tootak"></span>
      </a>
      <a target="_blank" class="btn btn-circle m-3 btn-radioline share-btn" :href="radioline" v-if="radioline">
        <span class="saooti-radioline"></span>
      </a>
    </div>
                    <ClipboardModal
                      v-if="dataRSSSave"
                      :closable="true"
                      @close="closeModal()"
                      :link="rssUrl"
                      :title="$t('RSS Link')"
                    />
  </div>
</template>

<style lang="scss">

</style>

<script>
import {state} from "../../../store/paramStore.js";
import ClipboardModal from '@/components/misc/modal/ClipboardModal.vue'
export default {
  props: [
    "podcastId",
    "emission",
    "participantId",
    "organisationId"
  ],
  components: {

  ClipboardModal
  },
  data() {
    return {
      facebookURL: `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`,
      twitterURL: `https://twitter.com/intent/tweet?text=${window.location.href}`,
      linkedinURL: `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
      iFrameModel: this.podcastId ? "default" : "emission",
      iFrameNumberPriv: "1",
      applePodcast:this.emission.annotations ? this.emission.annotations.applePodcast : undefined,
      deezer:this.emission.annotations ? this.emission.annotations.deezer : undefined,
      spotify:this.emission.annotations ? this.emission.annotations.spotify : undefined,
      tunein:this.emission.annotations ? this.emission.annotations.tunein : undefined,
      tootak:this.emission.annotations ? this.emission.annotations.tootak : undefined,
      radioline:this.emission.annotations ? this.emission.annotations.radioline : undefined,
      dataRSSSave:false
    };
  },

  computed: {
    rssUrl() {
      if (this.emission) {
        return state.generalParameters.ApiUri + "rss/emission/" + this.emission.emissionId;
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
        openPopup() {
          this.dataRSSSave = ! this.dataRSSSave;

        },
      closeModal() {

        this.dataRSSSave = false;
      },
    async onCopyCode() {
      const iFrame = `<iframe src="${this.iFrameSrc}" width="${this.iFrameWidth}" height="${this.iFrameHeight}" scrolling="no" frameborder="0"></iframe>`;
      await navigator.clipboard.writeText(iFrame);
    }
  }
};
</script>
