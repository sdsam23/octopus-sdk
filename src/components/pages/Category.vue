<template>
  <div class="page-box">
    <h1>{{ title }}</h1>
    <PodcastList
      :first="firstRoute"
      :size="sizeRoute"
      :iabId="iabId"
      :organisationId="filterOrga"
    />
  </div>
</template>

<style lang="scss"></style>

<script lang="ts">
// @ is an alias to /src
import PodcastList from '../display/podcasts/PodcastList.vue';
import { state } from '../../store/paramStore';

import Vue from 'vue';
export default Vue.extend({
  components: {
    PodcastList,
  },

  props: ['firstRoute', 'sizeRoute', 'iabId'],

  data() {
    return {
      title: '' as string,
    };
  },

  mounted() {
    this.extractTitle();
  },

  computed: {
    categories():any {
      return state.generalParameters.allCategories;
    },
    filterOrga():string {
      return this.$store.state.filter.organisationId;
    },
  },
  methods: {
    extractTitle(): void {
      const matchCategories = this.categories.filter((c: any) => c.id === this.iabId);
      if (1 !== matchCategories.length) return;
      this.title = matchCategories[0]['name'];

    },
  },
  watch: {
    iabId(): void {
      this.extractTitle();
    },
  },
});
</script>
