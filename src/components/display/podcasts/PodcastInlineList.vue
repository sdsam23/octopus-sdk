<template>
  <div class="d-flex flex-column p-3">
    <h2>{{ title }}</h2>
    <div class="d-flex justify-content-between">
      <div class="d-flex" v-if="requirePopularSort === undefined">
        <button
          class="btn btn-underline"
          @click="sortPopular()"
          :class="{ active: popularSort }"
        >{{ $t('Most popular') }}</button>
        <button
          class="btn btn-underline"
          @click="sortChrono()"
          :class="{ active: !popularSort }"
        >{{ $t('Last added') }}</button>
      </div>
      <div class="hide-phone" v-if="!isArrow">
        <button class="btn btn-arrow" @click="displayPrevious()" :class="{ disabled: !previousAvailable }">
          <div class="saooti-arrow-left2"></div>
        </button>
        <button class="btn btn-arrow" @click="displayNext()" :class="{ disabled: !nextAvailable }">
          <div class="saooti-arrow-right2"></div>
        </button>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3>{{ $t('Loading podcasts ...') }}</h3>
    </div>
    <transition-group :name="transitionName" class="podcast-list-inline" tag="ul" v-show="loaded">
      <PodcastItem class="flex-shrink" v-bind:podcast="p" v-for="p in podcasts" v-bind:key="p.podcastId" />
    </transition-group>
    <a class="btn btn-link" :class="buttonPlus? 'btn-linkPlus': ''" v-bind:href="href">{{buttonText}}<div class="saooti-plus" v-if="buttonPlus"></div></a>
  </div>
</template>

<style lang="scss">

  .podcast-list-inline {
    align-self: stretch;
    flex-grow: 1;
    margin: 0;
    padding: 0;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    display: grid	;
    grid-auto-flow: column;
    grid-gap: 1rem;
    grid-row: 1;
  }
  .out-left-enter-active,
  .out-left-leave-active,
  .out-right-enter-active,
  .out-right-leave-active {
    transition: all 0.3s ease;
  }

  .out-left-leave-to,
  .out-right-enter {
    transform: translateX(-110%);
    opacity: 0;
  }

  .out-left-enter,
  .out-right-leave-to {
    transform: translateX(110%);
    opacity: 0;
  }

  .out-left-leave-to,
  .out-right-leave-to {
    position: absolute;
  }
  .out-right-leave-to {
    right: 5rem;
    z-index: -1;
  }
/** PHONES*/
@media (max-width: 960px) {
  .podcast-list-inline{
    display: flex;
    flex-wrap: nowrap;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    padding: 2rem 0px;
    width: 100%;
  }
}
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import domHelper from "../../../helper/dom";
import PodcastItem from "./PodcastItem.vue";

const PHONE_WIDTH = 960;

export default {
  name: "PodcastInlineList",

  props: [
    "organisationId",
    "emissionId",
    "iabId",
    "title",
    "href",
    "buttonText",
    "requirePopularSort",
    "isArrow",
    "buttonPlus"
  ],

  components: {
    PodcastItem
  },

  created() {
    if(this.requirePopularSort !== undefined){
      this.popularSort = this.requirePopularSort
    }
    if(this.isArrow !== undefined){
      this.isArrow = true;
    }
    window.addEventListener("resize", this.handleResize);
  },

  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },

  mounted() {
    this.handleResize();
    this.fetchNext();
  },

  data() {
    return {
      loading: true,
      loaded: true,
      index: 0,
      first: 0,
      size: 5,
      totalCount: 0,
      popularSort: true,
      allPodcasts: [],
      direction: 1
    };
  },

  computed: {
    podcasts() {
      return this.allPodcasts.slice(this.index, this.index + this.size);
    },

    previousAvailable() {
      return this.index > 0;
    },
    nextAvailable() {
      return this.index + this.size < this.totalCount;
    },
    transitionName: ({ direction }) =>
      direction > 0 ? "out-left" : "out-right"
  },

  methods: {
    fetchNext() {
      octopusApi
        .fetchPodcasts({
          first: this.first,
          size: this.size + 1,
          organisationId: this.organisationId,
          emissionId: this.emissionId,
          iabId: this.iabId,
          sort: this.popularSort ? "POPULARITY" : "DATE"
        })
        .then(data => {
          this.loading = false;
          this.loaded = true;
          this.totalCount = data.count;
          if (this.allPodcasts.length + data.result.length < this.totalCount) {
            let nexEl = data.result.pop();
            this.preloadImage(nexEl.imageUrl);
          }
          this.allPodcasts = this.allPodcasts.concat(data.result);
          this.first += this.size;
        });
    },

    displayPrevious() {
      this.direction = -1;
      if (this.previousAvailable) {
        this.index -= 1;
      }
    },

    displayNext() {
      this.direction = 1;
      if (this.nextAvailable) {
        if (
          this.first - (this.index + this.size) < 2 &&
          this.allPodcasts.length < this.totalCount
        ) {
          this.fetchNext();
        }
        this.index += 1;
      }
    },

    handleResize() {
      if (this.$el) {
        const width = this.$el.offsetWidth;
        if (width <= PHONE_WIDTH - 255) {
          this.size = 10;
        } else {
          const one = domHelper.convertRemToPixels(1);
          const fourteen = domHelper.convertRemToPixels(14);
          this.size = Math.floor((width + one) / fourteen);
        }
      }
    },

    sortPopular() {
      if (!this.popularSort) {
        this.popularSort = true;
        this.reset();
        this.fetchNext();
      }
    },

    sortChrono() {
      if (this.popularSort) {
        this.popularSort = false;
        this.reset();
        this.fetchNext();
      }
    },

    reset() {
      this.loading = true;
      this.loaded = true;
      this.index = 0;
      this.first = 0;
      this.totalCount = 0;
      this.allPodcasts = [];
    },

    preloadImage(url) {
      let img = new Image();
      img.src = url;
    }
  },

  watch: {
    emissionId: {
      handler() {
        this.fetchContent(true);
      }
    },
    organisationId: {
      handler() {
        this.fetchContent(true);
      }
    },
    iabId: {
      handler() {
        this.fetchContent(true);
      }
    }
  }
};
</script>