import Podcast from "./src/components/pages/Podcast.vue";

export default {
 install(Vue, options) {
  Vue.component("PodcastComponent", Podcast);
 }
};