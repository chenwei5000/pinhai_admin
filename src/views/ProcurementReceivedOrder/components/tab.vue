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
        //待收货
        if (this.type === 'shipped') {
          return {
            'field': 'status',
            op: 'in',
            data: 4
          }
        }


        //已完成
        else if (this.type === 'complete') {
          return {
            field: 'status',
            op: 'in',
            data: 6
          }
        }
        else if (this.type === 'all') {
          return {
            field: 'status',
            op: 'in',
            data: "4,6"
          }
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

