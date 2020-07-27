<template>
  <div class="d-flex flex-column align-items-center">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading lives...') }}</h3>
    </div>
    <div v-if="loaded && !lives.length">
      <p>{{ $t('No live currently') }}</p>
    </div>
		<LiveItem
			class="mt-3"
			v-for="l in lives"
			:live="l"
			:key="l.podcastId"
		/>
  </div>
</template>

<style lang="scss">
</style>

<script>
import octopusApi from "@saooti/octopus-api";
import LiveItem from './LiveItem.vue';
/* import {state} from "../../../store/paramStore.js"; */

export default {
  name: 'LiveList',

  props:  {
    first: { default: 0 },
    size: { default: 20 },
    reload : {default: false},
  },

  components: {
    LiveItem,
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
      lives: [],
    };
  },

  computed: {
    filterOrga(){
      return this.$store.state.filter.organisationId;
    },
  },

  methods: {
    fetchContent(reset) {
      let param = {
        first: this.dfirst,
        size: this.dsize,
        organisationId: this.filterOrga,
      }
			octopusApi
			.fetchPodcasts(param)
			.then((data)=> {
				this.afterFetching(reset, data);
			});
    },

    afterFetching(reset, data){
      if (reset) {
        this.lives = [];
        this.dfirst = 0;
      }
      this.loading = false;
      this.loaded = true;
      this.lives = this.lives.concat(data.result).filter((p)=>{
        return p!== null;
      });
      this.dfirst += this.dsize;
    },

  },

  watch: {
    reload: {
      handler() {
        this.fetchContent(true);
      },
    },
  },
};
</script>
