<template>
  <div class="app-container">
    <div class="ph-card">
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

  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    name: '语言管理',
    data() {
      return {
        title: '语言管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('LanguageResource_create'),
          hasEdit: checkPermission('LanguageResource_update'),
          hasDelete: checkPermission('LanguageResource_remove'),
          // hasView: checkPermission('LanguageResource_get'),
          hasExportTpl: checkPermission('LanguageResource_export'),
          hasExport: checkPermission('LanguageResource_export'),
          hasImport: checkPermission('LanguageResource_import'),

          url: '/languages',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          columns: [
            {width: 30,type: checkPermission('LanguageResource_remove') ? 'selection' : '', hidden: !checkPermission('LanguageResource_remove')},
            {prop: 'name', label: '名称', 'min-width': 150, fixed: 'left', sortable: 'custom'},
            {prop: 'code', label: '代码', sortable: 'custom', 'min-width': 150},
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            phFromItems.name(),
            phFromItems.code,
            phFromItems.status()
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
