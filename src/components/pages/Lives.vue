<template>
  <div class="page-box">
    <div class="d-flex flex-column align-items-center mb-3">
        <h1>{{$t('In live')}}</h1>
        <button class="btn btn-primary" v-if="liveRight">{{$t('Launch a new live')}}</button>
    </div>
		<LiveList/>
  </div>
</template>
<style lang="scss">
</style>
<script>
// @ is an alias to /src
import {state} from "../../store/paramStore.js";
import LiveList from "../display/live/LiveList.vue";

export default {
  components: {
		LiveList
  },

  created() {
    if (this.$route.query.productor) {
      this.$data.organisationId = this.$route.query.productor;
    } else if (this.$store.state.filter.organisationId) {
      this.$data.organisationId = this.$store.state.filter.organisationId;
    }
    if(!this.$store.state.organisation.attributes['live.active']){
      this.live=false;
    }
  },

  data() {
    return {
      live: true,
    };
  },

  computed:{
    authenticated(){
      return state.generalParameters.authenticated;
    },
    liveRight() {
      if (this.authenticated && this.live) {
        return true;
      }
      return false;
    },
  },

  methods:{
  }
};
</script>
