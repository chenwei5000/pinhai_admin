<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
      <div class="ph-card-body">
        <procurementTable
        @openEditDialog="openEditDialog"
        ></procurementTable>
      </div>
    </div>

    <editDialog
    ref="editDialog"
    ></editDialog>
  </div>
</template>

<script>

  import procurementTable from './components/table'
  import editDialog from './components/editDialog'

  export default {
    name: 'procurement',
    components: {
      procurementTable,
      editDialog
    },

    data() {
      return {
        title: '采购单列表'
      }
    },
    computed: {},
    methods: {
      openEditDialog(row) {
        console.log('openEditDialog ')
        this.$refs.editDialog.$emit('openDialog', row)
      }
    },
    watch: {}
  }
</script>

<style scoped>
  .ph-table {
    padding: 10px 15px;
  }
</style>
