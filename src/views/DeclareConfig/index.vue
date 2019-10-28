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
        title: '报关配置',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('DeclareConfigResource_create'),
          hasEdit: checkPermission('DeclareConfigResource_update'),
          hasDelete: checkPermission('DeclareConfigResource_remove'),
          // hasView: checkPermission('DeclareConfigResource_get'),
          hasExportTpl: checkPermission('DeclareConfigResource_export'),
          hasExport: checkPermission('DeclareConfigResource_export'),
          hasImport: checkPermission('DeclareConfigResource_import'),

          url: '/declareConfigs',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {type: checkPermission('DeclareConfigResource_remove') ? 'selection' : '', hidden: !checkPermission('DeclareConfigResource_remove')},
            {prop: 'id', label: '报关码', "min-width": 100},
            {prop: 'name', label: '申报品名(中)', "min-width": 200},
            {prop: 'ename', label: '申报品名(英)', "min-width": 200},
            {prop: 'unit', label: '报关单位', "min-width": 120},
            {prop: 'tax', label: '税率', "min-width": 100},
            {prop: 'refundTax', label: '退税率', "min-width": 100},
            {prop: 'note', label: '报关备注', "min-width": 100},
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'input',
              $id: 'id',
              label: '报关码',
              $el: {
                op: 'in',
                size: "mini",
                placeholder: '请输入报关码',
                clearable: true,
              }
            },
            {
              $type: 'input',
              $id: 'name',
              label: '申报品名(中)',
              $el: {
                op: 'bw',
                placeholder: '请输入申报品名(中)',
                size:"mini",
                clearable: true,
                maxlength: "40",
                c: true,
              }
            },
            {
              $type: 'input',
              $id: 'ename',
              label: '申报品名(英)',
              $el: {
                op: 'bw',
                placeholder: '请输入申报品名(英)',
                size:"mini",
                style: 'height:25px',
                clearable: true,
                maxlength: "40",
                c: true,
              }
            },
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'id',
              label: '报关码',
              $el: {
                placeholder: '请输入报关码，以HS开头',
                maxlength: "15",
                "show-word-limit": true,
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'name',
              label: '申报品名(中)',
              $el: {
                placeholder: '请输入申报品名(中文)'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'ename',
              label: '申报品名(英)',
              $el: {
                placeholder: '请输入申报品名(英文)'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'unit',
              label: '报关单位',
              $el: {
                placeholder: '请输入报关单位，例如：箱、件'
              },
            },
            {
              $type: 'input',
              $id: 'tax',
              label: '税率',
              $el: {
                placeholder: '请输入税率（%）'
              },
            },
            {
              $type: 'input',
              $id: 'refundTax',
              label: '退税率',
              $el: {
                placeholder: '请输入退税率（%）'
              },
            },
            {
              $type: 'input',
              $id: 'note',
              label: '报关备注',
              $el: {
                placeholder: '请输入报关备注'
              },
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
