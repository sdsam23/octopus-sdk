<template>
  <div class="d-flex flex-column mt-3">
    <div class="d-flex justify-content-center" v-if="loading">
      <div class="spinner-border mr-3"></div>
      <h3 class="mt-2">{{ $t('Loading content ...') }}</h3>
    </div>
    <div v-if="loaded && !comments.length">
      <p>{{ $t('Be the first to react') }}</p>
    </div>
    <div class="d-flex flex-column" v-show="loaded">
      <CommentItem
        :comment="c"
        v-for="c in comments"
        :key="c.commentId"
        @deleteComment="deleteComment(c)"
        @updateComment="updateComment"
      />
    </div>
    <a
      class="btn btn-primary mt-2"
      :class="podcastId? 'align-self-center':'align-self-start'"
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
/* import CommentItem from "./CommentItem.vue" */
/* import octopusApi from "@saooti/octopus-api"; */

export default {
  name: 'CommentList',

  props:  {
    first: { default: 0 },
    size: { default: 5 },
    podcastId: {default:undefined},
    commentId: {default:undefined},
    reload:{default:false},
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
  },

  methods: {
    async fetchContent(reset) {
      this.resetData(reset);
      /* let param = {
        first: this.dfirst,
        size: this.dsize,
        podcastId: this.podcastId
      } */
      /* const data = await octopusApi.fetchComments(param); */
      let data;
      if(this.podcastId){
        data = [{commentId:0, status:"pending", organisationId:"ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c", relatedCommentsId:0, content: "Test", date:1603806083848, name:"Lupinos Boy", relatedComments:0},
                    {commentId:1, status:"valid", organisationId:"ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c", relatedCommentsId:0, content: "Des", date:1603806083848, name:"Boyito Boy", relatedComments:3, relatedValidComments:1},
                    {commentId:2, status:"invalid", organisationId:"ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c", relatedCommentsId:0, content: "Commentaires", date:1603806083848, name:"Cotelette", relatedComments:0},
                    {commentId:3, status:"valid", organisationId:"ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c", relatedCommentsId:0, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", date:1603806083848, name:"Woodito", relatedComments:5, relatedValidComments:5}];
      }else{
        data = [{commentId:10, status:"valid", organisationId:"ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c", relatedCommentsId:1, content: "Test", date:1603806083848, name:"Lupinos Boy", relatedComments:0},
                    {commentId:11, status:"valid", organisationId:"ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c", relatedCommentsId:1, content: "Des", date:1603806083848, name:"Boyito Boy", relatedComments:0},
                    {commentId:12, status:"valid", organisationId:"ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c", relatedCommentsId:1, content: "Commentaires", date:1603806083848, name:"Cotelette", relatedComments:0},
                    {commentId:13, status:"valid", organisationId:"ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c", relatedCommentsId:1, content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", date:1603806083848, name:"Woodito", relatedComments:0}]
      }
      
      this.resetData(reset);
      this.loading = false;
      this.loaded = true;
      this.comments = this.comments.concat(data).filter((c)=>{
        return c!== null;
      });
      this.dfirst += this.dsize;
      /* this.totalCount = data.count; */
      this.totalCount = 42;
      this.$emit("fetch", this.totalCount);
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
      let index = this.comments.findIndex(element => element.commentId === comment.commentId);
      this.comments.splice(index, 1);
    },
    updateComment(comment){
      let index = this.comments.findIndex(element => element.commentId === comment.commentId);
      this.comments.splice(index, 1, comment);
    }
  },

  watch: {
    reload(){
      this.fetchContent(true);
    }
  },
};
</script>
