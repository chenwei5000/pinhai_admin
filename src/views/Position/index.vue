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
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '职位管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('PositionResource_create'),
          hasEdit: checkPermission('PositionResource_update'),
          hasDelete: checkPermission('PositionResource_remove'),
          //hasView: checkPermission('PositionResource_get'),
          hasExportTpl: checkPermission('PositionResource_export'),
          hasExport: checkPermission('PositionResource_export'),
          hasImport: checkPermission('PositionResource_import'),

          url: '/positions',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          maxUploadCount: 1, //导出一次提交一个请求
          tplNoExportProps: ['操作', '修改时间', 'ID', '创建人', '状态'],
          exportFileName: '职位列表',


          columns: [
            {type: 'selection'},
            {prop: 'name', label: '职位名称', fixed: 'left', "min-width": 100},
            {prop: 'level', label: '岗位级别', "min-width": 100},
            phColumns.creator,
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
            {
              $type: 'input',
              $id: 'name',
              label: '职位名称',
              $el: {
                placeholder: '请输入职位名称',
                clearable: true,
                maxlength: "40",
                "show-word-limit": true,
              },
              rules: [
                validRules.required,
              ]
            },
            phFromItems.datadic("positionLevel", '岗位级别', '', "level"),
            phFromItems.status()
          ],
          //提交后执行
          afterConfirm: () => {
          }
        }
      }
    },
    computed: {},

    methods: {
      // 状态样式
      statusClassName({row}) {
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
