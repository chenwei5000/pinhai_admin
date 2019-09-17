<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title" v-if="dialogVisible" :visible.sync="dialogVisible" class="ph-dialog" @close='closeDialog'
             fullscreen>

    <!-- 折叠面板 -->
    <el-collapse v-model="activeNames">

      <el-collapse-item name="infoFrom">
        <div slot="title" class="title">1. 基本信息</div>
        <infoFrom ref="infoFrom" @modifyCBEvent="modifyCBEvent" v-if="primaryComplete" :primary="primary"></infoFrom>
      </el-collapse-item>

      <el-collapse-item name="itemTable" style="margin-top: 10px">
        <div slot="title" class="title">2. 付款项</div>
        <itemTable ref="itemTable" :primary="primary" v-if="primaryComplete"></itemTable>
      </el-collapse-item>

      <el-collapse-item name="billTable" style="margin-top: 10px">
        <div slot="title" class="title">3. 发票</div>
        <billTable ref="billTable" :primary="primary" v-if="primaryComplete"></billTable>
      </el-collapse-item>

      <el-collapse-item name="attachment" style="margin-top: 10px">
        <div slot="title" class="title">4. 附件</div>
        <attachment ref="attachment" :primary="primary" v-if="primaryComplete"></attachment>
      </el-collapse-item>

    </el-collapse>

    <el-row type="flex" justify="center">
      <el-button type="primary" style="margin-top: 15px" :loading="confirmLoading" @click="onPayment">
        申请付款
      </el-button>
    </el-row>
  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import infoFrom from './form'
  import itemTable from './itemTable'
  import billTable from './billTable'
  import attachment from './attachment'

  export default {
    components: {
      infoFrom,
      itemTable,
      billTable,
      attachment
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
      title() {
        return `申请付款 [${this.primary.code}]`;
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
          let relations = ["supplier", "currency", "procurementOrder"];
          //获取计划数据
          this.global.axios
            .get(`/settlementBills/${this.primaryId}?relations=${JSON.stringify(relations)}`)
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
        this.activeNames = ['infoFrom', 'itemTable', 'billTable', 'attachment'];
      },
      closeDialog() {
        this.primary = {};
        this.primaryId = null;
        this.logs = [];
        this.dialogVisible = false;
        this.primaryComplete = false;
      },

      onPayment() {
        this.$refs.infoFrom.$refs.editObject.validate(valid => {
          if (!valid) {
            return false
          }
          let editObject = this.$refs.infoFrom.editObject;
          let items = JSON.parse(JSON.stringify(this.$refs.itemTable.data));
          let bills = JSON.parse(JSON.stringify(this.$refs.billTable.data));
          console.log(items);
          if (!items || items.length == 0) {
            this.$message.error("请设置付款项目");
            return false;
          }
          if (!bills || bills.length == 0) {
            this.$message.error("请设置发票信息");
            return false;
          }
          console.log(bills);

          // this.loading = true;
          // this.confirmLoading = true;
          // this.$emit("modifyCBEvent", this.detailItem);
          // this.confirmLoading = false;
          // this.dialogVisible = false;
          // this.closeDialog();

        })


      },

      /* 子组件编辑完成后相应事件 */
      modifyCBEvent(object) {
        // 继续向父组件抛出事件 修改成功刷新列表
        this.$emit("modifyCBEvent", object);
      },
      /* 重新加载 */
      reloadCBEvent() {
        this.initData();
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .title {
    font-size: 14px;
    font-weight: bold;
  }

</style>

