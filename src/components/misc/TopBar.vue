<template>
  <div class="top-bar-container position-sticky" v-bind:class="{ 'shadow-element': scrolled }">
    <div class="top-bar">
      <div class="hamburger-menu" v-on:click="onDisplayMenu(false)" :aria-label="$t('open left Menu')">
        <div class="saooti-burger-menu h3"></div>
      </div>
      <router-link 
      :to="{ name: 'home', query:{productor: $store.state.filter.organisationId}}">
        <div class="top-bar-logo m-3" v-on:click="onDisplayMenu(true)">
          <img src="/img/logo_octopus_final.svg" :alt="$t('Logo of main page')" />
        </div>
      </router-link>
      <div class="d-flex align-items-center justify-content-center flex-grow">
        <router-link 
        :to="{ name: 'podcasts', query:{productor: $store.state.filter.organisationId}}"
        class="linkHover p-3 text-dark font-weight-bold">{{ $t('Podcasts') }}</router-link>
        <router-link
        :to="{ name: 'emissions', query:{productor: $store.state.filter.organisationId}}"
        class="linkHover p-3 text-dark font-weight-bold">{{ $t('Emissions') }}</router-link>
        <router-link 
        :to="{ name: 'productors', query:{productor: $store.state.filter.organisationId}}"
        class="linkHover p-3 text-dark font-weight-bold" v-if="!isPodcastmaker && !filterOrga">{{ $t('Productors') }}</router-link>
        <router-link 
        :to="{ name: 'participants', query:{productor: $store.state.filter.organisationId}}"
        class="linkHover p-3 text-dark font-weight-bold">{{ $t('Speakers') }}</router-link>
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <OrganisationChooser
					:defaultanswer="$t('No organisation filter')"
					@selected="onOrganisationSelected"
					:value='organisationId'
          :light='true'
          class="mr-2 hide-phone"
          :reset='reset'
          v-if="!isPodcastmaker"
          />
        <router-link to="/main/priv/upload" v-if="authenticated && !isPodcastmaker" class="mr-3">
          <button class="btn btn-primary">{{ $t('Upload new podcast') }}</button>
        </router-link>
        <div class="d-flex justify-content-end mr-3">
          <b-dropdown right toggle-class="text-decoration-none m-1 admin-button btn-rounded-icon" no-caret>
            <template v-slot:button-content>
              <i class="saooti-user text-dark" v-if="!imageUrl"></i><span class="sr-only">Profile</span>
            </template>
            <template v-if="!authenticated">
              <b-dropdown-item href="/sso/login">{{ $t('Login') }}</b-dropdown-item>
              <b-dropdown-item to="/main/pub/create" v-if="!isPodcastmaker">{{$t('Create an account')}}</b-dropdown-item>
            </template>
            <template @click="displayMenuPhone(true)" v-else>
              <b-dropdown-item to="/main/priv/backoffice">{{$t('My space')}}</b-dropdown-item>
              <b-dropdown-item to="/main/priv/edit/profile" v-if="!isPodcastmaker">{{ $t('Edit my profile') }}</b-dropdown-item>
              <b-dropdown-item to="/main/priv/edit/organisation" v-if="!isPodcastmaker">{{$t('Edit my organisation')}}</b-dropdown-item>
              <!-- Lien pour mobile-->
              <b-dropdown-item to="/main/priv/upload" class="show-phone" v-if="!isPodcastmaker">{{$t('Upload new podcast')}}</b-dropdown-item>
              <b-dropdown-item href="/sso/logout">{{ $t('Logout') }}</b-dropdown-item>
            </template>
          </b-dropdown>
          <router-link 
          :aria-label ="$t('Search')"
          :to="{ name: 'podcasts', query:{productor: $store.state.filter.organisationId}}">
            <div class="btn admin-button m-1">
              <i class="saooti-search text-dark"></i>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.top-bar-container {
  top: 0;
  background: #fff;
  width: 100%;
  z-index: 10;

  .top-bar {
    transition: height 1s;
    display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    height: 5rem;

    .top-bar-logo{
      width: 200px;
    }

    .hamburger-menu {
      display: none;
      margin: 0 1rem;
      .saooti-burger-menu {
      font-size: 1.5rem;
      font-weight: bold;
      }
      cursor: pointer;
    }
  }

  &.shadow-element {
    .linkHover{
      display: none;
    }
    .top-bar {
      height: 3.5rem;

      .hamburger-menu {
        display: block;
        .saooti-burger-menu {
          font-size: 2.2em;
          font-weight: bold;
          margin: 0;
        }
      }
      .top-bar-logo {
        flex-grow: 1;
        text-align: center;
        align-items: center;
        display: flex;
        img {
          height: 2rem;
          width: auto;
        }
      }
    }
  }
  
  /** PHONES*/
  @media (max-width: 1200px) {
    .hid {
      display: none;
    }
    .top-bar {
      padding: 0;
      height: 3.5rem;
      .linkHover, .btn-primary{
        display: none;
      }
      .hamburger-menu {
        flex-grow: 1;
        display: block;
      }
      .top-bar-logo {
        flex-grow: 1;
        text-align: center;
        display: flex;
        width: 100px;
        img {
          max-width: 100px;
        }
      }
    }
  }
}
</style>

<script>
import {state} from "../../store/paramStore.js";
import OrganisationChooser from '../display/organisation/OrganisationChooser.vue';

export default {
  name: "TopBar",

  components:{
    OrganisationChooser
  },

  mounted() {
    if(this.imageUrl){
      let imageLogin = document.getElementsByClassName('btn-rounded-icon')[0];
      imageLogin.style.background = "url(" + this.imageUrl + ")";
      imageLogin.style.backgroundSize = "cover";
    }
    if(this.filterOrga){
      this.organisationId = this.filterOrga;
    }
    window.addEventListener("scroll", this.handleScroll);
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.handleScroll);
  },

  props: ["displayMenu"],

  data() {
    return {
      scrolled: false,
      oldScrollY: 0,
      minScroll: 0,
      organisationId:undefined,
      reset: false,
    };
  },

  computed: {
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    authenticated(){
      return this.$store.state.authentication.isAuthenticated;
    },
    name(){
      return state.organisation.userName;
    },
    imageUrl(){
      return this.$store.state.profile.imageUrl;
    },
    filterOrga(){
      return this.$store.state.filter.organisationId;
    }
  },

  methods: {
    handleScroll() {
      if (window.scrollY - this.oldScrollY > 0 && window.scrollY > 1 && document.body.offsetHeight - window.innerHeight > 40) {
        this.scrolled = true;
        this.minScroll = 0;
      } else if (
        window.scrollY - this.oldScrollY < 0 &&
        window.scrollY < 1 &&
        this.minScroll > 20
      ) {
        this.scrolled = false;
        this.minScroll = 0;
      }
      this.oldScrollY = window.scrollY;
      if (this.minScroll < window.scrollY) {
        this.minScroll = window.scrollY;
      }
      if (!this.scrolled) {
        this.$emit('update:displayMenu', false);
      }
    },

    onDisplayMenu(param) {
      if(param === true){
        this.$emit('update:displayMenu', false);
      } else{
        this.$emit('update:displayMenu', !this.displayMenu);
      }
    },

    displayMenuPhone(hidden) {
      if (hidden) {
        this.$refs.menu.className = "menu hid";
      } else {
        this.$refs.menu.className = "menu";
      }
    },

    onOrganisationSelected(organisation){
      if (organisation && organisation.id) {
        if(this.$route.query.productor !== organisation.id){
          this.$router.push({query: {productor: organisation.id}});
        }
        this.$store.commit('filterOrga', organisation.id);
      } else {
        if(this.$route.query.productor){
          this.$router.push({query: {productor: undefined}});
        }
        this.$store.commit('filterOrga', undefined);
      }
    }
  },

  watch:{
    imageUrl(newVal){
      if(newVal){
        let imageLogin = document.getElementsByClassName('btn-rounded-icon')[0];
        imageLogin.style.background = "url(" + newVal + ")";
        imageLogin.style.backgroundSize = "cover";
      }
    },
    filterOrga(newVal){
      if(newVal){
        this.organisationId = newVal;
      }else{
        this.reset = !this.reset;
      }
    }
  }
};
</script>
