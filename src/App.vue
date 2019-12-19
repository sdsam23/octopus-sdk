<template>
  <div id="app">
    <TopBar v-bind:displayMenu.sync="displayMenu" />
    <LeftMenu v-bind:displayMenu.sync="displayMenu" />
    <CategoryList />
    <router-view />
    <Footer />
  </div>
</template>
<style lang="scss" src="@/assets/multiselect.scss"></style>
<style lang="scss">
@import 'src/assets/general.scss';
@import 'src/assets/form.scss';
</style>

<script>
import TopBar from '@/components/misc/TopBar.vue';
import LeftMenu from '@/components/misc/LeftMenu.vue';
import Footer from '@/components/misc/Footer.vue';
import CategoryList from '@/components/display/categories/CategoryList.vue';

export default {
  name: 'app',
  components: {
    TopBar,
    LeftMenu,
    CategoryList,
    Footer
  },

  data() {
    return {
      displayMenu: false,
    };
  },
}
</script>

