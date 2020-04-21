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
  import {checkPermission} from "../../utils/permission";

  export default {
    name: '货币管理',
    data() {
      return {
        title: '货币管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('CurrencyResource_create'),
          hasEdit: checkPermission('CurrencyResource_update'),
          hasDelete: checkPermission('CurrencyResource_remove'),
          // hasView: checkPermission('CurrencyResource_get'),
          hasExportTpl: checkPermission('CurrencyResource_export'),
          hasExport: checkPermission('CurrencyResource_export'),
          hasImport: checkPermission('CurrencyResource_import'),

          url: '/currencies',
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {width: 30,type: checkPermission('CurrencyResource_remove') ? 'selection' : '', hidden: !checkPermission('CurrencyResource_remove')},
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 80, fixed: 'left'},
            {prop: 'code', label: '代码', sortable: 'custom', width: 80},
            {prop: 'symbolLeft', label: '左侧符', width: 60},
            {prop: 'symbolRight', label: '右侧符', width: 60},
            {prop: 'decimalPoint', label: '小数符', width: 60},
            {prop: 'thousandsPoint', label: '千分位符', width: 60},
            {prop: 'decimalPlaces', label: '小数位数', width: 60},
            {prop: 'value', label: '汇率值', sortable: 'custom', width: 100},
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            {
              $type: 'input',
              $id: 'code',
              label: '代码',
              $el: {
                op: 'bw',
                size: "mini",
                placeholder: '请输入名称',
                clearable: true,
                maxlength: "40",
                "show-word-limit": true,
              }
            },
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            phFromItems.name(),
            {
              $type: 'input',
              $id: 'code',
              label: '代码',
              $el: {
                placeholder: '请输入代码'
              },
              rules: [
                validRules.required,
                validRules.strMax(3)
              ]
            },
            {
              $type: 'input',
              $id: 'symbolLeft',
              label: '左侧符',
              $el: {
                placeholder: '请输入左侧符'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'symbolRight',
              label: '右侧符',
              $el: {
                placeholder: '请输入右侧符'
              },
              rules: [
                validRules.strMax(1)
              ]
            },
            {
              $type: 'input',
              $id: 'decimalPoint',
              label: '小数符',
              $default: '.',
              $el: {
                placeholder: '请输入小数符'
              },
              rules: [
                validRules.strMax(1)
              ]
            },
            {
              $type: 'input',
              $id: 'thousandsPoint',
              label: '千分位符',
              $default: ',',
              $el: {
                placeholder: '请输入千分位符'
              },
              rules: [
                validRules.strMax(1)
              ]
            },
            {
              $type: 'input',
              $id: 'decimalPlaces',
              label: '小数位数',
              $default: 2,
              $el: {
                placeholder: '请输入小数位数',
              },
              rules: [
                validRules.integer
              ]
            },
            {
              $type: 'input',
              $id: 'value',
              label: '汇率值',
              $default: '1',
              $el: {
                placeholder: '请输入汇率值'
              },
              rules: [
                validRules.number
              ]
            },
            phFromItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
            this.$store.commit('app/SET_CURRENCIES', null)
          }
        }
      }
    },
    computed: {},

    methods: {
      // 状态样式
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>

</style>
