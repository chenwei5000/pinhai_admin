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
  import datadicModel from '@/api/datadic'
  import supplierModel from '@/api/supplier'
  import validRules from '@/components/validrules'


  export default {

    data() {
      return {

        types: [],
        names: [],
        title: '仓库管理',

        tableConfig: {

          url: '/warehouses',
          relations: ["dataDicItem.type", "supplier"],
          tableAttrs: {
            stripe: true,
            border: true,
            "row-class-name": this.statusClassName,
            "highlight-current-row": true
          },
          columns: [
            {type: 'selection'},
            {prop: 'id', label: 'ID', sortable: 'custom', hidden: true},
            {prop: 'code', label: '编码',  'min-width': 200},
            {prop: 'name', label: '名称', sortable: 'custom',  'min-width': 200, fixed: 'left'},
            {prop: 'address', label: '地址',  'min-width': 150},
            {prop: 'linkman', label: '联系人', width: 100},
            {prop: 'tel', label: '联系电话', width: 125},
            {prop: 'type', label: '类型'},
            {prop: 'supplierId', label: '供货商编号', hidden: true},
            {prop: 'supplier.name', label: '供货商名称', 'min-width': 150},
            {
              prop: 'status',
              label: '状态',
              width:80,
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
                validRules.required
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
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'address',
              label: '地址',
              $el: {
                placeholder: '请输入地址'
              },
            },
            {
              $type: 'input',
              $id: 'linkman',
              label: '联系人',
              $el: {
                placeholder: '请输入联系人'
              },
            },
            {
              $type: 'input',
              $id: 'linkman',
              label: '联系电话',
              $el: {
                placeholder: '请输入联系电话'
              },
              rules: [
                validRules.number
              ]
            },
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
              $id: 'supplierId',
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
