<template>
  <div class="page-box">
    <h1>{{ $t('All participants') }}</h1>
    <ProductorSearch
      :organisationId="organisationId"
      :searchPattern="searchPattern"
      type="participant"
      @updateOrganisationId="updateOrganisationId"
      @updateSearchPattern="updateSearchPattern"
    />
    <ParticipantList
      :showCount="true"
      :first="first"
      :size="size"
      :query="searchPattern"
      :organisationId="organisationId"
    />
  </div>
</template>
<style lang="scss"></style>
<script lang="ts">
// @ is an alias to /src
import ParticipantList from '../display/participant/ParticipantList.vue';
import ProductorSearch from '../display/filter/ProductorSearch.vue';
/* import {state} from "../../store/paramStore.js"; */

import Vue from 'vue';
export default Vue.extend({
  components: {
    ProductorSearch,
    ParticipantList,
  },
  props: ['firstRoute', 'sizeRoute', 'productor'],

  data() {
    return {
      first: 0 as number,
      size: 12 as number,
      searchPattern: '',
      organisationId: undefined as string | undefined,
    };
  },

  created() {
    if (this.firstRoute) {
      this.first = this.firstRoute;
    }
    if (this.sizeRoute) {
      this.size = this.sizeRoute;
    }
    if (this.productor) {
      this.organisationId = this.productor;
    } else if (this.$store.state.filter.organisationId) {
      this.organisationId = this.$store.state.filter.organisationId;
    }
  },
  
  methods: {
    updateOrganisationId(value: string) {
      this.organisationId = value;
    },
    updateSearchPattern(value: string) {
      this.searchPattern = value;
    },
  },
});
</script>
