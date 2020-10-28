<template>
  <div class="d-flex flex-column mt-3 module-box comment-item-container">
    <div class="d-flex align-items-center">
      <h2 class="mb-0 mr-2">{{$t("Podcast's comments")}}
        <template v-if="loaded && totalCount > 1">{{$t("()",{nb:totalCount})}}</template>
      </h2>
       <button class="saooti-refresh-stud btn btn-reload primary-color" @click="reloadComments"></button>
    </div>
    <b-form-textarea
      v-model="newComment"
      :placeholder="$t('Write a comment')"
      rows="1"
      max-rows="10"
      @focus="textareaFocus = true"
      @blur="textareaFocus = false"
    ></b-form-textarea>
    <div class="d-flex justify-content-end mt-1" v-if="textareaFocus">
      <button class="btn btn-secondary">{{$t('Cancel')}}</button>
      <button class="btn btn-primary" @mousedown="checkIdentity">{{$t('Write a comment')}}</button>
    </div>
    <CommentList :podcastId="podcastId" :reload="reload" @fetch="updateFetch"/>
    <AddCommentModal
      v-if="checkIdentityModal"
      @close="checkIdentityModal=false"
    />
  </div>
</template>

<style lang="scss">
@import '../../../sass/_variables.scss';
.btn-reload{
  width: 40px;
  height: 40px;
  padding: 0;
  font-size: 1rem;
  font-weight: bold;
}
.comment-item-container{
  textarea::placeholder {
    color: $octopus-primary-color;  
  }
  textarea:focus::placeholder{
    color: black; 
  }
  textarea{
    border-top: 0;
    border-right: 0;
    border-left: 0;
    border-bottom: 0.1rem solid black !important;
    overflow: hidden !important;
    box-shadow: unset !important;
    background: transparent !important;
  }
}

</style>

<script>
import CommentList from "./CommentList.vue"
import AddCommentModal from './AddCommentModal.vue';
/* import octopusApi from "@saooti/octopus-api"; */

export default {
  name: 'CommentSection',

  props:  {
    podcastId: {default:undefined},
  },

  components: {
    CommentList,
    AddCommentModal
  },

  created() {
  },

  data() {
    return {
      totalCount: 0,
      loaded : false,
      reload: false,
      newComment:"",
      textareaFocus: false,
      checkIdentityModal: false,
    };
  },

  computed: {
  },

  methods: {
    updateFetch(value){
      this.loaded = true;
      this.totalCount = value;
    },
    reloadComments(){
      this.reload = !this.reload;
    },
    checkIdentity(){
      this.checkIdentityModal = true;
    }
  },

  watch: {
    textareaFocus(){
      this.newComment = this.newComment.trim();
    }
  },
};
</script>
