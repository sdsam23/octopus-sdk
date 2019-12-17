<template>
	<div class="d-flex">
		<select class="basic-select" v-model="monetization" @change="onChange">
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
