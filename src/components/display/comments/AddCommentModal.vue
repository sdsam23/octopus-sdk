<template>
  <div>
    <b-modal id="add-comment-modal" @close="closePopup" @hide="closePopup"  @cancel="closePopup"  :title="$t('Welcome, thanks for your comment')">
      <template v-slot:default>
        <div>{{$t("Let's get acquainted :")}}</div>
      </template>
      <template v-slot:modal-footer>
        <button class="btn btn-secondary m-1" @click="closePopup">
          {{ $t('Cancel') }}
        </button>
        <button class="btn btn-primary m-1" @click="closePopup">
          {{ $t('Validate') }}
        </button>
      </template>
    </b-modal>
  </div>
</template>

<style lang="scss">
</style>
<script>
export default {
  name: 'AddCommentModal',

  props: [],

  components:{
  },

  mounted(){
    this.$bvModal.show('add-comment-modal');
  },

  methods: {
    closePopup(event) {
      event.preventDefault();
      this.$emit('close');
    },
  },
};
</script>
