<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" fullscreen>

    <el-row style="margin-bottom: 20px;">


      <el-button type="success" icon="el-icon-s-flag" v-if="primary.status === 4" @click="onConfirm">一键确认</el-button>
      <el-button type="success" icon="el-icon-s-claim" v-if="primary.status === 4" @click="onComplete">收货完成</el-button>
      <el-button type="success" icon="el-icon-printer" v-if="primary.status === 4" @click="onPrint" :disabled="true">打印收货单</el-button>


    </el-row>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 确认收货</div>
        <itemTable ref="itemTable" :primary="primary"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">3. 附件</div>
        <attachment ref="attachment" :primary="primary"></attachment>
      </el-collapse-item>

    </el-collapse>



  </el-dialog>

</template>

<script>
  import infoFrom from './form'
  import itemTable from '../detail/table'
  import attachment from './attachment'
  import person from './person'

  export default {
    components: {
      infoFrom,
      itemTable,
      attachment,
      person
    },
    props: {},
    computed: {
      title() {
        return '采购入库  ---  [' + this.primary.code + '] --- (' + this.primary.statusName + "状态)";
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
            .get(`/procurementReceivedOrders/${this.primaryId}`)
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

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
      },


      //确认收货
      onConfirm(){
        this.global.axios.put(`/procurementReceivedOrders/confirmTask/${this.primaryId}`)
          .then(resp => {
            this.$message.info("确认收货成功,请");
            this.loading = false;
            this.confirmLoading = false;
            this.dialogVisible = true;
            this.formVisible = false;
            this.$refs.itemTable.getList();
            this.$emit("modifyCBEvent", resp.data);

          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })
      },

      //收货完成
      onComplete(){
        this.global.axios.put(`/procurementReceivedOrders/receivedTask/${this.primaryId}`)
          .then(resp => {
            this.$message.info("收货完成");
            this.loading = false;
            this.confirmLoading = false;
            this.dialogVisible = false;
            this.$emit("modifyCBEvent", resp.data);

          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
          })
      },

      //打印收货单
      onPrint(){
        this.global.axios.get(`/attachments/procurementShippedOrders/${this.primaryId}`)
          .then(resp => {
            this.$message.info("打印收货单");
            this.loading = false;
            this.confirmLoading = false;
            this.dialogVisible = false;
            this.$emit("modifyCBEvent",  resp.data);

          })
          .catch(err => {
            this.loading = false;
            this.confirmLoading = false;
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

