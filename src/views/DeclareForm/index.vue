<template>
  <div class="app-container">
    <div class="ph-card">
      <div class="ph-card-body">
        111
      </div>
    </div>
  </div>
</template>

<script>
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        tableConfig: {
          url: '/declareConfigs',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          columns: [
            {width: 30,type: checkPermission('DeclareConfigResource_remove') ? 'selection' : '', hidden: !checkPermission('DeclareConfigResource_remove')},
            {prop: 'id', label: '报关码', "min-width": 100},
            {prop: 'name', label: '申报品名(中)', "min-width": 200},
            {prop: 'ename', label: '申报品名(英)', "min-width": 200},
            {prop: 'unit', label: '报关单位', "min-width": 120},
            {prop: 'tax', label: '税率', "min-width": 100},
            {prop: 'refundTax', label: '退税率', "min-width": 100},
            {prop: 'note', label: '报关备注', "min-width": 100},
            phColumns.creator,
            phColumns.status,
            phColumns.lastModified
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'input',
              $id: 'id',
              label: '报关码',
              $el: {
                op: 'in',
                size: "mini",
                placeholder: '请输入报关码',
                clearable: true,
              }
            },
            {
              $type: 'input',
              $id: 'name',
              label: '申报品名(中)',
              $el: {
                op: 'bw',
                placeholder: '请输入申报品名(中)',
                size:"mini",
                clearable: true,
                maxlength: "40",
                c: true,
              }
            },
            {
              $type: 'input',
              $id: 'ename',
              label: '申报品名(英)',
              $el: {
                op: 'bw',
                placeholder: '请输入申报品名(英)',
                size:"mini",
                style: 'height:25px',
                clearable: true,
                maxlength: "40",
                c: true,
              }
            },
          ],

        }
      }
    },
    computed: {},

    methods: {

    },

    // 观察data中的值发送变化后，调用
    watch: {}
  }
</script>

<style scoped>

</style>
