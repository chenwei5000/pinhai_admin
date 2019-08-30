<template>
  <div>
    <!-- 步骤条 TODO: -->
    <el-steps :active="stepsActive" finish-status="success" align-center simple>
      <el-step title="1.创建盘点明细" icon="el-icon-s-opportunity"></el-step>
      <el-step title="2.生成盘点任务" icon="el-icon-s-custom"></el-step>
    </el-steps>

    <!-- 创建盘点明细组件 -->
    <step1
      v-if="stepsActive===1"
      @step1CBEvent="step1CBEvent">
    </step1>

    <!--生成盘点任务组件-->
    <step2
      v-if="stepsActive===2" :primaryId="object.id"
      @step2CBEvent="step2CBEvent">
    </step2>

  </div>

</template>

<script>
  import step1 from './create/step1'
  import step2 from './create/step2'

  export default {
    components: {
      step1,
      step2,
    },

    props: {},

    computed: {},

    data() {
      return {
        // 默认选择的步骤 从0开始
        stepsActive: 1,

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
      // 创建盘点明细成功之后回调
      step1CBEvent(objectId) {

        this.$emit("createCBEvent", objectId);
        if (objectId) {
          this.object.id = objectId;
          // 切换到第二步
          this.stepsActive = 2;
        }
        // 继续向父组件抛出时间，创建成功后刷新列表
      },
      // 生成盘点任务之后回调
      step2CBEvent(step) {
        // 切换步骤
        console.log("Jiusshi不更新")
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

