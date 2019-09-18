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
        if (this.type === 'all') {
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

