<template>
  <el-card class="box-card">
    <div slot="header">
      <i class="el-icon-user" />
      <span style="margin-left:10px;">控制台</span>
    </div>

    <el-row :gutter="20" class="panel-group">
      <h3 style="text-align: center;width: 100%;">欢迎访问品海ERP2.0系统！</h3>
    </el-row>
  </el-card>
</template>

<script>
  import todoOrder from '../../components/panel/procurementOrder'
  import todoSettlement from '../../components/panel/procurementSettlement'
  import unfinishedProduct from '../../components/panel/unfinishedProduct'
  import unfinishedMaterial from '../../components/panel/unfinishedMaterial'

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
