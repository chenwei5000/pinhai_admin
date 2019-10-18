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

      <el-row v-if="editObject.status == 2">
        <el-col :md="12">
          <el-form-item label="本次实付金额" prop="paymentAmount">

              <span style="font-size: 12px;color:blue;" v-if="editObject.paymentAmount">
                {{editObject.paymentAmount, editObject.currency.symbolLeft | currency}}
              </span>

          </el-form-item>
        </el-col>

        <el-col :md="12">
          <el-form-item label="金额大写">
              <span style="font-size: 12px" v-if="editObject.paymentAmount">
                  {{this.editObject.currency.name}} {{editObject.paymentAmount | money}}
              </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="editObject.status == 2">
        <el-col :md="24">
          <el-form-item label="付款说明">
            <span style="font-size: 12px">{{editObject.note}}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row v-if="editObject.status == 0">
        <el-col :md="24">
          <el-form-item label="拒绝付款">
            <span style="font-size: 12px;color:red;">拒绝付款</span>
          </el-form-item>
        </el-col>
        <el-col :md="24">
          <el-form-item label="拒绝原因">
            <span style="font-size: 12px">{{editObject.note}}</span>
          </el-form-item>
        </el-col>
      </el-row>


    </el-form>
  </div>

</template>

<script>

  import {currency, intArrToStrArr, money, parseTime} from '@/utils'
  import validRules from '@/components/validRules'
  import moment from 'moment'

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
      currency: currency,
      money: money
    },


    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        initComplete: false,

        collectionAccountSelectOptions: [],
        paymentAccountSelectOptions: [],

        // 编辑对象 TODO
        editObject: {},

        // 字段验证规则 TODO:
        rules: {
          collectionAccountId: [
            validRules.required,
          ],
          paymentAccountId: [
            validRules.required,
          ],
          paymentAmount: [
            validRules.required,
            validRules.number
          ],
          paymentAmountTime: [
            validRules.required,
          ],
        },
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
          if (!this.editObject.paymentAmountTime) {
            this.editObject.paymentAmountTime = new Date();
          }
          else {
            this.editObject.paymentAmountTime = moment(this.editObject.paymentAmountTime).format("YYYY-MM-DD")
          }

          this.loadCollectionAccounts();
          this.loadPaymentAccounts();
          this.initComplete = true;
          this.loading = false;
        }
        else {
          this.$message.error("无效的物流付款单!");
          this.loading = false;
        }
      },

      // 载入收款帐号
      loadCollectionAccounts() {
        let filters = [
          {
            field: "companyManagementId",
            op: 'eq',
            data: this.editObject.companyManagementId ? this.editObject.companyManagementId : -1
          }
        ];
        let relations = ["bankAccount", "companyManagement", "bankAccount.currency"];
        let url = `/collectionAccounts?filters=${JSON.stringify({
          "groupOp": "AND",
          "rules": filters
        })}&relations=${JSON.stringify(relations)}`
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data
            let data = res || []
            this.collectionAccountSelectOptions = data;
            this.loading = false;
            this.initComplete = true;
          })
          .catch(err => {
            this.loading = false
            this.initComplete = true;
          })
      },


      // 载入付款帐号
      loadPaymentAccounts() {
        let filters = [
          {
            field: "companyManagement_type",
            op: 'eq',
            data: '1'
          }
        ];
        let relations = ["bankAccount", "companyManagement", "bankAccount.currency"];
        let url = `/paymentAccounts?filters=${JSON.stringify({
          "groupOp": "AND",
          "rules": filters
        })}&relations=${JSON.stringify(relations)}`
        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data
            let data = res || []
            this.paymentAccountSelectOptions = data;
            this.loading = false;
            this.initComplete = true;
          })
          .catch(err => {
            this.loading = false
            this.initComplete = true;
          })
      }

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
