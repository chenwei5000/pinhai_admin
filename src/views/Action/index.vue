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
        title: '操作列表',
        tableConfig: {
          url: '/actions',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          columns: [
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: false, 'min-width': '180', fixed: 'left'},
            {prop: 'resource', label: '资源标识', sortable: 'custom', 'min-width': 100},
            {prop: 'method', label: '行为动作', sortable: 'custom', 'min-width': 80},
            {prop: 'title', label: '行为说明', 'min-width': 200},
            phColumns.status,
            phColumns.lastModified
          ],
          //搜索栏
          searchForm: [
            {
              $type: 'input',
              $id: 'id',
              label: 'ID',
              $el: {
                op: 'bw',
                placeholder: '请输入ID'
              }
            },
            {
              $type: 'input',
              $id: 'resource',
              label: '资源标识',
              $el: {
                op: 'bw',
                placeholder: '请输入资源标识'
              }
            },
            phSearchItems.status
          ],
          //添加或修改弹出栏
          form: [
          ]
        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row, rowIndex}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
    },
    watch: {}
  }
</script>

<style scoped>


</style>
