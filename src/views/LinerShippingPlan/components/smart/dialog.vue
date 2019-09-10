<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="90%"
             class="ph-dialog"
             top="20px"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 步骤条 TODO: -->
      <el-steps :active="stepsActive" finish-status="success" align-center simple>
        <el-step title="1.配置参数" icon="el-icon-s-opportunity"></el-step>
        <el-step title="2.发柜推荐" icon="el-icon-edit-outline"></el-step>
        <el-step title="3.转发柜明细" icon="el-icon-edit-outline"></el-step>
      </el-steps>

      <!-- 智能备货组件 -->
      <step1
        style="margin-top: 10px"
        v-if="stepsActive==0"
        :primary="newObject"
        @step1CBEvent="step1CBEvent">
      </step1>

      <!-- 采购计划组件 -->
      <step2
        style="margin-top: 10px"
        v-if="stepsActive==1"
        :primary="newObject"
        @step2CBEvent="step2CBEvent">
      </step2>


    </div>

  </el-dialog>

</template>

<script>
  import step1 from './step1';
  import step2 from './step2'

  export default {
    components: {
      step1,
      step2
    },
    props: {},
    computed: {
      dialogTitle() {
        return "智能发柜";
      }
    },

    data() {
      return {
        //Dialog 是否开启
        dialogVisible: false,
        newObject: {},
        stepsActive: 0,
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(primary) {
        this.newObject = JSON.parse(JSON.stringify(primary));
        this.dialogVisible = true;
        this.initData();
      },
      closeDialog() {
        this.dialogVisible = false;
        this.newObject = {};
        this.stepsActive = 0;
      },

      step1CBEvent(object){
        this.newObject = JSON.parse(JSON.stringify(object));
        this.stepsActive = 1;
      },
      step2CBEvent(){

      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

