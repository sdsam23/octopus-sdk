<template>
  <div class="page-box">
    <PodcastInlineList
      v-for="c in categories"
      :key="c.id"
      :iabId="c.id"
      :href="'/main/pub/category/' + c.id"
      :title="c.name"
      :buttonText="$t('All podcast button', { name: c.name })"
    />
  </div>
</template>
<style lang="scss">
</style>

<script>
import PodcastInlineList from '../display/podcasts/PodcastInlineList.vue';
import {state} from "../../store/AppStore.js";

export default {
  name: 'home',

  components: {
    PodcastInlineList,
  },

  computed: {
    categories(){
      return state.generalParameters.allCategories.filter(c => {
          return c.podcastCount;
        });
    },
  },
};
</script>
