<template>
  <div class="bg-dark">
    <div id="footer" class="d-flex p-3 secondary-bg border-top">
        <div class="d-flex flex-grow align-items-center flex-column">
          <div class="d-flex flex-column">
            <router-link class="text-dark linkHover" to="/main/pub/home">{{ $t('Home') }}</router-link>
            <router-link class="text-dark linkHover" to="/main/pub/podcasts">{{$t('Podcasts')}}</router-link>
            <router-link class="text-dark linkHover" to="/main/pub/emissions">{{$t('Emissions')}}</router-link>
            <router-link class="text-dark linkHover" to="/main/pub/productors" v-if="!isPodcastmaker">{{$t('Productors')}}</router-link>
            <router-link class="text-dark linkHover" to="/main/pub/participants">{{$t('Speakers')}}</router-link>
          </div>
        </div>
        <div class="d-flex flex-grow align-items-center flex-column" v-if="!isPodcastmaker">
          <div class="d-flex flex-column">
            <div class="text-dark">&copy; Saooti 2019</div>
            <router-link class="text-dark linkHover" to="/main/pub/contact">{{$t('Contact')}}</router-link>
            <router-link class="text-dark linkHover" to="/main/pub/cgu">{{$t('Term of use')}}</router-link>
            <router-link class="text-dark linkHover" to="/main/pub/libraries">{{$t('Used libraries')}}</router-link>
          </div>
        </div>
    </div>
    <!-- <Player @hide="showBlackBorder"/> -->
  </div>
</template>
<style lang="scss" scoped>

.border {
  border-radius: 0 0 2rem 2rem;
}
/** PHONES*/
@media (max-width: 960px) {
  .container {
    font-size: 0.6rem;
    .pages {
      margin-right: 3rem;
    }
  }
}
</style>

<script>
import Player from '@/components/misc/Player.vue';
import parameters from "@/store/AppStore.js";

export default {
  name: 'Footer',
  components: {
    Player,
  },

  computed:{
    isPodcastmaker(){
      return parameters.generalParameters.podcastmaker;
    },
  },

  methods: {
    showBlackBorder(hide){
      if(hide){
        document.getElementById('footer').classList.remove('border');
      } else {
        document.getElementById('footer').className += ' border';
      }
    }
  }
};
</script>
