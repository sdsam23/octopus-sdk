<template>
  <div>
    <div class="modal-content" v-bind:class="{ active: active }">

      <div class="modal-container">
        <div class="modal-header">
          <div class="modal-title h5">{{ title }}</div>
        </div>
        <div class="modal-body">
          <p class="form-item">
            Fil RSS :
            <span id="LINK">{{link}}</span>
            <input type="button" value="Copier" class="btn btn-primary" @click="onCopyLINK()" />
          </p>
        </div>
        <div class="modal-footer" v-if="validatetext">
          <button class="btn btn-primary" @click="onValid">
            {{ validatetext }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>

<script>
export default {
  name: 'ClipboardModal',

  props: ['title', 'active', 'closable', 'validatetext','link'],

  methods: {
    closePopup(event) {
      event.preventDefault();
      this.$emit('close');
    },

    onValid() {
      this.$emit('validate');
    },
    onCancel() {
      this.$emit('cancel');
    },
    onCopyLINK() {
      navigator.clipboard.writeText(this.link);
    }
  },
};
</script>
