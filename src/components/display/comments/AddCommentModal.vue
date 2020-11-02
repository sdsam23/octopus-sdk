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
       <!--  <vue-recaptcha ref="recaptcha" v-if="!verify"
          @verify="onVerify" sitekey="6Ld3oV4UAAAAAPOl8ytNVcBSP-UMuLAIMg-pOak5">
        </vue-recaptcha> -->
      </template>
      <template v-slot:default v-else>
        <div>{{$t('Send in progress')}}</div>
      </template>
      <template v-slot:modal-footer v-if="!sending">
        <button class="btn btn-light m-1" @click="closePopup">
          {{ $t('Cancel') }}
        </button>
        <button class="btn btn-primary m-1" :disabled="name.length <= 2 || !verify" @click="sendComment">
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
/* import VueRecaptcha from 'vue-recaptcha'; */
import {state} from "../../../store/paramStore.js";
export default {
  name: 'AddCommentModal',

  props: [],

  components:{
    /* VueRecaptcha */
  },

  mounted(){
    if(this.authenticated){
      this.name = ((this.$store.state.profile.firstName || '') + ' ' + (this.$store.state.profile.lastName || '')).trim();
      this.verify = true;
    }
    this.$bvModal.show('add-comment-modal');
  },

  data() {
    return {
      name: "",
      sending: false,
      verify:true,
    };
  },

  computed:{
    authenticated(){
      return state.generalParameters.authenticated;
    },
  },

  methods: {
    closePopup(event) {
      event.preventDefault();
      this.$emit('close');
    },
    sendComment(){
      this.sending = true;
      this.$emit('validate', this.name);
    },
    onVerify(response){
       if (response) this.verify = true;
    }
  },
};
</script>
