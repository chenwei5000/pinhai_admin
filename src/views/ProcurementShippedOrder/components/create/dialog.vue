<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible"
             :visible.sync="dialogVisible" class="ph-dialog" @close='closeDialog'
             fullscreen>
    <!-- 步骤条 TODO: -->
    <el-steps :active="stepsActive" finish-status="success" align-center simple>
      <el-step title="1.下单" icon="el-icon-shopping-cart-full"></el-step>
      <el-step title="2.附件" icon="el-icon-document"></el-step>
      <el-step title="3.指派工作" icon="el-icon-s-custom"></el-step>
      >
    </el-steps>

    <!-- 智能备货组件 -->
    <step1
      v-if="stepsActive==0 && primaryComplete"
      :primary="primary"
      @step1CBEvent="step1CBEvent">
    </step1>

    <!-- 采购计划组件 -->
    <step2
      v-if="stepsActive==1" :primaryId="orderId"
      @step2CBEvent="step2CBEvent">
    </step2>

    <!--指派组件-->
    <step3
      v-if="stepsActive==2" :primaryId="orderId"
      @step3CBEvent="step3CBEvent">
    </step3>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import step1 from './step1'
  import step2 from './step2'
  import step3 from './step3'

  export default {
    components: {
      step1,
      step2,
      step3
    },
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),

      title() {
        if (this.primary && this.primary.length > 0) {
          return '创建发货计划 [' + this.primary[0].formatDeliveryTime + this.primary[0].supplier.name + ']';
        }
        else {
          return '创建发货计划';
        }
      }
    },

    data() {
      return {
        orderId: null,
        primary: {}, //主对象
        // 默认选择的步骤 从0开始
        stepsActive: 0,
        primaryComplete: false,
        dialogVisible: false, //Dialog 是否开启
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },
    methods: {
      initData() {
      },
      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primary) {
        this.primary = primary;
        this.dialogVisible = true;
        this.primaryComplete = true;
        this.initData();
      },

      closeDialog() {
        this.primary = {};
        this.orderId = null,
          this.stepsActive = 0;
        this.dialogVisible = false;
        this.primaryComplete = false;
      },

      /* 子组件编辑完成后相应事件 */
      step1CBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("createCBEvent", object);
        this.$emit("modifyCBEvent");
        this.orderId = object.id;
        this.stepsActive = 1;
      },
      step2CBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.stepsActive = 2;
      },
      step3CBEvent(step) {
        // 切换步骤
        if (step == 'close') {
          this.closeDialog();
          this.$emit("modifyCBEvent");
        } else {
          this.stepsActive = step;
        }
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .title {
    font-size: 14px;
    font-weight: bold;
  }

</style>

