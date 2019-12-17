<template>
  <div>
    <div class="page-box" v-if="loaded && !error">
      <h1>{{ $t('Emission') }}</h1>
      <div class="d-flex">
        <div class="d-flex flex-column flex-grow">
          <div class="module-box">
            <h2>{{ name }}</h2>
            <div class="mb-5 d-flex h6">
              <img 
                :src="imageUrl" 
                :alt="$t('Emission name image', { name: name })" 
                class="img-box shadow-element flex-shrink" />
              <div class="d-flex flex-column">
                <div>{{ description }}</div>
              </div>
            </div>
          </div>
          <EditBox :emission='emission' :rssEmission='rssEmission' v-if="editRight"></EditBox>
        </div>
        <div>
          <SharePlayer :emissionId="emissionId" :exclusive="exclusive" :organisationId='organisationId'></SharePlayer>
          <ShareButtons :emissionId="emissionId"></ShareButtons>
        </div>
      </div>
      <div v-if="editRight">
        <ShareDistribution :emissionId="emissionId"></ShareDistribution>
      </div>
      <PodcastFilterList :emissionId="emissionId" :categoryFilter="false" />
    </div>
    <div class="d-flex justify-content-center" v-if="!loaded">
      <div class="spinner-border mr-3"></div>
      <h3>{{ $t('Loading content ...') }}</h3>
    </div>
    <div class="text-center" v-if="error">
      <h3>{{ $t("Emission doesn't exist") }}</h3>
    </div>
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import EditBox from "@/components/display/edit/EditBox.vue";
import SharePlayer from '@/components/display/sharing/SharePlayer.vue';
import ShareButtons from "@/components/display/sharing/ShareButtons.vue";
import ShareDistribution from '@/components/display/sharing/ShareDistribution.vue';
import PodcastFilterList from '@/components/display/podcasts/PodcastFilterList.vue';
import octopusApi from "@saooti/octopus-api";
import parameters from "@/store/AppStore.js";

export default {
  components: {
    PodcastFilterList,
    SharePlayer,
    ShareButtons,
    ShareDistribution,
    EditBox
  },

  mounted() {
    this.getEmissionDetails(this.emissionId);
  },

  props: ["emissionId"],

  data() {
    return {
      loaded: false,
      title: "",
      emission: undefined,
      error: false,
      rssEmission: false,
      exclusive: false
    };
  },

  computed: {
    organisationId(){
      return parameters.generalParameters.organisationId;
    },
    authenticated(){
      return parameters.generalParameters.authenticated;
    },

    name() {
      return this.emission ? this.emission.name : "";
    },

    imageUrl() {
      return this.emission ? this.emission.imageUrl : "";
    },

    description() {
      return this.emission ? this.emission.description : "";
    },

    editRight() {
      if (this.authenticated) {
        if (this.organisationId === this.emission.orga.id) {
          return true;
        }
        if (parameters.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
    }
  },

  watch: {
    emissionId(val) {
      this.loaded = false;
      this.error = false;
      this.getEmissionDetails(val);
    }
  },

  methods: {
    getEmissionDetails(emissionId) {
      octopusApi
        .fetchEmission(emissionId)
        .then(data => {
          this.emission = data;
          this.loaded = true;
          if (this.emission.annotations) {
            if (this.emission.annotations.RSS) {
              this.rssEmission = true;
            }
            if (this.emission.annotations.exclusive) {
              this.exclusive =
                this.emission.annotations.exclusive == "true" ? true : false;
              this.exclusive =
                this.exclusive && this.organisationId !== this.emission.orga.id;
            }
          }
        })
        .catch(() => {
          this.error = true;
          this.loaded = true;
        });
    },
  }
};
</script>
