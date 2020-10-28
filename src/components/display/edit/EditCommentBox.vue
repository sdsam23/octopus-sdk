<template>
  <div class="d-flex">
		<button class="btn btn-circle primary-color mr-1" aria-label="edit" @click="editComment">
			<span class="saooti-edit-bounty"></span>
		</button>
		<button class="btn btn-circle primary-color mr-1" aria-label="valid"
		v-if="comment.status === 'pending' || comment.status === 'invalid'" @click="validComment">
			<span class="saooti-valid-stud"></span>
		</button>
		<button class="btn btn-circle primary-color mr-1" aria-label="invalid"
		v-if="comment.status === 'pending' || comment.status === 'valid'" @click="invalidComment">
			<span class="saooti-cross"></span>
		</button>
		<button class="btn btn-circle primary-color mr-1" aria-label="delete" @click="deleteComment">
			<span class="saooti-bin"></span>
		</button>
  </div>
</template>

<style lang="scss">
@import '../../../sass/_variables.scss';
.comment-item-container{
  .btn-circle{
    width: 24px;
    height: 24px;
    background: $octopus-secondary-color;
    padding: 0;
  }
  .status-pending {
    background: #eb7d22;
  }
  .status-invalid {
    background: #d40303;
  }
  .status-valid {
    background: $octopus-primary-color;
  }

  .status-valid, .status-invalid, .status-pending {
    width: 14px;
    height: 14px;
    border-radius: 50%;
	}
}
</style>

<script>

export default {
	props:  ["comment"],

	methods:{
		editComment(){

		},
		validComment(){

		},
		invalidComment(){

		},
		deleteComment(){

		}
	}
};
</script>
