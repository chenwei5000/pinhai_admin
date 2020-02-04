<template>
  <div class="app-container">
    <div class="ph-card">
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
  import {checkPermission} from "../../utils/permission";

  export default {
    data() {
      return {
        title: 'Amazon Fulfilled Shipments',
        tableConfig: {
          //权限控制
          hasNew: false,
          hasEdit: false,
          hasDelete: false,
          hasExportTpl: checkPermission('AmazonFulfillmentReportResource_list'),
          hasExport: checkPermission('AmazonFulfillmentReportResource_list'),
          hasImport: false,
          url: '/amazonFulfillmentReports?filters='+JSON.stringify({"groupOp":"AND","rules":[{"field":"salesChannel","op":"bw","data": "Non-Amazon" }]}),
          countUrl: '#/amazonFulfillmentReports/count?filters='+JSON.stringify({"groupOp":"AND","rules":[{"field":"salesChannel","op":"bw","data": "Non-Amazon" }]}),
          defalutSort: "&sort=shipmentDate&dir=desc",
          relations: null,
          tableAttrs: {
            "row-class-name": this.statusClassName
          },
          //表格内容显示
          columns: [
            {prop: 'shipmentId', label: 'Shipment Id',  "width": 120, fixed: 'left'},
            {prop: 'amazonOrderId', label: 'Amazon Order Id',  "width": 150},
            {prop: 'merchantOrderId', label: 'Merchant Order Id', "width": 120},
            {prop: 'productName', label: 'Product Name', "width": 250},
            {prop: 'sku', label: 'SKU', "width": 120},
            {prop: 'quantityShipped', label: 'Quantity', "width": 120},
            {prop: 'formatShipmentDate', label: 'Shipment Date', "width": 120},
            {prop: 'carrier', label: 'Carrier', 'width': 120},
            {prop: 'trackingNumber', label: 'Tracking Number', "width": 120,  fixed: 'right'}
          ],

          // 搜索区块定义
          searchForm: [
            {
              $type: 'input',
              $id: 'shipmentId',
              label: 'Shipment Id',
              $el: {
                op: 'eq',
                size: "mini",
                placeholder: '请输入Shipment Id',
                clearable: true,
                "show-word-limit": true,
              }
            },
            {
              $type: 'input',
              $id: 'amazonOrderId',
              label: 'Amazon Order Id',
              $el: {
                op: 'eq',
                size: "mini",
                placeholder: '请输入Amazon Order Id',
                clearable: true,
                "show-word-limit": true,
              }
            },
            {
              $type: 'input',
              $id: 'merchantOrderId',
              label: 'Merchant Order Id',
              $el: {
                op: 'eq',
                size: "mini",
                placeholder: '请输入Merchant Order Id',
                clearable: true,
                "show-word-limit": true,
              }
            },
            {
              $type: 'input',
              $id: 'sku',
              label: 'SKU',
              $el: {
                op: 'eq',
                size: "mini",
                placeholder: '请输入SKU',
                clearable: true,
                "show-word-limit": true,
              }
            },
            {
              $type: 'input',
              $id: 'trackingNumber',
              label: 'Tracking Number',
              $el: {
                op: 'eq',
                size: "mini",
                placeholder: '请输入Tracking Number',
                clearable: true,
                "show-word-limit": true,
              }
            },
          ],
          //提交后执行
          afterConfirm: () => {
          }
        }
      }
    },
    computed: {},
    methods: {
    },
    watch: {}
  }
</script>

<style scoped>


</style>
