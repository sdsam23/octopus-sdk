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
import PodcastInlineList from '@/components/display/podcasts/PodcastInlineList.vue';
import parameters from "@/store/AppStore.js";

export default {
  name: 'home',

  components: {
    PodcastInlineList,
  },

  computed: {
    categories(){
      return parameters.generalParameters.allCategories.filter(c => {
          return c.podcastCount;
        });
    },
  },
};
</script>
