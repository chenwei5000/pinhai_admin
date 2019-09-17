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
        title: '港口列表',
        tableConfig: {
          url: '/harbours',
          relations: ["creator"],
          tableAttrs: {
            "row-class-name": this.statusClassName,
          },
          columns: [
            {type: 'selection'},
            {prop: 'name', label: '名称', sortable: 'custom', 'min-width': 100, fixed: 'left'},
            {prop: 'location', label: '地址', sortable: 'custom', 'min-width': 100},
            {prop: 'creator.name', label: '创建人', width: 100},
            phColumns.status,
            phColumns.id,
            phColumns.lastModified
          ],

          searchForm: [
            phSearchItems.name,
            phSearchItems.status()
          ],
          form: [
            phFromItems.name(),
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
            phFromItems.status()
          ]
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
