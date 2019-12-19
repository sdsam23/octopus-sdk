<template>
  <div class="placeholder bg-dark" v-bind:style="{ height: playerHeight }">
    <div
      class="container bg-dark"
      v-bind:style="{ height: playerHeight }"
      @transitionend="onHidden"
    >
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
        class="podcast-image"
      />
      <div
        class="play-button-box c-hand"
        v-bind:class="{
          'bg-primary': status != 'LOADING',
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
      <div class="desc-box">
        <div class="box">
          <div class="title">{{ podcastTitle }}</div>
          <div class="elapsed-box">{{ playedTime }} / {{ totalTime }}</div>
        </div>
        <div class="progress-box c-hand" @mouseup="seekTo">
          <div class="bar bar-slider">
            <div
              class="bar-item"
              role="progressbar"
              v-bind:style="{ width: percentProgress + '%' }"
            >
              <button class="bar-slider-btn btn" role="slider"></button>
            </div>
          </div>
        </div>
      </div>
      <router-link
        :to=podcastShareUrl
        class="text-light"
      >
        <div class="icon-box" :title="$t('Go to episode page')">
          <div class="icon icon-share c-hand"></div>
        </div>
      </router-link>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.placeholder {
  width: 100%;
  transition: height 1s;
}

.container {
  position: fixed;
  overflow: hidden;
  z-index: 10;
  width: 100%;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 10%;
  transition: height 1s;
      background: #282828 !important;

  .podcast-image {
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
  }

  .desc-box {
    flex-grow: 1;
    display: flex;
    flex-direction: column;

    .box {
      display: flex;

      .title {
        flex-grow: 1;
      }
    }
  }

  .icon-box {
    > .icon {
      margin: 0.5rem;
      font-size: 1rem;
    }
  }
}

/** PHONES*/
@media (max-width: 960px) {
  .container {
    max-height: 3rem;
    padding: 0 0.6rem;

    .desc-box {
      .box {
        flex-wrap: wrap;

        .title {
          width: 5rem;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-right: 5px;
          font-size: 0.58rem;
        }
      }
    }
  }
}
</style>

<script>
import parameters from "@/store/AppStore.js";
import DurationHelper from '@/helper/duration';

export default {
  name: 'Player',

  data() {
    return {
      forceHide: false,
    };
  },

  props:['status', 'podcast', 'volume', 'total', 'elapsed'],

  computed: {
    display(){
      return this.status != 'STOPPED';
    },
    playerHeight() {
      if (this.status == 'STOPPED' || this.forceHide) {
        return 0;
      } else {
        return '5rem';
      }
    },
    podcastImage(){
      if (this.podcast) {
        return this.podcast.imageUrl;
      } else {
        return '';
      }
    },
    podcastTitle(){
      if (this.podcast) {
        return this.podcast.title;
      } else {
        return '';
      }
    },

    podcastAudioURL(){
      if (this.podcast) {
        let urlParameters = '?origin=octopus';
        urlParameters +=
          parameters.generalParameters.authenticated && parameters.generalParameters.organisationId
            ? '&distributorId=' + parameters.generalParameters.organisationId
            : '';
        return this.podcast.audioUrl + urlParameters;
      } else {
        return '';
      }
    },

    podcastShareUrl(){
      if (this.podcast) {
        return "/main/pub/podcast/"+this.podcast.podcastId;
      } else {
        return '';
      }
    },
    playedTime(){
      if (this.elapsed > 0 && this.total > 0) {
        return DurationHelper.formatDuration(
          Math.round(this.elapsed * this.total)
        );
      } else {
        return "--':--'";
      }
    },

    percentProgress(){
      return this.elapsed * 100;
    },

    totalTime(){
      if (this.elapsed > 0 && this.total > 0) {
        return DurationHelper.formatDuration(Math.round(this.total));
      } else {
        return "--':--'";
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
      const seekTime = this.total * percentPosition;

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
