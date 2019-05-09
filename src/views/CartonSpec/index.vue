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
  import {parseTime} from '@/utils'
  import categoryModel from '@/api/category'
  import validRules from '@/api/validrules'

  export default {
    data() {
      return {
        title: '包装材料列表',
        tableConfig: {
          url: '/cartonSpecs',
          relations: ["creator", "category"],
          tableAttrs: {
            "default-sort": {prop: 'id', order: 'descending'},
            "row-class-name": this.statusClassName,
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            {prop: 'code', label: '编码', 'min-width': 150, fixed: 'left'},
            {prop: 'id', label: 'ID', sortable: 'true', hidden: false, width: 100},
            {prop: 'category.name', label: '分类', 'min-width': 120},
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
            {prop: 'creator.name', label: '创建人', width: 100},
            {
              prop: 'status',
              label: '状态',
              width: 80,
              formatter: row => (row.status === 1 ? '启用' : '禁用')
            },
            {
              prop: 'lastModified',
              label: '修改时间',
              width: 140,
              formatter: row => {
                return parseTime(row.lastModified, '{y}-{m}-{d} {h}:{i}');
              }
            }
          ],
          //搜索栏
          searchForm: [
            {
              $type: 'input',
              $id: 'code',
              label: '编码',
              $el: {
                op: 'bw',
                placeholder: '请输入编码'
              }
            },
            //TODO: 需要按照分类搜索
            {
              $type: 'select',
              $id: 'status',
              label: '状态',
              $el: {
                op: 'eq',
                placeholder: '请选择状态'
              },
              $options: [
                {
                  label: '全部',
                  value: ''
                },
                {
                  label: '开启',
                  value: '1'
                },
                {
                  label: '禁用',
                  value: '0'
                }
              ]
            }
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
              $options: function () {
                var _categoryNames = [];
                const loaddata = async function () {
                  categoryModel.getCategories().then(categorys => {
                    categorys.forEach(category => {
                      _categoryNames.push({
                        label: category.name,
                        value: category.name
                      });
                    });
                    return _categoryNames;
                  });
                };
                loaddata();
                return _categoryNames;
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
            {
              $type: 'radio-group',
              $id: 'status',
              label: '状态',
              $el: {},
              $default: 1,
              $options: [
                {
                  label: '开启',
                  value: 1
                },
                {
                  label: '禁用',
                  value: 0
                }
              ]
            }
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
