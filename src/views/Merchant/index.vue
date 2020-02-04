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
  import phFromItems from '../../components/phFromItems'
  import countryModel from '../../api/country'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: '渠道管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('MerchantResource_create'),
          hasEdit: checkPermission('MerchantResource_update'),
          hasDelete: checkPermission('MerchantResource_remove'),
          // hasView: checkPermission('MerchantResource_get'),
          hasExportTpl: checkPermission('MerchantResource_export'),
          hasExport: checkPermission('MerchantResource_export'),
          hasImport: checkPermission('MerchantResource_import'),

          url: '/merchants',
          relations: ["country"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //列表
          columns: [
            {prop: 'code', label: '编码', 'min-width': 100},
            {prop: 'typeName', label: '类型', 'min-width': 100},
            {prop: 'name', label: '名称', 'min-width': 100},
            {prop: 'country.name', label: '国家', 'min-width': 100},
            {prop: 'address', label: '地址', 'width': 250},
            {prop: 'linkman', label: '联系人', 'min-width': 100},
            {prop: 'tel', label: '联系电话', 'min-width': 100},
            phColumns.status,
          ],
          //搜索
          searchForm: [],
          form: [
            {
              $type: 'input',
              $id: 'code',
              label: '编码',
              $el: {
                placeholder: '请输入编码'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'type',
              label: '类型',
              $options: [{
                label: '亚马逊平台',
                value: "Amazon"
              }],
              $el: {
                placeholder: '请输入类型'
              },
            },
            {
              $type: 'input',
              $id: 'name',
              label: '名称',
              $el: {
                placeholder: '请输入名称'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'select',
              $id: 'countryId',
              label: '国家',
              $options: countryModel.getSelectOptions(),
              $el: {
                placeholder: '请选择'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'input',
              $id: 'address',
              label: '地址',
              $el: {
                placeholder: '请输入地址'
              },
            },
            {
              $type: 'input',
              $id: 'linkman',
              label: '联系人',
              $el: {
                placeholder: '请输入联系人'
              },
            },
            {
              $type: 'input',
              $id: 'tel',
              label: '联系电话',
              $el: {
                placeholder: '请输入联系电话'
              },
            },
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
