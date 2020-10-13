<template>
  <div class="w-100 transition-height bg-dark" v-bind:style="{ height: playerHeight }">
    <div class="player-container" v-bind:style="{ height: playerHeight }" @transitionend="onHidden">
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
          v-bind:src="audioUrl"
          autoplay
          @timeupdate="onTimeUpdate"
          @ended="onFinished"
          @playing="onPlay"
          @durationChange="onTimeUpdate"
          @error="onError"
          v-if="!live"
        />
        <audio
          id="audio-player"
          src
          @timeupdate="onTimeUpdate"
          @ended="onFinished"
          @playing="onPlay"
          @durationChange="onTimeUpdate"
          @error="onError"
          v-else
        />
        <router-link :to="podcastShareUrl" v-if="isImage && podcastImage">
          <img v-bind:src="podcastImage" :alt="$t('Podcast image')" class="player-image c-hand" />
        </router-link>

        <div
          v-if="!playerError"
          class="play-button-box"
          v-bind:class="{
          'primary-bg': status != 'LOADING',
          'text-light': status != 'LOADING',
        }"
          @click="switchPausePlay"
        >
          <div
            class="text-light"
            :aria-label="$t('Play')"
            v-bind:class="{
            saooti: status == 'PLAYING' || status == 'PAUSED',
            'saooti-play2-bounty': status == 'PAUSED',
            'saooti-pause-bounty': status == 'PLAYING',
            loading: status == 'LOADING',
          }"
          ></div>
        </div>
        <div
          v-if="(status=== 'PLAYING' || status=== 'PAUSED')&& (media|| isStop)"
          class="play-button-box primary-bg text-light"
          @click="stopPlayer"
        >
          <div class="text-light saooti-stop-bounty" :aria-label="$t('Stop')"></div>
        </div>
        <div class="text-light player-grow-content">
          <div class="d-flex">
            <div
              class="text-warning player-title ml-2 mr-2"
              v-if="playerError"
            >{{ $t('Podcast play error') + " - "}}</div>
            <div class="flex-grow player-title">{{ podcastTitle }}</div>
            <div
              v-if="!playerError"
              v-show="!isBarTop"
              class="hide-phone"
            >{{ playedTime }} / {{ totalTime }}</div>
          </div>
          <div
            class="progress c-hand custom-bg-darkgrey"
            @mouseup="seekTo"
            style="height: 3px;"
            v-if="!playerError"
            v-show="!isBarTop"
          >
            <div
              class="progress-bar custom-bg-grey"
              role="progressbar"
              aria-valuenow="0"
              aria-valuemin="0"
              aria-valuemax="100"
              :style="'width: '+ percentLiveProgress + '%'"
            ></div>
            <div
              class="progress-bar primary-bg"
              role="progressbar"
              aria-valuenow="0"
              aria-valuemin="0"
              aria-valuemax="100"
              :style="'width: '+ percentProgress + '%'"
            ></div>
            <div
              class="progress-bar progress-bar-duration bg-danger"
              v-if="displayAlertBar"
              :style="'left: '+ durationLivePosition + '%'"
            ></div>
          </div>
        </div>
        <div class="d-flex text-light align-items-center hide-phone" v-if="isClock">
          <div class="saooti-clock-stud m-2"></div>
          <div>{{actualTime}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@import "../../sass/_variables.scss";

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



.player-container {
  position: fixed;
  overflow: hidden;
  z-index: 12;
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
  .player-progress-border {
    height: 10px;
    width: 3px;
    background: black;
  }
  .progress {
    align-items: flex-end;
    height: 10px;
    position: relative;
  }
  .progress-bar-duration {
    width: 10px;
  }
  .progress-bar {
    height: 4px;
    position: absolute;
  }

  .progress.custom-bg-darkgrey{
    background: #555;
  }

  .progress-bar.custom-bg-grey{
    background: #e9ecef;
  }

  .player-title,
  .hide-phone {
    font-size: 0.8rem;
    margin: 0 0 5px 0;
  }
  .player-grow-content {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    flex-shrink: 1;
    flex-basis: 20px;
    overflow: hidden;
  }
  .player-title {
    font-size: 0.8rem;
    margin: 0 0 5px 0;
  }

  .hide-phone {
    font-size: 0.8rem;
    margin: 0 0 5px 0;
  }
}
/** PHONES*/
@media (max-width: 450px) {
  .player-container {
        .player-image {
          height: 2rem;
          width: 2rem;
        }
  }
}

@media (max-width: 960px) {
  .player-container {
    .d-flex {
      @media (max-width: 960px) {
        flex-wrap: nowrap !important;
      }
    }
    .player-title {
      font-size: 12px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }
}

</style>

<script>
import { mapState } from "vuex";
import { state } from "../../store/paramStore.js";
import DurationHelper from "../../helper/duration";
import octopusApi from "@saooti/octopus-api";
import Hls from "hls.js";
const moment = require("moment");
//const axios = require("axios");

export default {
  name: "Player",

  data() {
    return {
      forceHide: false,
      actualTime: "",
      listenTime: 0,
      notListenTime: 0,
      lastSend: 0,
      _downloadId: null,
      playerError: false,
      listenError: false,
      percentLiveProgress: 0,
      durationLivePosition: 0,
      displayAlertBar: false,
      hlsReady: false,
    };
  },

  mounted() {
    moment.locale("fr");
    if (this.isClock) {
      setInterval(() => {
        this.actualTime = moment(new Date()).format("HH:mm:ss");
      }, 1000);
    }

    window.addEventListener("beforeunload", this.endListeningProgress);

    this.$store.watch(
      (state) => state.player.status,
      (newValue) => {
        const audioPlayer = document.querySelector("#audio-player");
        if(!audioPlayer){
          return;
        }
        if(this.live && !this.hlsReady){
          audioPlayer.pause();
          this.percentLiveProgress= 0;
          this.durationLivePosition= 0;
          return;
        }
        if (newValue === "PAUSED") {
          audioPlayer.pause();
        } else {
          audioPlayer.play();
        }
      }
    );
  },

  computed: {
    isImage() {
      return state.player.image;
    },
    isEmissionName() {
      return state.player.emissionName;
    },
    isClock() {
      return state.player.clock;
    },
    isBarTop() {
      return state.player.barTop;
    },
    ...mapState({
      display: (state) => state.player.status != "STOPPED",
      playerHeight(state) {
        if (state.player.status == "STOPPED" || this.forceHide) {
          return 0;
        } else if(window.innerWidth>450){
          return "5rem";
        }else{
          return "3.5rem";
        }
      },
      status: (state) => state.player.status,
      podcast: (state) => state.player.podcast,
      media: (state) => state.player.media,
      live: (state) => state.player.live,
      volume: (state) => state.player.volume,
      isStop: (state) => state.player.stop,

      podcastImage: (state) => {
        if (state.player.podcast) {
          return state.player.podcast.imageUrl;
        } else {
          return "";
        }
      },

      playedTime: (state) => {
        if (state.player.elapsed > 0 && state.player.total > 0) {
          return DurationHelper.formatDuration(
            Math.round(state.player.elapsed * state.player.total)
          );
        } else {
          return "--:--";
        }
      },

      percentProgress: (state) => {
        return state.player.elapsed * 100;
      },

      totalTime: (state) => {
        if (state.player.elapsed > 0 && state.player.total > 0) {
          return DurationHelper.formatDuration(Math.round(state.player.total));
        } else {
          return "--:--";
        }
      },
    }),

    audioUrl() {
      if (this.media) {
        return this.media.audioUrl;
      }
      if (this.podcast) {
        if (!this.podcast.availability.visibility) {
          return this.podcast.audioStorageUrl;
        }
        if (this.listenError) {
          return this.podcast.audioStorageUrl;
        }

        let parameters = []
        parameters.push("origin=octopus")
        parameters.push("cookieName=player_" + this.podcast.podcastId);
        if( this.$store.state.authentication && this.$store.state.authentication.organisationId){
          parameters.push("distributorId=" + this.$store.state.authentication.organisationId)
        }
        return this.podcast.audioUrl +"?"+ parameters.join("&");
      }
      return "";
    },

    podcastShareUrl() {
      if (this.podcast) {
        return {
          name: "podcast",
          params: { podcastId: this.podcast.podcastId },
          query: { productor: this.$store.state.filter.organisationId },
        };
      } else {
        return "";
      }
    },

    podcastTitle() {
      if (this.podcast) {
        if (this.isEmissionName) {
          return this.emissionName + " - " + this.podcast.title;
        } else {
          return this.podcast.title;
        }
      } else if (this.media) {
        return this.media.title;
      } else if (this.live) {
        if(!this.hlsReady) {
          return this.live.title + " ("+this.$t("Start in a while")+")";
        }
        return this.live.title;
      } else {
        return "";
      }
    },

    emissionName() {
      if (this.podcast) {
        return this.podcast.emission.name;
      } else {
        return "";
      }
    },
  },

  methods: {
    getDownloadId() {
      return this._downloadId;
    },

    setDownloadId(newValue) {
      this.endListeningProgress();
      this._downloadId = newValue;
    },

    onError() {
      if (this.podcast && !this.listenError) {
        this.listenError = true;
      } else if (this.podcast || this.media) {
        this.playerError = true;
      }
    },

    switchPausePlay() {
      const audioPlayer = document.querySelector("#audio-player");
      if (audioPlayer.paused) {
        this.onPlay();
      } else {
        this.onPause();
      }
    },

    stopPlayer() {
      this.$store.commit('playerPlayPodcast');
    },

    seekTo(event) {
      const audioPlayer = document.querySelector("#audio-player");
      const rect = event.currentTarget.getBoundingClientRect();
      const barWidth = event.currentTarget.clientWidth;
      const x = event.clientX - rect.left; //x position within the element.

      const percentPosition = x / barWidth;
      if (percentPosition * 100 < this.percentLiveProgress) {
        const seekTime = this.$store.state.player.total * percentPosition;
        if (this.podcast || this.live) {
          this.notListenTime = seekTime - this.listenTime;
        }
        audioPlayer.currentTime = seekTime;
      }
    },

    onTimeUpdate(event) {
      if (this.podcast || this.live) {
        if(!this.getDownloadId()){
          this.loadDownloadId();
        }
        if (
          this.live &&
          this.listenTime === 0 &&
          event.currentTarget.currentTime !== 0
        ) {
          this.notListenTime = event.currentTarget.currentTime;
          this.listenTime = 1;
        } else {
          this.listenTime =   event.currentTarget.currentTime - this.notListenTime;
        }
      }

      const streamDuration = event.currentTarget.duration;
      if(!streamDuration){
        return;
      }

      const playerCurrentTime = event.currentTarget.currentTime;
      if(!playerCurrentTime) {
        return;
      }

      if(!this.live){
        this.displayAlertBar = false;
        this.percentLiveProgress = 100;
        this.$store.commit('playerTotalTime', streamDuration);
        this.$store.commit('playerElapsed', playerCurrentTime / streamDuration);
        return;
      }

      const scheduledDuration = this.live.duration / 1000
      if (scheduledDuration > streamDuration) {
          this.displayAlertBar = false;
          this.percentLiveProgress = (streamDuration / scheduledDuration) * 100;
          this.$store.commit('playerTotalTime', scheduledDuration);
          this.$store.commit('playerElapsed',   playerCurrentTime / scheduledDuration);
      } else {
          this.percentLiveProgress = 100;
          this.displayAlertBar = true;
          this.durationLivePosition = (scheduledDuration / streamDuration) * 100;
          this.$store.commit('playerTotalTime', streamDuration);
          this.$store.commit('playerElapsed', playerCurrentTime / streamDuration);
      }
    },

    onPlay() {
      this.$store.commit("playerPause", false);
    },

    onPause() {
      this.$store.commit("playerPause", true);
    },

    onFinished() {
      this.setDownloadId(null);
      if (this.live) {
        let audio = document.getElementById("audio-player");
        audio.src = "";
      }
      this.$data.forceHide = true;
    },

    onHidden() {
      if (this.$data.forceHide) {
        this.$store.commit("playerPlayPodcast");
        this.$data.forceHide = false;
      }
    },

    loadDownloadId() {
      if(this.podcast){
        const matching_cookies = document.cookie.split(";")
                                 .map((item) => {
                                    const _return = item.trim().split("=");
                                    return _return.map((item) => item.trim())
                                 })
                                 .filter((item) => {
                                    return item[0] === "player_"+this.podcast.podcastId
                                 })
        if(matching_cookies.length === 1){
          this.setDownloadId(matching_cookies[0][1])
        }
      }
    },

    async endListeningProgress() {
      if (this.getDownloadId()) {
        await octopusApi.updatePlayerTime(
          this.getDownloadId(),
          Math.round(this.listenTime)
        );
        this.setDownloadId(null);
        this.notListenTime = 0;
        this.lastSend = 0;
        this.listenTime = 0;
      }
    },

    async initHls(audio, hlsStreamUrl){
      return new Promise((resolve, reject) => {
        if (!Hls.isSupported()) {
         reject("Hls is not supported ! ");
        }
        var hls = new Hls();
        hls.on(Hls.Events.MANIFEST_PARSED, async () =>{
          let downloadId = null;
          downloadId = await octopusApi.requestLiveDownloadId(this.live.livePodcastId);
          await octopusApi.markPlayingLive(this.live.livePodcastId, downloadId, "octopus", this.$store.state.authentication.organisationId);
          this.setDownloadId(downloadId);
          this.hlsReady = true;
          hls.attachMedia(audio);
          await audio.play();
          this.onPlay();
          resolve();
        });
        hls.on(Hls.Events.ERROR, async () => {
          reject("There is an error while reading media content")
        });
        hls.loadSource(hlsStreamUrl);
      })
    },

    async playLive(){
      if(this.live){
        let audio = document.getElementById('audio-player');
        let hlsStreamUrl = state.podcastPage.hlsUri+'stream/dev.'+this.live.conferenceId+'/index.m3u8';
        try{
          await this.initHls(audio, hlsStreamUrl);
        } catch(error) {
          console.log(error);
          setTimeout(()=>{this.playLive();}, 1000);
        }
      }
    },
  },

  watch: {
    async live() {
      this.hlsReady = false;
      this.setDownloadId(null);
      this.listenError = false;
      await this.playLive();

    },

    playerHeight(newVal) {
      this.$emit("hide", newVal === 0 ? true : false);
    },

    podcast() {
      this.setDownloadId(null);
      this.listenError = false;
    },

    async listenTime(newVal) {
      if (!this.podcast && !this.live) {
        //Nothing can be done there is no listen time
        return;
      }
      if(!this.getDownloadId()){
        //nothing can be done there is no downloadId
        return;
      }
      if(newVal - this.lastSend < 10) {
        //Last send is too recent, do nothing
        return;
      }
      this.lastSend = newVal;
      await octopusApi.updatePlayerTime(this.getDownloadId(), Math.round(newVal));
    },
  },
};
</script>
