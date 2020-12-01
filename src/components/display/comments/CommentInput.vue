<template>
  <div class="d-flex flex-column comment-input-container mt-3">
    <b class="small-Text mt-1" v-if="knownIdentity">{{knownIdentity}}</b>
    <b-form-textarea
			ref="textarea"
      v-model="newComment"
      :placeholder="placeholder"
      max-rows="10"
      :class="{short:isOneLine && !newComment.includes('\n')}"
      @focus="textareaFocus = true"
      @blur="textareaFocus = false"
    ></b-form-textarea>
    <div class="d-flex justify-content-end mt-1" v-if="textareaFocus">
      <button class="btn mr-2">{{$t('Cancel')}}</button>
      <button class="btn btn-primary" @mousedown="requestToSend">{{placeholder}}</button>
    </div>
    <AddCommentModal
      v-if="checkIdentityModal"
      @validate="postComment"
      @close="checkIdentityModal=false"
    />
    <MessageModal
      v-if="postError"
      @close="postError=false"
      @validate="postError=false"
      :validatetext="$t('Close')"
      :title="$t('Error')"
      :message="$t('Error occurs while post your comment...')"
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
    border-bottom: 0.1rem solid #ddd !important;
    overflow: hidden !important;
    box-shadow: unset !important;
    background: transparent !important;
    height: 40px;
  }
  textarea.short {
    max-height: 38px;
  }
}

</style>

<script>
import AddCommentModal from './AddCommentModal.vue';
import MessageModal from '../../misc/modal/MessageModal.vue';
import octopusApi from "@saooti/octopus-api";
import commentApi from '@/api/comments';
import { cookies } from '../../mixins/functions'
import {state} from "../../../store/paramStore.js";

export default {
  name: 'CommentInput',

  props:  {
    podcast: {default:undefined},
		knownIdentity:{default: null},
		focus:{default:false},
    comId:{default:undefined},
    fetchConference:{default:undefined},
	},
	
	mixins: [cookies],

  components: {
    AddCommentModal,
    MessageModal
  },

  data() {
    return {
      newComment:"",
      textareaFocus: false,
      checkIdentityModal: false,
      postError: false,
      isOneLine: true,
    };
  },

  computed:{
    placeholder(){
      if(this.comId){
        return this.$t('Answer a comment');
      }else{
        return this.$t('Write a comment');
      }
    },
    organisationId(){
      return state.generalParameters.organisationId;
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
    isCertified() {
      if ((state.generalParameters.isCommment && this.organisationId === this.podcast.organisation.id) || state.generalParameters.isAdmin) {
        return true;
      }
      return false;
    },
    userId(){
      if(this.authenticated){
        return this.$store.state.profile.userId;
      }
      return undefined;
    },
    phase(){
      if(this.podcast.conferenceId && this.podcast.conferenceId !== 0 && this.podcast.processingStatus === 'READY_TO_RECORD'){
        if(this.fetchConference && (this.fetchConference.status === "PLANNED" || this.fetchConference.status === "PENDING")){
          return "Prelive"
        }else{
          return "Live"
        }
      }else{
        return "Podcast";
      }
    },
  },


  methods: {
    inputExceeded(text, font){
      this.element = document.createElement('canvas');
      this.context = this.element.getContext("2d");
      this.context.font = font;
      return this.context.measureText(text).width;
    },
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
			if(this.$store.state.player.podcast && this.$store.state.player.podcast.podcastId === this.podcast.podcastId){
        timeline = Math.round((this.$store.state.player.elapsed * this.$store.state.player.total));
        if(this.podcast.duration){
          timeline = Math.round(timeline - (this.$store.state.player.total - (this.podcast.duration /1000)));
        }
        if(timeline < 0){
          timeline = 0;
        }
      }
      let sendName = this.knownIdentity;
      if(sendName === null && name){
        sendName = name;
      }
      let comment = {
        content: this.newComment,
        name: sendName,
        podcastId: this.podcast.podcastId,
        timeline: timeline,
				organisationId: this.podcast.organisation.id,
        commentIdReferer: this.comId,
        certified: this.isCertified,
        userId: this.userId,
        phase: this.phase,
      }
      try {
        let data;
        if(this.isCertified){
          comment.status = "Valid";
          data = await commentApi.postComment(this.$store,comment);
        }else{
          data = await octopusApi.postComment(comment);
        }
        this.$emit('newComment', data);
        this.newComment = "";
        this.checkIdentityModal = false;
      } catch (error) {
        this.checkIdentityModal = false;
        this.postError = true;
      }
    }
  },

  watch: {
    textareaFocus(){
      this.newComment = this.newComment.trim();
		},
		focus(){
			this.$refs.textarea.focus();
    },
    newComment(){
      let padding = 1.5 * parseFloat(getComputedStyle(document.documentElement).fontSize);
      this.isOneLine = (this.$refs.textarea.$el.clientWidth - this.inputExceeded(this.newComment, "18px Montserrat, sans-serif, Helvetica Neue")) > (padding);
    }
  },
};
</script>
