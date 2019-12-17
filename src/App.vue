<template>
  <div id="app">
    <!-- <Podcast podcastId='473' :playingPodcast='false'/> -->
    <Podcasts/>
  </div>
</template>

<style lang="scss">
@import 'src/assets/general.scss';
</style>

<script>
import Podcasts from '@/components/pages/Podcasts.vue'
/* import Podcast from '@/components/pages/Podcast.vue' */

export default {
  name: 'app',
  components: {
    Podcasts
  }
}
</script>

