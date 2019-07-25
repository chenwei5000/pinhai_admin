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
        title: '用户管理',
        tableConfig: {
          url: '/users',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '用户姓名',"min-width": 100},
            {prop: 'account', label: '用户账号', "min-width": 100},
            {prop: 'job', label: '职位描述', "min-width": 100},
            {prop: 'phoneNo', label: '用户电话', "min-width": 100},
            {prop: 'password', label: '用户密码', "min-width": 100},
            {prop: 'config', label: '用户配置', "min-width": 100},

            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'name',
              label: '用户姓名',
              $el: {
                placeholder: '请输入用户姓名'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'input',
              $id: 'account',
              label: '用户账号',
              $el: {
                placeholder: '请输入用户账号'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'input',
              $id: 'job',
              label: '职位描述',
              $el: {
                placeholder: '请填写职位描述'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'input',
              $id: 'phoneNo',
              label: '联系方式',
              $el: {
                placeholder: '请输入用户手机号/电话'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'input',
              $id: 'password',
              label: '用户密码',
              $el: {
                placeholder: '请输入用户密码'
              },
              rules: [
                validRules.required,
              ]
            },
            {
              $type: 'input',
              $id: 'config',
              label: '用户配置',
              $el: {
                placeholder: '请填写用户配置'
              },
              rules: [
                validRules.required,
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
