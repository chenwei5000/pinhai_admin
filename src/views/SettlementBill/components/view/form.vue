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
          <el-form-item label="购买方">
            <span style="font-size: 12px" v-if="this.editObject.company">{{this.editObject.company.abbreviation}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="供货商">
            <span style="font-size: 12px">{{this.editObject.supplier.name}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="业务编码">
            <span style="font-size: 12px">{{this.editObject.warehouseOrderCode}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="负责人">
            <span style="font-size: 12px">{{this.editObject.leader.name}}</span>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>

        <el-col :md="6">
          <el-form-item label="最晚付款日期">
            <b style="font-size:12px;color: blue;">
              {{this.editObject.latestPaymentTime | parseTime('{y}年{m}月{d}日')}}
            </b>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="结算日期">
            <span style="font-size: 12px">{{this.editObject.billingDate | parseTime('{y}年{m}月{d}日') }}</span>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="帐期">
            <span style="font-size: 12px">{{this.editObject.accountPeriod}}天</span>
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
          <el-form-item label="结算总额">
            <b style="font-size: 12px;color:blue;">{{this.editObject.settlementAmount,
              this.editObject.currency.symbolLeft | currency }}</b>
          </el-form-item>
        </el-col>


        <el-col :md="6">
          <el-form-item label="申请付款金额" v-if="!hasInpayment">
            <b style="font-size: 12px;color:blue;">
              {{this.editObject.payableAmount, this.editObject.currency.symbolLeft | currency }}
            </b>
          </el-form-item>
        </el-col>


        <el-col :md="6">
          <el-form-item label="已付金额" v-if="!hasInpayment">
            <b style="font-size: 12px;color:blue;">
              {{this.editObject.paymentAmount, this.editObject.currency.symbolLeft | currency }}
            </b>
          </el-form-item>
        </el-col>

        <el-col :md="6">
          <el-form-item label="未付金额" v-if="!hasInpayment">
            <b style="font-size: 12px;color:blue;">
              {{this.editObject.unpaidAmount, this.editObject.currency.symbolLeft | currency }}
            </b>
          </el-form-item>
        </el-col>

      </el-row>

      <el-row>
        <el-col :md="6">
          <el-form-item label="已付定金" v-if="!hasInpayment">
            <span style="font-size: 12px">{{this.editObject.advanceAmount, this.editObject.currency.symbolLeft | currency }}</span>
          </el-form-item>
        </el-col>


        <el-col :md="6">
          <el-form-item label="已开票金额" v-if="!hasInpayment">
            <span style="font-size: 12px">{{this.editObject.invoicedAmount, this.editObject.currency.symbolLeft | currency }}</span>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :md="24">
          <el-form-item label="备注" prop="note">
            <div style="font-size: 12px;white-space: pre-line;">{{editObject.note}}</div>
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
      hasInpayment() {
        if (this.editObject.status == 0) {
          return true;
        }
        else {
          return false;
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

