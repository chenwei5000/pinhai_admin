<template>
  <div class="app-container">

    <div class="ph-card">

      <!-- title -->
      <ph-card-header :title="title" type="table">

      </ph-card-header>

      <!-- 表格 -->
      <div class="ph-card-body">
        <!-- 说明  https://femessage.github.io/el-data-table/-->
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
  import datadicModel from '@/api/datadic';
  import supplierModel from '@/api/supplier';


  export default {

    data() {
      return {
        types: [],
        names: [],
        title: '仓库管理', // 页面标题
        url: '/warehouses', // 资源URL
        relations: ["dataDicItem.type", "supplier"],//关联数据字典


        //表格定义 具体可参考https://element.eleme.cn/#/zh-CN/component/table#table-attributes
        // https://femessage.github.io/el-data-table/
        tableAttrs: {
          stripe: true,
          border: true,
          "row-class-name": this.statusClassName,
          "highlight-current-row": true
        },

        // 表格列定义, 具体可参考 https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
        columns: [
          {type: 'selection'}, //多选
          {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
          {prop: 'code', label: '编码'},
          {prop: 'name', label: '名称', sortable: 'custom'},
          {prop: 'address', label: '地址'},
          {prop: 'linkman', label: '联系人'},
          {prop: 'tel', label: '联系电话'},
          {prop: 'type', label: '类型'},
          {prop: 'supplierId', label: '供货商编号', hidden: true},
          {prop: 'supplier.name', label: '供货商名称'},

          {
            prop: 'status',
            label: '状态',
            formatter: row => (row.status === 1 ? '启用' : '禁用')
          },
          {
            prop: 'lastModified',
            label: '最后修改时间',
            formatter: row => {
              return parseTime(row.lastModified, '{y}-{m}-{d} {h}:{i}');
            }
          }
        ],

        // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
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
            $type: 'input',
            $id: 'name',
            label: '名称',
            $el: {
              op: 'bw',
              placeholder: '请输入名称'
            }
          }

        ],
        //  弹窗表单, 用于新增与修改, 详情配置参考el-form-renderer
        // https://github.com/FEMessage/el-form-renderer/blob/master/README.md
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
                message: '请输入编码',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'input',
            $id: 'name',
            label: '名称',
            $el: {
              placeholder: '请输入名称'
            },
            rules: [
              {
                required: true,
                message: '请输入名称',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'input',
            $id: 'address',
            label: '地址',
            $el: {
              placeholder: '请输入地址'
            },
            rules: [
              {
                message: '请输入地址',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'input',
            $id: 'linkman',
            label: '联系人',
            $el: {
              placeholder: '请输入联系人'
            },
            rules: [
              {
                message: '请输入联系人',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'input',
            $id: 'linkman',
            label: '联系电话',
            $el: {
              placeholder: '请输入联系电话'
            },
            rules: [
              {
                message: '请输入联系电话',
                trigger: 'blur'
              }
            ]
          },
          ,
          {
            $type: 'select',
            $id: 'type',
            label: '类型',
            $el: {
              placeholder: '请输入类型'
            },
            $options: function () {
              var _types = []
              const loadData = async function () {
                datadicModel.getByType("warehouse").then(datadics => {
                  datadics.forEach(datadic => {
                    _types.push({
                      label: datadic.valueName,
                      value: datadic.valueId
                    });
                  });
                  return _types;
                });
              };
              loadData();
              return _types;
            }
          },
          {
            $type: 'select',
            $id: 'supplier_id',
            label: '供货商',
            $el: {
              placeholder: '请选择供货商'
            },
            $options: function () {
              var _names = []
              const loadData = async function () {
                supplierModel.getSuppliers().then(suppliers => {
                  suppliers.forEach(supplier => {
                    _names.push({
                      label: supplier.name,
                      value: supplier.id
                    });
                  });
                  return _names;
                });
              };

              loadData();
              return _names;
            }
          },
        ]
      }
    },

    // 计算属性，用于跟模版进行数据交互。
    // computed属性，属于持续变化跟踪。在computed属性定义的时候，这个computed属性就与给它赋值的变量绑定了。
    // 改变这个赋值变量，computed属性值会随之改变。
    // 主要用于用过其它第三变量，间接跟页面进行数据交互时使用。
    computed: {},

    // 各种相关方法定义
    methods: {
      // 状态样式
      statusClassName({row, rowIndex}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>


</style>
