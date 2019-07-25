<template>
  <div>

    <el-steps :active="stepsActive" finish-status="success" align-center simple>
      <el-step title="1.智能备货" icon="el-icon-reading"></el-step>
      <el-step title="2.采购计划" icon="el-icon-picture"></el-step>
      <el-step title="3.指派工作" icon="el-icon-upload"></el-step>
      <el-step title="4.提交审核" icon="el-icon-edit"></el-step>
    </el-steps>

    <smartPlan
      v-if="stepsActive==0"
      @smartPlanCBEvent="smartPlanCBEvent">
    </smartPlan>


  </div>


</template>

<script>
  import smartPlan from './smartPlan'

  export default {
    components: {
      smartPlan
    },

    props: {},

    computed: {},

    data() {
      return {
        //
        stepsActive: 0,

        // 新对象
        plan: {
          id: null
        }
      }
    },

    created() {
    },

    mounted() {
    },

    methods: {

      //智能备货成功之后回调
      smartPlanCBEvent(id, plan) {
        this.plan = plan;
        //this.stepsActive = 1;
        console.log(this.plan);
        console.log(this.stepsActive);
        this.$refs.itemTable.getList(true);
      }

    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

</style>

