<template>

  <infoTable ref="infoTable" :type="type" :defaultFilters="filters"></infoTable>

</template>

<script>
  import infoTable from './table'

  export default {
    components: {
      infoTable
    },
    props: {
      type: {
        type: String,
        default: 'valid'
      }
    },
    computed: {
      // TODO: 设置默认的搜索条件
      filters() {
        if (this.type === 'inventoryLosses') {
          return {
            'field': 'type',
            op: 'eq',
            data: 1
          }
        }
        else if (this.type === 'inventorySurplus') {
          return {
            field: 'type',
            op: 'eq',
            data: 2
          }
        }
        else if (this.type === 'all') {
          return {}
        }
      }
    },
    methods: {
      onRefreshTable() {
        this.$refs.infoTable.onRefreshTable();
      }
    }
  }
</script>
