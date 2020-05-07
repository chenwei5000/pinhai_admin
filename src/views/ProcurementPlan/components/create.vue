<template>
  <div>
    <!-- 步骤条 TODO: -->
    <el-steps :active="stepsActive" finish-status="success" align-center simple>
      <el-step title="1.智能备货" icon="el-icon-s-opportunity"></el-step>
      <el-step title="2.采购计划" icon="el-icon-edit-outline"></el-step>
      <el-step title="3.指派工作" icon="el-icon-s-custom"></el-step>
      <el-step title="4.提交审核" icon="el-icon-s-check"></el-step>
    </el-steps>

    <!-- 智能备货组件 -->
    <step1
      v-if="stepsActive==0"
      @step1CBEvent="step1CBEvent">
    </step1>

    <!-- 采购计划组件 -->
    <step2
      v-if="stepsActive==1" :primaryId="object.id"
      @step2CBEvent="step2CBEvent">
    </step2>

    <!--指派组件-->
    <step3
      v-if="stepsActive==2" :primaryId="object.id"
      @step3CBEvent="step3CBEvent">
    </step3>

    <!--提交审核组件-->
    <step4
      v-if="stepsActive==3" :primaryId="object.id"
      @step4CBEvent="step4CBEvent">
    </step4>

  </div>

</template>

<script>
  import step1 from './smart/smart'
  import step2 from './create/step2'
  import step3 from './create/step3'
  import step4 from './create/step4'

  export default {
    components: {
      step1,
      step2,
      step3,
      step4
    },

    props: {},

    computed: {},

    data() {
      return {
        // 默认选择的步骤 从0开始
        stepsActive: 0,

        // 新对象
        object: {
          id: null
        }
      }
    },

    created() {
    },

    mounted() {
    },

    methods: {
      // 智能备货成功之后回调
      step1CBEvent(objectId) {
        // 继续向父组件抛出时间，创建成功后刷新列表
        this.$emit("createCBEvent", objectId);

        if (objectId) {
          this.object.id = objectId;
          // 切换到第二步
          this.stepsActive = 1;
        }
      },
      // 采购计划确认成功之后回调
      step2CBEvent(step) {
        // 切换步骤
        this.stepsActive = step;
        // 继续向父组件抛出时间，刷新列表
        this.$emit("createCBEvent", this.object.id);
      },
      step3CBEvent(step) {
        // 切换步骤
        this.stepsActive = step;
      },
      step4CBEvent(step) {
        // 切换步骤
        this.stepsActive = step;
      },
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

