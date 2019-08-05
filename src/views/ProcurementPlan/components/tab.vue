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
            data: 0
          }
        }
        //执行中
        else if (this.type === 'executeing') {
          return {
            field: 'status',
            op: 'in',
            data: "2,3,4,5,6,7"
          }
        }
        else {
          return {
            field: 'status',
            op: 'in',
            data: 8
          }
        }
      }
    },
    methods: {
      onRefreshTable(){
        this.$refs.infoTable.onRefreshTable();
      }
    }
  }
</script>

