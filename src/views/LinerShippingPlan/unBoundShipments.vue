<template>
  <div class="app-container">
    <div class="ph-card">
      <ph-card-header :title="title" type="table">
      </ph-card-header>
      <div class="ph-card-body">
        <ph-table
          v-bind="tableConfig"
        >
        </ph-table>
      </div>
    </div>
  </div>
</template>

<script>
  import validRules from '../../components/validRules'
  import phColumns from '../../components/phColumns'
  import phSearchItems from '../../components/phSearchItems'
  import phFromItems from '../../components/phFromItems'

  export default {
    data() {
      return {
        title: '未绑定Amazon货柜',
        tableConfig: {
          url: 'linerShippingPlans/unBoundShipments',
          countUrl: "",
          hasPagination: false,
          relations: [""],
          hasDelete: false,
          hasOperation: false,
          hasNew: false,
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //列表
          columns: [
            {type: 'selection'},
            phColumns.id,
            {prop: 'shipmentId', label: 'Shipment ID', 'min-width': 100},
            {prop: 'shipmentStatus', label: '状态', 'min-width': 100},
            {prop: 'shipmentName', label: '名称', 'min-width': 100},
            {prop: 'destinationFulfillmentCenterId', label: '收货仓库', 'min-width': 100},
          ],
          //搜索
          searchForm: [
             //
          ],
          form: [
            
          ]
        }
      }
    },
    computed: {},
    methods: {
      statusClassName({row}) {
        if (row.status && row.status !== 0) {
          return '';
        }
        else {
          return 'warning-row';
        }
      },
    },
    watch: {}
  }
</script>

<style scoped>


</style>
