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
  import userModel from '../../api/user'
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFormItems from '../../components/phFromItems'


  export default {
    data() {
      return {
        title: '分类列表',
        tableConfig: {
          url: '/categories',
          relations: ["creator", "user", "dataDicItem.type"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          //列表
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '分类名称', 'min-width': 100, fixed: 'left'},
            {prop: 'materialName', label: '类型', width: 100},
            {prop: 'user.name', label: '采购负责人', width: 100},
            {prop: 'safetyStockWeek', label: '安全库存(周)', width: 100, 'label-class-name': 'ph-header-small'},
            {prop: 'vip1SafetyStockWeek', label: 'Vip1安全库存(周)', width: 120, 'label-class-name': 'ph-header-small'},
            {prop: 'vip2SafetyStockWeek', label: 'Vip2安全库存(周)', width: 120, 'label-class-name': 'ph-header-small'},
            {
              prop: 'needMaterial',
              label: '产品必须设置原材料',
              'label-class-name': 'ph-header-small',
              formatter: row => (row.needMaterial === 1 ? '是' : '否'),
              width: 150
            },
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],
          // 搜索
          searchForm: [
            phSearchItems.name,
            phSearchItems.datadic("materialName", "类型", "material"),
            phSearchItems.status
          ],
          //修改或新增
          form: [
            phFormItems.datadic("materialName", "类型", '0', "material"),
            {
              $type: 'input',
              $id: 'name',
              label: '分类名称',
              $el: {},
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'safetyStockWeek ',
              label: '安全库存(周)',
              $el: {},
              rules: [
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'vip1SafetyStockWeek ',
              label: 'Vip1安全库存(周)',
              $el: {},
              rules: [
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'vip2SafetyStockWeek ',
              label: 'Vip2安全库存(周)',
              $el: {},
              rules: [
                validRules.number
              ]
            },
            phFormItems.yesOrNo('needMaterial', '产品必须设置原材料'),
            {
              $type: 'select',
              $id: 'userId',
              label: '采购负责人',
              $el: {},
              $options: userModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            phFormItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
            this.$store.commit('app/SET_CATEGORIES', null)
          }
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
