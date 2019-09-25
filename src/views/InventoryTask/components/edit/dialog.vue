<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible"
             :visible.sync="dialogVisible" style="padding-bottom: 40px"
             class="ph-dialog" @close='closeDialog' fullscreen>

    <el-row
      style="text-align:right; position:fixed; left:0; bottom: 0px; background-color:#FFF; padding: 5px 30px; z-index: 9999; width: 100%;">
      <el-button type="success" icon="el-icon-s-claim" @click="onComplete">盘点完成</el-button>
    </el-row>

    <itemTable ref="itemTable" :primary="primary"></itemTable>
    <h4>附件</h4>
    <attachment ref="attachment" :primary="primary"></attachment>
  </el-dialog>

</template>
<script>

  import itemTable from './detailTable'
  import attachment from './attachment'
  export default {

    components: {
      itemTable,
      attachment,
    },
    props: {},
    computed: {
      title() {
        return '编辑盘点任务  ---  [' + this.primary.warehouse.name + ' ' + this.primary.formatLimitTime + "]";
      }
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象
        dialogVisible: false, //Dialog 是否开启
        activeNames: [], //折叠面板开启项
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

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.initData();
        this.activeNames = ['infoFrom', 'itemTable'];
      },
      closeDialog() {
        this.primaryId = null;
        this.primary = {};
        this.activeNames = [];
        this.dialogVisible = false;
      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
        this.closeDialog();
      },

      //盘点完成
      onComplete() {
        // 明细对象
       this.global.axios.put(`/inventoryTasks/receivedTask/${this.primary.id}`).then(resp => {
         this.$message({
           type: success,
           message: "盘点成功"
         }).catch(err => {

         })
       })

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

