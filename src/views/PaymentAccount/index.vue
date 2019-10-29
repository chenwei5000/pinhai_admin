<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">
        <ph-table
          v-bind="tableConfig"
        >
        </ph-table>
      </div>
    </div>
  </div>
</template>

<script>

  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import bankAccountModel from "../../api/bankAccount";
  import companyManagementModel from "../../api/companyManagement";
  import {checkPermission} from "../../utils/permission";


  export default {
    data() {
      return {
        title: '付款账户',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('PaymentAccountResource_create'),
          hasEdit: checkPermission('PaymentAccountResource_update'),
          hasDelete: checkPermission('PaymentAccountResource_remove'),
          // hasView: checkPermission('PaymentAccountResource_get'),
          hasExportTpl: checkPermission('PaymentAccountResource_export'),
          hasExport: checkPermission('PaymentAccountResource_export'),
          hasImport: checkPermission('PaymentAccountResource_import'),

          url: '/paymentAccounts',
          relations: ["creator","bankAccount","companyManagement",],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {width: 30, type: checkPermission('PaymentAccountResource_remove') ? 'selection' : '', hidden: !checkPermission('PaymentAccountResource_remove')},
            {prop: 'companyManagementId', label: '公司ID', hidden: 'false', "min-width": 120},
            {prop: 'bankAccountId', label: '银行账号ID', hidden: 'false',"min-width": 160},
            {prop: 'companyManagement.fullName', label: '公司名', fixed: 'left', "min-width": 100},
            {prop: 'bankAccount.accountName', label: '户名', sortable:'custom', "min-width": 60},
            {prop: 'contact', label: '联系人',  "min-width": 60},
            {prop: 'phoneHide', label: '联系人电话', "min-width": 80},

            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'select',
              $id: 'companyManagementId',
              label: '公司',
              $options: companyManagementModel.getSelectOptions(),
              $el: {
                op: 'eq',
                size:"mini",
                filterable: true,
                placeholder: '请选择公司'
              }
            },
            phSearchItems.status()
          ],
          //  弹窗表单
          form: [
            {
              $type: 'select',
              $id: 'companyManagementId',
              label: '公司名',
              $el: {
                filterable: true,
                placeholder: '请选择公司名'
              },
              $options: companyManagementModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'bankAccountId',
              label: '银行账户',
              $el: {
                filterable: true,
                placeholder: '请选择银行账户(户名)'
              },
              $options: bankAccountModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'contact',
              label: '联系人',
              $el: {
                placeholder: '请输入联系人'
              },
            },
            {
              $type: 'input',
              $id: 'phone',
              label: '联系人电话',
              $el: {
                placeholder: '请输入联系人电话'
              },
              rules:[
              ]
            },
            phFromItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
          }
        }
      }
    },
    methods: {
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      }
    },
    watch: {}
  }
</script>

<style scoped>


</style>
