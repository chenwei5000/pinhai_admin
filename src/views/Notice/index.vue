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
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '消息管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('NoticeResource_create'),
          hasEdit: checkPermission('NoticeResource_update'),
          hasDelete: checkPermission('NoticeResource_remove'),
           // hasView: checkPermission('NoticeResource_get'),
          hasExportTpl: checkPermission('NoticeResource_export'),
          hasExport: checkPermission('NoticeResource_export'),
          hasImport: checkPermission('NoticeResource_import'),

          url: '/notices',
          relations: ["sender"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //列表
          columns: [
            {type: checkPermission('NoticeResource_remove') ? 'selection' : '', hidden: !checkPermission('NoticeResource_remove')},
            phColumns.id,
            {prop: 'title', label: '标题', 'min-width': 120},
            {prop: 'content', label: '内容', 'min-width': 250},
            {prop: 'typeName', label: '类型', 'min-width': 50},
            {prop: 'target', label: '操作对象', 'min-width': 100},
            {prop: 'targetType', label: '操作类型', 'min-width': 120},
            {prop: 'sender.name', label: '发送者', 'min-width': 100},
          ],
          // 搜索
          searchForm: [

          ]
        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row}) {
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
