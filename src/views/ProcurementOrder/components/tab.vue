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
        if (this.type === 'editing') {
          return {
            'field': 'status',
            op: 'in',
            data: 1
          }
        }
        //待审核
        else if (this.type === 'auditing') {
          return {
            field: 'status',
            op: 'in',
            data: 2
          }
        }
        //执行中
        else if (this.type === 'executing') {
          return {
            field: 'status',
            op: 'in',
            data: "3,4,5,6,7,8,9,10,11"
          }
        }
        else if (this.type === 'complete') {
          return {
            field: 'status',
            op: 'in',
            data: 11
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

