<template>
  <li class="emission-item-container shadow-element">
    <router-link v-bind:to="'/main/pub/emission/' + emission.emissionId" class="text-dark">
      <div class="img-box" :style="{ 'background-image': 'url(\'' + emission.imageUrl + '\')' }"></div>
    </router-link>
    <div class="emission-item-text">
      <router-link v-bind:to="'/main/pub/emission/' + emission.emissionId" class="text-dark">
        <div class="emission-name">{{ name }}</div>
        <div class="emission-description">{{ description }}</div>
      </router-link>
      <div class="flex-grow"></div>
      <router-link v-bind:to="'/main/pub/productor/' + emission.orga.id" class="text-dark" v-if="!isPodcastmaker">
        <div class="emission-producer primary-color">© {{ emission.orga.name }}</div>
      </router-link>
    </div>
  </li>
</template>

<style lang="scss" scoped>
.emission-item-container {
  list-style: none;
  background: #fff;
  border-radius: 2rem;
  display: flex;
  width: 100%;
  margin: 1rem 0;
}
.emission-item-text{
  padding: 1rem;
  display: flex;
  flex-direction: column;
  max-height: 13rem;

  .emission-name{
    font-size: 0.9rem;
    font-weight: 600;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .emission-description{
    font-weight: 500;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 7;
    -webkit-box-orient: vertical;
    white-space: pre-wrap;
  }

  .emission-producer{
    font-weight: 300;
    font-size: 0.6rem;
  }
}
/** PHONES*/
@media (max-width: 960px) {
  .emission-item-container {
    flex-wrap: wrap;
    width: auto;
    margin: 0;
    padding: 1rem;
    justify-content: center;
  }
}
</style>

<script>
import parameters from "../../../store/AppStore.js";
export default {
  name: 'EmissionItem',

  props: ['emission'],

  computed: {
    isPodcastmaker(){
      return parameters.generalParameters.podcastmaker;
    },

    organisation() {
      return '' + this.emission.publisher.organisation.name;
    },

    description() {
      let description;
      description = this.emission.description || '';
      if (parameters.generalParameters.isIE11) {
        return description.substring(0, 50) + '...';
      } else {
        return description;
      }
    },

    name() {
      if (parameters.generalParameters.isIE11) {
        return this.emission.name.substring(0, 50) + '...';
      } else {
        return this.emission.name;
      }
    },
  },
};
</script>
