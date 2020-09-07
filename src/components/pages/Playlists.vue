<template>
  <div class="page-box">
    <h1>{{ $t('All playlists') }}</h1>
    <router-link to="/main/priv/edit/playlist" v-if="editRight && !isPodcastmaker" class="d-flex justify-content-center">
      <button class="btn btn-primary">{{ $t('Create playlist') }}</button>
    </router-link>
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
    organisationId(){
      return state.generalParameters.organisationId;
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    editRight() {
      if (this.authenticated && (this.$store.state.authentication.role.includes("PLAYLIST") || state.generalParameters.isAdmin)) {
        return true;
      }
      return false;
    }
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
