<template>
  <div>
    <div class="page-box" v-if="loaded && !error">
      <h1>{{ $t('Episode') }}</h1>
      <div class="d-flex">
        <div class="d-flex flex-column flex-grow">
          <div class="module-box">
            <h2 class="text-uppercase font-weight-bold h3">{{ this.podcast.title }}</h2>
            <div class="mb-5 d-flex h6">
              <PodcastImage class="shadow-element mr-3" v-bind:podcast="podcast" hidePlay='false' :playingPodcast='playingPodcast' @playPodcast='playPodcast' />
              <div>
                <div class="d-flex align-items-left flex-wrap text-secondary mb-3">
                  <div class="mr-5">{{ date }}</div>
                  <div>{{ $t('Duration', { duration: duration }) }}</div>
                </div>
                <div>{{ this.podcast.description }}</div>
                <div class="mt-3 mb-3">
                  <div class="comma">{{ $t('Animated by : ') }}
                    <router-link
                      class="link-info"
                      v-bind:to="
                        '/main/pub/participant/' + animator.participantId
                      "
                      v-for="animator in podcast.animators"
                      v-bind:key="animator.participantId"
                    >{{ getName(animator) }}</router-link>
                  </div>
                  <div>{{ $t('Emission') + ' : ' }}
                    <router-link
                      class="link-info"
                      v-bind:to="
                        '/main/pub/emission/' + this.podcast.emission.emissionId
                      "
                    >{{ this.podcast.emission.name }}</router-link>
                  </div>
                  <div v-if="!isPodcastmaker">{{ $t('Producted by : ') }}
                    <router-link
                      class="link-info"
                      v-bind:to="'/main/pub/productor/' + podcast.organisation.id"
                    >{{ this.podcast.organisation.name }}</router-link>
                  </div>
                  <div class="comma" v-if="podcast.guests">{{ $t('Guests') + ' : ' }}
                    <router-link
                      class="link-info"
                      v-bind:to="'/main/pub/participant/' + guest.participantId"
                      v-for="guest in podcast.guests"
                      v-bind:key="guest.participantId"
                    >{{ getName(guest) }}</router-link>
                  </div>
                  <div v-if="editRight">
                    <div
                      class="mr-5"
                      v-if="podcast.annotations && podcast.annotations.RSS"
                    >{{ $t('From RSS') }}</div>
                      <div class="alert-text" v-if="!podcast.availability.visibility">
                        <img src="/img/caution.png" class="icon"/>
                        {{ $t('Podcast is not visible for listeners') }}
                      </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <EditBox :podcast="podcast" v-if="editRight && isEditBox"></EditBox>
        </div>
        <div class="d-flex flex-column">
          <SharePlayer
            :podcast="podcast"
            :emissionId="podcast.emission.emissionId"
            class="flex-grow"
            :exclusive="exclusive"
            :organisationId='organisationId'
            v-if="isSharePlayer"
          ></SharePlayer>
          <ShareButtons :podcastId="podcastId" class="flex-grow" v-if="isShareButtons"></ShareButtons>
        </div>
      </div>
      <PodcastInlineList
        :emissionId="this.podcast.emission.emissionId"
        :href="'/main/pub/emission/' + this.podcast.emission.emissionId"
        :title="$t('More episodes of this emission')"
        :buttonText="$t('All podcast emission button')"
      />
      <PodcastInlineList
        v-for="c in categories"
        :key="c.id"
        :iabId="c.id"
        :href="'/main/pub/category/' + c.id"
        :title="$t('More episodes of this category : ', { name: c.name })"
        :buttonText="$t('All podcast button', { name: c.name })"
      />
    </div>
    <div class="d-flex justify-content-center" v-if="!loaded">
      <div class="spinner-border mr-3"></div>
      <h3>{{ $t('Loading content ...') }}</h3>
    </div>
    <div class="text-center" v-if="error">
      <h3>{{ $t("Podcast doesn't exist") }}</h3>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import EditBox from "@/components/display/edit/EditBox.vue";
import SharePlayer from "@/components/display/sharing/SharePlayer.vue";
import ShareButtons from "@/components/display/sharing/ShareButtons.vue";
import PodcastInlineList from "@/components/display/podcasts/PodcastInlineList.vue";
import PodcastImage from "@/components/display/podcasts/PodcastImage.vue";
import octopusApi from "@saooti/octopus-api";
import parameters from "@/store/AppStore.js";
const moment = require("moment");
const humanizeDuration = require("humanize-duration");

export default {
  components: {
    PodcastInlineList,
    PodcastImage,
    ShareButtons,
    SharePlayer,
    EditBox
  },

  mounted() {
    this.getPodcastDetails(this.podcastId);
  },

  props: ["podcastId", "playingPodcast"],

  data() {
    return {
      loaded: false,
      podcast: undefined,
      error: false,
      exclusive: false
    };
  },

  computed: {
    isPodcastmaker(){
      return parameters.generalParameters.podcastmaker;
    },
    isEditBox(){
      return parameters.podcastPage.EditBox;
    },
    isShareButtons(){
      return parameters.podcastPage.ShareButtons;
    },
    isSharePlayer(){
      return parameters.podcastPage.SharePlayer;
    },
    allCategories(){
      return parameters.generalParameters.allCategories;
    },
    organisationId(){
      return parameters.generalParameters.organisationId;
    },
    authenticated(){
      return parameters.generalParameters.authenticated;
    },
    emissionMainCategory() {
      if (
        this.podcast.emission.annotations &&
        this.podcast.emission.annotations.mainIabId
      ) {
        return parseInt(this.podcast.emission.annotations.mainIabId, 10);
      } else if (
        this.podcast.emission.iabIds &&
        this.podcast.emission.iabIds.length
      ) {
        return this.podcast.emission.iabIds[0];
      } else {
        return 0;
      }
    },

    categories() {
      if (typeof this.podcast !== "undefined") {
        return this.allCategories
          .filter(item => {
            return this.podcast.emission.iabIds.indexOf(item.id) !== -1;
          })
          .sort((a, b) => {
            if (a.id === this.emissionMainCategory) return -1;
            if (b.id === this.emissionMainCategory) return 1;
            return 0;
          });
      } else {
        return "";
      }
    },

    date() {
      return moment(this.podcast.pubDate).format("D MMMM YYYY [à] HH[h]mm");
    },

    duration() {
      return humanizeDuration(this.podcast.duration, {
        language: "fr",
        largest: 1,
        round: true
      });
    },

    editRight() {
      if (this.authenticated) {
        if (this.organisationId === this.podcast.organisation.id) {
          return true;
        }
        if (parameters.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
    }
  },

  watch: {
    podcastId(val) {
      this.loaded = false;
      this.error = false;
      this.getPodcastDetails(val);
    }
  },

  methods: {
    getPodcastDetails(podcastId) {
      octopusApi
        .fetchPodcast(podcastId)
        .then(data => {
          this.podcast = data;
          if (
            this.podcast.emission.annotations &&
            this.podcast.emission.annotations.exclusive
          ) {
            this.exclusive =
              this.podcast.emission.annotations.exclusive == "true"
                ? true
                : false;
            this.exclusive =
              this.exclusive &&
              this.organisationId !== this.podcast.organisation.id;
          }
          if(!this.podcast.availability.visibility && !this.editRight){
            this.error= true;
          }
          this.loaded = true;
        })
        .catch(() => {
          this.error = true;
          this.loaded = true;
        });
    },
    getName(person) {
      const first = person.firstName || "";
      const last = person.lastName || "";
      return (first + " " + last).trim();
    },
    playPodcast(podcast){
      this.$emit('playPodcast', podcast);
    }
  }
};
</script>
