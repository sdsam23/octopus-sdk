<template>
	<div class="d-flex align-items-center">
			<div class="filter-organisation-chooser" v-if="!isPodcastmaker">
			<OrganisationChooser
					:defaultanswer="$t('No organisation filter')"
					@selected="onOrganisationSelected"
					:value='organisationId'
			/>
      <div class="checkbox-saooti m-3" v-if="!!organisationId">  
        <input type="checkbox" class="custom-control-input" id="orgaCheck" v-model="keepOrganisation" @click="onKeepOrganisation">  
        <label class="custom-control-label" for="orgaCheck"></label>  
      </div>
			<div class="filter-speech-bubble" v-if="showBubble">{{$t('check this box if you want to keep this filter for the rest of your visit')}}</div>
			</div>
			<div class="d-flex align-items-center flex-grow">
			<label for="search" class="d-inline" :aria-label="$t('Search')"></label>
			<input
        id="search"
        class='filter-search-input input-no-outline'
				:placeholder="searchText"
				:value="searchPattern"
        ref="search"
        v-on:input="(event)=> this.$emit('updateSearchPattern', event.target.value)"
			/>
			</div>
	</div>
</template>
<style lang="scss">
@import '../../../sass/_variables.scss';

.filter-speech-bubble {
  position: absolute;
  background: $octopus-primary-color;
  border-radius: .4em;
  width:10rem;
  right: 4rem;
  padding: 5px;
  -webkit-animation: fadein 1s;
  -moz-animation: fadein 1s;
  animation: fadein 1s;
  color: white;
}

.filter-speech-bubble:after {
  content: '';
  position: absolute;
  right: 0;
  top: 50%;
  width: 0;
  height: 0;
  border: 18px solid transparent;
  border-left-color: $octopus-primary-color;
  border-right: 0;
  border-bottom: 0;
  margin-top: -9px;
  margin-right: -18px;
  -webkit-animation: fadein 1s;
  -moz-animation: fadein 1s;
  animation: fadein 1s;
}
@keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@-moz-keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@-webkit-keyframes fadein {
  from { opacity: 0; }
  to   { opacity: 1; }
}
.filter-organisation-chooser{
  display: flex;
  align-items: center;
  flex-grow: 1;
  margin-right: 10%;
  position: relative;
  @media (max-width: 500px) {
    margin-right: 0;
  }
}
</style>
<script>
// @ is an alias to /src
import OrganisationChooser from '../organisation/OrganisationChooser.vue';
import {state} from "../../../store/paramStore.js";

export default {
  components: {
    OrganisationChooser
	},
  
  props:  {
    organisationId: { default: undefined },
    searchPattern: { default: "" },
    type: { default: 'podcast' },
  },

  created() {
    if (this.organisationId) {
      this.$store.commit('filterOrga', this.organisationId);
      this.keepOrganisation = true;
      if(!this.$route.query.productor){
        this.$router.replace({query: {productor: this.organisationId}});
      }
    }
  },

  mounted(){
    if(this.$refs.search){
      this.$refs.search.focus();
    }
  },

  data() {
    return {
      keepOrganisation: false,
      showBubble: false,
    };
  },

  computed:{
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    searchText(){
      if(this.type === "emission"){
        return this.$t('Look for emission name');
      }else if(this.type === "participant"){
        return this.$t('Look for participant name');
      } else{
        return this.$t('Look for podcast name');
      }
    },
    filterOrga(){
      return this.$store.state.filter.organisationId;
    }
  },

  methods:{
    onOrganisationSelected(organisation) {
      if(this.$route.query.productor){
        this.$router.push({query: {productor: undefined}});
      }
      this.$store.commit('filterOrga', undefined);
      this.keepOrganisation = false;
      if (organisation && organisation.id) {
        this.showBubble=true;
        setTimeout(()=>{
          this.showBubble=false;
        }, 6000);
        this.$emit('updateOrganisationId', organisation.id);
      } else {
        this.$emit('updateOrganisationId', undefined);
      }
    },
    onKeepOrganisation(){
      if(!this.keepOrganisation){
        if(this.$route.query.productor !== this.organisationId){
          this.$router.push({query: {productor: this.organisationId}});
        }
        this.$store.commit('filterOrga', this.organisationId);
      }else {
        if(this.$route.query.productor){
          this.$router.push({query: {productor: undefined}});
        }
        this.$store.commit('filterOrga', undefined);
      }
    }
  },
  watch:{
    filterOrga(){
      if(this.filterOrga){
        this.keepOrganisation=true;
        this.$emit('updateOrganisationId', this.filterOrga);
      } else{
        this.keepOrganisation=false;
      }
    },
  }
};
</script>
