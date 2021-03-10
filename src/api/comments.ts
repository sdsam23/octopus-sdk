const octopusApi = require('@saooti/octopus-api');
export default {
  postComment(store, parameters) {
    console.log(store);
    octopusApi.postComment(parameters);
  },
};
