<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog title="编辑采购计划" v-if="dialogVisible" :visible.sync="dialogVisible" fullscreen>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" :primaryId="primaryId"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 采购计划内容</div>
        <itemTable ref="itemTable" :primaryId="primaryId"></itemTable>
      </el-collapse-item>

    </el-collapse>

  </el-dialog>

</template>

<script>
  import infoFrom from './from'
  import itemTable from '../detail/table'

  export default {
    components: {
      infoFrom,
      itemTable
    },
    props: {},
    computed: {},

    data() {
      return {
        primaryId: null,  //主ID
        dialogVisible: false, //Dialog 是否开启
        activeNames: [],   //折叠面板开启项
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },
    methods: {

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.dialogVisible = true;
        // 默认展开所有折叠面板
        this.activeNames = ['infoFrom', 'itemTable'];
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .title {
    font-size: 14px;
    font-weight: bold;
  }

</style>

