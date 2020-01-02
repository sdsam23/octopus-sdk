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
        <button class="btn btn-primary admin-button" v-if="participant" @click="onParticipantPopup">
          <div class="saooti-edit font-weight-bold"></div>
        </button>
        <button class="btn btn-primary admin-button" @click="onDelete()">
            <div class="saooti-delete font-weight-bold"></div>
        </button>
    </div>
 <!--    <PodcastDeleter
      :podcast="podcastToDelete"
      :emission="emissionToDelete"
      :participant="participantToDelete"
      v-if="!!podcastToDelete || !!emissionToDelete || !!participantToDelete"
      :rss="rssEmission"
      @rss="closeModal"
      @cancel="cleanItemToDelete"
      @done="removeDeleted"
    /> -->
 <!--    <ParticipantPopup
      v-if="editParticipant"
      :participant="participant"
      title="Test"
      @validate="onParticipantPopupValid"
      @cancel="onParticipantPopup"
    /> -->
  </div>
</template>

<style lang="scss">
</style>

<script>

/* import PodcastDeleter from "@/components/display/backoffice/PodcastDeleter.vue"; */

export default {
  components: {
    /* PodcastDeleter */
  },
  props: ['podcast', 'emission', 'participant', 'rssEmission'],

  data() {
    return {
      podcastToDelete: undefined,
      emissionToDelete: undefined,
      participantToDelete: undefined,
      editParticipant: false,
    };
  },

  computed: {
  },

  methods: {
    onDelete() {
     if(this.podcast){
        this.podcastToDelete = this.podcast;
      } else if(this.emission){
        this.emissionToDelete = this.emission;
      } else{
        this.participantToDelete = this.participant;
      }
    },
    cleanItemToDelete() {
      this.podcastToDelete = undefined;
      this.emissionToDelete = undefined;
      this.participantToDelete = undefined;
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
    },
    /* onParticipantPopupValid(kind, participant) {
      participantApi.updateParticipant(this.$store, participant).then(()=>{
         this.onParticipantPopup();
         this.$emit('participantUpdate');
      });
    },
    onParticipantPopup() {
      this.editParticipant = !this.editParticipant;
    }, */
  },
};
</script>
