<template>
	<div class="d-flex align-items-center">
			<div class="filter-organisation-chooser" v-if="!isPodcastmaker">
			<OrganisationChooser
					:defaultanswer="$t('No organisation filter')"
					@selected="onOrganisationSelected"
					:value='organisationId'
			/>
			<label class="m-3" v-if="!!organisationId">
					<input type="checkbox" v-model="keepOrganisation" @click="onKeepOrganisation"/>
			</label>
			<div class="filter-speech-bubble" v-if="showBubble">{{$t('check this box if you want to keep this filter for the rest of your visit')}}</div>
			</div>
			<div class="d-flex align-items-center flex-grow">
			<div>{{ $t('Filter by keyword : ') }}</div>
			<input
        class='filter-search-input input-no-outline'
				:placeholder="$t('Look for podcast name')"
				:value="searchPattern"
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
}
</style>
<script>
// @ is an alias to /src
import OrganisationChooser from '../organisation/OrganisationChooser.vue';
import parameters from "../../../store/AppStore.js";

export default {
  components: {
    OrganisationChooser
	},
	
	props: ['organisationId', 'searchPattern'],

  created() {
    if (this.organisationId) {
      parameters.filter.organisationId = this.organisationId;
      this.keepOrganisation = true;
      if(!this.$route.query.productor){
        this.$router.replace({query: {productor: this.organisationId}});
      }
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
      return parameters.generalParameters.podcastmaker;
    },
  },

  methods:{
    onOrganisationSelected(organisation) {
      this.$router.push({query: {productor: undefined}});
      parameters.filter.organisationId = this.organisationId;
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
        this.$router.push({query: {productor: this.organisationId}});
        parameters.filter.organisationId = this.organisationId;
      }else {
        this.$router.push({query: {productor: undefined}});
        parameters.filter.organisationId = this.organisationId;
      }
    }
  }
};
</script>
