import 'bootstrap'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Vue from 'vue'
import App from './App.vue'
import VueI18n from 'vue-i18n';
import I18nResources from '@/locale/messages';
import octopusApi from '@saooti/octopus-api';
import router from '@/router/router';

Vue.config.productionTip = false;

//Gestion de l'i18n
Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: 'fr',
  messages: I18nResources,
});

let error = octopusApi.initialize({
  url: 'http://api.staging.saooti.org/',
})
if(error){
  //Handle error
}

new Vue({
  i18n,
  router,
  render: h => h(App),
}).$mount('#app')
