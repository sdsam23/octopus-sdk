<template>
  <div class="page-box">
    <h1>{{ title }}</h1>
    <PodcastList :first="firstRoute" :size="sizeRoute" :rubriqueId="rubriqueId" />
  </div>
</template>

<style lang="scss"></style>

<script lang="ts">
// @ is an alias to /src
const octopusApi = require('@saooti/octopus-api');
import PodcastList from '../display/podcasts/PodcastList.vue';

import Vue from 'vue';
export default Vue.extend({
  components: {
    PodcastList,
  },

  props: ['firstRoute', 'sizeRoute', 'rubriqueId'],

  data() {
    return {
      title: '' as string,
    };
  },

  mounted() {
    this.extractTitle();
  },

  
  computed: {},
  methods: {
    async extractTitle(): Promise<void> {
      const data = await octopusApi.fetchRubric(this.rubriqueId);
      this.title = data.name;
    },
  },
  watch: {
    rubriqueId(): void {
      this.extractTitle();
    },
  },
});
</script>
