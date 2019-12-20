<template>
  <div class="p-3">
    <h2 v-if="name">{{ $t('All podcast button', { name: name }) }}</h2>
    <h2 v-else>{{ $t('All podcast emission button') }}</h2>
    <div class="d-flex align-items-center mt-5 flex-wrap">
      <div class="d-flex align-items-center flex-grow" v-if="categoryFilter">
        <CategoryChooser
          :defaultanswer="$t('No category filter')"
          @selected="onCategorySelected"
        />
      </div>
      <div class="d-flex position-relative flex-grow">
        <input :placeholder="$t('Search')" v-model="searchPattern" class="filter-search-input input-no-outline flex-grow" />
        <div class="saooti-search-bounty search-icon-container"></div>
      </div>
    </div>
      <PodcastList
        :first="first"
        :size="size"
        :iabId="iabId"
        :query="query"
        :participantId="participantId"
        :emissionId="emissionId"
        :organisationId="productorId"
      />
  </div>
</template>

<style lang="scss">
.search-icon-container {
  position: absolute;
  top: 1.6rem;
  right: 1.6rem;
  font-weight: bold;
}
</style>

<script>
// @ is an alias to /src
import CategoryChooser from '../categories/CategoryChooser.vue';
import PodcastList from './PodcastList.vue';

export default {
  components: {
    CategoryChooser,
    PodcastList,
  },

  created() {
    if (this.$route.query.first) {
      this.$data.first = this.$route.query.first;
    } else {
      this.$data.first = 0;
    }
    if (this.$route.query.size) {
      this.$data.size = this.$route.query.size;
    } else {
      this.$data.size = 12;
    }
  },

  props: [
    'participantId',
    'name',
    'emissionId',
    'categoryFilter',
    'productorId',
  ],

  data() {
    return {
      first: undefined,
      size: undefined,
      searchPattern: '',
      iabId: undefined,
    };
  },

  computed: {
    query() {
      if (this.searchPattern.length >= 3) {
        return this.searchPattern;
      } else {
        return '';
      }
    },
  },

  methods: {
    onCategorySelected(category) {
      if (category && category.id) {
        this.iabId = category.id;
      } else {
        this.iabId = undefined;
      }
    },
  },
};
</script>
