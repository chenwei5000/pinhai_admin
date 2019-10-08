<template>

  <div class="ph-form">
    <!-- 编辑表单 TODO:-->
    <el-form :rules="rules" :model="editObject" status-icon inline
             ref="editObject"
             label-position="right"
             label-width="120px"
             v-loading="loading"
             v-if="initComplete"
             inline-message
    >

      <el-row>
        <el-col :md="6">
          <el-form-item label="供货商">
            <span style="font-size: 12px">{{this.editObject.supplier.name}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="采购单编码">
            <span style="font-size: 12px">{{this.editObject.settlementBill.procurementOrder.code}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="采购单">
            <span style="font-size: 12px">{{this.editObject.settlementBill.procurementOrder.name}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="收货单编码">
            <span style="font-size: 12px">{{this.editObject.settlementBill.warehouseOrderCode}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :md="6">
          <el-form-item label="结算日期">
            <span style="font-size: 12px">{{this.editObject.settlementBill.billingDate | parseTime('{y}-{m}-{d}') }}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="最晚付款日期">
            <span style="font-size: 12px">{{this.editObject.settlementBill.latestPaymentTime | parseTime('{y}-{m}-{d}')}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="帐期">
            <span style="font-size: 12px">{{this.editObject.settlementBill.accountPeriod}}天</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="结算货币">
            <span style="font-size: 12px">{{this.editObject.currency.name}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-col :md="6">
          <el-form-item label="申请金额">
            <b style="font-size: 12px;color:blue;">{{this.editObject.payableAmount, this.editObject.currency.symbolLeft | currency }}</b>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="结算总额">
            <b style="font-size: 12px;">{{this.editObject.settlementBill.settlementAmount, this.editObject.currency.symbolLeft | currency }}</b>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="采购单预付款金额">
            <span style="font-size: 12px">{{this.editObject.advanceAmount, this.editObject.currency.symbolLeft | currency }}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="已开票金额">
            <span style="font-size: 12px">{{this.editObject.invoicedAmount, this.editObject.currency.symbolLeft | currency }}</span>
          </el-form-item>
        </el-col>
      </el-row>

    </el-form>
  </div>

</template>

<script>

  import {currency, intArrToStrArr, parseTime} from '@/utils'

  export default {
    components: {},
    props: {
      primary: {
        type: [Object],
        default: {}
      }
    },
    computed: {
      hasEdit() {
        // 控制按钮
        if ([0, 8].indexOf(this.primary.status) > -1) {
          return false;
        }
        else {
          return true;
        }
      },
      hasCategory() {
        if (this.editObject.categoryId == null || this.editObject.categoryId.length == 0) {
          return true;
        }
        else {
          return false;
        }
      }
    },
    filters: {
      currency: currency
    },


    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        initComplete: false,

        // 编辑对象 TODO
        editObject: {},

        // 字段验证规则 TODO:
        rules: {},
      }
    },

    created() {
    },

    mounted() {
      this.$nextTick(() => {
        this.initData();
      });
    },
    methods: {
      /********************* 基础方法  *****************************/
      /**
       * 初始化数据
       */
      initData() {
        this.loading = true;
        if (this.primary) {
          //获取计划数据
          this.editObject = JSON.parse(JSON.stringify(this.primary));
          this.loading = false;
          this.initComplete = true;
        }
        else {
          this.$message.error("无效的采购计划!");
          this.loading = false;
        }
      },

      /********************* 操作按钮相关方法  ***************************/

    }
  }
</script>

<style type="text/less" lang="scss" scoped>

  .panel-heading {
    color: #444;
    border: 1px #cfd9db solid;
  }

  .panel-title {
    display: table-cell;
    vertical-align: middle;
    padding: 0 10px;
  }

  .el-form-item {
    //margin-bottom: 7px;
  }

</style>

