<template>


  <warehouseTable ref="warehouseTable" :type="type" :v-if="type=='warehouse'"></warehouseTable>

</template>

<script>
  import warehouseTable from './warehouseTable'

  export default {
    components: {
      warehouseTable
    },
    props: {
      type: {
        type: String,
        default: 'warehouse'
      }
    },
    computed: {},
    methods: {
      onRefreshTable() {
        //this.$refs.warehouseTable.onRefreshTable();
      }
    }
  }
</script>

