<template>

  <el-dialog :title="dialogTitle"
             append-to-body
             v-if="dialogVisible"
             width="80%"
             top="20vh"
             @close='closeDialog'
             :visible.sync="dialogVisible">

    <div class="ph-form">
      <!-- 编辑表单 TODO:-->
      <el-form :rules="rules" :model="detailItem" status-icon inline
               ref="detailItem" label-position="right"
               label-width="120px"
               v-loading="loading"
               inline-message
      >
        <el-row>
          <el-col :md="10">
            <el-form-item label="付款项目" prop="remarks">

              <el-input v-model.trim="detailItem.remarks"
                        maxlength="50"
                        show-word-limit
                        size="mini"
                        style="width: 200px" placeholder="请填写付款项目" clearable></el-input>


              <el-tooltip class="item" effect="light" content="付款项说明，最好与发票中的付款项目一致。" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>

          <el-col :md="14">
            <el-form-item label="数量" prop="number">

              <el-input v-model.trim="detailItem.number"
                        maxlength="50"
                        show-word-limit
                        size="mini"
                        @change="onQtyChange"
                        style="width: 200px" placeholder="数量" clearable></el-input>

              <el-tooltip class="item" effect="light" content="数量" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :md="10">

            <el-form-item label="单价" prop="price">

              <el-input v-model.trim="detailItem.price"
                        maxlength="50"
                        show-word-limit
                        size="mini"
                        @change="onQtyChange"
                        style="width: 200px" placeholder="单价" clearable></el-input>

              <el-tooltip class="item" effect="light" content="单价" placement="right">
                <i class="el-icon-question">&nbsp;</i>
              </el-tooltip>
            </el-form-item>

          </el-col>

          <el-col :md="14">
            <el-form-item label="总额" prop="amount">
              <span style="font-size: 12px" v-if="detailItem.amount">
                {{detailItem.amount, this.currency.symbolLeft | currency}}
              &nbsp; 大写: {{this.currency.name}} {{detailItem.amount | money}}
              </span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSave" size="mini" :loading="confirmLoading">保 存</el-button>
      <el-button @click="closeDialog" size="mini">取 消</el-button>
    </div>

  </el-dialog>

</template>

<script>
  import validRules from '@/components/validRules'
  import {currency, money} from '@/utils'

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: null
      }
    },
    computed: {
      dialogTitle() {
        if (this.detailItem.remarks) {
          return "修改付款项目";
        }
        else {
          return "添加付款项目";
        }
      },
      hasEdit() {
        return true;
      }
    },
    filters: {
      currency: currency,
      money: money
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
        // 货币
        currency: {
          symbolLeft: "￥",
          id: 1
        },

        // 字段验证规则 TODO:
        rules: {
          remarks: [
            validRules.required
          ],
          number: [
            validRules.required,
            validRules.integer
          ],
          price: [
            validRules.required,
            validRules.number
          ],
          amount: [
            validRules.required,
            validRules.number
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
      /********************* 基础方法  *****************************/
      //初始化加载数据 TODO:根据实际情况调整
      initData() {
      },

      /* 开启弹出编辑框 需要传明细ID */
      openDialog(row, currency) {
        if (row) {
          this.detailItem = JSON.parse(JSON.stringify(row));
        }
        if (currency && currency.id) {
          this.currency = currency;
        }
        this.dialogVisible = true;
        this.initData();
      },

      closeDialog() {
        this.dialogVisible = false;
        this.loading = false;
        this.confirmLoading = false;
        this.detailItem = {};
      },

      onQtyChange(val) {
        if (this.detailItem) {
          // 总额 = 数量 * 单价
          let number = this.detailItem.number || 0;
          let price = this.detailItem.price || 0;

          this.detailItem.amount = number * price;
          this.$forceUpdate();
        }
      },

      // 保存
      onSave() {
        this.$refs.detailItem.validate(valid => {
          if (!valid) {
            return false
          }
          this.loading = true;
          this.confirmLoading = true;
          this.$emit("modifyCBEvent", this.detailItem);
          this.confirmLoading = false;
          this.dialogVisible = false;
          this.closeDialog();
        })
      }
    }
  }
</script>

<style type="text/less" lang="scss" scoped>


</style>

