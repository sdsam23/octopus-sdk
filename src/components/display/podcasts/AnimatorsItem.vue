<template>
  <div class="d-flex align-items-center justify-content-start">
    <router-link
      v-bind:to="'/main/pub/participant/' + animator.participantId"
      class="animator-item"
      v-for="(animator, index) in animators"
      v-bind:key="animator.participantId"
      v-show="index == visibleIndex"
    >
      <div class="podcast-item-animator text-dark">{{ getAnimatorName(animator) }}</div>
    </router-link>
  </div>
</template>

<style lang="scss">

.podcast-item-animator {
  display: flex;
  align-items: flex-start;
  justify-content: center;

  font-size: 0.55rem;
  font-weight: 300;
  text-transform: capitalize;
  margin: 00.25rem 0.5rem 0;
}
</style>

<script>
export default {
  name: 'AnimatorsItem',

  props: ['animators'],

  data() {
    return {
      visibleIndex: 0,
    };
  },

  methods: {
    getAnimatorName(animator) {
      const first = animator.firstName || '';
      const last = animator.lastName || '';
      return (first + ' ' + last).trim();
    },
  },
};
</script>
