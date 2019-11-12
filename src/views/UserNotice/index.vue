<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">
        <ph-table
          v-bind="tableConfig"
          @onSetting="onSetting"
          @onView="onView"
          ref="phTable"
        >
        </ph-table>
      </div>
    </div>

    <viewDialog ref = "viewDialog"></viewDialog>
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
  import viewDialog from './components/dialog'
  import {parseTime} from '@/utils'

  export default {
    components: {
      viewDialog
    },

    data() {
      return {
        title: '用户管理',
        tableConfig: {
          //权限控制
          hasNew: false,
          hasEdit: false,
          hasDelete: false,
          hasView: true,
          hasExportTpl: false,
          hasExport: checkPermission('UserResource_export'),
          hasImport: false,
          hasSetting: true,

          url: '/userNotices',
          relations: ["creator", "notice", "notice.sender", "user", ],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //工具按钮

          tplNoExportProps: ['操作', '修改时间', '名称', 'ID', '创建人', '状态'],
          exportFileName: '用户消息列表',
          operationAttrs: {width: '130', fixed: 'right'},

          columns: [
            phColumns.id,
             {
              prop: 'isReadName',
              label: '状态',
              width: 80,
            },
            { prop: 'createTime', sortable:'custom',label: '接受时间', width: 140,
              formatter: row => {
                try {
                  return parseTime(row.createTime, '{y}-{m}-{d} {h}:{i}:{s}');
                }
                catch (e) {
                  return row.createTime;
                }
              }
             },
            {prop: 'notice.title', label: '标题', "min-width": 200},
            {prop: 'notice.targetType', label: '目标类型', sortable: 'custom', "min-width": 150},
            {prop: 'notice.senderName', label: '发送者', "min-width": 50},
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'select',
              $id: 'isRead',
              label: '状态',
              $el: {
                op: 'eq',
                size: "mini",
                placeholder: '请选择状态'
              },
              $options:  [{
                    value: '0',
                    label: '未处理'
                  }, {
                    value: '1',
                    label: '已完成'
                  }, 
                  ]
            }
          ],
          //  弹窗表单, 用于新增与修改
          form: [],
          //提交后执行
          afterConfirm: () => {
          }
        }
      }
    },

    computed: {
      hasComplete(){

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
      },
      onSetting(row) {
          if (row.isRead === 1){
            this.$message.warning("该消息已经完成！")
            return;
          }
          this.$confirm('确认该任务已经完成了吗?', '提示', {
          type: 'warning',
          beforeClose: (action, instance, done) => {
            if (action == 'confirm') {
              instance.confirmButtonLoading = true;
              this.doComplete(row, instance, done);

            } else {
              instance.confirmButtonLoading = false;
              done()
            }
          }
        }).catch(er => {
          console.log(er)
          /*取消*/
        })
      }, 
      onView(row) {
        this.$refs.viewDialog.openDialog(row);
      },

       // 完成任务
      doComplete(val, instance, done) {
        if (val && val.id) {
          this.global.axios
            .put('/userNotices' + '/read/' + val.id)
            .then(res => {
              instance.confirmButtonLoading = false;
              done();
              this.$refs.phTable.getList();
            })
            .catch(er => {
              done();
              instance.confirmButtonLoading = false
            })
        }
      },
    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>

</style>
