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
  import categoryModel from '../../api/category'
  import phEnumModel from '../../api/phEnum'
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFormItems from '../../components/phFromItems'
  import {checkPermission} from '@/utils/permission'


  export default {
    name: 'CartonSpecResource_menu',
    data() {
      return {
        title: '包装材料列表',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('CartonSpecResource_create'),
          hasEdit: checkPermission('CartonSpecResource_update'),
          hasDelete: checkPermission('CartonSpecResource_remove'),
          // hasView: checkPermission('CartonSpecResource_get'),
          hasExportTpl: checkPermission('CartonSpecResource_export'),
          hasExport: checkPermission('CartonSpecResource_export'),
          hasImport: checkPermission('CartonSpecResource_import'),

          url: '/cartonSpecs',
          relations: ["creator", "category"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          //表格内容显示
          columns: [
            {width: 30,type: checkPermission('CartonSpecResource_remove') ? 'selection' : '', hidden: !checkPermission('CartonSpecResource_remove'), width: 30, align: "center"},
            {prop: 'code', label: '编码', sortable: 'custom', 'min-width': 150, fixed: 'left'},
            {prop: 'category.name', label: '分类', 'min-width': 100},
            {prop: 'categoryId', label: '分类ID', hidden: true, 'min-width': 120},
            {prop: 'length', label: '长(Cm)', width: 80, align: "center"},
            {prop: 'width', label: '宽(Cm)', width: 80, align: "center"},
            {prop: 'height', label: '高(Cm)', width: 80, align: "center"},
            {prop: 'volume', label: '体积(m³)', 'min-width': 100, align: "center"},
            {prop: 'grossWeight', label: '皮重(Kg)', width: 80, align: "center"},
            {
              prop: 'pallet',
              label: '是否打托',
              formatter: row => {
                let _status = phEnumModel.getSelectOptions("YesOrNo");
                let _label = '';
                _status.forEach(s => {
                  if (s.value === row.pallet + '') {
                    _label = s.label;
                    return;
                  }
                });
                return _label;
              }
            },
            {prop: 'numberOfPallets', label: '托盘放置数', 'min-width': 120, align: "center"},
            phColumns.creator,
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],
          //搜索栏
          searchForm: [
            phSearchItems.code,
            phSearchItems.productCategories(),
            phSearchItems.status()
          ],
          //添加或修改弹出框
          form: [
            {
              $type: 'select',
              $id: 'categoryId',
              label: '分类',
              $el: {
                filterable: true,
                placeholder: '请选择分类,可筛选',
                size: 'mini'
              },
              $options: categoryModel.getMineSelectProdcutOptions(),
              rules: [
                validRules.required
              ]
            },
            phFormItems.code,
            {
              $type: 'input',
              $id: 'length',
              label: '长(Cm)',
              $el: {
                placeholder: '请输入箱子长度'
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
                placeholder: '请输入箱子宽度'
              },
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'height',
              label: '高度(Cm)',
              $el: {
                placeholder: '请输入箱子高度'
              },
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            {
              $type: 'input',
              $id: 'grossWeight',
              label: '皮重(Kg)',
              $el: {
                placeholder: '箱子和箱中填充物的重量，不包含产品的重量'
              },
              rules: [
                validRules.required,
                validRules.number
              ]
            },
            phFormItems.yesOrNo('pallet', '是否打托', 0),
            {
              $type: 'input',
              $id: 'numberOfPallets',
              label: '托盘放置数',
              $default: 1,
              $el: {
                placeholder: '一个托盘上可以放置该箱规的最大箱数, 如：24'
              },
              rules: [
                validRules.number
              ]
            },
            phFormItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
            this.$store.commit('app/SET_CARTONSPECS', null)
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
