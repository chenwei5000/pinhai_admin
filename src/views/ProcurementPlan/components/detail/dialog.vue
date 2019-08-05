<template>

  <el-dialog :title="dialogTitle" v-if="dialogVisible" :visible.sync="dialogVisible" fullscreen>


    <el-collapse v-model="activeNames">
      <el-collapse-item title="1.基本信息" name="infoFrom">
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" :planId="planId"></infoFrom>
      </el-collapse-item>

      <el-collapse-item title="2.采购计划内容" name="itemTable" style="margin-top: 10px">
        <itemTable ref="itemTable" :planId="planId">
        </itemTable>
      </el-collapse-item>

    </el-collapse>

  </el-dialog>

</template>

<script>
  import itemDialog from './dialog'

  export default {
    components: {
      itemDialog
    },
    props: {
      planItem: {
        type: Object,
        default: null
      }

    },
    computed: {
      dialogTitle() {
        if (this.planItem == null || this.planItem.id == null) {
          return "添加采购计划明细";
        }
        else {
          return "添加采购计划明细";
        }
      }
    },

    data() {
      return {
        planId: null,
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
      openDialog(planId) {
        this.planId = planId;
        this.dialogVisible = true;
        this.activeNames = ['infoFrom', 'itemTable'];
      },

      modifyCBEvent(plan) {
        this.$emit("modifyCBEvent", plan);
      },
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

