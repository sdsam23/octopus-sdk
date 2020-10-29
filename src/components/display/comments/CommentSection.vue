<template>
  <div class="d-flex flex-column mt-3 module-box comment-item-container">
    <div class="d-flex align-items-center">
      <h2 class="mb-0 mr-2">{{$t("Podcast's comments")}}
        <template v-if="loaded && totalCount > 1">{{$t("()",{nb:totalCount})}}</template>
      </h2>
       <button class="saooti-refresh-stud btn btn-reload primary-color" @click="reloadComments"></button>
    </div>
    <CommentInput
    :podcastId="podcastId"
    :organisationId="organisationId"
    :knownIdentity.sync="knownIdentity"
    @newComment="newComment"/>
    <CommentList 
    ref="commentList"
    :podcastId="podcastId" 
    :reload="reload" 
    @fetch="updateFetch"/>
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
</style>

<script>
import CommentList from "./CommentList.vue"
import CommentInput from './CommentInput.vue';
import Vue from "vue";

export default {
  name: 'CommentSection',

  props:  {
    podcastId: {default:undefined},
    organisationId: {default:undefined},
  },

  components: {
    CommentList,
    CommentInput
  },

  created() {
    this.knownIdentity = this.getCookie('comment-ocopus-name');
  },

  data() {
    return {
      totalCount: 0,
      loaded : false,
      reload: false,
    };
  },

  computed: {
    knownIdentity: {
      get() {
        return this.$store.state.comments.knownIdentity
      },
      set(value) {
        this.$store.commit('setCommentIdentity', value);
      },
    },
  },

  methods: {
    getCookie(name){
      return Vue.getCookie(name);
    },
    updateFetch(value){
      this.loaded = true;
      this.totalCount = value;
    },
    reloadComments(){
      this.reload = !this.reload;
    },
    newComment(comment){
      this.$refs.commentList.addNewComment(comment);
    }
  },
};
</script>
