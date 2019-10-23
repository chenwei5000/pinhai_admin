<template>
  <el-card class="box-card">
    <div slot="header">
      <svg-icon icon-class="steamship"/>
      <span style="margin-left:10px;">采购相关</span>
    </div>

    <el-row :gutter="20" class="panel-group">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <todoOrder :mine="mine"></todoOrder>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <todoSettlement :mine="mine"></todoSettlement>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <unfinishedProduct :mine="mine"></unfinishedProduct>
      </el-col>

      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <unfinishedMaterial :mine="mine"></unfinishedMaterial>
      </el-col>

    </el-row>
  </el-card>
</template>

<script>
  import todoOrder from './panel/todoOrder'
  import todoSettlement from './panel/todoSettlement'
  import unfinishedProduct from './panel/unfinishedProduct'
  import unfinishedMaterial from './panel/unfinishedMaterial'

  export default {
    props: {
      mine: {
        type: Object,
        default: {merchantId: '', categoryId: '', week: '20'}
      }
    },
    components: {
      todoOrder,
      todoSettlement,
      unfinishedProduct,
      unfinishedMaterial,
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
