<template>
  <div>
    <div class="content-container" v-if="loaded && !error">
      <h1>{{ $t('Podcast') }}</h1>
      <div class="flex-container">
        <div class="flex-column-container white-container">
          <h2 class="text-uppercase">{{ this.podcast.title }}</h2>
					<!-- <PodcastImage class="shadow-img" v-bind:podcast="podcast" hidePlay='false' /> -->
					<div class="date-box">
						<div class="date">{{ date }}</div>
						<div>{{ $t('Duration', { duration: duration }) }}</div>
					</div>
					<div class="text-description">{{ this.podcast.description }}</div>
					<div class="margin-container">
						<div class="text-description comma">
							{{ $t('Animated by : ') }}
							<router-link
									class="link-info"
									v-bind:to="
									'/participant/' + animator.participantId
									"
									v-for="animator in podcast.animators"
									v-bind:key="animator.participantId"
							>{{ getName(animator) }}</router-link>
						</div>
						<div class="text-description">
							{{ $t('Emission') + ' : ' }}
							<router-link
									class="link-info"
									v-bind:to="
									'/emission/' + this.podcast.emission.emissionId
									"
							>{{ this.podcast.emission.name }}</router-link>
						</div>
						<div class="text-description comma" v-if="podcast.guests">
							{{ $t('Guests') + ' : ' }}
							<router-link
									class="link-info"
									v-bind:to="'/participant/' + guest.participantId"
									v-for="guest in podcast.guests"
									v-bind:key="guest.participantId"
							>{{ getName(guest) }}</router-link>
						</div>
					</div>
        </div>
      </div>
    </div>
    <div class="loading-box" v-show="!loaded">
      <p>{{ $t('Loading content ...') }}</p>
      <div class="loading loading-lg"></div>
    </div>
    <div class="loading-box" v-if="error">
      <h2>{{ $t("Podcast doesn't exist") }}</h2>
    </div>
  </div>
</template>

<style lang="scss">
@import '../../sass/_variables.scss';
.content-container {
  padding: 3rem;
  border-radius: 2rem 2rem 0 0;
  background-color: $background;
}
.flex-container{
  display: flex;
}
.flex-column-container {
  display: flex;
  flex-direction: column;
}
.white-container {
  background-color: #fafafa;
  padding: 2rem;
  margin: 1rem 1rem 0 1rem;
  border-radius: 1rem;
  flex-grow: 1;
}
.text-uppercase{
  text-transform: uppercase;
}
.date-box {
  display: flex;
  align-items: left;
  flex-wrap: wrap;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: grey;
  .date {
    margin-right: 5rem;
  }
}
.text-description {
  font-weight: 500;
  font-size: 0.8rem;
  .link-info {
    font-weight: bold;
    color: $primary-color;
    cursor: pointer;
  }
}
.margin-container {
  margin: 1rem 0 1.5rem;
}
.comma {
  > a {
    text-transform: capitalize;
    &:after {
      content: ", ";
    }
    &:last-child {
      &:after {
        content: "";
      }
    }
  }
}
@media (max-width: 1200px) {
  .content-container {
    padding: 1rem;
    .img-box {
      float: none;
      margin: 1rem auto;
    }
  }
}
/** PHONES*/
@media (max-width: 960px) {
  .white-container{
    margin: 1rem;
  }
}

@media (max-width: 400px) {
  h1 {
    margin-bottom: 0.5rem;
  }
  .white-container{
    margin: 0;
    padding: 0.3rem;
  }
  .pcontent-container {
    padding: 0.3rem;
  }
}
</style>


<script>
/* import PodcastImage from "@/components/display/podcasts/PodcastImage.vue"; */
import octopusApi from '@saooti/octopus-api';
const moment = require("moment");
const humanizeDuration = require("humanize-duration");

export default {
  /* components: {
    PodcastImage,
  }, */

  mounted() {
    this.podcastId = 538;
    this.getPodcastDetails(this.podcastId);
  },

  props: ["podcastId"],

  data() {
    return {
      loaded: false,
      podcast: undefined,
      error: false,
      exclusive: false
    };
  },

  computed: {

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
    }
  }
};
</script>
