<template>
  <div class="page-box">
    <h1 v-if="titlePage === undefined">{{ $t('All emissions') }}</h1>
    <h1 v-else>{{ titlePage }}</h1>
    <ProductorSearch 
      :organisationId='organisationId' 
      :searchPattern='searchPattern'
      type='emission'
      @updateOrganisationId='updateOrganisationId'
      @updateSearchPattern='updateSearchPattern'
      v-if="isProductorSearch"/>
      <AdvancedSearch 
      :isEmission='true'
      @updateRubriquage='updateRubriquage'
      @updateRubrique='updateRubrique'
      @updateMonetization='updateMonetization' 
      @updateFromDate='updateFromDate'
      @updateToDate='updateToDate'
      :organisationId='organisationId'/>
    <EmissionList
      :first="first"
      :size="size"
      :query="searchPattern"
      :organisationId="organisationId"
      :monetization="monetization"
      :rubriqueId='rubriqueId'
      :rubriquageId='rubriquageId'
    />
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import EmissionList from '../display/emission/EmissionList.vue';
import ProductorSearch from '../display/filter/ProductorSearch.vue';
import AdvancedSearch from '../display/filter/AdvancedSearch.vue';
import {state} from "../../store/paramStore.js";

export default {
  components: {
    ProductorSearch,
    EmissionList,
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
      this.$data.size = 12;
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
      rubriquageId: undefined,
      rubriqueId: undefined,
      emissionId: undefined,
      fromDate: undefined,
      toDate: undefined,
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
      return state.emissionsPage.titlePage;
    },
  },

  methods:{
    updateToDate(value){
      if(value[0]){
        this.toDate = value[1];
      }else{
        this.toDate = undefined;
      }
    },
    updateFromDate(value){
      if(value[0]){
        this.fromDate = value[1];
      }else{
        this.fromDate = undefined;
      }
    },
    updateRubriquage(value){
      this.rubriquageId = value;
    },
    updateRubrique(value){
      this.rubriqueId = value;
    },
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
