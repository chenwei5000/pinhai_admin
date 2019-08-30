<template>

  <orderTable v-if="isOrder" ref="infoTable" :type="type" :defaultFilters="filters"></orderTable>
  <infoTable v-else ref="infoTable" :type="type" :defaultFilters="filters"></infoTable>

</template>

<script>
  import infoTable from './table'
  import orderTable from './order/table'

  export default {
    components: {
      infoTable,
      orderTable
    },
    props: {
      type: {
        type: String,
        default: 'valid'
      }
    },
    computed: {
      isOrder() {
        if (this.type === 'completionDate' || this.type === 'orderExecuting') {
          return true;
        } else {
          return false;
        }
      },

      filters() {
        //待确认完成日期
        if (this.type === 'completionDate') {
          return {
            'field': 'status',
            op: 'in',
            data: "3, 4, 5"
          }
        }
        //待发货采购单
        if (this.type === 'orderExecuting') {
          return {
            'field': 'status',
            op: 'in',
            data: "6, 7"
          }
        }
        //待确认发货任务
        else if (this.type === 'executing') {
          return {
            field: 'status',
            op: 'in',
            data: "1,3"
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
            data: "5,6"
          }
        }
        //全部
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

