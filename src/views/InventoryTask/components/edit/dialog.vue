<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="90%"
             class="ph-dialog"
             top="20px"
             @close='closeDialog'
             :visible.sync="dialogVisible" fullscreen>

    <div class="ph-form">
      <!-- 步骤条 TODO: -->
      <el-steps :active="stepsActive" finish-status="success" align-center simple>
        <el-step title="1.当前库存情况" icon="el-icon-s-opportunity"></el-step>
        <el-step title="2.录入盘点数据" icon="el-icon-edit-outline"></el-step>
        <el-step title="3.完成盘点" icon="el-icon-edit-outline"></el-step>
      </el-steps>

      <step1
        style="margin-top: 10px"
        v-if="stepsActive==0"
        :primary="primary"
        @step1CBEvent="step1CBEvent">
      </step1>

      <step2
        style="margin-top: 10px"
        v-if="stepsActive==1"
        :primary="primary"
        @step2CBEvent="step2CBEvent">
      </step2>

      <step3
        style="margin-top: 10px"
        v-if="stepsActive==2"
        :primary="primary"
        @step2CBEvent="step2CBEvent">
      </step3>

    </div>

  </el-dialog>

</template>

<script>
  import step1 from './step1';
  import step2 from './step2';
  import step3 from './step3';

  export default {
    components: {
      step1,
      step2,
      step3
    },
    props: {},
    computed: {
      dialogTitle() {
        return '执行盘点任务  ---  [' + this.primary.warehouse.name + ' ' + this.primary.formatLimitTime + "]";
      }
    },

    data() {
      return {
        //Dialog 是否开启
        primaryId: null,  //主ID
        primary: {}, //主对象
        dialogVisible: false,
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
        if (this.primaryId) {
          //获取计划数据
          this.global.axios
            .get(`/inventoryTasks/${this.primaryId}?relations=${JSON.stringify(["warehouseStock","storageLocation","warehouse"])}`)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
              this.dialogVisible = true;
            })
            .catch(err => {
            });
        }
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.initData();
      },

      closeDialog() {
        this.primaryId = null;
        this.primary = {};
        this.dialogVisible = false;
        this.stepsActive = 0;
        this.$emit("modifyCBEvent", 0);
      },

      step1CBEvent(object) {
        this.stepsActive = 1;
      },
      step2CBEvent(step) {
        this.stepsActive = step;
        if (step == 3) {
          this.closeDialog();
          this.$emit("modifyCBEvent", 0);
        }
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

