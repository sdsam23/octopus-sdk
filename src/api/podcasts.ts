const octopusApi = require('@saooti/octopus-api');
export default {
  async fetchPodcastsAdmin(store: any, parameters: any) {
    console.log(store);
    return await octopusApi.fetchPodcasts(parameters);
  },
};
