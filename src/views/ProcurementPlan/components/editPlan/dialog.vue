<template>

  <el-dialog title="编辑采购计划" v-if="dialogVisible" :visible.sync="dialogVisible" fullscreen>

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
  import itemTable from '../planItem/table'

  export default {
    components: {
      infoFrom,
      itemTable
    },
    props: {},
    computed: {},

    data() {
      return {
        primaryId: null,
        dialogVisible: false,
        activeNames: [],
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
      });
    },
    methods: {
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.dialogVisible = true;
        this.activeNames = ['infoFrom', 'itemTable'];
      },

      modifyCBEvent(obj) {
        this.$emit("modifyCBEvent", obj);
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

