<template>
	<div class="d-flex align-items-center">
		<div>{{$t('Advertising') + ' :'}}</div>
		<select class="basic-select ml-2 mb-0 border" v-model="monetization" @change="onChange">
			<option value="UNDEFINED" v-if="isEmission">{{ $t('All emissions') }}</option>
			<option value="UNDEFINED" v-else>{{ $t('All podcasts') }}</option>
			<option value="YES">{{ $t('Authorized advertising') }}</option>
			<option value="NO">{{ $t('Prohibited advertising') }}</option>
		</select>
	</div>
</template>
<style lang="scss">
</style>
<script>

export default {

	props: ['isEmission'],

  data() {
    return {
      monetization: 'UNDEFINED'
    };
  },

  methods:{
    onChange(){
			this.$emit('updateMonetization', this.monetization);
		}
  }
};
</script>
