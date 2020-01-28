<template>
  <div class="w-100 transition-height bg-dark" v-bind:style="{ height: playerHeight }">
    <div
      class="player-container"
      v-bind:style="{ height: playerHeight }"
      @transitionend="onHidden"
    >
       <div class="progress secondary-bg c-hand" @mouseup="seekTo" v-if="isBarTop">
          <div 
          class="progress-bar primary-bg" 
          role="progressbar" 
          aria-valuenow="0" 
          aria-valuemin="0" 
          aria-valuemax="100" 
          :style="'width: '+ percentProgress + '%'"
          ></div>
          <div class="player-progress-border"></div>
        </div>
      <div class="d-flex align-items-center justify-center flex-grow pr-5 pl-5">
      <audio
        id="audio-player"
        v-bind:src="podcastAudioURL"
        autoplay
        @timeupdate="onTimeUpdate"
        @play="onPlay"
        @pause="onPause"
        @ended="onFinished"
        @playing="onPlay"
        @durationChange="onTimeUpdate"
      />
      <img
        v-bind:src="podcastImage"
        :alt="$t('Podcast image')"
        class="player-image"
        v-if="isImage"
      />
      <div
        class="play-button-box"
        v-bind:class="{
          'primary-bg': status != 'LOADING',
          'text-light': status != 'LOADING',
        }"
        @click="switchPausePlay"
      >
        <div
          class="text-light"
          v-bind:class="{
            saooti: status == 'PLAYING' || status == 'PAUSED',
            'saooti-play3': status == 'PAUSED',
            'saooti-pause22': status == 'PLAYING',
            loading: status == 'LOADING',
          }"
        ></div>
      </div>
      <div class="flex-grow d-flex flex-column text-light">
        <div class="d-flex">
          <div class="flex-grow player-title">{{ podcastTitle }}</div>
          <div v-if="!isBarTop" class="hide-phone">{{ playedTime }} / {{ totalTime }}</div>
        </div>
        <div class="progress c-hand" @mouseup="seekTo" style="height: 3px;" v-if="!isBarTop">
          <div class="progress-bar primary-bg" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" :style="'width: '+ percentProgress + '%'"></div>
        </div>
      </div>
      <router-link :to=podcastShareUrl class="text-light hide-phone">
        <div class="saooti-export-bounty c-hand m-2" ></div>
      </router-link>
      <div class="d-flex text-light align-items-center hide-phone" v-if="isClock">
        <div class="saooti-clock-stud m-2" ></div>
        <div>{{actualTime}}</div>
      </div>
    </div>
    </div>
  </div>
</template>
<style lang="scss">
@import '../../sass/_variables.scss';

.player-container {
  position: fixed;
  overflow: hidden;
  z-index: 10;
  width: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column;
  transition: height 1s;
  background: #282828 !important;
  max-width: 100%;
  font-size: 1rem;

  .player-image {
    border-radius: 0.2rem;
    height: 2.4rem;
    width: 2.4rem;
  }

  .play-button-box {
    height: 2.5rem;
    width: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 0.5rem;
    border-radius: 50%;
    font-size: 1.2rem;
    flex-shrink: 0;
    cursor: pointer;
  }
  .player-progress-border{
    height: 10px;
    width: 3px;
    background: black;
  }
  .progress{
    align-items: flex-end;
    height: 10px;
  }
  .progress-bar{
    height: 3px;
  }
}
/** PHONES*/
@media (max-width: 960px) {
  .player-container{
    .d-flex{
      @media (max-width: 960px) {
        flex-wrap: nowrap;
      }
    }
    .player-title{
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}
</style>

<script>
import { mapState } from 'vuex';
import {state} from "../../store/paramStore.js";
import DurationHelper from '../../helper/duration';
const moment = require('moment');

export default {
  name: 'Player',

  data() {
    return {
      forceHide: false,
      actualTime: '',
    };
  },
  mounted(){
    moment.locale('fr');
    if(this.isClock){
      setInterval(() => {
        this.actualTime = moment(new Date()).format("HH:mm:ss");
      }, 1000)
    }
  },

  computed: {
    isImage(){
      return state.player.image;
    },
    isEmissionName(){
      return state.player.emissionName;
    },
    isClock(){
      return state.player.clock;
    },
    isBarTop(){
      return state.player.barTop;
    },
    ...mapState({
      display: state => state.player.status != 'STOPPED',
      playerHeight(state) {
        if (state.player.status == 'STOPPED' || this.forceHide) {
          return 0;
        } else {
          return '5rem';
        }
      },
      status: state => state.player.status,
      podcast: state => state.player.podcast,
      volume: state => state.player.volume,

      podcastImage: state => {
        if (state.player.podcast) {
          return state.player.podcast.imageUrl;
        } else {
          return '';
        }
      },

      podcastAudioURL: state => {
        if (state.player.podcast) {
          let parameters = '?origin=octopus';
          parameters +=
            state.authentication && state.authentication.organisationId
              ? '&distributorId=' + state.authentication.organisationId
              : '';
          return state.player.podcast.audioUrl + parameters;
        } else {
          return '';
        }
      },

      podcastShareUrl: state => {
        if (state.player.podcast) {
          return "/main/pub/podcast/"+state.player.podcast.podcastId;
        } else {
          return '';
        }
      },

      playedTime: state => {
        if (state.player.elapsed > 0 && state.player.total > 0) {
          return DurationHelper.formatDuration(
            Math.round(state.player.elapsed * state.player.total)
          );
        } else {
          return "--':--'";
        }
      },

      percentProgress: state => {
        return state.player.elapsed * 100;
      },

      totalTime: state => {
        if (state.player.elapsed > 0 && state.player.total > 0) {
          return DurationHelper.formatDuration(Math.round(state.player.total));
        } else {
          return "--':--'";
        }
      },
    }),

    podcastTitle(){
      if (this.podcast) {
        if(this.isEmissionName){
          return this.emissionName + ' - ' + this.podcast.title;
        }else{
          return this.podcast.title;
        }
      } else {
        return '';
      }
    },

    emissionName(){
      if (this.podcast) {
        return this.podcast.emission.name;
      } else {
        return '';
      }
    },
  },

  methods: {
    switchPausePlay() {
      const audioPlayer = document.querySelector('#audio-player');
      if (audioPlayer.paused) {
        audioPlayer.play();
      } else {
        audioPlayer.pause();
      }
    },

    seekTo(event) {
      const audioPlayer = document.querySelector('#audio-player');
      const rect = event.currentTarget.getBoundingClientRect();
      const barWidth = event.currentTarget.clientWidth;
      const x = event.clientX - rect.left; //x position within the element.

      const percentPosition = x / barWidth;
      const seekTime = this.$store.state.player.total * percentPosition;

      audioPlayer.currentTime = seekTime;
    },

    onTimeUpdate(event) {
      const duration = event.currentTarget.duration;
      const currentTime = event.currentTarget.currentTime;
      if (duration && currentTime) {
        this.$store.commit('playerTotalTime', duration);
        this.$store.commit('playerElapsed', currentTime / duration);
      }
    },
    onPlay() {
      this.$store.commit('playerPause', false);
    },
    onPause() {
      this.$store.commit('playerPause', true);
    },

    onFinished() {
      this.$data.forceHide = true;
    },

    onHidden() {
      if (this.$data.forceHide) {
        this.$store.commit('playerPlayPodcast');
        this.$data.forceHide = false;
      }
    },
  },
  watch: {
    playerHeight(newVal){
      this.$emit('hide', newVal=== 0? true : false);
    }
  }
}; 
</script>
