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
  import currencyModel from "../../api/currency";

  export default {
    data() {
      return {
        title: '银行账户',
        tableConfig: {
          url: '/bankAccounts',
          relations: ["creator","currency"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'accountName', label: '户名', "min-width": 100},
            {prop: 'accountCard', label: '银行卡号', "min-width": 160},
            {prop: 'openingBank', label: '开户行', "min-width": 120},
            {prop: 'currencyId', label: '货币类型ID', hidden: 'false', "min-width": 120},
            {prop: 'currency.name', label: '币种', "min-width": 120},

            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.accountName,
            phSearchItems.status()
          ],
          //  弹窗表单
          form: [
            {
              $type: 'input',
              $id: 'accountName',
              label: '户名',
              $el: {
                placeholder: '请输入户名'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'accountCard',
              label: '银行卡号',
              $el: {
                placeholder: '请输入银行卡号'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'input',
              $id: 'openingBank',
              label: '开户行',
              $el: {
                placeholder: '请输入开户行'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'select',
              $id: 'currencyId',
              label: '币种',
              $el: {
                filterable: true,
                placeholder: '请选择货币类型'
              },
              $options: currencyModel.getSelectOptions(),
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
