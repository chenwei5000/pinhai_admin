<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
      <div class="ph-card-body">
        <ph-table
          :url="url"
          :columns="columns"
          :searchForm="searchForm"
          :form="form"
          :tableAttrs="tableAttrs"
          :relations="relations"
        >
        </ph-table>
      </div>
    </div>
  </div>
</template>

<script>
  import {parseTime} from '@/utils'
  import categoryModel from '@/api/category'

  export default {
    data() {
      return {
        categoryNames: [],
        title: '包装材料列表', 
        url: '/cartonSpecs', 
        relations: ["creator", "category"],
        tableAttrs: {
          stripe: true,
          border: true,
          "default-sort": {prop: 'id', order: 'descending'},
          "row-class-name": this.statusClassName,
          "highlight-current-row": true
        },
        //表格内容显示
        columns: [
          {type: 'selection'}, 
          {prop: 'id', label: 'ID', sortable: 'true', hidden: false}, 
          {
            prop: 'status',
            label: '状态',
            formatter: row => (row.status === 1 ? '启用' : '禁用')
          },
          {prop: 'code', label: '编码'},
          {prop: 'numberOfPallets', label: '托盘放置数量'},
          {prop: 'length', label: '长(Cm)'},
          {prop: 'width', label: '宽(Cm)'},
          {prop: 'height', label: '高(Cm)'},
          {prop: 'volume', label: '体积(m³)'},
          {prop: 'grossWeight', label: '皮重(Kg)'},
          {prop: 'category.name', label: '分类'},
          {
            prop: 'pallet', 
            label: '是否打托',
            formatter: row => (row.pallet === 1 ? '是' : '否' )
            },
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
          {
            $type: 'select',
            $id: 'status',
            label: '状态',
            $el: {
              op: 'bw',
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
            $type: 'input',
            $id: 'code',
            label: '编码',
            $el: {
              placeholder: '请输入编码'
            },
            rules: [
              {
                required: true,
                message: '编码不能为空',
                trigger: 'blur'
              }
            ]
          },
           {
            $type: 'input',
            $id: 'numberOfPallets',
            label: '托盘放置数量',
            $el: {
            },
            rules: [
              {
                required: true,
                message: '托盘放置数量不能为空',
                trigger: 'blur'
              },
              {
                type: 'number',
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
                message: '必须是数字',
                trigger: 'blur'
              }
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
              {
                required: true,
                message: '长度不能为空',
                trigger: 'blur',
              },
              {
                type: 'number',
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
                message: '必须是数字',
                trigger: 'blur'
              }
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
              {
                required: true,
                message: '宽度不能为空',
                trigger: 'blur'
              },
              {
                type: 'number',
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
                message: '必须是数字',
                trigger: 'blur'
              }
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
              {
                required: true,
                message: '高度不能为空',
                trigger: 'blur'
              },
              {
                type: 'number',
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
                message: '必须是数字',
                trigger: 'blur'
              }
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
              {
                required: true,
                message: '皮重不能为空',
                trigger: 'blur'
              },
              {
                type: 'number',
                transform(value) {
                  if (value) {
                    return Number(value);
                  }
                },
                message: '必须是数字',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'select',
            $id: 'groupCode',
            label: '分类',
            $el: {
              placeholder: '请输入分类'
            },
            $options: function(){
              var _categoryNames = [];
              const loaddata = async function(){
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
              {
                required: true,
                message: '请选择分类',
                trigger: blur
              }
            ]
          },
          {
            $type: 'radio-group',
            $id: 'status',
            label: '状态',
            $el: {},
            $default: 1 ,
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
