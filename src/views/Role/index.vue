<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
      <div class="ph-card-body">
        <roleTable></roleTable>
      </div>
    </div>
  </div>
</template>

<script>

  import roleTable from './components/table'

  export default {
    name: 'roleMgr',
    components: {
      roleTable
    },

    data() {
      return {
        title: '角色管理'
      }
    },
    computed: {},
    methods: {},
    watch: {}
  }
</script>

<style scoped>
  .ph-table {
    padding: 10px 15px;
  }
</style>
