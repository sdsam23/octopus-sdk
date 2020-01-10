<template>
  <div class="page-box">
    <h1 v-if="!hideBar">{{ $t('Podcast search') }}</h1>
    <h1 v-else>{{$t('Search results', {query: this.rawQuery})}}</h1>
    <div class="position-relative" v-if="!hideBar">
      <input
        type="search"
        ref="search"
        v-model="rawQuery"
        class="search-input border-primary m-3 w-100 p-2 input-no-outline"
        :placeholder="$t('Please type at least three characters')"
        autofocus
      />
      <div class="saooti-search-bounty search-icon-container"></div>
    </div>
    <PodcastList :query="query" :first="0" :size="20" v-if="!!query" />
  </div>
</template>

<style lang="scss">
  .search-icon-container {
    position: absolute;
    top: 0;
    bottom: 0;
    right: 0;
    display: flex;
    align-items: center;
  }
/** PHONES*/
@media (max-width: 960px) {
  .search-icon-container {
    right: 1rem;
  }
}
</style>

<script>
// @ is an alias to /src
import {state} from "../../store/paramStore.js";
import PodcastList from '../display/podcasts/PodcastList.vue';

export default {
  components: {
    PodcastList,
  },

  mounted() {
    if (this.$route.query.query) {
      this.$data.rawQuery = this.$route.query.query;
    }
    if(this.$refs.search){
      this.$refs.search.focus();
    }
    
  },

  data() {
    return {
      rawQuery: '',
    };
  },

  computed: {
    query() {
      if (this.rawQuery.length >= 3) {
        return this.rawQuery;
      } else {
        return '';
      }
    },
    hideBar(){
      return state.searchPage.hideBar;
    },
  },

  watch:{
    '$route.query.query': {
        handler(search){ 
          this.rawQuery = search;
        },
        deep: true,
        immediate: true
      }
  }
};
</script>
