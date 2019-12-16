<template>
  <div>
    <div class="bg-white share-container">
      <h3>{{ $t('Embed') }}</h3>
      <div class="frame-container" v-if="!exclusive && authenticated">
        <div v-if="noAd" class="sticker" :title="$t('You cannot insert advertising')">
          {{ $t('No advertising') }}
        </div>
        <iframe
          :src="iFrameSrc"
          scrolling="no"
          frameborder="0"
          :width="iFrameWidth"
          :height="iFrameHeight"
        ></iframe>
        <div class="flex-container-columns">
          <button class="btn" @click="onCopyCode">
            {{ $t('Copy code') }}
          </button>
          <select v-model="iFrameModel" class="frame-select" v-if="this.podcast && this.podcast.podcastId">
            <option value="default">Version par défaut</option>
            <option value="large">Version en longueur</option>
            <option value="emission">Version émission</option>
          </select>
        </div>
        <div class="flex-container" v-if="iFrameModel === 'emission'">
          <span>{{ $t('Show') }}</span>
          <input
            type="number"
            v-model="iFrameNumber"
            min="1"
            max="10"
            class="frame-number"
          />
          <span>{{ $t('Last podcasts') }}</span>
        </div>
      </div>
      <div v-if="exclusive && authenticated">
        {{ $t('Only organisation members can share the content') }}
      </div>
      <div v-if="!authenticated">
        {{ $t('Only authenticated members can share the content') }}
      </div>
    </div>
    <Snackbar ref="snackbar" position="bottom-left"></Snackbar>
  </div>
</template>

<style lang="scss" scoped>
@import '../../../sass/_variables.scss';
.flex-container {
  display: flex;
}
.flex-container-columns {
  display: flex;
  flex-direction: column;
}
.bg-white {
  background-color: $octopus-secondary-background;
  padding: 2rem;
  margin: 1rem 1rem 1rem 1rem;
  border-radius: 1rem;
  flex-grow: 1;
}
.frame-container {
  align-items: center;
  display: flex;
  flex-direction: column;
  h3 {
    margin: 0;
  }
  .flex-container {
    align-items: center;
    margin: 1rem 0;
    span {
      font-size: 0.8em;
    }
  }
}

.frame-select {
  border-radius: 3rem;
  margin: 1rem;
  background: #ddd;
  padding: 0.25rem 0.4rem;
}
.frame-number {
  margin: 0 1rem;
  text-align: center;
  border-radius: 3rem;
  width: 100px;
  border: 1px solid #ddd;
}
.frame-select:focus,
.frame-number:focus {
  outline-width: 0;
}

.sticker{
  align-self:center;
  background:rgba($octopus-primary-color, 0.3);
  padding:0.5rem;
  transition:all .5s ease;
  color:#41403E;
  font-size:0.8rem;
  letter-spacing:1px;
  outline:none;
  box-shadow: 10px 10px 34px -15px hsla(0,0%,0%,.4);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  border:solid 2px #41403E;
    &:hover{
      box-shadow:2px 8px 4px -6px hsla(0,0%,0%,.3);
  } 
}


/** PHONES*/
@media (max-width: 960px) {
  .bg-white {
    margin: 1rem 0 1rem 0;
    }
  .flex-container {
    flex-wrap: wrap;
  }
  .share-container {
    text-align: center;
  }
}
</style>

<script>
import Snackbar from '@/components/misc/Snackbar.vue';
import parameters from "@/store/AppStore.js";

export default {
  props: ['podcast', 'emissionId', "organisationId", 'exclusive'],

  components:{
    Snackbar
  },

  data() {
    return {
      iFrameModel: this.podcast ? 'default' : 'emission',
      iFrameNumberPriv: '1',
    };
  },
  computed: {
    noAd(){
      if(this.podcast && this.podcast.organisation.id !== this.organisationId && this.podcast.monetisable === 'NO' || (this.podcast && this.podcast.monetisable === 'UNDEFINED' && this.podcast.emission.monetisable === 'NO')){
        return true;
      } else{
        return false;
      }
      
    },
    authenticated(){
      return parameters.generalParameters.authenticated;
    },

    iFrameSrc() {
      if (this.iFrameModel === 'emission') {
        if (this.podcast && this.podcast.podcastId) {
          return `${parameters.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.emissionId}/${this.iFrameNumberPriv}/${this.podcast.podcastId}`;
        } else {
          return `${parameters.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.emissionId}/${this.iFrameNumberPriv}`;
        }
      } else {
        return `${parameters.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.podcast.podcastId}`;
      }
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
      },
    },

    iFrameWidth() {
      switch (this.iFrameModel) {
        case 'large':
          return '730px';
        default:
          return '355px';
      }
    },

    iFrameHeight() {
      switch (this.iFrameModel) {
        case 'large':
          return '165px';
        case 'emission':
          return '530px';
        default:
          return '494px';
      }
    },
  },

  methods: {
    async onCopyCode() {
      const iFrame = `<iframe src="${this.iFrameSrc}" width="${this.iFrameWidth}" height="${this.iFrameHeight}" scrolling="no" frameborder="0"></iframe>`;
      await navigator.clipboard.writeText(iFrame);
      this.$refs.snackbar.open(this.$t('Link in clipboard'));
    },
  },
};
</script>
