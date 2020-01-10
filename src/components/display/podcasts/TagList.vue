<template>
    <div v-if="tagList !== undefined">
      <ul class='d-flex flex-wrap'>
        <li class='tagListElement' v-for="tag in tagList" :key="tag">
          <router-link :to="{ name: 'search', query: {query: tag }}" class='tagListLink'>{{tag}}</router-link>
        </li>
      </ul>
    </div>
</template>
<style lang="scss" scoped>

.tagListElement{
  display: flex;
  margin: 0.5rem;
  padding: 1rem;
  border: 1px solid #999;
  cursor: pointer;
}
.tagListLink{
  font-weight: bold;
  font-size: 1.5rem;
  color: #666;
}
	
</style>

<script>

export default {
  name: 'TagList',
  components: {
   
  },

  props:['tagList'],

  methods: {
    
  }
};
</script>
