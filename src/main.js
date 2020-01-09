import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n';
import I18nResources from './locale/messages';
import router from '@/router/router';
import moment from 'moment';
let store = require('./store/AppStore');


moment.locale('fr');
Vue.config.productionTip = false;

//Gestion de l'i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'fr',
  messages: I18nResources,
});

// Initialisation store
store.initialize({
  generalParameters : {},
  podcastPage : {},
  podcastsPage : {},
  emissionsPage : {},
  emissionPage: {},
  organisation : {},
  octopusApi : {},
}).then(()=>{
  new Vue({
    i18n,
    router,
    render: h => h(App),
  }).$mount('#app')
});

