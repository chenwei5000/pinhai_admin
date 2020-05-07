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

    <setting ref="setting">
    </setting>

  </div>
</template>

<script>
  import phColumns from '../../components/phColumns'
  import phFromItems from '../../components/phFromItems'
  import phSearchItems from '../../components/phSearchItems'
  import phEnumModel from '@/api/phEnum'
  import departmentModel from '@/api/department'
  import positionModel from '@/api/position'
  import userModel from '@/api/user'
  import validRules from '../../components/validRules'
  import {checkPermission} from "../../utils/permission";
  import setting from './components/setting'

  export default {
    name: 'UserResource_menu',
    components: {
      setting
    },

    data() {
      return {
        title: '用户管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('UserResource_create'),
          hasEdit: checkPermission('UserResource_update'),
          hasDelete: checkPermission('UserResource_remove'),
          // hasView: checkPermission('UserResource_get'),
          hasExportTpl: checkPermission('UserResource_export'),
          hasExport: checkPermission('UserResource_export'),
          hasImport: checkPermission('UserResource_import'),
          hasSetting: checkPermission('DataAuthorityResource_importData'),

          url: '/users',
          relations: ["creator", "department", "position", "parent"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //工具按钮

          tplNoExportProps: ['操作', '修改时间', '名称', 'ID', '创建人', '状态'],
          exportFileName: '用户列表',
          operationAttrs: {width: '130', fixed: 'right'},

          columns: [
            {width: 30,type: checkPermission('UserResource_remove') ? 'selection' : '', hidden: !checkPermission('UserResource_remove')},
            phColumns.id,
            {prop: 'account', label: '账号', "min-width": 200},
            {prop: 'name', label: '姓名', sortable: 'custom', "min-width": 100},
            {prop: 'department.allName', label: '部门', "min-width": 100},
            {prop: 'position.name', label: '职位', "min-width": 100},
            {prop: 'parent.name', label: '上级领导', "min-width": 100},
            {
              prop: 'phoneNo', label: '用户电话', "min-width": 150,
              formatter: row => {
                return row.phoneNo ? row.phoneNo.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3") : '';
              }
            },
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
            {
              prop: 'hide',
              label: '隐藏',
              width: 80,
              formatter: row => {
                let _status = phEnumModel.getSelectOptions("YesOrNo");
                let _label = '';
                _status.forEach(s => {
                  if (s.value === row.hide + '') {
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
              $type: 'input',
              $id: 'account',
              label: '账号',
              $el: {
                op: 'bw',
                size: "mini",
                placeholder: '请输入账号',
                clearable: true,
                maxlength: "40",
                "show-word-limit": true,
              }
            },
            phSearchItems.name,
            {
              $type: 'select',
              $id: 'status',
              label: '状态',
              $el: {
                op: 'eq',
                size: "mini",
                placeholder: '请选择状态'
              },
              $options: phEnumModel.getSelectOptions('UserStatus')
            }
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            {
              $type: 'input',
              $id: 'account',
              label: '账号',
              $el: {
                placeholder: '请输入用户账号',
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
              label: '姓名',
              $el: {
                placeholder: '请输入用户姓名',
                clearable: true,
                maxlength: "20",
                "show-word-limit": true,
              },
              rules: [
                validRules.required
              ],
            },
            {
              $type: 'select',
              $id: 'departmentId',
              label: "所在部门",
              $el: {
                placeholder: '请选择用户所在部门',
                filterable: true,
              },
              rules: [
                validRules.required
              ],
              $options: departmentModel.getSelectOptions()
            },
            {
              $type: 'select',
              $id: 'positionId',
              label: "职位",
              $el: {
                placeholder: '请选择用户职位',
                filterable: true,
              },
              rules: [],
              $options: positionModel.getSelectOptions()
            },
            {
              $type: 'select',
              $id: 'parentId',
              label: "上级领导",
              $el: {
                placeholder: '请选择用户的上级领导',
                filterable: true,
              },
              rules: [],
              $options: userModel.getSelectOptions(),
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
              $id: 'passwordText',
              label: '用户密码',
              $el: {
                placeholder: '请输入用户密码,不输入不修改'
              },
            },
            {
              $type: 'input',
              $id: 'config',
              label: '用户配置',
              $el: {
                placeholder: '请填写用户配置',
                type: "textarea"
              },
            },
            phFromItems.status(),
            {
              $type: 'radio-button',
              $id: 'hide',
              label: '隐藏',
              $el: {},
              $default: '0',
              $options: phEnumModel.getSelectOptions('YesOrNo')
            }
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
        this.$refs.setting.openDiaLog(row.id, row.name);
      }
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>

</style>
