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
        filters() {
        //待确认发货任务
        if (this.type === 'executing') {
          return {
            field: 'status',
            op: 'in',
            data: "1, 2, 3"
          }
        }
        //待收货
        else if (this.type === 'shipped') {
          return {
            field: 'status',
            op: 'in',
            data: 4
          }
        }
        //完成
        else if (this.type === 'complete') {
          return {
            field: 'status',
            op: 'in',
            data: "5, 6"
          }
        }
        //全部
        else if (this.type === 'all') {
          return {}
        }
    },
      },

    
    methods: {
      onRefreshTable() {
        this.$refs.infoTable.onRefreshTable();
      }
    }
  }
</script>

