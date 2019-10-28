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

  import phEnumModel from '../../api/phEnum'
  import userModel from '../../api/user'
  import harbourModel from '../../api/harbour'
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFormItems from '../../components/phFromItems'
  import {checkPermission} from '@/utils/permission'


  export default {
    data() {
      return {
        title: '分类列表',
        tableConfig: {
          url: '/categories',
          //权限控制
          hasNew: checkPermission('CategoryResource_create'),
          hasEdit: checkPermission('CategoryResource_update'),
          hasDelete: checkPermission('CategoryResource_remove'),
          //hasView: checkPermission('CategoryResource_get'),
          hasExportTpl: checkPermission('CategoryResource_export'),
          hasExport: checkPermission('CategoryResource_export'),
          hasImport: checkPermission('CategoryResource_import'),

          relations: ["creator", "user", "dataDicItem.type", "harbour"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          //列表
          columns: [
            {type: checkPermission('CategoryResource_remove') ? 'selection' : '', hidden: !checkPermission('CategoryResource_remove')},
            {prop: 'name', label: '分类名称', 'min-width': 100, fixed: 'left'},
            {prop: 'materialName', label: '类型', width: 100},
            {prop: 'user.name', label: '采购负责人', width: 100},
            {prop: 'harbour.name', label: '默认发货港口', width: 100},
            {
              prop: 'needMaterial',
              label: '产品必须设置原材料',
              'label-class-name': 'ph-header-small',
              formatter: row => {
                let _status = phEnumModel.getSelectOptions("YesOrNo");
                let _label = '';
                _status.forEach(s => {
                  if (s.value === row.needMaterial + '') {
                    _label = s.label;
                    return;
                  }
                });
                return _label;
              },
              width: 150
            },
            phColumns.creator,
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],
          // 搜索
          searchForm: [
            phSearchItems.name,
            phSearchItems.datadic("materialName", "类型", "material"),
            phSearchItems.status()
          ],
          //修改或新增
          form: [
            phFormItems.datadic("materialName", "类型", '请选择', "material"),
            {
              $type: 'input',
              $id: 'name',
              label: '分类名称',
              $el: {
                size: "mini",
                placeholder: '请输入分类名称'
              },
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'userId',
              label: '采购负责人',
              $el: {
                size: "mini",
                placeholder: '请选择采购负责人,可筛选',
                filterable: true
              },
              $options: userModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            {
              $type: 'select',
              $id: 'harbourId',
              label: '默认发货港口',
              $el: {
                size: "mini",
                placeholder: '请选择港口,可筛选',
                filterable: true
              },
              $options: harbourModel.getSelectOptions(),
              rules: [
                validRules.required
              ]
            },
            phFormItems.yesOrNo('needMaterial', '产品必须设置原材料'),
            phFormItems.status()
          ],
          formAttrs: {
            "label-width": "170px"
          },
          //提交后执行
          afterConfirm: () => {
            this.$store.commit('app/SET_CATEGORIES', null);
          }
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
