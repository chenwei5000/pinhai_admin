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

  export default {
    data() {
      return {
        title: '货币管理',
        tableConfig: {
          url: '/currencies',
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 100, fixed: 'left'},
            {prop: 'code', label: '代码', sortable: 'custom', width: 80},
            {prop: 'symbolLeft', label: '左侧符', width: 80},
            {prop: 'symbolRight', label: '右侧符', width: 80},
            {prop: 'decimalPoint', label: '小数符', width: 80},
            {prop: 'thousandsPoint', label: '千分位符', width: 80},
            {prop: 'decimalPlaces', label: '小数位数', width: 80},
            {prop: 'value', label: '汇率值', sortable: 'custom', width: 100},
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            phSearchItems.code,
            phSearchItems.status(),
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            phFromItems.name,
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
