<template>

  <planTable :type="type" :defaultFilters="filters"></planTable>

</template>

<script>
  import planTable from './table'

  export default {
    components: {
      planTable
    },
    props: {
      type: {
        type: String,
        default: 'valid'
      }
    },
    computed: {
      filters() {
        //编辑中
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
    methods: {}
  }
</script>

