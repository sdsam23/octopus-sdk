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
  emissionsPage: {
  },
  emissionPage: {
  },
  intervenantPage: {
  },
  searchPage: {
  },
  organisation : {
  },
  octopusApi : {

  }
};

var initialize = function initialize(initObject){
  return new Promise((resolve, reject) => {
    if(initObject.generalParameters){
      let param = initObject.generalParameters;
      state.generalParameters.organisationId = (typeof param.organisationId !== "undefined") ? param.organisationId : 'ecbd98d9-79bd-4312-ad5e-fc7c1c4a191c';
      state.generalParameters.authenticated = (typeof param.authenticated !== "undefined") ? param.authenticated : true;
      state.generalParameters.isAdmin =(typeof param.isAdmin !== "undefined") ? param.isAdmin : false;
      state.generalParameters.ApiUri = (typeof param.ApiUri !== "undefined") ? param.ApiUri : 'https://api.staging.saooti.org/';
      state.generalParameters.isIE11 = (typeof param.isIE11 !== "undefined") ? param.isIE11 : false;
      state.generalParameters.podcastmaker =(typeof param.podcastmaker !== "undefined") ? param.podcastmaker : true;
      state.generalParameters.buttonPlus =(typeof param.buttonPlus !== "undefined") ? param.buttonPlus : true;
    }
    if(initObject.podcastPage){
      let param = initObject.podcastPage;
      state.podcastPage.EditBox = (typeof param.EditBox !== "undefined") ? param.EditBox : false;
      state.podcastPage.SharePlayer = (typeof param.SharePlayer !== "undefined") ? param.SharePlayer : false;
      state.podcastPage.ShareButtons = (typeof param.ShareButtons !== "undefined") ? param.ShareButtons : false;
      state.podcastPage.ShareDistribution = (typeof param.ShareDistribution !== "undefined")? param.ShareDistribution : false;
      state.podcastPage.MiniplayerUri = (typeof param.MiniplayerUri !== "undefined") ? param.MiniplayerUri : 'https://player.staging.saooti.org/';
      state.podcastPage.ouestFranceStyle = (typeof param.ouestFranceStyle !== "undefined") ? param.ouestFranceStyle : true;
      state.podcastPage.tagList= (typeof param.tagList !== "undefined") ? param.tagList : true;
    }
    if(initObject.podcastsPage){
      let param = initObject.podcastsPage;
      state.podcastsPage.ProductorSearch = (typeof param.ProductorSearch !== "undefined") ? param.ProductorSearch : true;
      state.podcastsPage.MonetizableFilter = (typeof param.MonetizableFilter !== "undefined") ? param.MonetizableFilter : false;
      state.podcastsPage.podcastShadow = (typeof param.podcastShadow !== "undefined") ? param.podcastShadow : true;
      state.podcastsPage.podcastBorderBottom = (typeof param.podcastBorderBottom !== "undefined") ? param.podcastBorderBottom : false;
      state.podcastsPage.titlePage = (typeof param.titlePage !== "undefined") ? param.titlePage : undefined;
    }
    if(initObject.emissionsPage){
      let param = initObject.emissionsPage;
      state.emissionsPage.smallItems = (typeof param.smallItems !== "undefined") ? param.smallItems : true;
      state.emissionsPage.lightItems = (typeof param.lightItems !== "undefined") ? param.lightItems : true;
      state.emissionsPage.titlePage = (typeof param.titlePage !== "undefined") ? param.titlePage : undefined;
    }
    if(initObject.emissionPage){
      let param = initObject.emissionPage;
      state.emissionPage.ouestFranceStyle = (typeof param.ouestFranceStyle !== "undefined") ? param.ouestFranceStyle : true;
    }
    if(initObject.intervenantPage){
      let param = initObject.intervenantPage;
      state.intervenantPage.lightStyle = (typeof param.lightStyle !== "undefined") ? param.lightStyle : true;
    }
    if(initObject.searchPage){
      let param = initObject.searchPage;
      state.searchPage.hideBar = (typeof param.hideBar !== "undefined") ? param.hideBar : true;
    }
    if(initObject.organisation){
      let param = initObject.organisation;
      state.organisation.imageUrl = (typeof param.imageUrl !== "undefined") ? param.imageUrl : '/img/emptypodcast.png';
      state.organisation.name = (typeof param.name !== "undefined") ? param.name : 'Saooti';
      state.organisation.userName = (typeof param.userName !== "undefined") ? param.userName : '';
    }
    if(initObject.octopusApi){
      let param = initObject.octopusApi;
      state.octopusApi.url = (typeof param.url !== "undefined") ? param.url : "http://api.staging.saooti.org/";
      state.octopusApi.organisationId = (typeof param.organisationId !== "undefined") ? param.organisationId : undefined;
      let error = octopusApi.initialize(state.octopusApi);
      if(error){
        reject();
      } else{
        octopusApi.fetchCategories({ lang: 'fr' }).then((data)=>{
          state.generalParameters.allCategories = data;
          resolve();
        });
      }
    }else{
      reject();
    }
  });
};

export {
	initialize,
	state
}