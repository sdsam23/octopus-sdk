<template>
  <div class="page-box">
    <div class="d-flex" :class="isEmissionChooser?'justify-content-between':'justify-content-center'">
      <h1 v-if="titlePage === undefined" class="flex-shrink">{{ $t('All podcasts') }}</h1>
      <h1 v-else class="flex-shrink">{{ titlePage }}</h1>
      <EmissionChooser @selected='emissionSelected' v-if="isEmissionChooser" :defaultanswer="$t('No emission filter')" width='auto' class="ml-3"/>
    </div>
    <ProductorSearch 
      :organisationId='organisationId' 
      :searchPattern='searchPattern'
      @updateOrganisationId='updateOrganisationId'
      @updateSearchPattern='updateSearchPattern'
      v-if="isProductorSearch" />
    <div class="d-flex justify-content-center mb-3" @click="showFilters = !showFilters">
      <div class="text-secondary c-hand">{{$t('Advanced filters')}}</div>
      <div class="text-secondary c-hand align-self-center large-font-size" :class="{'arrow-transform':showFilters}">
        <div class="saooti-arrow_drop_down"></div>
      </div>
    </div>
    <AdvancedSearch v-if="showFilters" @updateMonetization='updateMonetization'/>
    <PodcastList :first="first" :size="size" :organisationId='organisationId' :query='searchPattern' :monetization="monetization" :emissionId='emissionId'/>
  </div>
</template>
<style lang="scss">
.large-font-size{
  font-size: 1.3rem;
}
.arrow-transform{
  transform: rotate(180deg);
}
</style>
<script>
// @ is an alias to /src
import PodcastList from '../display/podcasts/PodcastList.vue';
import {state} from "../../store/paramStore.js";
import ProductorSearch from '../display/filter/ProductorSearch.vue';
import AdvancedSearch from '../display/filter/AdvancedSearch.vue';
import EmissionChooser from '../display/emission/EmissionChooser.vue';

export default {
  components: {
    PodcastList,
    ProductorSearch,
    EmissionChooser,
    AdvancedSearch
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
      monetization: undefined,
      emissionId: undefined,
      showFilters : false,
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
    isEmissionChooser(){
      return state.podcastsPage.emissionChooser;
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
    },
    emissionSelected(emission){
      if (emission && emission.emissionId) {
        this.emissionId = emission.emissionId;
      } else {
        this.emissionId = undefined;
      }
    }
  }
};
</script>
