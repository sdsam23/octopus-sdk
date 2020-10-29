<template>
  <div>
    <b-modal id="add-comment-modal" @close="closePopup" @hide="closePopup"  @cancel="closePopup"  :title="$t('Welcome, thanks for your comment')">
      <template v-slot:default v-if="!sending">
        <div>{{$t("Let's get acquainted :")}}</div>
        <input
          class="form-input"
          type="text"
          v-model="name"
          :placeholder="$t('Your name')"
        />
      </template>
      <template v-slot:default v-else>
        <div>{{$t('Send in progress')}}</div>
      </template>
      <template v-slot:modal-footer v-if="!sending">
        <button class="btn btn-light m-1" @click="closePopup">
          {{ $t('Cancel') }}
        </button>
        <button class="btn btn-primary m-1" :disabled="name.length === 0" @click="sendComment">
          {{ $t('Validate') }}
        </button>
      </template>
      <template v-slot:modal-footer v-else>
        <button class="btn m-1" @click="closePopup">
          {{ $t('Close') }}
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

  data() {
    return {
      name: "",
      sending: false,
    };
  },

  methods: {
    closePopup(event) {
      event.preventDefault();
      this.$emit('close');
    },
    sendComment(){
      this.sending = true;
      this.$emit('validate', this.name);
    }
  },
};
</script>
