(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d224570"],{e05d:function(e,t,i){"use strict";i.r(t);var n=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",{staticClass:"app-container"},[i("div",{staticClass:"ph-card"},[i("ph-card-header",{attrs:{title:e.title,type:"table"}}),e._v(" "),i("div",{staticClass:"ph-card-body"},[i("ph-table",e._b({},"ph-table",e.tableConfig,!1))],1)],1)])},a=[],l=(i("b99d"),i("a97c")),r=(i("7eee"),i("85f3"),{data:function(){return{title:"出口计划历史",tableConfig:{url:"/linerShippingPlanItems/histories",relations:["cartonSpec","linerShippingPlan","product"],hasNew:!1,hasDelete:!1,hasOperation:!1,tableAttrs:{"row-class-name":this.statusClassName},columns:[{type:"selection"},l["a"].id,{prop:"linerShippingPlan.formatEtdTime",label:"开船日","min-width":120,sortable:!0,"sort-orders":["descending","ascending"]},{prop:"linerShippingPlan.statusName",label:"货柜状态","min-width":120},{prop:"linerShippingPlan.type",label:"物流方式","min-width":100},{prop:"linerShippingPlan.portOfLoading",label:"发货港","min-width":100},{prop:"linerShippingPlan.shipmentId",label:"FBA ID","min-width":120},{prop:"linerShippingPlan.referenceId",label:"Reference ID","min-width":100},{prop:"linerShippingPlan.fromWarehouse.name",label:"收货仓库","min-width":100},{prop:"linerShippingPlan.destinationFulfillmentCenterId",label:"仓库标识","min-width":100},{prop:"product.skuCode",label:"SKU编码","min-width":200},{prop:"numberOfCarton",label:"装箱数","min-width":100},{prop:"qty",label:"发货件数","min-width":100},{prop:"cartonQty",label:"发货箱数","min-width":100}]}}},computed:{},methods:{statusClassName:function(e){var t=e.row;return t.status&&0!==t.status?"":"warning-row"}},watch:{}}),p=r,s=i("2877"),o=Object(s["a"])(p,n,a,!1,null,"4ddb50ae",null);t["default"]=o.exports}}]);