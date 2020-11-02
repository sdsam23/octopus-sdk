<template>
  <div class="d-flex flex-column mt-3">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading content ...') }}</h3>
    </div>
    <div class="text-danger align-self-center" v-if="error">{{$t('Comments loading error')}}</div>
    <div class="d-flex flex-column" v-show="loaded">
      <CommentItem
        :comment.sync="c"
        :podcast="podcast"
        :fetchConference="fetchConference"
        v-for="c in comments"
        :key="c.comId"
        @deleteComment="deleteComment(c)"
        @updateComment="updateComment"
      />
    </div>
    <a
      class="btn btn-primary mt-2"
      :class="comId? 'align-self-start':'align-self-center'"
      @click="displayMore"
      v-show="!allFetched && loaded"
      :aria-label="$t('See more comments')"
    >{{$t('See more comments')}}
    </a>
  </div>
</template>

<style lang="scss">
</style>

<script>
import {state} from "../../../store/paramStore.js";
import octopusApi from "@saooti/octopus-api";

export default {
  name: 'CommentList',

  props:  {
    first: { default: 0 },
    size: { default: 50 },
    podcast: {default:undefined},
    comId: {default:undefined},
    reload:{default:false},
    fetchConference:{default:undefined},
    organisation:{default:undefined},
  },

  components: {
    CommentItem: () => import('./CommentItem.vue')
  },

  created() {
    this.fetchContent(true);
  },

  data() {
    return {
      loading: true,
      loaded: true,
      error:false,
      dfirst: this.$props.first,
      dsize: this.$props.size,
      totalCount: 0,
      comments: [],
    };
  },

  computed: {
    allFetched() {
      return this.dfirst >= this.totalCount;
    },
    organisationId(){
      return state.generalParameters.organisationId;
    },

    authenticated(){
      return state.generalParameters.authenticated;
    },
    podcastId(){
      if(this.podcast){
        return this.podcast.podcastId;
      }else{
        return undefined;
      }
    },

    editRight() {
      if (this.authenticated) {
        if (((this.podcast && this.organisationId === this.podcast.organisation.id) || (this.organisationId === this.organisation))
         && this.$store.state.authentication.role.includes("COMMENTS_MODERATION")) {
          return true;
        }
        if (state.generalParameters.isAdmin) {
          return true;
        }
      }
      return false;
    },
  },

  methods: {
    async fetchContent(reset) {
      this.resetData(reset);
      let data; 
      try {
        if(this.comId){
          data = await octopusApi.fetchCommentAnswers(this.comId);
        }else{
          let param = {
            first: this.dfirst,
            size: this.dsize,
            podcastId: this.podcastId,
            organisationId:this.organisation,
          }
          data = await octopusApi.fetchRootComments(param);
        }
        
        this.resetData(reset);
        this.loading = false;
        this.loaded = true;
        this.totalCount = data.totalElements;
        this.comments = this.comments.concat(data.content).filter((c)=>{
          if(!this.editRight){
            return c!==null && c.status === "Valid";
          }
          return c!== null;
        });
        this.dfirst += this.dsize;
      } catch (error) {
        this.loading = false;
        this.error = true;
      }
    },

    resetData(reset){
      if (reset) {
        this.comments = [];
        this.dfirst = 0;
        this.loading = true;
        this.loaded = false;
      }
    },
    displayMore(event) {
      event.preventDefault();
      this.fetchContent(false);
    },
    deleteComment(comment){
      this.totalCount -=1; 
      if(this.dfirst !==0){
        this.dfirst -=1;
      }
      let index = this.comments.findIndex(element => element.comId === comment.comId);
      if(index !== -1){
        this.comments.splice(index, 1);
      }
      
    },
    updateComment(data){
      let index = this.comments.findIndex(element => element.comId === data.comment.comId);
      if(index !== -1){
        this.comments.splice(index, 1, data.comment);
      }
      
      if(this.comId && data.status){
        this.$emit('updateStatus', data.status);
      }
    },
    addNewComment(comment){
      this.totalCount +=1; 
      this.dfirst +=1;
      this.comments.unshift(comment);
    }
  },

  watch: {
    reload(){
      this.fetchContent(true);
    },
    comments(){
      this.$emit("fetch", {count:this.totalCount, comments:this.comments});
    }
  },
};
</script>
