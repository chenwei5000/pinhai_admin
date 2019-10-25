<template>

  <el-card class="box-card" style="margin-top:10px;">

    <div slot="header">
      <svg t="1571910330207" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="44524" width="16" height="16"><path d="M1021.675 555.029V750.08c0 11.25-2.977 21.73-8.908 31.415-5.941 9.693-14.067 17.033-24.383 22.034L778.327 908.558c-7.817 4.373-16.726 6.565-26.724 6.565-10.007 0-18.915-2.19-26.724-6.565L514.825 803.529c-1.251-0.63-2.343-1.251-3.281-1.876-0.634 0.622-1.723 1.244-3.283 1.876L298.207 908.558c-7.817 4.373-16.726 6.565-26.725 6.565-10.006 0-18.915-2.19-26.724-6.565L34.704 803.529c-10.316-5.004-18.447-12.345-24.382-22.034-5.94-9.684-8.908-20.162-8.908-31.415V555.029c0-11.876 3.356-22.816 10.081-32.822 6.718-10.001 15.548-17.503 26.491-22.507l203.489-87.21V224.94c0-11.876 3.356-22.814 10.082-32.822 6.717-10 15.548-17.501 26.491-22.507l210.054-90.023c7.187-3.12 15.003-4.689 23.444-4.689 8.438 0 16.252 1.569 23.443 4.689l210.057 90.023c10.939 5.004 19.767 12.507 26.49 22.507 6.718 10.006 10.082 20.946 10.082 32.822v187.548l203.489 87.21c11.253 5.004 20.162 12.507 26.724 22.507 6.561 10.007 9.846 20.947 9.846 32.823z m-750.198 72.204l189.424-81.114-189.424-81.117-189.424 81.117 189.424 81.114z m30.008 212.872l180.048-90.023V602.855L301.485 679.75v160.356zM511.541 312.15l206.774-88.617-206.774-88.617-206.774 88.617 206.774 88.617z m30.007 177.705l180.047-77.365V287.771l-180.047 76.895v125.188z m210.054 137.378l189.424-81.114-189.424-81.117-189.423 81.117 189.423 81.114z m30.011 212.872l180.046-90.023V602.855L781.613 679.75v160.356z" p-id="44525" fill="#13227a"></path></svg>
      <span style="margin-left:10px;">库管</span>
    </div>

    <el-row :gutter="40" class="panel-group">

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <procurement-received :mine="mine"></procurement-received>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <allocation-received :mine="mine"></allocation-received>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <warehouse-allocation :mine="mine"></warehouse-allocation>
      </el-col>

      <el-col :xs="8" :sm="8" :lg="4" class="card-panel-col">
        <export :mine="mine"></export>
      </el-col>

    </el-row>

  </el-card>
</template>

<script>

  import AllocationReceived from "../panel/allocationReceived";
  import WarehouseAllocation from "../panel/warehouseAllocation";
  import ProcurementReceived from "../panel/procurementReceived";
  import Export from "../panel/export";

  export default {
    props: {
      mine: {
        type: Object,
      }
    },
    components: {
      Export,
      ProcurementReceived,
      WarehouseAllocation,
      AllocationReceived
    },
    methods: {}
  }
</script>

<style lang="scss" scoped>

  .panel-group {
    margin-top: 10px;

    .card-panel-col {
      margin-bottom: 15px;
      align-content: center;
      text-align: center;
    }

  }

</style>
