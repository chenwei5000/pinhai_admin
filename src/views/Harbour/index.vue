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
  import {parseTime} from '@/utils'
  import validRules from '@/components/validrules'

  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {
    data() {
      return {
        title: '港口列表',
        tableConfig: {
          url: '/harbours',
          relations: ["creator"],
          tableAttrs: {
            stripe: true,
            border: true,
            "row-class-name": this.statusClassName,
            "highlight-current-row": true
          },
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 100, fixed: 'left'},
            {prop: 'location', label: '地址', sortable: 'custom' ,'min-width': 100},
            {prop: 'creator.name', label: '创建人', width: 100},
            phColumns.status,
            phColumns.lastModified
          ],

          searchForm: [
            phSearchItems.name,
            phSearchItems.status
          ],
          form: [
            phFromItems.name,
            {
              $type: 'input',
              $id: 'location',
              label: '港口地址',
              $el: {
                placeholder: '请输入港口地址'
              },
              rules: [
                validRules.required
              ]
            },
            phFromItems.status
          ]
        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row, rowIndex}) {
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
