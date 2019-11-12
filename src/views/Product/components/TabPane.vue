<template>

  <productTable :type="type" :defaultFilters="filters"></productTable>

</template>

<script>
  import productTable from './table'

  export default {
    components: {
      productTable
    },
    props: {
      type: {
        type: String,
        default: 'valid'
      }
    },
    computed: {
      filters() {
        if (this.type === 'invalid') {
          return {
            'field': 'status',
            op: 'in',
            data: 0
          }
        }
        else {
          return {
            'field': 'status',
            op: 'in',
            data: 1
          }
        }
      }
    },
    methods: {}
  }
</script>

