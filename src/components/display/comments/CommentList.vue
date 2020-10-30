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
import octopusApi from "@saooti/octopus-api";

export default {
  name: 'CommentList',

  props:  {
    first: { default: 0 },
    size: { default: 50 },
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
      let param = {
        first: this.dfirst,
        size: this.dsize,
        podcastId: this.podcastId
      }
      const data = await octopusApi.fetchRootComments(param);
      this.resetData(reset);
      this.loading = false;
      this.loaded = true;
      this.comments = this.comments.concat(data.content).filter((c)=>{
        return c!== null;
      });
      this.dfirst += this.dsize;
      this.totalCount = data.totalElements;
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
    },
    addNewComment(comment){
      this.comments.unshift(comment);
    }
  },

  watch: {
    reload(){
      this.fetchContent(true);
    }
  },
};
</script>
