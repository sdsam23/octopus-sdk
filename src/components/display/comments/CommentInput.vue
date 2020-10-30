<template>
  <div class="d-flex flex-column comment-input-container">
    <b class="small-Text mt-1" v-if="knownIdentity">{{knownIdentity}}</b>
    <b-form-textarea
			ref="textarea"
      v-model="newComment"
      :placeholder="$t('Write a comment')"
      max-rows="10"
      @focus="textareaFocus = true"
      @blur="textareaFocus = false"
    ></b-form-textarea>
    <div class="d-flex justify-content-end mt-1" v-if="textareaFocus">
      <button class="btn">{{$t('Cancel')}}</button>
      <button class="btn btn-primary" @mousedown="requestToSend">{{$t('Write a comment')}}</button>
    </div>
    <AddCommentModal
      v-if="checkIdentityModal"
      @validate="postComment"
      @close="checkIdentityModal=false"
    />
  </div>
</template>

<style lang="scss">
@import '../../../sass/_variables.scss';
.comment-input-container{
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
    height: 40px;
  }
}

</style>

<script>
import AddCommentModal from './AddCommentModal.vue';
import octopusApi from "@saooti/octopus-api";
import { cookies } from '../../mixins/functions'
import {state} from "../../../store/paramStore.js";

export default {
  name: 'CommentInput',

  props:  {
    podcastId: {default:undefined},
		knownIdentity:{default: null},
		focus:{default:false},
		commentId:{default:undefined},
	},
	
	mixins: [cookies],

  components: {
    AddCommentModal
  },

  data() {
    return {
      newComment:"",
      textareaFocus: false,
      checkIdentityModal: false,
    };
  },

  computed:{
    organisationId(){
      return state.generalParameters.organisationId;
    },
  },

  methods: {
    requestToSend(){
      if(this.knownIdentity){
        this.postComment();
      }else{
        this.checkIdentityModal = true;
      }
    },
    async postComment(name){
      if(name){
				this.setCookie('comment-octopus-name', name);
				this.$emit('update:knownIdentity', name);
			}
			let timeline = 0;
			if(this.$store.state.player.podcast && this.$store.state.player.podcast.podcastId === this.podcastId){
				timeline = Math.round(this.$store.state.player.elapsed * this.$store.state.player.total);
			}
      let comment = {
        content: this.newComment,
        name: this.knownIdentity,
        podcastId: this.podcastId,
        timeline: timeline,
				organisationId: this.organisationId,
				commentIdReferer: this.commentId,
      }
			let data = await octopusApi.postComment(comment);
			this.$emit('newComment', data);
			this.newComment = "";
      this.checkIdentityModal = false;
    }
  },

  watch: {
    textareaFocus(){
      this.newComment = this.newComment.trim();
		},
		focus(){
			this.$refs.textarea.focus();
		}
  },
};
</script>
