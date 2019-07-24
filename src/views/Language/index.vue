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

  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {
    data() {
      return {
        title: '语言列表',
        tableConfig: {
          url: '/languages',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '名称', 'min-width': 150, fixed: 'left', sortable: 'custom'},
            {prop: 'code', label: '代码', sortable: 'custom', 'min-width': 150},
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
            phFromItems.code,
            phFromItems.name,
            phFromItems.status()
          ]
        }
      }
    },
    computed: {},

    methods: {
      statusClassName({row}) {
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
