<template>
  <div>
    <!-- 步骤条 TODO: -->
    <el-steps :active="stepsActive" finish-status="success" align-center simple>
      <el-step title="1.智能备货" icon="el-icon-reading"></el-step>
      <el-step title="2.采购计划" icon="el-icon-picture"></el-step>
      <el-step title="3.指派工作" icon="el-icon-upload"></el-step>
      <el-step title="4.提交审核" icon="el-icon-edit"></el-step>
    </el-steps>

    <!-- 智能备货组件 -->
    <smart
      v-if="stepsActive==0"
      @smartCBEvent="smartCBEvent" >
    </smart>

    <!-- 采购计划组件 -->

  </div>

</template>

<script>
  import smart from './smart/smart'

  export default {
    components: {
      smart
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
      smartCBEvent(objectId) {
        // 继续向父组件抛出时间，创建成功后刷新列表
        this.$emit("createCBEvent", objectId);

        if (objectId) {
          this.object.id = objectId;
          // 切换到第二步
          this.stepsActive = 1;
        }
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

