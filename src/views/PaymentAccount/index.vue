<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
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


  export default {
    data() {
      return {
        title: '付款账户',
        tableConfig: {
          url: '/paymentAccounts',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'companyManagementId', label: '公司ID', hidden: 'false', "min-width": 100},
            {prop: 'bankAccountId', label: '银行账号ID', hidden: 'false',"min-width": 160},
            {prop: 'companyManagement.fullName', label: '公司全称', "min-width": 120},
            {prop: 'bankAccount.accountCard', label: '银行账户', "min-width": 160},

            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.status()
          ],
          //  弹窗表单
          form: [
            {
              $type: 'select',
              $id: 'bankAccountId',
              label: '银行账户',
              $el: {
                filterable: true,
                placeholder: '请选择银行账户'
              },
              $options: bankAccountModel.getSelectOptions(),
              rules: [
                validRules.required
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
