<template>
  <div>
    <div class="module-box text-center-mobile">
      <h3>{{ $t('Editing') }}</h3>
       <router-link v-if='podcast' v-bind:to="`/main/priv/edit/podcast/${podcast.podcastId}/${podcast.podcastId}`">
          <button class="btn btn-primary admin-button">
            <div class="saooti-edit font-weight-bold"></div>
          </button>
        </router-link>
        <router-link v-if='emission' v-bind:to="`/main/priv/edit/emission/${emission.emissionId}/${emission.emissionId}`">
          <button class="btn btn-primary admin-button">
            <div class="saooti-edit font-weight-bold"></div>
          </button>
        </router-link>
        <button class="btn btn-primary admin-button" @click="onDelete()">
            <div class="saooti-delete font-weight-bold"></div>
        </button>
    </div>
 <!--    <PodcastDeleter
      :podcast="podcastToDelete"
      :emission="emissionToDelete"
      v-if="!!podcastToDelete || !!emissionToDelete"
      :rss="rssEmission"
      @rss="closeModal"
      @cancel="cleanItemToDelete"
      @done="removeDeleted"
    /> -->
  </div>
</template>

<style lang="scss">

.admin-button {
  margin: 1em 1rem 0.5rem 0;
  height: 3rem !important;
  width: 3rem;
  font-size: 1.5rem;
  display: inline-flex;
  align-items: center;
}
</style>

<script>

/* import PodcastDeleter from "@/components/display/backoffice/PodcastDeleter.vue"; */

export default {
  components: {
    /* PodcastDeleter */
  },
  props: ['podcast', 'emission', 'rssEmission'],

  data() {
    return {
      podcastToDelete: undefined,
      emissionToDelete: undefined,
    };
  },

  computed: {
  },

  methods: {
    onDelete() {
      if(this.podcast){
        this.podcastToDelete = this.podcast;
      } else{
        this.emissionToDelete = this.emission;
      }
    },
    cleanItemToDelete() {
      this.podcastToDelete = undefined;
      this.emissionToDelete = undefined;
    },
    removeDeleted() {
      if(window.history.length > 1){
        this.$router.go(-1);
      } else{
        this.$router.push('/');
      }
    },
    closeModal() {
      this.rssEmission = false;
      this.emissionToDelete = undefined;
    }
  },
};
</script>
