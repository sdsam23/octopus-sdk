<template>
  <div class="d-inline-flex w-100 mb-3 pl-3 pr-3 hide-phone">
    <div class="category-list-container" id="category-list-container">
      <router-link
        :id="'category'+category.id"
        v-bind:to="'/main/pub/category/' + category.id"
        class="category-item text-dark secondary-bg"
        v-for="category in categories"
        v-bind:key="category.id"
        >{{ category.name }}</router-link
      >
    </div>
    <div class="dropdown" v-show="hidenCategories.length">
        <a href="#" data-toggle="dropdown"  aria-expanded="false">
          <div class="category-item text-dark secondary-bg">
            <div class="saooti-plus"></div>
          </div>
        </a>
        <div class="dropdown-menu dropdown-menu-right mr-3">
          <router-link 
            :to="'/main/pub/category/' + category.id" 
            v-for="category in hidenCategories" 
            v-bind:key="category.id" 
            class="dropdown-item"
          >{{ category.name }}</router-link>
        </div>
      </div>
  </div>
</template>

<style lang="scss">
.category-list-container {
  display: inline-flex;
  justify-content: flex-start;
  overflow: hidden;
  flex-grow: 1;
  width: 0;
  padding: 0 4rem;
}
.category-item {
  font-size: 0.6rem;
  margin: 0.2rem;
  padding: 0.5rem;
  display: block;
  height: 1.5rem;
  border-radius: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  flex-shrink: 0;
  &:hover {
    background: #ddd !important;
  }
}
</style>
<script>
import parameters from "../../../store/AppStore.js";

export default {
  name: 'CategoryList',

  mounted(){
    window.addEventListener('resize', this.resizeWindow);
    this.resizeWindow();
  },

 data() {
    return {
      hidenCategories : [],
    };
  },

  computed: {
    categories(){
      return parameters.generalParameters.allCategories.filter(c => {
          return c.podcastCount;
        });
    }
  },

  methods:{
    resizeWindow(){
      document.getElementById("category-list-container").style.justifyContent = 'flex-start';
      this.hidenCategories = [];
      this.categories.forEach(element => {
        let el = document.getElementById('category' + element.id);
        if(el){
          const parent = el.parentNode;
          if(el.offsetLeft + el.clientWidth > parent.clientWidth - 20){
            this.hidenCategories.push(element);
            if(!el.classList.contains('hid')){
              el.className += ' hid';
            }
          } else {
            el.classList.remove('hid');
          }
        }
      });
      if(!this.hidenCategories.length){
        document.getElementById("category-list-container").style.justifyContent = 'center';
      }
    }
  },

  beforeDestroy() {
    window.removeEventListener('resize', this.resizeWindow);
  },

  watch:{
    categories(){
      this.$nextTick(()=>{
        this.resizeWindow(); 
      });   
    }
  }

};
</script>