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
        title: '职位管理',
        tableConfig: {
          url: '/positions',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '名称', sortable: 'custom', "min-width": 60, fixed: 'left'},
            {prop: 'type', label: '职位类别', sortable: 'custom', "min-width": 60},

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
                placeholder: '请输入职位名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'type',
              label: '职位类别',
              $el: {
                placeholder: '请输入职位类别'
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
