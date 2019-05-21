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
  import phFormItems from '../../components/phFromItems'

  export default {
    data() {
      return {
        title: '数据字典',
        tableConfig: {
          url: '/dataDicItems',
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'type', label: '字典类型', sortable: 'custom', fixed: 'left', 'min-width': 100},
            {prop: 'name', label: '字典类型名称', sortable: 'custom', 'min-width': 100},
            {prop: 'valueId', label: '字典值ID', 'min-width': 100},
            {prop: 'valueName', label: '字典值名称', 'min-width': 100},
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'input',
              $id: 'name',
              label: '字典类型名称',
              $el: {
                op: 'bw',
                placeholder: '请输入字典类型名称'
              }
            },
            {
              $type: 'input',
              $id: 'valueName',
              label: '字典值名称',
              $el: {
                op: 'bw',
                placeholder: '请输入字典值名称'
              }
            },
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'type',
              label: '字典类型',
              $el: {
                placeholder: '请输入字典类型'
              },
              rules: [
                validRules.required
              ]
            },
            phFormItems.name,
            {
              $type: 'input',
              $id: 'valueId',
              label: '字典值ID',
              $el: {
                placeholder: '请输入字典值ID'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'valueName',
              label: '字典值名称',
              $el: {
                placeholder: '请输入字典值名称'
              },
              rules: [
                validRules.required
              ]
            },
            phFormItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
            this.$store.commit('app/SET_DATADICS', null)
          }
        }
      }
    },

    computed: {},
    // 各种相关方法定义
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
