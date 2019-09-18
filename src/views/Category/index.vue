<template>
  <div class="app-container">
    <div class="ph-card">
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

  import phEnumModel from '../../api/phEnum'
  import userModel from '../../api/user'
  import harbourModel from '../../api/harbour'
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
          relations: ["creator", "user", "dataDicItem.type", "harbour"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          //列表
          columns: [
            {type: 'selection'},
            {prop: 'name', label: '分类名称', 'min-width': 100, fixed: 'left'},
            {prop: 'materialName', label: '类型', width: 100},
            {prop: 'user.name', label: '采购负责人', width: 100},
            {prop: 'harbour.name', label: '港口', width: 100},
            {prop: 'safetyStockWeek', label: '安全库存(周)', width: 100, 'label-class-name': 'ph-header-small'},
            {prop: 'vip1SafetyStockWeek', label: 'Vip1安全库存(周)', width: 120, 'label-class-name': 'ph-header-small'},
            {prop: 'vip2SafetyStockWeek', label: 'Vip2安全库存(周)', width: 120, 'label-class-name': 'ph-header-small'},
            {
              prop: 'needMaterial',
              label: '产品必须设置原材料',
              'label-class-name': 'ph-header-small',
              formatter: row => {
                let _status = phEnumModel.getSelectOptions("YesOrNo");
                let _label = '';
                _status.forEach(s => {
                  if (s.value === row.needMaterial + '') {
                    _label = s.label;
                    return;
                  }
                });
                return _label;
              },
              width: 150
            },
            phColumns.creator,
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],
          // 搜索
          searchForm: [
            phSearchItems.name,
            phSearchItems.datadic("materialName", "类型", "material"),
            phSearchItems.status()
          ],
          //修改或新增
          form: [
            phFormItems.datadic("materialName", "类型", '0', "material"),
            {
              $type: 'input',
              $id: 'name',
              label: '分类名称',
              $el: {
                placeholder: '请输入分类名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'userId',
              label: '采购负责人',
              $el: {
                placeholder: '请选择采购负责人,可筛选',
                filterable: true
              },
              $options: userModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'harbourId',
              label: '港口',
              $el: {
                placeholder: '请选择港口,可筛选',
                filterable: true
              },
              $options: harbourModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            phFormItems.yesOrNo('needMaterial', '产品必须设置原材料'),
            {
              $type: 'input',
              $id: 'safetyStockWeek',
              label: '安全库存(周)',
              $el: {
                placeholder: '分类下普通产品安全库存周数'
              },
              rules: [
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'vip1SafetyStockWeek',
              label: 'Vip1安全库存(周)',
              $el: {
                placeholder: '分类下热卖产品安全库存周数'
              },
              rules: [
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'vip2SafetyStockWeek',
              label: 'Vip2安全库存(周)',
              $el: {
                placeholder: '分类下爆款产品安全库存周数'
              },
              rules: [
                validRules.number
              ]
            },
            phFormItems.status()
          ],
          formAttrs: {
            "label-width": "170px"
          },
          //提交后执行
          afterConfirm: () => {
            this.$store.commit('app/SET_CATEGORIES', null);
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
