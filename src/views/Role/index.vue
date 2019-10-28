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

    <roleList ref="roleList">
    </roleList>
  </div>
</template>

<script>

  import phColumns from '../../components/phColumns'
  import phFromItems from '../../components/phFromItems'
  import phSearchItems from '../../components/phSearchItems'
  import phEnumModel from '@/api/phEnum'
  import validRules from '../../components/validRules'
  import {checkPermission} from "../../utils/permission";
  import roleList from './components/roleList'

  export default {
    name: 'roleMgr',
    components: {
      roleList
    },

    data() {
      return {
        title: '角色管理',
        tableConfig: {
          //权限控制
          hasNew: checkPermission('UserResource_create'),
          hasEdit: checkPermission('UserResource_update'),
          hasDelete: checkPermission('UserResource_remove'),
          //hasImport: checkPermission('UserResource_import'),

          url: '/roles',
          relations: [],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //工具按钮
          hasSetting: true,
          operationAttrs: {width: '120', fixed: 'right'},

          columns: [
            {type: checkPermission('UserResource_remove') ? 'selection' : '', hidden: !checkPermission('UserResource_remove')},
            phColumns.id,
            {prop: 'name', label: '名称', sortable: 'custom', "min-width": 100},
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            phSearchItems.name,
            phSearchItems.status()
          ],
          //  弹窗表单, 用于新增与修改
          form: [
            phFromItems.name(),
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
      onSetting(row) {
        this.$refs.roleList.openDiaLog(row.id, row.name);
      }
    },
    watch: {}
  }
</script>

<style scoped>
  .ph-table {
    padding: 10px 15px;
  }
</style>
