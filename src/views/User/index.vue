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
  import phEnumModel from '@/api/phEnum'

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

            {
    prop: 'status',
    label: '状态',
    width: 80,
    formatter: row => {
      let _status = phEnumModel.getSelectOptions("UserStatus");
      let _label = '';
      _status.forEach(s => {
        if (s.value === row.status + '') {
          _label = s.label;
          return;
        }
      });
      return _label;
    }
  },
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'select',
              $id: 'status',
              label: '状态',
              $el: {
                op: 'eq',
                placeholder: '请选择状态'
              },
          $options: phEnumModel.getSelectOptions('UserStatus')
    },
            phSearchItems.name,
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
            },
            {
              $type: 'input',
              $id: 'account',
              label: '用户账号',
              $el: {
                placeholder: '请输入用户账号'
              },
            },
            {
              $type: 'input',
              $id: 'job',
              label: '职位描述',
              $el: {
                placeholder: '请填写职位描述'
              },
            },
            {
              $type: 'input',
              $id: 'phoneNo',
              label: '联系方式',
              $el: {
                placeholder: '请输入用户手机号/电话'
              },
            },
            {
              $type: 'input',
              $id: 'password',
              label: '用户密码',
              $el: {
                placeholder: '请输入用户密码'
              },
            },
            {
              $type: 'input',
              $id: 'config',
              label: '用户配置',
              $el: {
                placeholder: '请填写用户配置'
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
