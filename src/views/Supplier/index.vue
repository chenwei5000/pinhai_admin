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

  import {parseTime} from '@/utils';
  import datadicModel from '@/api/datadic';

  export default {

    data() {
      return {
        regions: [],
        title: '供货商管理', 
        url: '/suppliers', 
        relations: ["dataDicItem.type"],
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
          {prop: 'name', label: '简称', sortable: 'custom'},
          {prop: 'companyName', label: '公司名称'},
          {prop: 'city', label: '所在城市'},
          {prop: 'region', label: '管理区域', sortable: 'custom'},
          {prop: 'address', label: '地址'},
          {prop: 'linkman', label: '联系人'},
          {prop: 'tel', label: '联系电话'},
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
            label: '简称',
            $el: {
              op: 'bw',
              placeholder: '请输入简称'
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
            label: '简称',
            $el: {
              placeholder: '请输入简称'
            },
            rules: [
              {
                required: true,
                message: '请输入简称',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'input',
            $id: 'companyName',
            label: '公司名称',
            $el: {
              placeholder: '请输入公司名称'
            },
            rules: [
              {
                message: '请输入公司名称',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'input',
            $id: 'city',
            label: '所在城市',
            $el: {
              placeholder: '请输入所在城市'
            },
            rules: [
              {
                message: '请输入所在城市',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'select',
            $id: 'region',
            label: '管理区域',
            $el: {
              placeholder: '请输入管理区域'
            },
            $options: function () {
              var _regions = []

              const loadData = async function () {
                datadicModel.getByType("region").then(datadics => {
                  datadics.forEach(datadic => {
                    _regions.push({
                      label: datadic.valueName,
                      value: datadic.valueId
                    });
                  });
                  return _regions;
                });
              };

              loadData();
              return _regions;
            }
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
