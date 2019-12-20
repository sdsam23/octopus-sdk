import octopusApi from '@saooti/octopus-api';

var state = {
  generalParameters : {
  },
  filter : {
    organisationId : undefined,
  },
  podcastPage : {
  },
  podcastsPage : {
  },
  organisation : {
  },
  octopusApi : {

  }
};

var initialize = function initialize(initObject){
	if(initObject.generalParameters){
    let param = initObject.generalParameters;
    state.generalParameters.organisationId = param.organisationId ? param.organisationId : 'ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c';
    state.generalParameters.authenticated = param.authenticated ? param.authenticated : true;
    state.generalParameters.isAdmin = param.isAdmin ? param.isAdmin : true;
    state.generalParameters.ApiUri = param.ApiUri ? param.ApiUri : 'https://api.staging.saooti.org/';
    state.generalParameters.allCategories = param.allCategories ? param.allCategories : [];
    state.generalParameters.isIE11 = param.isIE11 ? param.isIE11 : false;
    state.generalParameters.podcastmaker = param.podcastmaker ? param.podcastmaker : false;
  }
  if(initObject.podcastPage){
    let param = initObject.podcastPage;
    state.podcastPage.EditBox = param.EditBox ? param.EditBox : true;
    state.podcastPage.SharePlayer = param.SharePlayer ? param.SharePlayer : true;
    state.podcastPage.ShareButtons = param.ShareButtons ? param.ShareButtons : true;
    state.podcastPage.ShareDistribution = param.ShareDistribution ? param.ShareDistribution : true;
    state.podcastPage.MiniplayerUri = param.MiniplayerUri ? param.MiniplayerUri : 'https://player.staging.saooti.org/';
  }
  if(initObject.podcastsPage){
    let param = initObject.podcastPage;
    state.podcastsPage.ProductorSearch = param.ProductorSearch ? param.ProductorSearch : true;
    state.podcastsPage.MonetizableFilter = param.MonetizableFilter ? param.MonetizableFilter : false;
  }
  if(initObject.organisation){
    let param = initObject.organisation;
    state.organisation.imageUrl = param.imageUrl ? param.imageUrl : '/img/emptypodcast.png';
    state.organisation.name = param.name ? param.name : 'Saooti';
    state.organisation.userName = param.userName ? param.userName : '';
  }
  if(initObject.octopusApi){
    let param = initObject.octopusApi;
    state.octopusApi.url = param.url ? param.url : "http://api.staging.saooti.org/";
    state.octopusApi.organisationId = param.organisationId ? param.organisationId : undefined;
    let error = octopusApi.initialize(state.octopusApi)
    if(error){
      //Handle error
    }
  }
};

export {
	initialize,
	state
}