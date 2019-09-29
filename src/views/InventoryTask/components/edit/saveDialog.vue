<template>

  <!-- 修改弹窗 TODO: title -->
  <el-dialog :title="title"
             class="ph-dialog"
             append-to-body
             v-if="dialogVisible"
             width="60%"
             top="20vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-table">

      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="primary" status-icon
               ref="detailItem" label-position="right"
               label-width="120px"
               inline-message
               v-if="initComplete"
               @submit.native.prevent
               v-loading="loading"
      >
        <el-form-item label="本次盘点">
          <span style="font-size: 12px">{{primary.allQty}}件</span>
        </el-form-item>
        <el-form-item label="截止日期" prop="limitTime">
          <el-date-picker
            v-model="primary.limitTime"
            format="yyyy-MM-dd"
            type="date"
            placeholder="截止日期"></el-date-picker>
        </el-form-item>

      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" :loading="confirmLoading">确认</el-button>
      <el-button @click="closeDialog">关 闭</el-button>
    </div>

  </el-dialog>

</template>

<script>

  import {mapGetters} from 'vuex'
  import {parseTime} from '@/utils'

  export default {
    components: {},
    props: {},
    computed: {
      ...mapGetters([
        'device',
        'rolePower'
      ]),
      title() {
        return '盘点确认';
      }
    },

    data() {
      return {
        primary: {}, //主对象
        details: {}, //明细对象
        dialogVisible: false, //Dialog 是否开启
        loading: false,
        initComplete: false,
        confirmLoading: false,
        rules: {
          receivedTime: [
          ],
        },
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
      },

      /* 开启弹出编辑框 需要传主键ID */
      openDialog(primary, details) {
        this.initComplete = false;
        this.primary = primary;
        this.primary.limitTime = new Date();
        this.details = details;
        this.primary.allQty = 0;
        this.details.forEach(r=>{
          this.primary.allQty += r.checkedStock;
        });

        this.initData();
        this.dialogVisible = true;
        this.initComplete = true;
      },
      closeDialog() {
        this.primary = {};
        this.details = {};
        this.dialogVisible = false;
      },

      /* 子组件编辑完成后相应事件 */
      onPaymentCBEvent(object) {
        this.$emit("paymentCBEvent", object);
      },

      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }


          const loading = this.$loading({
            lock: true,
            text: '处理中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          this.global.axios.put(`/inventoryTasks/receivedTask/${this.primary.id}`)
            .then(resp => {
              this.$message.info("盘点完成");
              loading.close();
              this.$emit("modifyCBEvent", resp.data);
              this.closeDialog();

            })
            .catch(err => {
              loading.close();
            })
        });
      },
      updateInput(val) {
        this.$forceUpdate();
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>
  .title {
    font-size: 14px;
    font-weight: bold;
  }

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

