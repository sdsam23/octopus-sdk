<template>
  <div class="page-box">
    <h1>{{ $t('All participants') }}</h1>
    <ProductorSearch 
      :organisationId='organisationId'
      :searchPattern='searchPattern'
      @updateOrganisationId='updateOrganisationId'
      @updateSearchPattern='updateSearchPattern' />
    <ParticipantList
      :first="first"
      :size="size"
      :query="searchPattern"
      :organisationId="organisationId"
    />
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import ParticipantList from '../display/participant/ParticipantList.vue';
import ProductorSearch from '../display/filter/ProductorSearch.vue';
import parameters from "../../store/AppStore.js";

export default {
  components: {
    ProductorSearch,
    ParticipantList,
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
    };
  },

  methods:{
    updateOrganisationId(value){
      this.organisationId = value;
    },
    updateSearchPattern(value){
      this.searchPattern =value;
    }
  }

};
</script>
