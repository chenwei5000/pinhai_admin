<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="50%"
             top="20vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="detailItem" status-icon inline
               ref="detailItem" label-position="right"
               label-width="120px"
               v-loading="loading"
      >
        <el-row>
          <el-col :md="24">
            <el-form-item label="预计完成日期" prop="otdTime">
              <el-date-picker
                v-model="detailItem.otdTime"
                type="date"
                size="mini"
                placeholder="选择日期">
              </el-date-picker>

              <el-tooltip class="item" effect="light" content="采购单预计在该日期前完成" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

        </el-row>

      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" size="mini" :loading="confirmLoading">保 存</el-button>
      <el-button @click="closeDialog" size="mini" >取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import validRules from '@/components/validRules'
  import {currency, intArrToStrArr} from '@/utils'

  export default {
    components: {},
    props: {},
    filters: {
      currency: currency
    },
    computed: {
      orderQty() {
        return this.calOrderQty();
      },
      amount() {
        return this.calAmount();
      },
      dialogTitle() {
        return "确认采购单完成日期";

      },
      hasEdit() {
        return true;
      }
    },

    data() {
      return {
        //Dialog 是否开启
        dialogVisible: false,
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        //明细对象
        detailItem: {},

        // 字段验证规则 TODO:
        rules: {
          otdTime: [
            validRules.required
          ]
        },
      }
    }
    ,

    created() {
    }
    ,

    mounted() {
      this.$nextTick(() => {
      });
    }
    ,

    methods: {
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(detailItem) {
        this.detailItem = detailItem;
        this.detailItem.otdTime = detailItem.formatOtdTime;
        this.dialogVisible = true;
        this.initData();
      }
      ,

      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.confirmLoading = false;
        this.detailItemId = null;
        this.detailItem = null;
      }
      ,

      // 保存
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          const loading = this.$loading({
            lock: true,
            text: '保存中...',
            spinner: 'el-icon-loading',
            background: 'rgba(0, 0, 0, 0.7)'
          });

          let _order = {};
          _order.otdTime = this.detailItem.otdTime;

          this.global.axios.put(`/procurementOrders/confirmDate/${this.detailItem.id}`, _order)
            .then(resp => {
              let _newObject = resp.data;
              this.$message({type: 'success', message: '操作成功'});
              loading.close();
              this.$emit("modifyCBEvent", _newObject);
              this.closeDialog();
            })
            .catch(err => {
              loading.close();
            })
        });
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>

</style>
