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

  export default {
    data() {
      return {
        title: '港口列表', 
        url: '/harbours', 
        relations: ["creator"],
        tableAttrs: {
          stripe: true,
          border: true,
          "row-class-name": this.statusClassName,
          "highlight-current-row": true
        },
        columns: [
          {type: 'selection'}, 
          {prop: 'id', label: 'ID', sortable: 'custom', hidden: false},
          {
            prop: 'status',
            label: '状态',
            formatter: row => (row.status === 1 ? '启用' : '禁用')
          },
          {prop: 'name', label: '名称', sortable: 'custom'},
          {prop: 'location', label: '地址', sortable: 'custom'},
          {prop: 'creator.name', label: '创建人'},
          {
            prop: 'lastModified',
            label: '最后修改时间',
            formatter: row => {
              return parseTime(row.lastModified, '{y}-{m}-{d} {h}:{i}');
            }
          }
        ],

        searchForm: [
          {
            $type: 'input',
            $id: 'name',
            label: '港口名称',
            $el: {
              op: 'bw',
              placeholder: '请输入港口名称'
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
        form: [
          {
            $type: 'input',
            $id: 'name',
            label: '港口名称',
            $el: {
              placeholder: '请输入港口名称'
            },
            rules: [
              {
                required: true,
                message: '请输入港口名称',
                trigger: 'blur'
              }
            ]
          },
          {
            $type: 'input',
            $id: 'location',
            label: '港口地址',
            $el: {
              placeholder: '请输入港口地址'
            },
            rules: [
              {
                required: true,
                message: '请输入港口地址',
                trigger: 'blur'
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
