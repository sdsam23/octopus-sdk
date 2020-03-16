<template>
  <div class="advanced-search-container">
    <MonetizableFilter @updateMonetization='updateMonetization' :isEmission='false' v-if="isMonetizableFilter"/>
		<div class="d-flex">
			<div class="checkbox-saooti">  
				<input type="checkbox" class="custom-control-input" id="search-rubriquage-checkbox" v-model="isRubriquage">  
				<label class="custom-control-label" for="search-rubriquage-checkbox">{{ $t('By topic') }}</label>  
      </div>
		<!-- 	<RubriqueChooser 
				:multiple='false' 
				:rubriquageId='topic.rubriquageId' 
				:allRubriques='topic.rubriques' 
				:rubriqueArray='rubriqueArray[index]'		
				@selected='updateRubrics(index,$event)'/> -->
		</div>
  </div>
</template>
<style lang="scss">
.advanced-search-container{
	background: #fff;
  border-radius: 2rem;
	display: flex;
	flex-direction: column;
  width: 100%;
	padding: 1rem;
	margin: 1rem;
}
</style>
<script>
// @ is an alias to /src

import MonetizableFilter from './MonetizableFilter.vue';
/* import RubriqueChooser from '../rubriques/RubriqueChooser.vue'; */
import {state} from "../../../store/paramStore.js";
import octopusApi from "@saooti/octopus-api";

export default {
  components: {
		MonetizableFilter,
		/* RubriqueChooser */
  },

  created() {
		this.fetchTopics();
  },

  data() {
    return {
			isRubriquage:false,
    };
  },

  computed:{
    isMonetizableFilter(){
      return state.podcastsPage.MonetizableFilter;
    },
  },

  methods:{
    updateMonetization(value){
      this.$emit('updateMonetization', value);
		},
		fetchTopics(){
			octopusApi.fetchTopics().then((data)=>{
				debugger;
				console.log(data);
			});
		},
  }
};
</script>
