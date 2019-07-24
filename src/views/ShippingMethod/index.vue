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
        title: '物流方式列表',
        tableConfig: {
          url: '/shippingMethods',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 100, fixed: 'left'},
            {prop: 'code', label: '编码', sortable: 'custom', 'min-width': 100},
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],
          //搜索栏
          searchForm: [
            phSearchItems.name,
            phSearchItems.code,
            phSearchItems.status()
          ],
          //修改或添加弹窗栏
          form: [
            {
              $type: 'input',
              $id: 'name',
              label: '物流方式',
              $el: {
                placeholder: '请输入物流方式名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'code',
              label: '编码',
              $el: {
                placeholder: '请输入编码'
              },
              rules: [
                validRules.required
              ]
            },
            phFormItems.status()
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
