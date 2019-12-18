<template>
  <div id="app">
    <!-- <Podcast podcastId='473' :playingPodcast='false'/> -->
    <!-- <Podcasts/> -->
    <!-- <Emission emissionId='110'/> -->
    <!-- <Participant participantId='326' /> -->
    <!-- <Emissions/> -->
    <Participants />
  </div>
</template>
<style lang="scss" src="@/assets/multiselect.scss"></style>
<style lang="scss">
@import 'src/assets/general.scss';
</style>

<script>
/* import Podcasts from '@/components/pages/Podcasts.vue' */
/* import Podcast from '@/components/pages/Podcast.vue' */
/* import Emission from '@/components/pages/Emission.vue' */
/* import Emissions from '@/components/pages/Emissions.vue' */
/* import Participant from '@/components/pages/Participant.vue' */
import Participants from '@/components/pages/Participants.vue'

export default {
  name: 'app',
  components: {
    /* Podcasts, */
    /* Podcast, */
    /* Emission, */
    /* Emissions, */
    /* Participant */
    Participants
  }
}
</script>

