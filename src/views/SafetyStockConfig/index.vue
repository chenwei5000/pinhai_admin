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
        types: [],
        title: '安全库存配置列表',
        tableConfig: {
          url: '/safetyStockConfigs',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 90, fixed: 'left'},
            {prop: 'typeName', label: '类型', 'min-width': 80},
            {prop: 'vip0SafetyStockWeek', label: 'Vip0普通', 'min-width': 80},
            {prop: 'vip1SafetyStockWeek', label: 'Vip1热销', 'min-width': 80},
            {prop: 'vip2SafetyStockWeek', label: 'Vip2爆款', 'min-width': 80},
            {prop: 'sortNum', label: '排序值', sortable: true, 'min-width': 80},
            phColumns.status,
            phColumns.lastModified
          ],
          //搜索栏
          searchForm: [
            phSearchItems.name,
            phSearchItems.status,
          ],
          //添加或修改弹窗
          form: [
            phFromItems.name,
            phFromItems.datadicName("typeName", '类型', '成品', 'typeName'),

            {
              $type: 'input',
              $id: 'vip0SafetyStockWeek',
              label: 'Vip0普通(周)',
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'vip1SafetyStockWeek',
              label: 'Vip1热销(周)',
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'vip2SafetyStockWeek',
              label: 'Vip2爆款(周)',
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'sortNum',
              label: '排序值',
              rules: [
                validRules.required,
                validRules.number
              ]
            },
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
