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

  export default {
    data() {
      return {
        title: '公司管理',
        tableConfig: {
          url: '/companyManagements',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'abbreviation', label: '简称', sortable: 'custom', "min-width": 135, },
            {prop: 'fullName', label: '全称', sortable: 'custom', "min-width": 120},
            {prop: 'address', label: '地址', "min-width": 120},
            {prop: 'region', label: '区域', "min-width": 120},
            {prop: 'contact', label: '联系人', "min-width": 120},
            {prop: 'phone', label: '联系人电话', "min-width": 120},
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.region,
            phSearchItems.contact,
            phSearchItems.status()
          ],

          //  弹窗表单,用于新增和修改
          form: [
            phFromItems.name,
            {
              $type: 'input',
              $id: 'abbreviation',
              label: '简称',
              $el: {
                placeholder: '请输入公司简称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'fullName',
              label: '全称',
              $el: {
                placeholder: '请输入公司全称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'address',
              label: '地址',
              $el: {
                placeholder: '请输入公司地址'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'region',
              label: '区域',
              $el: {
                placeholder: '请输入公司所在区域'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'contact',
              label: '联系人',
              $el: {
                placeholder: '请输入公司联系人'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'input',
              $id: 'phone',
              label: '联系人电话',
              $el: {
                placeholder: '请输入公司联系人电话'
              },
              rules: [
                validRules.required,
                validRules.strMax(13)
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
    methods: {
      // 状态样式
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      }
    },
    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>


</style>
