<template>
  <div class="category-chooser-container" :style="{ width: width }">
    <Multiselect
      v-model="category"
      id="ajax"
      label="name"
      track-by="id"
      :placeholder="$t('Type string to filter by categories')"
      :options="categories"
      :multiple="multiple"
      :searchable="true"
      :loading="isLoading"
      :internal-search="false"
      :clear-on-select="false"
      :close-on-select="true"
      :options-limit="200"
      :max-height="600"
      :show-no-results="true"
      :hide-selected="true"
      :show-labels="false"
      @open="clearAll"
      @search-change="onSearchCategory"
      @close="onClose"
      @select="onEmissionSelected"
    >
      <template slot="singleLabel" slot-scope="props">
        <div class="proposition">
          <span class="option__title">
            {{ props.option.name }}
          </span>
        </div>
      </template>
      <template slot="option" slot-scope="props">
        <div class="proposition">
          <span class="option__title">{{ props.option.name }}</span>
        </div>
      </template>
      <template slot="noOptions">{{ $t('List is empty') }}</template>
      <span slot="noResult">
        {{ $t('No elements found. Consider changing the search query.') }}
      </span>
    </Multiselect>
  </div>
</template>

<style lang="scss">
.category-chooser-container {
  width: 100%;

  .proposition {
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    .option__title {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .multiselect__tags {
    border-radius: 0.3rem;
        padding: 12px 40px 2px 20px;
  }
  .multiselect__tag{
    color: black;
    background: #e6f3ed;
  }
}
</style>
<script>
import Multiselect from 'vue-multiselect';

const getDefaultCategory = defaultName => {
  if(defaultName !== undefined){
    return {name: defaultName, id: 0};
  } else {
    return '';
  }
};

export default {
  components: {
    Multiselect,
  },

  props: { 
    width: { default: '100%' },
    defaultanswer: { default: undefined },
    categorySelected: {default: undefined},
    multiple: {default: false},
    categoryArray: {default: undefined},
    displayAllCategories: {default: false}
  },

  computed: {
    allCategories(){
      return this.$store.state.categories;
    }
  },

  data() {
    return {
      categories: [],
      category: getDefaultCategory(this.defaultanswer),
      isLoading: false,
      totalCategories: undefined,
      init: true,
    };
  },

  mounted() {
    if(this.categorySelected !== undefined){
      this.initCategorySelected(this.categorySelected);
    }
    if(this.categoryArray !== undefined){
      this.initCategoryArray(this.categoryArray);
    }
  },

  methods: {
    clearAll() {
      if(this.categoryArray === undefined) {
        this.category = '';
      }
      if(this.categorySelected !== undefined || this.categoryArray !== undefined || this.displayAllCategories){
        this.totalCategories = this.allCategories;
      } else {
        this.totalCategories = this.allCategories.filter(c => {return c.podcastCount;});
      }
      if(this.defaultanswer !== undefined){
        this.categories = [getDefaultCategory(this.defaultanswer)].concat(
          this.totalCategories
        );
      } else {
        this.categories = this.totalCategories;
      }
    },

    onClose() {
      if (!this.category && this.categoryArray === undefined) {
        this.category = getDefaultCategory(this.defaultanswer);
        this.onEmissionSelected(this.category);
      }
    },

    onSearchCategory(query) {
      this.isLoading = true;
      let list = [getDefaultCategory(this.defaultanswer)].concat(
        this.totalCategories
      );
      if(this.defaultanswer === undefined){
        list = this.totalCategories;
      } 
      this.categories = list.filter(item => {
        return item.name.toUpperCase().includes(query.toUpperCase());
      });
      this.isLoading = false;
    },

    onEmissionSelected(category) {
      if(this.categorySelected !== undefined){
        this.$emit('update:categorySelected', category.id);
      } else if(this.categoryArray === undefined){
        this.$emit('selected', category);
      }
    },
    initCategorySelected(val){
      this.category = this.$store.state.categories.find((el)=>{
        return el.id === val;
      });
    },
    initCategoryArray(val){
      this.category = [];
      val.forEach(element => {
        let item = this.$store.state.categories.find((el)=>{
          return el.id === element;
        })
        this.category.push(item);
      }); 
    }
  },
  watch:{
    categorySelected(newVal) {
      this.initCategorySelected(newVal);
    },
    category(newVal) {
      if(this.categoryArray !== undefined){
        let idsArray = [];
        newVal.forEach((el)=>{
          idsArray.push(el.id);
        })
        this.$emit('selected', idsArray);
      }
    }
  }
};
</script>
