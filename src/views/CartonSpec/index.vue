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
  import categoryModel from '../../api/category'
  import validRules from '../../components/validrules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFormItems from '../../components/phFromItems'

  export default {
    data() {
      return {
        title: '包装材料列表',
        tableConfig: {
          url: '/cartonSpecs',
          relations: ["creator", "category"],
          tableAttrs: {
            "default-sort": {prop: 'categoryId', order: 'ascending'},
            "row-class-name": this.statusClassName,
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            {prop: 'code', label: '编码', sortable: 'custom', 'min-width': 150, fixed: 'left'},
            phColumns.id,
            {prop: 'category.name', label: '分类', 'min-width': 120},
            {prop: 'categoryId', label: '分类ID', hidden: true, 'min-width': 120},
            {prop: 'numberOfPallets', label: '托盘放置数', 'min-width': 120},
            {prop: 'length', label: '长(Cm)', width: 80},
            {prop: 'width', label: '宽(Cm)', width: 80},
            {prop: 'height', label: '高(Cm)', width: 80},
            {prop: 'volume', label: '体积(m³)', 'min-width': 100},
            {prop: 'grossWeight', label: '皮重(Kg)', width: 80},
            {
              prop: 'pallet',
              label: '是否打托',
              formatter: row => (row.pallet === 1 ? '是' : '否')
            },
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],
          //搜索栏
          searchForm: [
            phSearchItems.code,
            phSearchItems.productCategories,
            phSearchItems.status
          ],
          //添加或修改弹出框
          form: [
            {
              $type: 'select',
              $id: 'groupCode',
              label: '分类',
              $el: {
                placeholder: '请输入分类'
              },
              $options: categoryModel.getMineSelectNameOptions('p'),
              rules: [
                validRules.required
              ]
            },
            phFormItems.code,
            {
              $type: 'input',
              $id: 'numberOfPallets',
              label: '托盘放置数',
              $el: {},
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'length',
              label: '长(Cm)',
              $el: {
                placeholder: '请输入长度'
              },
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'width',
              label: '宽(Cm)',
              $el: {
                placeholder: '请输入宽度'
              },
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'height',
              label: '高度',
              $el: {
                placeholder: '请输入高度'
              },
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'grossWeight',
              label: '皮重',
              $el: {
                placeholder: '请输入皮重'
              },
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            phFormItems.status
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
