<template>
  <div class="page-box">
    <h1>{{ $t('All emissions') }}</h1>
    <ProductorSearch 
      :organisationId='organisationId' 
      :searchPattern='searchPattern'
      @updateOrganisationId='updateOrganisationId'
      @updateSearchPattern='updateSearchPattern' />
    <MonetizableFilter @updateMonetization='updateMonetization' :isEmission='true'/>
    <EmissionList
      :first="first"
      :size="size"
      :query="searchPattern"
      :organisationId="organisationId"
      :monetization="monetization"
    />
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import EmissionList from '@/components/display/emission/EmissionList.vue';
import ProductorSearch from '@/components/display/filter/ProductorSearch.vue';
import MonetizableFilter from '@/components/display/filter/MonetizableFilter.vue';
import parameters from "@/store/AppStore.js";

export default {
  components: {
    ProductorSearch,
    EmissionList,
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
      this.$data.size = 12;
    }
     if (this.$route.query.productor) {
      this.$data.organisationId = this.$route.query.productor;
    } else if (parameters.filter.organisationId) {
      this.$data.organisationId = parameters.filter.organisationId;
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
