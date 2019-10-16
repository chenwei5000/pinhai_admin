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

        <el-col :md="8">
          <el-form-item label="收款公司" prop="companyManagementId">
            <span style="font-size:12px">{{editObject.companyManagement.abbreviation}}</span>
          </el-form-item>
        </el-col>

        <el-col :md="16">
          <el-form-item label="收款账户" prop="collectionAccountId">
            <span style="font-size:12px">
              {{editObject.collectionAccount ? editObject.collectionAccount.bankAccount.accountName : ""}}
              {{editObject.collectionAccount ? editObject.collectionAccount.bankAccount.currency.name : ""}}
              {{editObject.collectionAccount ? editObject.collectionAccount.bankAccount.openingBank : ""}}
              {{editObject.collectionAccount ? editObject.collectionAccount.bankAccount.accountCardHide : ""}}
            </span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-col :md="8">
          <el-form-item label="付款货币" prop="currencyId">
            <span style="font-size:12px">{{editObject.currency ? editObject.currency.name : '' }}</span>
          </el-form-item>
        </el-col>

        <el-col :md="16">
          <el-form-item label="最晚付款时间" prop="latestPaymentTime">
            <span style="font-size: 12px">{{this.editObject.latestPaymentTime | parseTime('{y}-{m}-{d}')}}</span>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :md="24">
          <el-form-item label="备注" prop="remark">
            <span style="font-size: 12px" v-html="editObject.formatRemark"></span>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
  </div>

</template>

<script>

  import {currency, intArrToStrArr, parseTime} from '@/utils'
  import validRules from '@/components/validRules'
  import currencyModel from '@/api/currency'

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
      }
    },
    filters: {},

    data() {
      return {
        // 表单加载状态
        loading: false,
        // 点击按钮之后，按钮锁定不可在点
        confirmLoading: false,

        initComplete: false,
        currency: {},

        companySelectOptions: [],
        accountSelectOptions: [],
        currencySelectOptions: [],

        // 编辑对象 TODO
        editObject: {},

        // 字段验证规则 TODO:
        rules: {
          companyManagementId: [
            validRules.required
          ],
          currencyId: [
            validRules.required
          ],
          latestPaymentTime: [
            validRules.required
          ]
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
          this.editObject.currencyId = this.editObject.currencyId + '';
          this.currencySelectOptions = currencyModel.getSelectOptions();
          this.loadCompany();
          this.loadAccount();
        }
      },

      loadAccount() {
        if (this.editObject.companyManagementId) {
          let filters = [
            {
              field: "companyManagementId",
              op: 'eq',
              data: this.editObject.companyManagementId
            }
          ];
          let relations = ["bankAccount", "companyManagement", "bankAccount.currency"];
          let url = `/collectionAccounts?filters=${JSON.stringify({
            "groupOp": "AND",
            "rules": filters
          })}&relations=${JSON.stringify(relations)}`;

          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data
              let data = res || []
              this.accountSelectOptions = data;
              this.initComplete = true;
              this.loading = false;
            })
            .catch(err => {
              this.initComplete = true;
              this.loading = false;
            })
        }
      },

      loadCompany() {
        let filters = [
          {
            field: "status",
            op: 'eq',
            data: 1
          },
          {
            field: "type",
            op: 'in',
            data: '2,3'
          },
        ];
        let url = `/companyManagements?filters=${JSON.stringify({
          "groupOp": "AND",
          "rules": filters
        })}`;

        this.global.axios
          .get(url)
          .then(resp => {
            let res = resp.data
            let data = res || []
            this.companySelectOptions = data;
            this.initComplete = true;
            this.loading = false;
          })
          .catch(err => {
            this.initComplete = true;
            this.loading = false;
          })
      },

      /********************* 操作按钮相关方法  ***************************/
      // 保存
      onSave() {
        this.$refs.editObject.validate(valid => {
          if (!valid) {
            return false
          }
          this.confirmLoading = true;

          let url = `/logisticPaymentBills/${this.editObject.id}`
          this.global.axios.put(url, this.editObject)
            .then(resp => {
              this.$message({type: 'success', message: '编辑成功'});
              let obj = resp.data;
              // 回传消息
              this.$emit("modifyCBEvent", this.editObject);

              this.confirmLoading = false;
            })
            .catch(err => {
              this.confirmLoading = false;
            })
        })
      }
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

