<template>
<div>
	<div class="d-flex justify-content-center mb-3" @click="showFilters = !showFilters">
		<div class="text-secondary c-hand">{{$t('Advanced filters')}}</div>
		<div class="text-secondary c-hand align-self-center large-font-size" :class="{'arrow-transform':showFilters}">
			<div class="saooti-arrow_drop_down"></div>
		</div>
	</div>
  <div class="advanced-search-container" v-show="showFilters" >
		<div class="d-flex flex-column">
			<div class="primary-color mb-2">{{$t('Filter emissions')}}</div>
			<MonetizableFilter @updateMonetization='updateMonetization' :isEmission='isEmission' v-if="isMonetizableFilter"/>
			<div class="d-flex mt-3 align-items-center rubrique-select-height" v-if="organisationId && rubriquageDisplay">
				<div class="checkbox-saooti flex-shrink">  
					<input type="checkbox" class="custom-control-input" id="search-rubriquage-checkbox" v-model="isRubriquage">  
					<label class="custom-control-label" for="search-rubriquage-checkbox">{{ $t('By topic') }}</label>  
				</div>
				<template v-if="isRubriquage">
					<label class="wrap">
						<select class="basic-select ml-2 mb-0 border c-hand" v-model="rubriquageId" @change="onRubriquageSelected">
							<option 
								v-for="rubriquage in rubriquageData" 
								v-show="rubriquage.rubriques.length !== 0"
								:key="rubriquage.rubriquageId" 
								:value="rubriquage.rubriquageId"
							>{{rubriquage.title}}</option>
						</select>
						<div class="saooti-arrow_down octopus-arrow-down-2 classic-select"></div>
					</label>
					<div class="ml-3 flex-shrink">{{$t('By rubric')}}</div>
					<RubriqueChooser 
						class="ml-2"
						:multiple='false' 
						:rubriquageId='rubriquageId' 
						:allRubriques='getRubriques(rubriquageId)' 
						:defaultanswer='$t("No rubric filter")'
						:reset='reset'
						width='auto'
						@selected="onRubriqueSelected"		
					/>
				</template>
			</div>
			<div class="d-flex mt-3 align-items-center">
				<div class="mr-2" v-if="isEmission">{{$t('Emission with episode published :')}}</div>
				<div class="checkbox-saooti flex-shrink">  
					<input type="checkbox" class="custom-control-input" id="search-from-checkbox" v-model="isFrom">  
					<label class="custom-control-label" for="search-from-checkbox">{{ $t('From the :') }}</label>  
				</div>
				<Datetime
					type="datetime"
					moment-locale="fr"
					v-model="fromDate"
					class="theme-saooti pl-3"
					@input="updateFromDate"
					:i18n="lang"
				/>
				<div class="checkbox-saooti flex-shrink ml-3">  
					<input type="checkbox" class="custom-control-input" id="search-to-checkbox" v-model="isTo">  
					<label class="custom-control-label" for="search-to-checkbox">{{ $t('To the :') }}</label>  
				</div>
				<Datetime
					type="datetime"
					moment-locale="fr"
					v-model="toDate"
					class="theme-saooti pl-3"
					@input="updateToDate"
					:i18n="lang"
				/>
			</div>
			<div class="d-flex flex-column mt-3" v-if="organisationRight && !isEmission && !isPodcastmaker">
				<div class="checkbox-saooti flex-shrink" v-show="false">  
					<input type="checkbox" class="custom-control-input" id="search-visible-checkbox" v-model="isVisible" :disabled='true || lastCheckbox(isVisible)'>  
					<label class="custom-control-label" for="search-visible-checkbox">{{ $t('Visible') }}</label>  
				</div>
				<!-- <div class="checkbox-saooti flex-shrink">  
					<input type="checkbox" class="custom-control-input" id="search-inCreate-checkbox" v-model="isInCreate" :disabled='lastCheckbox(isInCreate)'>  
					<label class="custom-control-label" for="search-inCreate-checkbox">{{ $t('In creation') }}</label>  
				</div> -->
				<div class="checkbox-saooti flex-shrink">  
					<input type="checkbox" class="custom-control-input" id="search-future-checkbox" v-model="isFuture" :disabled='lastCheckbox(isFuture)'>  
					<label class="custom-control-label" for="search-future-checkbox">{{ $t('Publish in future') }}</label>  
				</div>
				<!-- <div class="checkbox-saooti flex-shrink">  
					<input type="checkbox" class="custom-control-input" id="search-error-checkbox" v-model="isError" :disabled='lastCheckbox(isError)'>  
					<label class="custom-control-label" for="search-error-checkbox">{{ $t('In error') }}</label>  
				</div> -->
			</div>
		</div>
		<div class="d-flex flex-column ml-3" v-if="isEmission">
			<div class="primary-color mb-2">{{$t('Sort emissions')}}</div>
			<b-form-group>
				<b-form-radio-group v-model="emissionSort" class="d-flex flex-column">
					<b-form-radio value="SCORE">{{$t('Sort score')}}</b-form-radio>
					<b-form-radio value="LAST_PODCAST_DESC">{{$t('Sort last')}}</b-form-radio>
					<b-form-radio value="NAME">{{$t('Sort name')}}</b-form-radio>
				</b-form-radio-group>
			</b-form-group>
		</div>
  </div>
</div>
</template>
<style lang="scss">
.large-font-size{
  font-size: 1.3rem;
}
.arrow-transform{
  transform: rotate(180deg);
}
.advanced-search-container{
	background: #fff;
  border-radius: 0.8rem;
	display: flex;
  width: 100%;
	padding: 1rem;
	margin-bottom: 1rem;
	label.wrap { 
		position: relative;
		margin:0;
	}
	select{       
		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;
	}
	.rubrique-select-height{
		height: 30px;
	}
}

</style>
<script>
// @ is an alias to /src

import MonetizableFilter from './MonetizableFilter.vue';
import RubriqueChooser from '../rubriques/RubriqueChooser.vue';
import { Datetime } from 'vue-datetime';
import {state} from "../../../store/paramStore.js";
import octopusApi from "@saooti/octopus-api";
const moment = require('moment');

export default {
  components: {
		MonetizableFilter,
		RubriqueChooser,
		Datetime
	},
	
	props: ['organisationId', 'isEmission', 'resetRubriquage'],

  created() {
		this.fetchTopics();
	},
	
	mounted(){
		if(this.organisationRight){
			this.isInCreate = true;
			this.isFuture = true;
			this.isError = true;
		}
	},

  data() {
    return {
			isRubriquage:false,
			rubriquageId : undefined,
			rubriqueId : undefined,
			rubriquageData: [],
			isFrom: false,
			isTo: false,
			lang: {
        ok: this.$t('Validate'),
        cancel: this.$t('Cancel'),
			},
			fromDate: moment().subtract(10, "days").toISOString(),
			toDate: moment().toISOString(),
			isVisible: true,
			isInCreate: false,
			isFuture: false,
			isError: false,
			showFilters : false,
			reset: false,
			emissionSort: 'SCORE',
    };
  },

  computed:{
    isMonetizableFilter(){
      return state.podcastsPage.MonetizableFilter;
		},
		rubriquageDisplay(){
			if(this.rubriquageData.length !== 0){
				let found = false;
				for (let index = 0; index < this.rubriquageData.length; index++) {
					if(this.rubriquageData[index].rubriques.length !== 0){
						found = true;
						break;
					}
				}
				return found;
			}
			return false;
		},
		myOrganisationId(){
      return state.generalParameters.organisationId;
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
		organisationRight() {
      if (this.authenticated) {
        if (this.myOrganisationId === this.organisationId) {
          return true;
        }
        if (state.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
		},
		isPodcastmaker(){
      return state.generalParameters.podcastmaker;
		},
		filterOrga(){
      return this.$store.state.filter.organisationId;
    },
    organisation(){
      if(this.organisationId){
        return this.organisationId;
      }else if(this.filterOrga){
        return this.filterOrga;
      }else {
        return undefined;
      }
    },
  },

  methods:{
		lastCheckbox(value){
			if(this.organisationId === undefined){
				this.isFuture = false;
				return true;
			} else{
				if(value){
					let i = 0;
					if(!this.isVisible){
						i++;
					}
					/* if(!this.isInCreate){
						i++;
					}
					if(!this.isError){
						i++;
					} */
					if(!this.isFuture){
						i++;
					}
					/* return i === 3; */
					return i === 1;
				}else{
					return false;
				}
			}
		},
		updateFromDate(){
			if(moment(this.fromDate).startOf('minute').toISOString() !== moment().subtract(10, "days").startOf('minute').toISOString()){
				this.isFrom = true;
			}
		},
		updateToDate(){
			if(moment(this.toDate).startOf('minute').toISOString() !== moment().startOf('minute').toISOString()){
				this.isTo = true;
			}
		},
		getRubriques(rubriquageId){
			let topicIndex = this.rubriquageData.findIndex(element => element.rubriquageId === rubriquageId);
			return this.rubriquageData[topicIndex].rubriques;
		},
		onRubriqueSelected(rubrique){
			if(rubrique.rubriqueId !== this.rubriqueId){
				this.rubriqueId = rubrique.rubriqueId;
				if(this.rubriqueId === 0){
					this.$emit('updateRubrique', undefined);
				}else{
					this.$emit('updateRubrique', rubrique.rubriqueId);
				}
			}
		},
		onRubriquageSelected(){
			this.reset = !this.reset;
			if(this.isRubriquage){
				this.$emit('updateRubriquage', this.rubriquageId);
			}
		},
    updateMonetization(value){
      this.$emit('updateMonetization', value);
		},
		fetchTopics(){
			if(this.organisation){
				octopusApi.fetchTopics(this.organisation).then((data)=>{
					this.rubriquageData = data;
					if(data.length !== 0){
						for (let index = 0; index < this.rubriquageData.length; index++) {
							if(this.rubriquageData[index].rubriques.length !== 0){
								this.rubriquageId = this.rubriquageData[index].rubriquageId;
								break;
							}
						}
					}
				});
			}
		},
	},
	watch:{
		organisation(){
			this.fetchTopics();
		},
		isFrom(newVal){
			if(newVal){
				this.$emit('updateFromDate', this.fromDate);
			}else{
				this.$emit('updateFromDate', undefined);
			}
		},
		isTo(newVal){
			if(newVal){
				this.$emit('updateToDate', this.toDate);
			}else{
				this.$emit('updateToDate', undefined);
			}
		},
		isRubriquage(newVal){
			if(newVal){
				this.$emit('updateRubriquage', this.rubriquageId);
			}else{
				this.$emit('updateRubriquage', undefined);
				this.$emit('updateRubrique', undefined);
			}
		},
		emissionSort(newVal){
			this.$emit('updateSortEmission', newVal);
		},
		resetRubriquage(){
			this.isRubriquage = false;
		},
		isVisible(){
			//emit quelqueChose
		},
		isFuture(newVal){
			this.$emit('includeHidden', newVal);
		}
	}
};
</script>
