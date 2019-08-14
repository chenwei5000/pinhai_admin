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
  import userModel from '../../api/user'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {
    data() {
      return {
        title: '部门管理',
        tableConfig: {
          url: '/departments',
          relations: ["creator", "user"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },

          //工具按钮
          tplNoExportProps: ['操作', '修改时间', '名称', 'ID', '创建人', '状态'],
          exportFileName: '部门列表',
          hasExportTpl: true,
          hasExport: true,
          hasImport: true,

          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'allName', label: '部门', "min-width": 300},
            {prop: 'name', label: '名称', "min-width": 100},
            {prop: 'user.name', label: '负责人', "min-width": 100},
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'allName',
              label: '部门',
              $el: {
                placeholder: '上下级部门间用‘/’隔开，且从最上级部门开始，例如"品海/华东供应链/苏州分公司"。',
                maxlength: "200",
                "show-word-limit": true,
                clearable: true
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'select',
              $id: 'userId',
              label: '部门负责人',
              $el: {
                placeholder: '请选择部门负责人,可筛选',
                filterable: true
              },
              $options: userModel.getSelectOptions(),
              rules: []
            },
            phFromItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
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
