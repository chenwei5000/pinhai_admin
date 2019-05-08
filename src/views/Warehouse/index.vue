<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title = "title" type="table">
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
  import datadicModel from '@/api/datadic';
  import supplierModel from '@/api/supplier';


  export default {
    
    data() {
      return {
        types: [],
        names: [],
        title: '仓库管理', 
        url: '/warehouses', 
        relations: ["dataDicItem.type","supplier"],
        //表格定义
        tableAttrs: {
          stripe: true,
          border: true,
          "row-class-name": this.statusClassName,
          "highlight-current-row": true
        },
        // 表格列定义
        columns: [
          {type: 'selection'},
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

        // 搜索区块定义
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
        //  弹窗表单, 用于新增与修改
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
            $id: 'supplier.name',
            label: '供货商名称',
            $el: {
              placeholder: '请选择供货商名称'
            },
            $options: function () {
              var _names = []

              const loadData = async function () {
                supplierModel.getById("name").then(suppliers => {
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
