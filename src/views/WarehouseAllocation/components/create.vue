<template>
  <div>
    <el-steps :active="stepsActive" finish-status="success" align-center simple>
      <el-step title="1.创建" icon="el-icon-s-opportunity"></el-step>
      <el-step title="2.添加附件" icon="el-icon-edit-outline"></el-step>
      <el-step title="3.指派工作" icon="el-icon-s-custom"></el-step>
      <el-step title="4.完成" icon="el-icon-s-check"></el-step>
    </el-steps>

    <step1
      v-if="stepsActive==0"
      @step1CBEvent="step1CBEvent" ref="step">
    </step1>

    <step2
      v-if="stepsActive==1" :primaryId="object.id"
      @step2CBEvent="step2CBEvent" ref="step">
    </step2>

    <step3
      v-if="stepsActive==2" :primaryId="object.id"
      @step3CBEvent="step3CBEvent" ref="step">
    </step3>

    <step4
      v-if="stepsActive==3" :primaryId="object.id"
      @step4CBEvent="step4CBEvent" ref="step">
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
      step1CBEvent(objectId) {
        if (objectId) {
          this.object.id = objectId;
          // 切换到第二步
          this.stepsActive = 1;
          this.$emit("createCBEvent", null);
        }
      },
      // 采购计划确认成功之后回调
      step2CBEvent(step) {
        // 切换步骤
        this.stepsActive = step;
      },
      step3CBEvent(step) {
        // 切换步骤
        this.stepsActive = step;
      },
      step4CBEvent(step) {
        // 切换步骤
        if(step == 4){
          this.$message.success("创建成功");
          this.$emit("createCBEvent", null);
          this.stepsActive = 0;
        }else{
         this.stepsActive = step;
        }
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

