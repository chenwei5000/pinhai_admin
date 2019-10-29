<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">
        <ph-table
          v-bind="tableConfig"
          @onSetting="onSetting"
        >
        </ph-table>
      </div>
    </div>

    <stockDialog ref="stockDialog">
    </stockDialog>

  </div>
</template>

<script>
  import phColumns from '../../components/phColumns'
  import phFromItems from '../../components/phFromItems'
  import phSearchItems from '../../components/phSearchItems'
  import datadicModel from '@/api/datadic'
  import validRules from '../../components/validRules'
  import {checkPermission} from "../../utils/permission";
  import stockDialog from './components/stockDialog'

  export default {
    components: {
      stockDialog
    },

    data() {
      return {
        title: '供货商管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('SupplierResource_create'),
          hasEdit: checkPermission('SupplierResource_update'),
          hasDelete: checkPermission('SupplierResource_remove'),
          hasSetting: checkPermission('SupplierStockResource_list'),

          url: '/suppliers',
          relations: ["company"],  // 关联对象
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //工具按钮
          operationAttrs: {width: '120', fixed: 'right'},

          columns: [
            {width: 30,type: checkPermission('SupplierResource_remove') ? 'selection' : '', hidden: !checkPermission('PositionResource_remove')},
            phColumns.id,
            {prop: 'code', label: '编码', "width": 100},
            {prop: 'name', label: '简称', "min-width": 150},
            {prop: 'companyName', label: '公司名称', "min-width": 200},
            {prop: 'city', label: '所在城市', "min-width": 100},
            {prop: 'region', label: '管理区域', "min-width": 100},
            {prop: 'address', label: '地址', "min-width": 200},
            {prop: 'linkman', label: '联系人', "min-width": 100},
            {prop: 'tel', label: '联系电话', "min-width": 100},
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            phSearchItems.datadic("region", "管理区域", "region"),
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'code',
              label: '编码',
              $el: {
                placeholder: '请输入供货商编码',
                clearable: true,
                maxlength: "40",
                "show-word-limit": true,
              },
              rules: [
                validRules.required
              ],
            },
            {
              $type: 'input',
              $id: 'name',
              label: '简称',
              $el: {
                placeholder: '请输入供货商简称',
                clearable: true,
                maxlength: "20",
                "show-word-limit": true,
              },
              rules: [
                validRules.required
              ],
            },
            {
              $type: 'input',
              $id: 'companyName',
              label: '公司名称',
              $el: {
                placeholder: '请输入供货商公司名称',
                clearable: true,
                maxlength: "100",
                "show-word-limit": true,
              },
              rules: [
                validRules.required
              ],
            },
            {
              $type: 'input',
              $id: 'city',
              label: '所在城市',
              $el: {
                placeholder: '请输入供货商所在城市',
                clearable: true,
                maxlength: "100",
                "show-word-limit": true,
              },
              rules: [
                validRules.required
              ],
            },
            {
              $type: 'select',
              $id: 'region',
              label: '管理区域',
              $el: {
                filterable: true,
                placeholder: '我们采购团队所在的区域，如：深圳'
              },
              rules: [
                validRules.required
              ],
              $options: datadicModel.getSelectOptions('region')
            },
            {
              $type: 'input',
              $id: 'address',
              label: '地址',
              $el: {
                placeholder: '请输入供货商地址',
                clearable: true,
                maxlength: "200",
                "show-word-limit": true,
              },
              rules: [],
            },
            {
              $type: 'input',
              $id: 'linkman',
              label: '联系人',
              $el: {
                placeholder: '请输入供货商联系人',
                clearable: true,
                maxlength: "100",
                "show-word-limit": true,
              },
              rules: [],
            },
            {
              $type: 'input',
              $id: 'tel',
              label: '联系电话',
              $el: {
                placeholder: '请输入供货商联系电话',
                clearable: true,
                maxlength: "100",
                "show-word-limit": true,
              },
              rules: [],
            },
            phFromItems.status(),
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
      onSetting(row) {
        this.$refs.stockDialog.openDialog(row.id, row.name);
      }
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>

</style>
