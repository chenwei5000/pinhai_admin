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
        title: '部门管理',
        tableConfig: {
          url: '/departments',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '名称', sortable: 'custom', "min-width": 120, fixed: 'left'},
            {prop: 'userId', label: '部门负责人', sortable: 'custom', "min-width": 120},
            {prop: 'parentId', label: '父级部门ID', "min-width": 120},

            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            phSearchItems.status()
          ],
          //  弹窗表单
          form: [
            phFromItems.name,
            {
              $type: 'input',
              $id: 'name',
              label: '名称',
              $el: {
                placeholder: '请输入部门名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'userId',
              label: '部门负责人',
              $el: {
                placeholder: '请输入部门负责人'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'input',
              $id: 'parentId',
              label: '父级部门ID',
              $el: {
                placeholder: '请输入父级部门ID'
              },
              rules: [
                validRules.required,
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
