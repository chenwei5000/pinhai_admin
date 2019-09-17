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

  import supplierModel from '../../api/supplier'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import userModel from '../../api/user'

  export default {
    data() {
      return {
        title: '仓库管理',
        tableConfig: {
          url: '/warehouses',
          relations: ["supplier", "creator", "leader"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          columns: [
            {type: 'selection'},
            {prop: 'code', label: '编码', 'min-width': 200},
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 200, fixed: 'left'},
            {prop: 'address', label: '地址', 'min-width': 150},
            {prop: 'linkman', label: '联系人', width: 100},
            {prop: 'tel', label: '联系电话', width: 125},
            {prop: 'type', label: '类型'},
            {prop: 'supplierId', label: '供货商编号', hidden: true},
            {prop: 'supplier.name', label: '供货商名称', 'min-width': 150},
            {prop: 'leader.name', label: '负责人', 'min-width': 150},
            phColumns.creator,
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'input',
              $id: 'name',
              label: '名称',
              $el: {
                op: 'bw',
                placeholder: '请输入名称',
                clearable: true,
                maxlength: "40",
                size:"mini",
                style: "width:120px;",
                "show-word-limit": true,
              }
            },
            {
              $type: 'input',
              $id: 'code',
              label: '编码',
              $el: {
                op: 'bw',
                size:"mini",
                placeholder: '请输入编码',
                style: "width:120px;",
                clearable: true
              }
            },
            phSearchItems.datadic('warehouse', '类型', 'type'),
            {
            $type: 'select',
            $id: 'leaderId',
            label: '负责人',
            $el: {
              op: 'eq',
              placeholder: '请输入负责人',
              style: "width:120px;",
              filterable: true,
              size:"mini",
              maxlength: "40",
              "show-word-limit": true,
            },
          $options: userModel.getSelectOptions
          },
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            phFromItems.code,
            phFromItems.name(),
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
            phFromItems.datadic('warehouse', '类型', '', 'type'),
            {
              $type: 'select',
              $id: 'supplierId',
              label: '供货商',
              $el: {
                filterable: true,
                placeholder: '请选择供货商'
              },
              $options: supplierModel.getSelectOptions(),
            },
             {
              $type: 'select',
              $id: 'leaderId',
              label: '负责人',
              $el: {
                filterable: true,
                placeholder: '请选择负责人'
              },
              $options: userModel.getSelectOptions(),
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
