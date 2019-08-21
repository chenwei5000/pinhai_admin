<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
      <div class="ph-card-body">
        <roleTable
        @openRoleList="openRoleList"
        ></roleTable>
      </div>
    </div>

    <roleList
    ref="roleList"
    >
    </roleList>
  </div>
</template>

<script>

  import roleTable from './components/table'
  import roleList from './components/roleList'

  export default {
    name: 'roleMgr',
    components: {
      roleTable,
      roleList
    },

    data() {
      return {
        title: '角色管理'
      }
    },
    computed: {},
    methods: {
      openRoleList(id, name) {
        this.$refs.roleList.$emit('openDiaLog', id, name)
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
