<template>
  <div class="d-flex flex-column align-items-center">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3>{{ $t('Loading podcasts ...') }}</h3>
    </div>
    <ul class="podcast-list" v-show="loaded">
      <PodcastItem
        v-bind:podcast="p"
        v-for="p in podcasts"
        v-bind:key="p.podcastId"
      />
    </ul>
    <a
      class="btn"
      v-bind:href="'/main/pub/podcasts?first=' + dfirst + '&size=' + dsize"
      :class="buttonPlus? 'btn-linkPlus': 'btn-more'"
      @click="displayMore"
      v-show="!allFetched && loaded"
    >
      <template v-if="buttonPlus">{{$t('See more')}}</template>
      <div class="saooti-plus"></div>
    </a>
  </div>
</template>

<style lang="scss">

.podcast-list {
  align-self: stretch;
  flex-grow: 1;
  margin: 0;
  padding: 0;
  /*For ie11 */
  display: flex;
  flex-wrap: wrap;
  /* end */
  display: grid; /* 1 */
  grid-template-columns: repeat(auto-fill, 13rem); /* 2 */
  grid-gap: 1rem; /* 3 */
  justify-content: space-between; /* 4 */
}
/** PHONES*/
@media (max-width: 960px) {
  .podcast-list {
    align-self: auto;
    justify-items: center;
    display: flex;
    justify-content: space-around;
  }
}
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import PodcastItem from './PodcastItem.vue';
import {state} from "../../../store/AppStore.js";

export default {
  name: 'PodcastList',

  props: [
    'first',
    'size',
    'organisationId',
    'emissionId',
    'iabId',
    'participantId',
    'query',
    'monetization'
  ],

  components: {
    PodcastItem,
  },

  created() {
    this.fetchContent(true);
  },

  data() {
    return {
      loading: true,
      loaded: true,
      dfirst: this.$props.first,
      dsize: this.$props.size,
      totalCount: 0,
      podcasts: [],
    };
  },

  computed: {
    allFetched() {
      return this.dfirst >= this.totalCount;
    },
    buttonPlus(){
      return state.generalParameters.buttonPlus;
    }
  },

  methods: {
    fetchContent(reset) {
      var self = this;
      if (reset) {
        self.$data.podcasts = [];
        self.$data.dfirst = 0;
        self.$data.loading = true;
        self.$data.loaded = false;
      }
      octopusApi
        .fetchPodcasts({
          first: self.dfirst,
          size: self.dsize,
          organisationId: self.organisationId,
          emissionId: self.emissionId,
          iabId: self.iabId,
          participantId: self.participantId,
          query: self.query,
          monetisable: self.monetization,
        })
        .then(function(data) {
          self.$data.loading = false;
          self.$data.loaded = true;
          self.$data.podcasts = self.$data.podcasts.concat(data.result).filter((p)=>{
            return p!== null;
          });
          self.$data.dfirst += self.$data.dsize;
          self.$data.totalCount = data.count;
        });
    },

    displayMore(event) {
      event.preventDefault();
      this.fetchContent(false);
    },
  },

  watch: {
    emissionId: {
      handler() {
        this.fetchContent(true);
      },
    },
    organisationId: {
      handler() {
        this.fetchContent(true);
      },
    },
    iabId: {
      handler() {
        this.fetchContent(true);
      },
    },
    participantId: {
      handler() {
        this.fetchContent(true);
      },
    },
    query: {
      handler() {
        this.fetchContent(true);
      },
    },
    monetization: {
      handler() {
        this.fetchContent(true);
      },
    },
  },
};
</script>
