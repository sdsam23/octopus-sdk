<template>
  <div class="page-box">
    <h1 v-if="titlePage === undefined">{{ $t('All podcasts') }}</h1>
    <h1 v-else>{{ titlePage }}</h1>
    <ProductorSearch 
      :organisationId='organisationId' 
      :searchPattern='searchPattern'
      @updateOrganisationId='updateOrganisationId'
      @updateSearchPattern='updateSearchPattern'
      v-if="isProductorSearch" />
    <MonetizableFilter @updateMonetization='updateMonetization' :isEmission='false' v-if="isMonetizableFilter"/>
    <PodcastList :first="first" :size="size" :organisationId='organisationId' :query='searchPattern' :monetization="monetization"/>
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import PodcastList from '../display/podcasts/PodcastList.vue';
import {state} from "../../store/paramStore.js";
import ProductorSearch from '../display/filter/ProductorSearch.vue';
import MonetizableFilter from '../display/filter/MonetizableFilter.vue';

export default {
  components: {
    PodcastList,
    ProductorSearch,
    MonetizableFilter
  },

  created() {
    if (this.$route.query.first) {
      this.$data.first = this.$route.query.first;
    } else {
      this.$data.first = 0;
    }
    if (this.$route.query.size) {
      this.$data.size = this.$route.query.size;
    } else {
      this.$data.size = 49;
    }
    if (this.$route.query.productor) {
      this.$data.organisationId = this.$route.query.productor;
    } else if (state.filter.organisationId) {
      this.$data.organisationId = state.filter.organisationId;
    }
  },

  data() {
    return {
      first: undefined,
      size: undefined,
      searchPattern: '',
      organisationId: undefined,
      monetization: undefined
    };
  },

  computed:{
    isProductorSearch(){
      return state.podcastsPage.ProductorSearch;
    },
    isMonetizableFilter(){
      return state.podcastsPage.MonetizableFilter;
    },
    titlePage(){
      return state.podcastsPage.titlePage;
    },
  },

  methods:{
    updateOrganisationId(value){
      this.organisationId = value;
    },
    updateSearchPattern(value){
      this.searchPattern =value;
    },
    updateMonetization(value){
      this.monetization = value;
    }
  }
};
</script>
