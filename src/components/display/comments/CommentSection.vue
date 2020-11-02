<template>
  <div class="d-flex flex-column mt-3 module-box comment-item-container">
    <div class="d-flex align-items-center">
      <h2 class="mb-0 mr-2">{{$t("Podcast's comments")}}
        <template v-if="loaded && totalCount > 1">{{$t("()",{nb:totalCount})}}</template>
      </h2>
       <button class="saooti-refresh-stud btn btn-reload primary-color" @click="reloadComments"></button>
    </div>
    <CommentInput
    :podcast="podcast"
    :knownIdentity.sync="knownIdentity"
    :fetchConference="fetchConference"
    @newComment="newComment"/>
    <CommentList 
    ref="commentList"
    :podcast="podcast" 
    :reload="reload" 
    :fetchConference="fetchConference"
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
import { cookies } from '../../mixins/functions'

export default {
  name: 'CommentSection',

  props:  {
    podcast: {default:undefined},
    fetchConference: {default:undefined},
  },

  mixins: [cookies],

  components: {
    CommentList,
    CommentInput
  },

  created() {
    this.knownIdentity = this.getCookie('comment-octopus-name');
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
    updateFetch(value){
      this.loaded = true;
      this.$store.commit('setCommentLoaded', {...value,podcastId:this.podcast.podcastId});
      this.totalCount = value.count;
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
