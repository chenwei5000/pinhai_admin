<template>

  <el-dialog :title="dialogTitle"
             class="ph-dialog"
             append-to-body
             v-if="dialogVisible"
             width="90%"
             top="5vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">1. 付款项</div>
        <itemTable ref="itemTable" :primary="primary" v-if="primaryComplete"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="logs" style="margin-top: 10px">
        <div slot="title" class="title">2. 付款记录</div>
        <logs ref="logs" :primary="primary" v-if="primaryComplete"></logs>
      </el-collapse-item>


      <el-collapse-item name="billTable" style="margin-top: 10px">
        <div slot="title" class="title">3. 发票信息</div>
        <billTable ref="billTable" :primary="primary" v-if="primaryComplete"></billTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">4. 发票文件</div>
        <attachment ref="attachment" :primary="primary"
                    v-if="primaryComplete"></attachment>
      </el-collapse-item>

    </el-collapse>

    <div slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">关 闭</el-button>
    </div>
  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import itemTable from './paymentItemTable'
  import billTable from './paymentBillTable'
  import attachment from './paymentAttachment'
  import logs from '../../../FinanceBill/components/paymentBill/view/paymentLogs'

  export default {
    components: {
      itemTable,
      billTable,
      attachment,
      logs
    },
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),

      hasExecute() {
        if ([2, 3, 4, 5, 6, 7].indexOf(this.primary.status) > -1) {
          return true;
        }
        else {
          return false;
        }
      },
      hasAdmin() {
        return true;
      },
      dialogTitle() {
        return `付款单明细[${this.primary.code}]`;
      }
    },

    data() {
      return {
        primaryId: null,  //主ID
        primary: {}, //主对象

        primaryComplete: false,
        dialogVisible: false, //Dialog 是否开启
        confirmLoading: false,
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
      initData() {
        if (this.primaryId) {
          let relations = ["currency"];
          //获取计划数据
          this.global.axios
            .get(`/procurementPaymentOrders/${this.primaryId}?relations=${JSON.stringify(relations)}`)
            .then(resp => {
              let res = resp.data;
              this.primary = res || {};
              this.dialogVisible = true;
              this.primaryComplete = true;
            })
            .catch(err => {
            });
        }
        else {
          this.$message.error("无效的结算单");
        }
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primaryId) {
        this.primaryId = primaryId;
        this.initData();
        // 默认展开所有折叠面板
        //this.activeNames = ['infoFrom', 'itemTable', 'billTable', 'attachment'];
        this.activeNames = ['infoFrom', 'itemTable', 'logs'];
      },
      closeDialog() {
        this.primary = {};
        this.primaryId = null;
        this.logs = [];
        this.dialogVisible = false;
        this.primaryComplete = false;
      },

      /* 重新加载 */
      reloadCBEvent() {
        this.initData();
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

