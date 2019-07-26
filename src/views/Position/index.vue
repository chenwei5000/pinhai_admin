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
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'type', label: '职位类别',"min-width": 100, hidden: 'false'},
            {prop: 'name', label: '职位名称', "min-width": 100},
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'name',
              label: '职位名称',
              $el: {
                placeholder: '请输入职位名称'
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
