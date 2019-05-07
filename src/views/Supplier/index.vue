<template>
  <div class="app-container">

    <div class="ph-card">

      <!-- title -->
      <ph-card-header :title = "title" type="table">

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

  export default {
    
    data() {
      return {
        title: '供货商管理', // 页面标题
        url: '/suppliers', // 资源URL
        relations: ["dataDicItem.type"],//关联数据字典

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
            label: '简称',
            $el: {
              op: 'bw',
              placeholder: '请输入简称'
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
            $type: 'input',
            $id: 'region',
            label: '管理区域',
            $el: {
              placeholder: '请输入管理区域'
            },
            rules: [
              {
                message: '请输入管理区域',
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
          }
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
