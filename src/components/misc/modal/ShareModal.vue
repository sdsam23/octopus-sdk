<template>
  <div name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title h5">{{ $t('Share') }}</h5>
              <button type="button" class="close" data-dismiss="modal" aria-label="Close"  @click="closePopup">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <b-tabs content-class="p-2 share-modal-border">
                <b-tab :title="$t('Embed link')" class="tab-pane" active>
                  <p>{{embedLink}}</p>
                  <div class='saooti-copy' @click="onCopyCode(embedLink)"></div>
                </b-tab>
                <b-tab :title="$t('Embedly link')" class="tab-pane">
                  <p>{{embedlyLink}}</p>
                  <div class='saooti-copy' @click="onCopyCode(embedlyLink)"></div>
                </b-tab>
                <b-tab :title="$t('Direct link')" class="tab-pane" v-if="directLink">
                  <p>{{directLink.audioUrl}}</p>
                  <div class='saooti-copy' @click="onCopyCode(directLink.audioUrl)"></div>
                </b-tab>
              </b-tabs>
            </div>
            <div class="modal-footer">
              <button class="btn btn-primary m-1" @click="closePopup">
                {{ $t('Close') }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Snackbar ref="snackbar" position="bottom-left"></Snackbar>
  </div>
</template>

<style lang="scss">
.share-modal-border{
  border-right: solid 1px rgb(222, 226, 230);
  border-left: solid 1px rgb(222, 226, 230);
  border-bottom: solid 1px rgb(222, 226, 230);
  background-color: #f8fafc;
  p{
    margin-top : 0.5rem;
    margin-bottom: 0.5rem;
    overflow-wrap: break-word;
    word-wrap: break-word;
    -ms-word-break: break-all;
    word-break: break-all;
    word-break: break-word;
    -ms-hyphens: auto;
    -moz-hyphens: auto;
    -webkit-hyphens: auto;
    hyphens: auto;
    margin-right: 0.5rem;
  }
}
.nav-tabs{
  .nav-item{
    border-right: solid 1px rgb(222, 226, 230);
    border-left: solid 1px rgb(222, 226, 230);
    border-top: solid 1px rgb(222, 226, 230);
    border-top-left-radius: 0.25rem;
    border-top-right-radius: 0.25rem;
  }
}
.tab-content{
  .tab-pane.active{
    display: flex;
    justify-content: space-between;
  }
  .saooti-copy{
    cursor: pointer;
    align-self: center;
  }
}
</style>
<script>
import Snackbar from '../../misc/Snackbar.vue';
export default {
  name: 'MessageModal',

  props: ['embedLink', 'embedlyLink', 'directLink'],

  components:{
    Snackbar, 
  },

  methods: {
    closePopup(event) {
      event.preventDefault();
      this.$emit('close');
    },
    async onCopyCode(link) {
      if (typeof(navigator.clipboard)=='undefined') {
        let textArea = document.createElement("textarea");
        textArea.value = link;
        textArea.style.position="fixed";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        var successful = document.execCommand('copy');
        if(successful){
          this.$refs.snackbar.open(this.$t('Link in clipboard'));
        }
        document.body.removeChild(textArea)            
      } else{
        await navigator.clipboard.writeText(link);
        this.$refs.snackbar.open(this.$t('Link in clipboard'));
      }
    },
  },
};
</script>
