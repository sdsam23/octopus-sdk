 <template>
    <b-card no-body class="mr-3 ml-3 rss-parameters">
      <b-card-header header-tag="header" role="tab">
        <b-button block v-b-toggle.rssParameters variant="info">{{$t('Rss feed parameters')}}</b-button>
      </b-card-header>
      <b-collapse id="rssParameters" role="tabpanel">
        <b-card-body>
          <b-card-text class="d-flex justify-content-center" v-if="loading">
            <div class="spinner-border mr-3"></div>
            <h3 class="mt-2">{{ $t('Loading content ...') }}</h3>
          </b-card-text>
          <b-card-text>
            <div v-if="0 === listOrganisationRules.length && 0 === listEmissionRules.length">{{$t('You apply no rules')}}</div>
            <div v-else-if="0 === listEmissionRules.length">{{$t('You apply default organisation rules')}}</div>
            <div v-else>{{$t('You apply particuliar emission rules')}}</div>
            <RuleEdit :isDisabled="true" :organisationId="emission.orga.id"/>
          </b-card-text>
        </b-card-body>
      </b-collapse>
    </b-card>
</template>
<style lang="scss">
.rss-parameters.card{
	border: 0;
	.btn {
		border-radius: 0;
	}
  .card-header {
    border: 0;
    background-color: #fafafa;
    padding :0;
  }
  .card-body {
    border: 0.05rem solid #eee;
    background-color: #fafafa;
  }
}

</style>
<script>
import aggregatorsApi from '@/api/aggregators';
import RuleEdit from "@/components/display/aggregator/RuleEdit.vue";
export default {
  props:["emission"],

  component:{
    RuleEdit,
  },
  mounted(){
    this.fetchRules();
  },

  data() {
    return {
      listOrganisationRules: [],
      listEmissionRules: [],
      loading: true,
      showOrganisation : false,
    };
  },
  computed:{
  },
  methods:{
    async fetchRules(){
      this.listEmissionRules = await aggregatorsApi.fetchRulesList(this.$store, undefined, this.emission.emissionId); 
      this.listOrganisationRules = await aggregatorsApi.fetchRulesList(this.$store, this.emission.orga.id); 
      this.loading = false;
    }
  },
  watch:{
  }

};
</script>
