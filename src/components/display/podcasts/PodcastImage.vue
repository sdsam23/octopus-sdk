<template>
  <div
    class="img-box d-flex flex-column justify-content-start align-items-start position-relative justify rounded-lg flex-shrink"
    :style="{ 'background-image': 'url(\'' + podcast.imageUrl + '\')' }"
    v-if="podcast"
  >
    <div class="podcast-image-play-button" v-on:click="play" v-if="hidePlay">
      <div class="icon-container">
        <div
          class="saooti-play2-bounty primary-color"
          v-show="!playingPodcast"
        ></div>
        <div class="bloc-paddle" v-show="playingPodcast">
          <span class="paddle1 primary-color"></span>
          <span class="paddle2 primary-color"></span>
          <span class="paddle3 primary-color"></span>
        </div>
      </div>
    </div>
    <div class="background-icon saooti-arrow-up2" v-if="!isDescription && displayDescription && isMobile" @click="showDescription"></div>
    <div class="background-icon saooti-arrow-down2" v-if="isDescription && displayDescription && isMobile" @click="showDescription"></div>
  </div>
</template>

<style lang="scss">

.podcast-image-play-button {
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: pointer;

  .icon-container {
    background: #00000050;
    border-radius: 50%;
    height: 3rem;
    width: 3rem;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: #00000030;;
    }

    > .saooti-play2-bounty {
      font-size: 2em;
      position: relative;
      right: -0.2rem;
    }
    z-index: 2;

    .bloc-paddle {
      align-items: flex-end;
      display: flex;
      width: 2rem;
      height: 2.6rem;
      padding: 0.7rem;
      justify-content: space-around;
      align-content: flex-start;
      border-radius: 50%;
      background: transparent !important;

      > span {
        width: 0.1rem;
        background: #fff;
      }

      .paddle1 {
        animation-duration: 0.6s;
        animation-name: slidein;
        animation-iteration-count: infinite;
        animation-direction: alternate;
      }

      .paddle2 {
        animation-duration: 0.3s;
        animation-name: slidein2;
        animation-iteration-count: infinite;
        animation-direction: alternate;
      }

      .paddle3 {
        animation-duration: 0.5s;
        animation-name: slidein3;
        animation-iteration-count: infinite;
        animation-direction: alternate;
      }
    }
  }

  @keyframes slidein {
    0% {
      height: 0;
    }
    100% {
      height: 1rem;
    }
  }

  @keyframes slidein2 {
    0% {
      height: 0.3rem;
    }
    100% {
      height: 1.2rem;
    }
  }

  @keyframes slidein3 {
    0% {
      height: 1.2rem;
    }
    100% {
      height: 0;
    }
  }
}
</style>

<script>
import parameters from "@/store/AppStore.js";
export default {
  name: 'PodcastImage',

  props: ['podcast', 'hidePlay', 'displayDescription', 'arrowDirection', 'playingPodcast'],

  computed: {
    isMobile(){
      return window.matchMedia( "(hover: none)" ).matches;
    }
  },

  data() {
    return {
      isDescription : false,
    };
  },

  methods: {
    play() {
      this.$emit('playPodcast', this.podcast);
    },
    showDescription(){
      if(this.isDescription){
        this.$emit('hideDescription');
      }else {
         this.$emit('showDescription');
      }
      this.isDescription = !this.isDescription;
    }
  },

  watch:{
    arrowDirection(newValue){
      if(newValue === 'up'){
        this.isDescription = true;
        this.showDescription();
      }else{
        this.isDescription = false;
        this.showDescription();
      }
    }
  }
};
</script>
