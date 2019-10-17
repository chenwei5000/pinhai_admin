<template>

  <infoTable ref="infoTable" :type="type"></infoTable>

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
    computed: {},
    methods: {
      onRefreshTable() {
        this.$refs.infoTable.onRefreshTable();
      }
    }
  }
</script>

