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
        title: '国家列表',
        tableConfig: {
          url: '/countries',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '名称', sortable: 'custom', "min-width": 120, fixed: 'left'},
            {prop: 'enName', label: '英文名', sortable: 'custom', "min-width": 120},
            {prop: 'isoCode2', label: '2位iso编码', "min-width": 120},
            {prop: 'isoCode3', label: '3位iso编码', "min-width": 120},
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            phSearchItems.status
          ],
          //  弹窗表单
          form: [
            phFromItems.name,
            {
              $type: 'input',
              $id: 'enName',
              label: '国家英文名',
              $el: {
                placeholder: '请输入国家英文名'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'isoCode2',
              label: '2位iso编码',
              $el: {
                placeholder: '请输入国家2位iso编码'
              },
              rules: [
                validRules.required,
                validRules.strMax(2)
              ]
            },
            {
              $type: 'input',
              $id: 'isoCode3',
              label: '3位iso编码',
              $el: {
                placeholder: '请输入国家3位iso编码'
              },
              rules: [
                validRules.required,
                validRules.strMax(3)
              ]
            },
            phFromItems.status()
          ]
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
