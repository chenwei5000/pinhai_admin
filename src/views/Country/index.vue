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
    name: 'CountryResource_menu',
    data() {
      return {
        title: '国家列表',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('CountryResource_create'),
          hasEdit: checkPermission('CountryResource_update'),
          hasDelete: checkPermission('CountryResource_remove'),
          // hasView: checkPermission('CountryResource_get'),
          hasExportTpl: checkPermission('CountryResource_export'),
          hasExport: checkPermission('CountryResource_export'),
          hasImport: checkPermission('CountryResource_import'),

          url: '/countries',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {width: 30,type: checkPermission('CountryResource_remove') ? 'selection' : '', hidden: !checkPermission('CountryResource_remove')},
            {prop: 'name', label: '名称', sortable: 'custom', "min-width": 120, fixed: 'left'},
            {prop: 'enName', label: '英文名', sortable: 'custom', "min-width": 120},
            {prop: 'isoCode2', label: '2位iso编码', "min-width": 120},
            {prop: 'isoCode3', label: '3位iso编码', "min-width": 120},
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
          //  弹窗表单
          form: [
            phFromItems.name(),
            {
              $type: 'input',
              $id: 'enName',
              label: '国家英文名',
              $el: {
                placeholder: '请输入国家英文名'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'isoCode2',
              label: '2位iso编码',
              $el: {
                placeholder: '请输入国家2位iso编码'
              },
              rules: [
                validRules.required,
                validRules.strMax(2)
              ]
            },
            {
              $type: 'input',
              $id: 'isoCode3',
              label: '3位iso编码',
              $el: {
                placeholder: '请输入国家3位iso编码'
              },
              rules: [
                validRules.required,
                validRules.strMax(3)
              ]
            },
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
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      }
    },
    watch: {}
  }
</script>

<style scoped>


</style>
