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

  export default {
    data() {
      return {
        title: '公司管理',
        tableConfig: {
          url: '/companyManagements',
          relations: ["dataDicItem","creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {type: 'selection'},
            phColumns.id,
            {
              prop: 'type', label: '类型',"min-width": 90,
              formatter: row => (row.type == 1 ? '本公司' :
                row.type == 2 ? '货代公司' :
                row.type == 3 ? '物流公司' :
                row.type == 4 ? '采购公司' :  row.type)
            },
            {prop: 'abbreviation', label: '简称', "min-width": 100},
            {prop: 'fullName', label: '全称', "min-width": 200},
            {prop: 'region', label: '管理区域', "min-width": 100},
            {prop: 'taxNumber', label: '纳税人识别号', "min-width": 120},
            {prop: 'contact', label: '联系人', "min-width": 100},
            {prop: 'phone', label: '联系人电话', "min-width": 100},
            {prop: 'address', label: '地址', "min-width": 200},
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.datadic("type",'类型','type'),
            phSearchItems.abbreviation,
            phSearchItems.datadic("region",'管理区域','region'),
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            phFromItems.datadicName("type", '公司类型','请选择', 'type'),
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
            phFromItems.datadic("region", '管理区域', '', 'region'),
            {
              $type: 'input',
              $id: 'contact',
              label: '联系人',
              $el: {
                placeholder: '请输入联系人'
              },
            },
            {
              $type: 'input',
              $id: 'phone',
              label: '联系人电话',
              $el: {
                placeholder: '请输入联系人电话'
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
