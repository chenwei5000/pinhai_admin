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
  import userModel from '@/api/user'

  export default {
    data() {
      return {
        title: '分类列表', 
        url: '/categories', 
        relations: ["creator", "user"],
        tableAttrs: {
          stripe: true,
          border: true,
          "row-class-name": this.statusClassName,
          "highlight-current-row": true
        },
        //列表
        columns: [
          {type: 'selection'}, 
          {prop: 'id', label: 'ID', sortable: 'true', hidden: false}, 
          {
            prop: 'status',
            label: '状态',
            formatter: row => (row.status === 1 ? '启用' : '禁用')
          },
          {prop: 'materialName', label: '类型'},
          {prop: 'name', label: '分类名称'},
          {prop: 'safetyStockWeek', label: '安全库存(周)'},
          {prop: 'vip1SafetyStockWeek', label: 'Vip1安全库存(周)'},
          {prop: 'vip2SafetyStockWeek', label: 'Vip2安全库存(周)'},
          {
            prop: 'needMaterial', 
            label: '产品必须设置原材料',
            formatter: row => (row.needMaterial === 1 ? '是' : '否')
            },
          {prop: 'user.name', label: '采购负责人'},
        ],
        // 搜索
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '名称',
            $el: {
              op: 'bw',
              placeholder: '请输入分类名称'
            }
          },
          {
            $type: 'select',
            $id: 'material',
            label: '类型',
            $el: {
              op: 'eq',
              placeholder: '请选择类型'
            },
            $options: [
              {
                label: '产品',
                value: '0'
              },
              {
                label: '原料',
                value: '1'
              },
              
            ]
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
        //修改或新增
        form: [
          {
            $type: 'select',
            $id: 'material',
            label: '类型',
            $default: 0,
            $el: {
            },
            $options: [
              {
                label: '产品',
                value: 0
              },
              {
                label: '原料',
                value: 1
              }
            ]
          },
           {
            $type: 'input',
            $id: 'name',
            label: '分类名称',
            $el: {
            },
            rules: [
              {
                required: true,
                message: '分类名称不能为空',
                trigger: 'blur'
              }
            ]
          },
           {
            $type: 'input',
            $id: 'safetyStockWeek ',
            label: '安全库存(周)',
            $el: {
            },
          },
           {
            $type: 'input',
            $id: 'vip1SafetyStockWeek ',
            label: 'Vip1安全库存(周)',
            $el: {
            },
          },
           {
            $type: 'input',
            $id: 'vip2SafetyStockWeek ',
            label: 'Vip2安全库存(周)',
            $el: {
            },
          },
           {
            $type: 'radio-group',
            $id: 'needMaterial',
            label: '产品必须设置原材料',
            $default: 1,
            $options: [
              {
                label: '是',
                value: 1
              },
              {
                label: '否',
                value: 0
              }
            ],
            $el: {
            },
          },
           {
            $type: 'select',
            $id: 'userId',
            label: '采购负责人',
            $el: {
            },
            $options: function(){
              var _users = [];
              const loaddata = async function(){
                  userModel.getUsers().then(users => {
                    users.forEach(user => {
                      _users.push({
                        label: user.name,
                        value: user.id 
                      });
                    });
                    return _users;
                  });
              };
              loaddata();
              return _users;
            }
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
