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
            <el-select filterable
                       v-model="editObject.companyManagementId"
                       @change="loadAccount"
                       style="width: 150px"
                       size="mini"
                       placeholder="请选择收款公司">
              <el-option
                v-for="(item,idx) in companySelectOptions"
                :label="item.abbreviation"
                :value="item.id"
                :key="idx"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="16">
          <el-form-item label="收款账户" prop="collectionAccountId">
            <el-select filterable
                       v-model="editObject.collectionAccountId"
                       style="width: 300px"
                       size="mini"
                       placeholder="请选择收款公司收款帐号">
              <el-option
                v-for="(item,idx) in accountSelectOptions"
                :label="item.bankAccount.accountName + '-'
                + item.bankAccount.currency.name + '-'
                + item.bankAccount.openingBank + '-' + item.bankAccount.accountCardHide " :value="item.id"
                :key="idx"
              ></el-option>
            </el-select>

          </el-form-item>
        </el-col>
      </el-row>

      <el-row>

        <el-col :md="8">
          <el-form-item label="付款货币" prop="currencyId">
            <el-select filterable
                       v-model="editObject.currencyId"
                       @change="loadCurrency"
                       style="width: 150px"
                       size="mini"
                       placeholder="请选择付款货币">
              <el-option
                v-for="(item,idx) in currencySelectOptions"
                :label="item.label"
                :value="item.value"
                :key="idx"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :md="16">
          <el-form-item label="最晚付款时间" prop="latestPaymentTime">
            <el-date-picker
              v-model="editObject.latestPaymentTime"
              style="width: 200px"
              type="date"
              size="mini"
              placeholder="选择日期">
            </el-date-picker>

            <el-tooltip class="item" effect="light" content="财务必须在该日期前付款" placement="right">
              <i class="el-icon-question">&nbsp;</i>
            </el-tooltip>
          </el-form-item>
        </el-col>

      </el-row>
      <el-row>
        <el-col :md="24">
          <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="editObject.remark"
                      maxlength="200"
                      show-word-limit
                      rows="2"
                      cols="80"
                      show-word-limit></el-input>
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
          latestPaymentTime:[
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
          this.currencySelectOptions = currencyModel.getSelectOptions();
          this.loadCompany();
          this.loadAccount();
        }
      },

      loadCurrency() {
        if (this.editObject.currencyId) {
          let url = `/currencies/${this.editObject.currencyId}`;
          this.global.axios
            .get(url)
            .then(resp => {
              let res = resp.data
              this.currency = res || {}
              this.$emit("modifyCBEvent", this.currency);
            })
            .catch(err => {
            })
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

