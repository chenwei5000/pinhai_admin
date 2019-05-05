<template>
  <div class="app-container">

    <div class="ph-card">

      <!-- title -->
      <div class="ph-card-header">{{title}}</div>

      <!-- 筛选栏 -->
      <div class="filter-container">

      </div>

      <!-- 表格 -->
      <div class="ph-card-body">
        <!-- 说明  https://femessage.github.io/el-data-table/-->
        <ph-table
          :url="url"
          :columns="columns"
          :searchForm="searchForm"
          :form="form"
          :tableAttrs="tableAttrs"
        >
        </ph-table>

      </div>


    </div>


  </div>
</template>

<script>

  import {parseTime} from '@/utils'

  export default {
    methods: {
      handleClick(row) {
        console.log(row);
      }
    },

    data() {
      return {
        title: '国家列表', // 页面标题
        url: '/countries', // 资源URL

        //表格定义 具体可参考https://element.eleme.cn/#/zh-CN/component/table#table-attributes
        tableAttrs: {
          stripe: true,
          border: true,
          "row-class-name": this.statusClassName
        },

        // 表格列定义, 具体可参考 https://element.eleme.cn/#/zh-CN/component/table#table-column-attributes
        columns: [
          {prop: 'id', label: 'ID', sortable: 'custom'},
          {prop: 'name', label: '名称', sortable: 'custom'},
          {prop: 'enName', label: '英文名', sortable: 'custom'},
          {prop: 'isoCode2', label: '2位iso编码'},
          {prop: 'isoCode3', label: '3位iso编码'},
          {
            prop: 'status',
            label: '状态',
            formatter: row => (row.status === 1 ? '启用' : '禁用')
          }
        ],

        // 搜索区块定义, 具体可参考 https://github.com/FEMessage/el-form-renderer/blob/master/README.md
        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '国家名称',
            $el: {
              placeholder: '请输入国家名称'
            }
          }
        ],

        //  弹窗表单, 用于新增与修改, 详情配置参考el-form-renderer
        // https://github.com/FEMessage/el-form-renderer/blob/master/README.md

        form: [
          {
            $type: 'input',
            $id: 'name',
            label: '国家名称',
            $el: {
              placeholder: '请输入国家名称'
            },
            rules: [
              {
                required: true,
                message: '请输入国家名称',
                trigger: 'blur'
              }
            ]
          }
        ]
      }
    }
    ,

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
    }
  }
</script>

<style scoped>
  .app-container {
    background-color: #f4f4f5;
  }

  .ph-card {
    border-radius: 2px;
    background-color: #fff;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, .05);
  }

  .ph-card-header {
    position: relative;
    height: 42px;
    line-height: 42px;
    padding: 0 15px;
    border-bottom: 1px solid #f6f6f6;
    color: #333;
    border-radius: 2px 2px 0 0;
    font-size: 14px;
  }

  .ph-card-body {
    position: relative;
    padding: 10px 15px;
    line-height: 24px;
  }


</style>
