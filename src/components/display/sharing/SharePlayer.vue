<template>
  <div>
    <div class="module-box text-center-mobile">
      <h3>{{ $t('Embed') }}</h3>
      <div class="d-flex flex-column align-items-center" v-if="!exclusive && authenticated">
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
        <div class="d-flex flex-column">
          <button class="btn mb-3" @click="onCopyCode">
            {{ $t('Copy code') }}
          </button>
          <select v-model="iFrameModel" class="frame-select">
            <option value="default">{{$t('Default version')}}</option>
            <option value="large">{{$t('Large version')}}</option>
            <option value="emission" v-if="podcast && podcast.podcastId">{{$t('Emission version')}}</option>
            <option value="largeEmission" v-if="podcast && podcast.podcastId">{{$t('Large emission version')}}</option>
            <option value="largeSuggestion" v-if="podcast && podcast.podcastId">{{$t('Large suggestion version')}}</option>
          </select>
        </div>
        <div class="d-flex align-items-center mt-3" v-if="!podcast || iFrameModel === 'emission' || iFrameModel === 'largeEmission' || iFrameModel === 'largeSuggestion'">
          <span>{{ $t('Show') }}</span>
          <input
            type="number"
            v-model="iFrameNumber"
            min="1"
            max="10"
            class="input-share-player input-no-outline text-center m-2"
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

<style lang="scss">
@import '../../../sass/_variables.scss';

.input-share-player{
  border: 1px solid #ddd;
  border-radius: 50px;
  input[type=number]{
    margin: 0 1rem;
    width: 100px;
  }
}
.sticker{
  align-self:center;
  background:rgba($octopus-primary-color, 0.3);
  padding:0.5rem;
  transition:all .5s ease;
  color:#41403E;
  letter-spacing:1px;
  outline:none;
  box-shadow: 10px 10px 34px -15px hsla(0,0%,0%,.4);
  border-radius: 255px 15px 225px 15px/15px 225px 15px 255px;
  border:solid 2px #41403E;
    &:hover{
      box-shadow:2px 8px 4px -6px hsla(0,0%,0%,.3);
  } 
}
</style>

<script>
import Snackbar from '../../misc/Snackbar.vue';
import {state} from "../../../store/paramStore.js";

export default {
  props: ['podcast', 'emissionId', "organisationId", 'exclusive'],

  components:{
    Snackbar
  },

  data() {
    return {
      iFrameModel:'default',
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
      return state.generalParameters.authenticated;
    },

    iFrameSrc() {
      if(!this.podcast){
        if(this.iFrameModel === 'default'){
          return `${state.podcastPage.MiniplayerUri}miniplayer/emission/${this.emissionId}/${this.iFrameNumberPriv}`;
        } else{
          return `${state.podcastPage.MiniplayerUri}miniplayer/emissionLarge/${this.emissionId}/${this.iFrameNumberPriv}`;
        }
      }else {
        if (this.iFrameModel === 'emission' || this.iFrameModel === 'largeEmission') {
            return `${state.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.emissionId}/${this.iFrameNumberPriv}/${this.podcast.podcastId}`;
        } else if(this.iFrameModel === 'largeSuggestion'){
            return `${state.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.podcast.podcastId}/${this.iFrameNumberPriv}`;
        }else {
          return `${state.podcastPage.MiniplayerUri}miniplayer/${this.iFrameModel}/${this.podcast.podcastId}`;
        }
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
      return '100%';
    },

    iFrameHeight() {
      switch (this.iFrameModel) {
        case 'large':
          if(this.podcast){
            return '110px';
          } else{
            return '450px';
          }
        case 'largeEmission':
        case 'largeSuggestion':
          return '435px';
        case 'emission':
          return '530px';
        default:
          if(this.podcast){
            return '520px';
          } else{
            return '530px';
          }

      }
    },
  },

  methods: {
    async onCopyCode() {
      const iFrame = `<iframe src="${this.iFrameSrc}" width="${this.iFrameWidth}" height="${this.iFrameHeight}" scrolling="no" frameborder="0"></iframe>`;
      if (typeof(navigator.clipboard)=='undefined') {
        let textArea = document.createElement("textarea");
        textArea.value = iFrame;
        textArea.style.position="fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        var successful = document.execCommand('copy');
        if(successful){
          this.$refs.snackbar.open(this.$t('Link in clipboard'));
        }
        document.body.removeChild(textArea)            
      } else{
        await navigator.clipboard.writeText(iFrame);
        this.$refs.snackbar.open(this.$t('Link in clipboard'));
      }
    },
  },
};
</script>
