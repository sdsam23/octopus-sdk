<template>
  <div class="page-box">
    <h1>{{ $t('All podcasts') }}</h1>
<!--     <ProductorSearch 
      :organisationId='organisationId' 
      :searchPattern='searchPattern'
      @updateOrganisationId='updateOrganisationId'
      @updateSearchPattern='updateSearchPattern' />
    <MonetizableFilter @updateMonetization='updateMonetization' :isEmission='false'/> -->
    <PodcastList :first="first" :size="size" :organisationId='organisationId' :query='searchPattern' :monetization="monetization"/>
  </div>
</template>
<style lang="scss" scoped>
</style>
<script>
// @ is an alias to /src
import PodcastList from '@/components/display/podcasts/PodcastList.vue';
import parameters from "@/store/AppStore.js";
/* import ProductorSearch from '@/components/display/filter/ProductorSearch.vue';
import MonetizableFilter from '@/components/display/filter/MonetizableFilter.vue'; */

export default {
  components: {
    PodcastList,
/*     ProductorSearch,
    MonetizableFilter */
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
