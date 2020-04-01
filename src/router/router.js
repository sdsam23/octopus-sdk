import Vue from 'vue';
import VueRouter from 'vue-router';

/*--------------------------------------------------------------------------
Composants publics
--------------------------------------------------------------------------*/
import Home from '@/components/pages/Home.vue';
import PodcastsPage from '@/components/pages/Podcasts.vue';
import EmissionPage from '@/components/pages/Emission.vue';
import EmissionsPage from '@/components/pages/Emissions.vue';
import ParticpantsPage from '@/components/pages/Participants.vue';
import PodcastPage from '@/components/pages/Podcast.vue';
import ParticipantPage from '@/components/pages/Participant.vue';
import SearchPage from '@/components/pages/Search.vue';
import CategoryPage from '@/components/pages/Category.vue';
import RubriquePage from '@/components/pages/Rubrique.vue';

Vue.use(VueRouter);

const routes = [

  /*--------------------------------------------------------------------------
  Liens publics
  --------------------------------------------------------------------------*/
  { path: '/main/pub/home', component: Home },
  { path: '/main/pub/search/:query?',name:'search', component: SearchPage,
    props: route => ({
      query: route.params.query,
    }) },
  { path: '/main/pub/podcasts/:productor?', component: PodcastsPage,
    props: route => ({
      productor: route.params.productor,
    }) },
  { path: '/main/pub/emissions/:productor?', component: EmissionsPage,
    props: route => ({
      productor: route.params.productor,
    }) },
  { path: '/main/pub/participants/:productor?', component: ParticpantsPage,
    props: route => ({
      productor: route.params.productor,
    }) },
    {
    path: '/main/pub/emission/:emissionId',
    component: EmissionPage,
    props: route => ({
      first: parseInt(route.query.first, 10) || 0,
      size: parseInt(route.query.size, 10) || 12,
      emissionId: parseInt(route.params.emissionId, 10),
    }),
  },
  {
    path: '/main/pub/podcast/:podcastId',
    component: PodcastPage,
    props: route => ({
      podcastId: parseInt(route.params.podcastId, 10),
    }),
  },
  {
    path: '/main/pub/participant/:participantId',
    component: ParticipantPage,
    props: route => ({
      first: parseInt(route.query.first, 10) || 0,
      size: parseInt(route.query.size, 10) || 12,
      participantId: parseInt(route.params.participantId, 10),
    }),
  },
  {
    path: '/main/pub/category/:iabId',
    component: CategoryPage,
    props: route => ({
      first: parseInt(route.query.first, 10) || 0,
      size: parseInt(route.query.size, 10) || 12,
      iabId: parseInt(route.params.iabId, 10),
    }),
  },
  {
    path: '/main/pub/rubrique/:rubriqueId',
    component: RubriquePage,
    props: route => ({
      first: parseInt(route.query.first, 10) || 0,
      size: parseInt(route.query.size, 10) || 12,
      rubriqueId: parseInt(route.params.rubriqueId, 10),
    }),
  },
];

export default new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});
