<template>
  <div>
    <div class="bg-white">
      <h3>{{ $t('Share') }}</h3>
      <div class="share-container">
        <a target="_blank" :href="facebookURL" class="btn btn-round btn-facebook">
          <span class="saooti-facebook-bounty"></span>
        </a>
        <a target="_blank" class="btn btn-round btn-twitter" :href="twitterURL">
          <span class="saooti-twitter-bounty"></span>
        </a>
        <a target="_blank" class="btn btn-round btn-linkedin" :href="linkedinURL">
          <span class="saooti-linkedin1"></span>
        </a>
        <a target="_blank" class="btn btn-round btn-rss" :href="rssUrl" v-if="rssUrl">
          <span class="saooti-rss-bounty"></span>
        </a>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../sass/_variables.scss';
.bg-white {
  background-color: $octopus-secondary-background;
  padding: 2rem;
  margin: 1rem 1rem 4rem 1rem;
  border-radius: 1rem;
  flex-grow: 1;
}

.share-container {
  display: flex;

  .btn-round {
    font-size: 1.5rem;
    border-radius: 50%;
    margin: 0.2rem;
    width: 2.5rem;
    height: 2.5rem;
    padding-top: 0.5rem;
  }
  .btn {
    border-radius: 3rem;
    margin: 1rem;
    background: #ddd;
    &:hover {
      border: 0;
      background: #ccc;
    }
  }
  .btn-facebook {
    background: #d8dfea;
    color: #3b5998;
    &:hover {
      background: #afbdd4;
    }
  }
  .btn-twitter {
    background: #d2ecfc;
    color: #1da1f2;
    &:hover {
      background: #bbe3fb;
    }
  }
  .btn-linkedin {
    background: #0077b550;
    color: #0077b5;
    &:hover {
      background: #00a0dc;
    }
  }
}

/** PHONES*/
@media (max-width: 960px) {
  .bg-white {
    margin: 1rem 0 2rem 0;
    padding: 1rem;
  }
  .share-container {
    text-align: center;
    flex-wrap: wrap;
    .btn {
      margin: 0.5rem;
    }
  }
}
</style>

<script>
import parameters from "@/store/AppStore.js";
export default {
  props: [
    "podcastId",
    "emissionId",
    "participantId",
    "organisationId"
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
        return parameters.generalParameters.ApiUri + "rss/emission/" + this.emissionId;
      }
      if (this.organisationId) {
        return parameters.generalParameters.ApiUri + "rss/productor/" + this.organisationId;
      }
      if (this.participantId) {
        return parameters.generalParameters.ApiUri + "rss/participant/" + this.participantId;
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
