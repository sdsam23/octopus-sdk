<template>
  <div id="app">
    <Podcast podcastId='473' :playingPodcast='false'/>
  </div>
</template>

<style lang="scss">
@import 'src/assets/general.scss';
</style>

<script>
import Podcast from '@/components/pages/Podcast.vue'

export default {
  name: 'app',
  components: {
    Podcast
  }
}
</script>

