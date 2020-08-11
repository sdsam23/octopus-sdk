<template>
  <div class="d-flex w-100" v-if="live">
		<router-link class="live-date-box" :to="{ name: 'podcast', params: {podcastId:live.podcastId}, query:{productor: $store.state.filter.organisationId}}">
			<div class="font-weight-bold">{{date}}</div>
			<div class="font-weight-bold">{{hours}}</div>
			<div class="font-size-smaller">{{ $t('Duration', { duration: duration }) }}</div>
    </router-link>
		<router-link :to="{ name: 'podcast', params: {podcastId:live.podcastId}, query:{productor: $store.state.filter.organisationId}}">
			<PodcastImage
				class="live-box-shadow"
				v-bind:podcast="live" 
				:hidePlay='false'
				:playingPodcast='false'
				:fetchConference="fetchConference"
				:isAnimatorLive="organisationRight"/>
		</router-link>
		<div class="d-flex flex-column live-special-width">
			<router-link class="text-uppercase primary-color font-weight-bold text-truncate"
			:to="{ name: 'podcast', params: {podcastId:live.podcastId}, query:{productor: $store.state.filter.organisationId}}"
			>{{live.title}}</router-link>
			<router-link class="primary-color font-weight-bold text-truncate"
        :to="{ name: 'emission', params: {emissionId:live.emission.emissionId}, query:{productor: $store.state.filter.organisationId}}"
				>{{live.emission.name}}</router-link>
			<div class="four-line-clamp" v-if="description" v-html="description">{{description}}</div>
			<div class="comma" v-if="live.animators">{{ $t('Animated by : ') }}
				<router-link
					:aria-label="$t('Participant')"
					class="link-info"
					v-for="animator in live.animators"
					v-bind:key="animator.participantId"
					:to="{ name: 'participant', params: {participantId: animator.participantId}, query:{productor: $store.state.filter.organisationId}}"
				>{{ getName(animator) }}</router-link>
			</div>
			<div v-if="!isPodcastmaker">{{ $t('Producted by : ') }}
				<router-link
					class="link-info"
					:to="{ name: 'productor', params: {productorId:live.organisation.id}, query:{productor: $store.state.filter.organisationId}}"
				>{{ live.organisation.name }}</router-link>
			</div>
			<RecordingItemButton 
			:live="true" 
			:recording="fetchConference" 
			:podcast="live" 
			@deleteItem="deleteItem"
			v-if="fetchConference && organisationRight && isEditBox"
			></RecordingItemButton>
		</div>
  </div>
</template>

<style lang="scss">
.live-date-box{
	width : 200px;
	display: flex;
	flex-shrink: 0;
	flex-direction: column;
}
.font-size-smaller{
	font-size: smaller;
}
.live-image-status{
	text-align: center;
	width: 100%;
	font-weight: bold;
	color: white;
	text-transform: uppercase;
}
.live-box-shadow{
	margin: 0 1rem;
	box-shadow: 0px 12px 48px 6px rgba(255, 132, 87, 0.5) !important;
}
.four-line-clamp{
	display: block;
	max-width: 100%;
	height: 100px;
	font-size: 16px;
	line-height: 1.5;
	-webkit-line-clamp: 4;
	-webkit-box-orient: vertical;
	overflow: hidden;
	text-overflow: ellipsis;
}
.live-special-width{
	width: 0;
  flex-grow: 1;
}
.planned-bg {
	background: #f09653;
}
.pending-bg {
	background: #f1643e;
}
.recording-bg {
	background: #f34a4a;
}
.debriefing-bg {
	background: #6ec66e;
}
.done-bg {
	background: #679fe9;
}
.publishing-bg {
	background: #7d7d7d;
}
</style>

<script>
import {state} from "../../../store/paramStore.js";
const moment = require('moment');
const humanizeDuration = require('humanize-duration');
/* import podcastApi from '@/api/podcasts'; */
import octopusApi from "@saooti/octopus-api";
import PodcastImage from "../podcasts/PodcastImage.vue";
import RecordingItemButton from "@/components/display/studio/RecordingItemButton.vue";

export default {
  name: 'LiveItem',

  props: ['fetchConference', 'index'],

  components: {
		RecordingItemButton,
		PodcastImage
	},

	async created(){
		this.fetchPodcastData();
	},
  
  data() {
    return {
			dummyParam : new Date().getTime().toString(),
			live: undefined,
    };
  },

  computed: {
		isEditBox(){
      return state.podcastPage.EditBox;
    },
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    hours() {
      return moment(this.live.pubDate).format('À HH[H]mm');
		},
		date() {
      return moment(this.live.pubDate).format('D/MM/YYYY');
    },
    displayDate(){
      return moment(this.live.pubDate).format('X');
    },
    description() {
      if(this.live.description){
          return this.live.description;
      }else {
        return '';
      }
		},
    authenticated(){
      return state.generalParameters.authenticated;
    },
    myOrganisationId(){
      return state.generalParameters.organisationId;
    },
		organisationRight() {
      if (this.authenticated && this.isAnimator) {
        if (this.myOrganisationId === this.live.organisation.id) {
          return true;
        }
      }
      return false;
    },
    isAnimator() {
      return state.generalParameters.isAdmin || state.generalParameters.isAnimator;
    },
	
    duration() {
      if(this.live.duration > 1){
				if(this.live.duration > 600000){
          return humanizeDuration(this.live.duration, {
            language: 'fr',
            largest: 1,
            round: true,
          });
        }else{
          return humanizeDuration(this.live.duration, {
            language: 'fr',
            largest: 2,
            round: true,
          });
        }
      }else{
        return '';
      }
		},
  },
  methods:{
		getName(person) {
      const first = person.firstName || "";
      const last = person.lastName || "";
      return (first + " " + last).trim();
		},
		async fetchPodcastData(){
			if(this.fetchConference && this.fetchConference.podcastId){
				let tempLive = await octopusApi.fetchPodcast(this.fetchConference.podcastId);
				if (tempLive.availability.visibility || (this.authenticated && this.isAnimator && this.myOrganisationId === tempLive.organisation.id)) {
					this.live = tempLive;
				}else{
					this.$emit('deleteItem', this.item);
				}
			}
		},
		deleteItem(){
			this.$emit('deleteItem', this.index);
		}
  }
};
</script>
