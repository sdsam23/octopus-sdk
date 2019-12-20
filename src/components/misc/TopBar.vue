<template>
  <div class="top-bar-container position-sticky" v-bind:class="{ 'shadow-element': scrolled }">
    <div class="top-bar">
      <div class="hamburger-menu" v-on:click="onDisplayMenu">
        <div class="saooti-burger-menu h3"></div>
      </div>
      <router-link to="/main/pub/home">
        <div class="top-bar-logo m-3">
          <img src="../../../public/img/logo_octopus_final.svg" :alt="$t('Logo of main page')" />
        </div>
      </router-link>
      <div class="d-flex align-items-center justify-content-center flex-grow">
        <router-link class="linkHover p-3 text-dark font-weight-bold h6" to="/main/pub/podcasts">{{ $t('Podcasts') }}</router-link>
        <router-link class="linkHover p-3 text-dark font-weight-bold h6" to="/main/pub/emissions">{{ $t('Emissions') }}</router-link>
        <router-link class="linkHover p-3 text-dark font-weight-bold h6" to="/main/pub/productors" v-if="!isPodcastmaker">{{ $t('Productors') }}</router-link>
        <router-link class="linkHover p-3 text-dark font-weight-bold h6" to="/main/pub/participants">{{ $t('Speakers') }}</router-link>
      </div>
      <div class="d-flex align-items-center justify-content-end">
        <router-link to="/main/priv/upload" v-if="authenticated" class="mr-3">
          <button class="btn btn-primary h6">{{ $t('Upload new podcast') }}</button>
        </router-link>
        <div class="d-flex justify-content-end">
          <div class="dropdown" v-if="!isPodcastmaker">
            <a  href="#" id="dropdownMenuLink" data-toggle="dropdown"  aria-expanded="false">
              <div class="btn admin-button m-1">
                <i class="saooti-user text-dark"></i>
              </div>
            </a>
            <div class="dropdown-menu dropdown-menu-right mt-4" aria-labelledby="dropdownMenuLink">
              <!-- Lien non authentifié-->
              <template v-if="!authenticated">
                <a href="/sso/login" class="dropdown-item">{{ $t('Login') }}</a>
                <router-link to="/main/pub/create" class="dropdown-item">{{$t('Create an account')}}</router-link>
              </template>
              <!-- Lien authentifié-->
              <template @click="displayMenuPhone(true)" v-else>
                <router-link to="/main/priv/backoffice" class="dropdown-item">{{$t('My space')}}</router-link>
                <router-link to="/main/priv/edit/profile" class="dropdown-item">{{ $t('Edit my profile') }}</router-link>
                <router-link to="/main/priv/edit/organisation" class="dropdown-item">{{$t('Edit my organisation')}}</router-link>
                <!-- Lien pour mobile-->
                <router-link to="/main/priv/upload" class="dropdown-item show-phone">{{$t('Upload new podcast')}}</router-link>
                <a href="/sso/logout" class="dropdown-item">{{ $t('Logout') }}</a>
              </template>
            </div>
          </div>
          <router-link to="/main/pub/search">
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
import {state} from "../../store/AppStore.js";

export default {
  name: "TopBar",

  mounted() {
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
      minScroll: 0
    };
  },

  computed: {
    isPodcastmaker(){
      return state.generalParameters.podcastmaker;
    },
    authenticated(){
      return state.generalParameters.authenticated;
    },
    name(){
      return state.organisation.userName;
    },
  },

  methods: {
    handleScroll() {
      if (window.scrollY - this.oldScrollY > 0 && window.scrollY > 1) {
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

    onDisplayMenu() {
      this.$emit('update:displayMenu', !this.displayMenu);
    },

    displayMenuPhone(hidden) {
      if (hidden) {
        this.$refs.menu.className = "menu hid";
      } else {
        this.$refs.menu.className = "menu";
      }
    }
  },

};
</script>
