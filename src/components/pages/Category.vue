<template>
  <div class="page-box">
    <h1>{{ title }}</h1>
    <PodcastList :first="first" :size="size" :iabId="iabId" :organisationId='filterOrga' />
  </div>
</template>

<style lang="scss">
</style>

<script>
// @ is an alias to /src
import PodcastList from '../display/podcasts/PodcastList.vue';
import {state} from "../../store/paramStore.js";

export default {
  components: {
    PodcastList,
  },

  props: ['first', 'size', 'iabId'],

  mounted() {
    this.extractTitle(this.iabId);
  },

  data() {
    return {
      title: '',
    };
  },

  computed: {
    categories(){
      return state.generalParameters.allCategories;
    },
    filterOrga(){
      return this.$store.state.filter.organisationId;
    }
  },


  methods: {
    extractTitle(iabId) {
      const matchCategories = this.categories.filter(
        c => c.id === iabId
      );
      if (matchCategories.length === 1) {
        this.title = matchCategories[0]['name'];
      } else {
        return '';
      }
    },
  },

  watch: {
    iabId(val) {
      this.extractTitle(val);
    },
  },

};
</script>
