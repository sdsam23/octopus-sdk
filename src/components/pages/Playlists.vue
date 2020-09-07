<template>
  <div class="page-box">
    <h1>{{ $t('All playlists') }}</h1>
    <ProductorSearch 
      :organisationId.sync='organisationId' 
      :searchPattern='searchPattern'
      type='playlist'
      @updateOrganisationId='updateOrganisationId'
      @updateSearchPattern='updateSearchPattern'
      v-if="isProductorSearch"/>
    <PlaylistList
      :showCount="true"
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
import PlaylistList from '../display/playlist/PlaylistList.vue';
import ProductorSearch from '../display/filter/ProductorSearch.vue';
import {state} from "../../store/paramStore.js";

export default {
  components: {
    ProductorSearch,
    PlaylistList,
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

  computed:{
    isProductorSearch(){
      return state.podcastsPage.ProductorSearch;
    },
  },

  methods:{
    updateOrganisationId(value){
      this.resetRubriquage = !this.resetRubriquage;
      this.rubriquageId = undefined;
      this.rubriqueId= undefined;
      this.organisationId = value;
    },
    updateSearchPattern(value){
      this.searchPattern =value;
    },
  },
};
</script>
