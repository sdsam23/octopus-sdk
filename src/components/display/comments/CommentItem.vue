<template>
  <div class="d-flex flex-column mt-3 comment-item-container">
    <div class="d-flex small-Text">
			<b class="mr-2">{{comment.name}}</b>
			<div class="mr-2">{{date}}</div>
      <span v-if="editRight" :class="'status-'+comment.status"></span>
		</div>
    <div >{{contentDisplay}}</div>
    <a class="c-hand font-italic" v-if="comment.content.length > 300" @click="summary = !summary">{{readMore}}</a>
		<div class="d-flex align-items-center mt-1">
			<button class="btn btn-secondary primary-color mr-2" v-if="comment.relatedCommentsId ===0">{{$t('To answer')}}</button>
      <div 
        v-b-toggle="'answers-comment-'+comment.commentId"
        class="primary-color c-hand d-flex align-items-center"
        v-if="comment.relatedComments"
      >
        <div class="d-flex align-items-center when-closed">
          <div>{{$t('Display answers', {nb:comment.relatedComments})}}
            <i v-if="editRight">{{$t('(nb valid comment answers)',{nb: comment.relatedValidComments})}}</i>
          </div>
          <span class="saooti-arrow_down saooti-arrow_down-margin"></span>
        </div>
        <div class="d-flex align-items-center when-opened">
          <div>{{$t('Hide answers')}}</div>
          <span class="saooti-arrow_down saooti-arrow_down-margin arrow-transform"></span>
        </div>
      </div>
      <EditCommentBox v-if="editRight" :comment="comment" @deleteComment="deleteComment" @updateComment="updateComment" />
		</div>
    <b-collapse :id="'answers-comment-'+comment.commentId" v-if="comment.relatedComments" class="ml-5">
      <CommentList :commentId="comment.commentId" />
    </b-collapse>
  </div>
</template>

<style lang="scss">
.comment-item-container{
  .btn-secondary{
    padding: 0.1rem 0.75rem;
  }
  .collapsed > .when-opened,
  :not(.collapsed) > .when-closed {
      display: none !important;
  }
}

</style>

<script>

import CommentList from "./CommentList.vue"
import EditCommentBox from "@/components/display/edit/EditCommentBox.vue";
import {state} from "../../../store/paramStore.js";
const moment = require('moment');
export default {
  name: 'CommentItem',

  props:  ["comment"],

  components:{
    CommentList,
    EditCommentBox
  },

  created(){
    this.fetchAnswers();
  },

  data() {
    return {
      summary: true,
      answers: [],
      first:0,
      size:15,
    };
  },

  computed: {
		date() {
      if(this.comment.date){
        return moment(this.comment.date).format("D MMMM YYYY HH[h]mm");
      }else{
        return ""
      }
    },
    limitContent(){
      if(!this.comment.content) return '';
      if(this.comment.content.length <= 300) return this.comment.content;
      return this.comment.content.substring(0, 300 )+ '...';
    },
    readMore(){
      if(this.summary){
        return this.$t('Read more');
      }else{
        return this.$t('Read less');
      }
    },
    contentDisplay(){
      if(this.summary){
        return this.limitContent;
      }else{
        return this.comment.content;
      }
    },
    organisationId(){
      return state.generalParameters.organisationId;
    },

    authenticated(){
      return state.generalParameters.authenticated;
    },

    editRight() {
      if (this.authenticated) {
        if (this.organisationId === this.comment.organisationId) {
          return true;
        }
        if (state.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
    }
  },

  methods: {
    async fetchAnswers() {
      this.loading = true;
      this.loaded = false;
      /* let param = {
        first: this.first,
        size: this.size,
        commentId: this.comment.commentId,
      } */
      /* const data = await octopusApi.fetchCommentsAnswers(param); */
      const data = [{commentId:10, content: "Test", date:1603806083848, name:"Lupinos Boy", relatedComments:0},
                    {commentId:11, content: "Des", date:1603806083848, name:"Boyito Boy", relatedComments:0},
                    {commentId:12, content: "Commentaires", date:1603806083848, name:"Cotelette", relatedComments:0},
                    {commentId:13, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", date:1603806083848, name:"Woodito", relatedComments:0}];
      this.loading = false;
      this.loaded = true;
      this.answers = this.answers.concat(data).filter((c)=>{
        return c!== null;
      });
      this.first += this.size;
      /* this.totalCount = data.count; */
      this.totalCount = 42;
    },
    deleteComment(){
      this.$emit('deleteComment');
    },
    updateComment(comment){
      this.$emit('updateComment', comment);
    }
  },

  watch: {
  },
};
</script>
