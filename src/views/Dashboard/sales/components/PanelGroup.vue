<template>
  <el-card class="box-card">
    <div slot="header">
      <svg-icon icon-class="steamship"/>
      <span style="margin-left:10px;">货柜/库存安全</span>
    </div>

    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <newSteamship :searchParam="searchParam"></newSteamship>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <overdueSteamship :searchParam="searchParam"></overdueSteamship>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <inventorySteamship :searchParam="searchParam"></inventorySteamship>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" v-if="false">
        <stockAlert :searchParam="searchParam"></stockAlert>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <unfinishedMaterial :mine="searchParam"></unfinishedMaterial>
      </el-col>

    </el-row>
  </el-card>
</template>

<script>
  import newSteamship from '../../components/panel/newSteamship'
  import overdueSteamship from '../../components/panel/overdueSteamship'
  import inventorySteamship from '../../components/panel/inventorySteamship'
  import stockAlert from '../../components/panel/stockAlert'
  import unfinishedMaterial from '../../components/panel/unfinishedMaterial'

  export default {
    props: {
      searchParam: {
        type: Object,
        default: {merchantId: null, categoryId: null, week: 20}
      }
    },
    components: {
      newSteamship,
      overdueSteamship,
      inventorySteamship,
      stockAlert,
      unfinishedMaterial
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>
  .panel-group {
    margin-top: 10px;

    .card-panel-col {
      margin-bottom: 32px;
    }
  }
</style>
