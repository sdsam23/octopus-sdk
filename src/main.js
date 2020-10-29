import Vue from 'vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import App from './App.vue'
import VueI18n from 'vue-i18n';
import I18nResources from './locale/messages';
import router from '@/router/router';
import moment from 'moment';
import store from '@/store/AppStore';
let paramStore = require('./store/paramStore');


moment.locale('fr');
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.config.productionTip = false;

//Gestion de l'i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'fr',
  messages: I18nResources,
});

// Initialisation store
paramStore.initialize({
  generalParameters : {},
  podcastPage : {},
  podcastsPage : {},
  emissionsPage : {},
  emissionPage: {},
  intervenantPage: {},
  searchPage: {},
  player:{},
  organisation : {},
  octopusApi : {},
  footer:{},
}).then(()=>{
  new Vue({
    i18n,
    store,
    router,
    render: h => h(App),
  }).$mount('#app')
  Vue.seleniumFormat = function(string){
    return string.toLowerCase().replace(/\s/g, "");
  };
  Vue.setCookie = function (name, value) {
    var date = new Date();
    date.setTime(date.getTime() + (24*60*60*1000));
    var expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
  };
  Vue.getCookie = function (name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
      var c = ca[i];
      while (c.charAt(0)==' ') c = c.substring(1,c.length);
      if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
  };
});

