(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-0dc3593e","chunk-2d208bd9"],{"1f39":function(t,e,r){},"7f08":function(t,e,r){"use strict";var i=r("1f39"),a=r.n(i);a.a},9679:function(t,e,r){"use strict";r.r(e);var i=function(){var t=this,e=t.$createElement,r=t._self._c||e;return r("div",[r("div",{staticClass:"ph-form",staticStyle:{"margin-top":"15px"}},[r("el-form",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"editObject",attrs:{rules:t.rules,model:t.editObject,"status-icon":"",inline:"","label-position":"right","label-width":"120px","inline-message":""}},[r("fieldset",{staticClass:"panel-heading"},[r("legend",{staticClass:"panel-title"},[t._v("交货要求\n          "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",placement:"right"}},[r("div",{attrs:{slot:"content"},slot:"content"},[t._v("\n              销售对采购计划的要求\n            ")]),t._v(" "),r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1),t._v(" "),t.editObject.note?r("el-row",{domProps:{innerHTML:t._s(t.editObject.formatNote)}}):r("el-row",[t._v("\n          无\n        ")])],1),t._v(" "),r("fieldset",{staticClass:"panel-heading",staticStyle:{"margin-top":"15px"}},[r("legend",{staticClass:"panel-title"},[t._v("采购单信息\n          "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",placement:"right"}},[r("div",{attrs:{slot:"content"},slot:"content"},[t._v("\n              采购单相关信息\n            ")]),t._v(" "),r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1),t._v(" "),r("el-row",[r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"供货商",prop:"supplierId"}},[r("el-select",{attrs:{filterable:"",placeholder:"请选择供货商"},on:{change:t.onSupplierChange},model:{value:t.editObject.supplierId,callback:function(e){t.$set(t.editObject,"supplierId",e)},expression:"editObject.supplierId"}},t._l(t.supplierSelectOptions,function(t,e){return r("el-option",{key:e,attrs:{label:t.name,value:t.id}})}),1),t._v(" "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"产品供货商，从哪个厂商采购。",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"收货仓库",prop:"warehouseId"}},[r("el-select",{attrs:{filterable:"",placeholder:"请选择收货仓库"},model:{value:t.editObject.warehouseId,callback:function(e){t.$set(t.editObject,"warehouseId",e)},expression:"editObject.warehouseId"}},t._l(t.warehouseSelectOptions,function(t,e){return r("el-option",{key:e,attrs:{label:t.name,value:t.id}})}),1),t._v(" "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"采购的商品接收的仓库",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),r("el-row",[r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"结算方式",prop:"settlementMethod"}},[r("el-select",{attrs:{filterable:"",placeholder:"请选择结算方式"},on:{change:t.onSettlementMethodChange},model:{value:t.editObject.settlementMethod,callback:function(e){t.$set(t.editObject,"settlementMethod",e)},expression:"editObject.settlementMethod"}},t._l(t.settlementMethodSelectOptions,function(t,e){return r("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"采购单的结算方式。货到付款方式不用走预付款流程。",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"结算货币",prop:"currencyId"}},[r("el-select",{attrs:{filterable:"",placeholder:"请选择结算货币"},on:{change:t.onCurrencyChange},model:{value:t.editObject.currencyId,callback:function(e){t.$set(t.editObject,"currencyId",e)},expression:"editObject.currencyId"}},t._l(t.currencySelectOptions,function(t,e){return r("el-option",{key:e,attrs:{label:t.name,value:t.id}})}),1),t._v(" "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"使用什么货币跟供货商进行结算。",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"帐期",prop:"accountPeriod"}},[r("el-input-number",{staticStyle:{width:"155px"},attrs:{min:1,step:1,max:365,label:"帐期"},on:{change:t.onAccountPeriodChange},model:{value:t.editObject.accountPeriod,callback:function(e){t.$set(t.editObject,"accountPeriod",e)},expression:"editObject.accountPeriod"}}),t._v("\n              天\n              "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"生产商、批发商向零售商供货后，直至零售商付款的这段时间周期",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1)],1)])],1),t._v(" "),r("h4",[t._v("产品详情")]),t._v(" "),r("div",{staticClass:"ph-table",staticStyle:{"margin-top":"15px"}},[r("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{stripe:"",border:"","highlight-current-row":"","max-height":t.tableMaxHeight,"row-class-name":t.dangerClassName,"cell-class-name":"ph-cell","header-cell-class-name":"ph-cell-header",data:t.tableData,"show-summary":"","summary-method":t.getSummaries,"default-sort":{prop:"product.skuCode",order:"ascending"},id:"table"},on:{"selection-change":t.handleSelectionChange}},[r("el-table-column",{attrs:{prop:"product.skuCode",label:"SKU",sortable:"",width:"150",fixed:"left"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.product.skuCode&&e.row.product.skuCode.length>22?r("el-popover",{attrs:{placement:"top-start",width:"200",trigger:"hover"}},[r("div",{domProps:{innerHTML:t._s(e.row.product.skuCode)}}),t._v(" "),r("span",{attrs:{slot:"reference"},slot:"reference"},[t._v(t._s(e.row.product.skuCode?e.row.product.skuCode.length>22?e.row.product.skuCode.substr(0,20)+"..":e.row.product.skuCode:""))])]):r("span",[t._v("\n          "+t._s(e.row.skuCode)+"\n        ")])]}}])}),t._v(" "),r("el-table-column",{attrs:{prop:"product.supplier.name",label:"供货商",width:"100"}}),t._v(" "),r("el-table-column",{attrs:{prop:"productName",label:"名称",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.product.name&&e.row.product.name.length>17?r("el-popover",{attrs:{placement:"top-start",width:"200",trigger:"hover"}},[r("div",{domProps:{innerHTML:t._s(e.row.product.name)}}),t._v(" "),r("span",{attrs:{slot:"reference"},slot:"reference"},[t._v(t._s(e.row.product.name?e.row.product.name.length>17?e.row.product.name.substr(0,15)+"..":e.row.product.name:""))])]):r("span",[t._v("\n          "+t._s(e.row.product.name)+"\n          ")])]}}])}),t._v(" "),r("el-table-column",{attrs:{prop:"numberOfCarton",label:"装箱数",width:"80"}}),t._v(" "),r("el-table-column",{attrs:{prop:"cartonSpecCode",label:"箱规",width:"120"}}),t._v(" "),r("el-table-column",{attrs:{prop:"cartonQty",label:"计划箱数",width:"110"}}),t._v(" "),r("el-table-column",{attrs:{prop:"orderCartonQty",label:"已下箱数",width:"80"}}),t._v(" "),r("el-table-column",{attrs:{prop:"noPurchaseOrderCartonQty",label:"未下箱数",width:"80"}}),t._v(" "),r("el-table-column",{attrs:{prop:"id",label:"ID",width:"80"}}),t._v(" "),r("el-table-column",{attrs:{prop:"purchaseOrderCartonQty",label:"采购箱数",width:"80",fixed:"right"}}),t._v(" "),r("el-table-column",{attrs:{prop:"purchaseOrderQty",label:"采购件数",width:"80",fixed:"right"}}),t._v(" "),r("el-table-column",{attrs:{prop:"product.price",label:"单价",width:"80",fixed:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n          "+t._s(t._f("currency")(e.row.product.price?e.row.product.price:0,t.selCurrency?t.selCurrency.symbolLeft:""))+"\n        ")]}}])}),t._v(" "),r("el-table-column",{attrs:{prop:"purchaseOrderAmount",label:"总额",width:"100",fixed:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n          "+t._s(t._f("currency")(e.row.purchaseOrderAmount?e.row.purchaseOrderAmount:0,t.selCurrency?t.selCurrency.symbolLeft:""))+"\n        ")]}}])}),t._v(" "),r("el-table-column",{attrs:{label:"操作","no-export":"true",width:"120",fixed:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[t.hasEdit?r("el-button",{attrs:{size:"small",icon:"el-icon-edit",circle:"",type:"primary",id:"ph-table-edit"},on:{click:function(r){return t.onDefaultEdit(e.row)}}}):t._e(),t._v(" "),t.hasDelete?r("el-button",{attrs:{type:"danger",size:"mini",id:"ph-table-del",icon:"el-icon-delete",circle:""},on:{click:function(r){return t.onDefaultDelete(e.row)}}}):t._e()]}}])})],1),t._v(" "),r("planDetailDialog",{ref:"planDetailDialog",on:{modifyDetailCBEvent:t.modifyDetailCBEvent}})],1),t._v(" "),r("el-row",[r("el-col",{attrs:{md:24}},[r("el-row",{attrs:{type:"flex",justify:"center"}},[t.hasEdit?r("el-button",{staticStyle:{"margin-top":"15px"},attrs:{type:"primary",loading:t.confirmLoading},on:{click:t.onSave}},[t._v("\n          下单\n        ")]):t._e()],1)],1)],1)],1)},a=[],n=(r("c5f6"),r("386d"),r("ac6a"),r("ed08")),l=r("c971"),o=r("b9a9"),s=r("a5a0"),c={components:{planDetailDialog:s["default"]},props:{primary:{type:[Object],default:{}}},filters:{currency:n["b"]},computed:{hasEdit:function(){return!0},hasDelete:function(){return!0}},watch:{},data:function(){return{tableMaxHeight:"mobile"!==this.device?500:4e7,selected:[],loading:!1,confirmLoading:!1,supplierSelectOptions:[],warehouseSelectOptions:[],settlementMethodSelectOptions:[],currencySelectOptions:[],selCurrency:{},editObject:{id:null,supplierId:null,warehouseId:null,settlementMethod:null,currencyId:null,accountPeriod:null},rules:{supplierId:[{required:!0,message:"必须输入",trigger:"blur"}],warehouseId:[{required:!0,message:"必须输入",trigger:"blur"}],settlementMethod:[{required:!0,message:"必须输入",trigger:"blur"}],currencyId:[{required:!0,message:"必须输入",trigger:"blur"}],accountPeriod:[{required:!0,message:"必须输入",trigger:"blur"}]},url:"/procurementPlanItems",downloadUrl:"",filters:[{field:"procurementPlanId",op:"eq",data:this.primary?this.primary.id:-1}],relations:["cartonSpec","product","product.currency","product.supplier"],data:[],tableData:[]}},created:function(){},mounted:function(){var t=this;this.$nextTick(function(){t.initData()})},methods:{initData:function(){this.loading=!0,this.primary?(this.editObject=JSON.parse(JSON.stringify(this.primary)),this.editObject.limitTime=this.editObject.formatLimitTime,this.editObject.executeTime=this.editObject.formatExecuteTime,this.editObject.categoryId=Object(n["f"])(this.editObject.categoryId),this.editObject.accountPeriod=60,this.editObject.settlementMethod="3",this.settlementMethodSelectOptions=l["a"].getSelectOptions("SettlementMethod"),this.initCurrencData(),this.initSupplierData(),this.initWarehouseData(),this.getList(),this.loading=!1):(this.$message.error("无效的采购计划!"),this.loading=!1)},initSupplierData:function(){var t=this;this.loading=!0;var e="/procurementPlans/".concat(this.primary.id,"/suppliers");this.global.axios.get(e).then(function(e){var r=e.data||[];t.supplierSelectOptions=[],r.forEach(function(e){t.supplierSelectOptions.push(e)}),t.loading=!1}).catch(function(e){t.loading=!1})},initWarehouseData:function(){var t=this;this.loading=!0;var e="/warehouses",r=[{field:"status",op:"eq",data:"1"},{field:"type",op:"in",data:"普通,原料仓,工厂仓"}];e+="?filters="+JSON.stringify({groupOp:"AND",rules:r}),this.global.axios.get(e).then(function(e){var r=e.data||[];t.warehouseSelectOptions=[],r.forEach(function(e){t.warehouseSelectOptions.push(e)}),t.loading=!1}).catch(function(e){t.loading=!1})},initCurrencData:function(){var t=this;this.loading=!0,o["a"].getCurrencies().then(function(e){var r=e||[];t.currencySelectOptions=[],r.forEach(function(e){t.currencySelectOptions.push(e)}),t.loading=!1}).catch(function(e){t.loading=!1})},getList:function(){var t=this,e=this.url,r="";e?(this.filters&&this.filters.length>0&&(r+="?filters="+JSON.stringify({groupOp:"AND",rules:this.filters})),this.relations&&this.relations.length>0&&(r+="&relations="+JSON.stringify(this.relations)),this.loading=!0,this.global.axios.get(e+r).then(function(e){var r=e.data||[],i=[];r.forEach(function(e){e.purchaseOrderCartonQty=e.noPurchaseOrderCartonQty,e.purchaseOrderQty=e.purchaseOrderCartonQty*e.numberOfCarton,e.purchaseOrderAmount=e.noPurchaseOrderAmount,e.product&&e.product.currency&&!t.editObject.currencyId&&(t.editObject.currencyId=e.product.currency.id,t.selCurrency=JSON.parse(JSON.stringify(e.product.currency))),i.push(e)}),t.data=i,t.search(),t.total=r.length||0,t.loading=!1,t.$emit("update",i,r)}).catch(function(e){t.$emit("error",e),t.loading=!1})):console.warn("url 为空, 不发送请求")},dangerClassName:function(t){var e=t.row;t.rowIndex;return e.product&&e.product.price&&e.numberOfCarton&&e.cartonSpecId&&-1!=e.cartonSpecId&&e.supplierId?"":"danger-row"},getSummaries:function(t){var e=this,r=t.columns,i=t.data,a=[];return r.forEach(function(t,r){if("product.skuCode"==t.property){var l=i.map(function(e){return e[t.property]});a[r]=l.reduce(function(t){return t+1},0),a[r]="合计: "+a[r]+" 行"}if("cartonQty"==t.property||"orderCartonQty"==t.property||"noPurchaseOrderCartonQty"==t.property||"purchaseOrderCartonQty"==t.property){var o=i.map(function(e){return Number(e[t.property])});o.every(function(t){return isNaN(t)})?a[r]="N/A":(a[r]=o.reduce(function(t,e){var r=Number(e);return isNaN(r)?t:t+e},0),a[r]+=" 箱")}if("purchaseOrderQty"==t.property){var s=i.map(function(e){return Number(e[t.property])});s.every(function(t){return isNaN(t)})?a[r]="N/A":(a[r]=s.reduce(function(t,e){var r=Number(e);return isNaN(r)?t:t+e},0),a[r]+=" 件")}if("purchaseOrderAmount"==t.property){var c=i.map(function(e){return Number(e[t.property])});c.every(function(t){return isNaN(t)})?a[r]="N/A":(a[r]=c.reduce(function(t,e){var r=Number(e);return isNaN(r)?t:t+e},0),a[r]=Object(n["b"])(a[r],e.selCurrency?e.selCurrency.symbolLeft:null))}}),a},handleSelectionChange:function(t){this.selected=t},search:function(){var t=this;this.tableData=JSON.parse(JSON.stringify(this.data)),null!=this.editObject.supplierId&&""!=this.editObject.supplierId&&(this.tableData=this.tableData.filter(function(e){if(e.supplierId==t.editObject.supplierId)return!0}))},onCurrencyChange:function(t){var e=this;this.currencySelectOptions.forEach(function(r){t==r.id&&(e.selCurrency=r)}),this.$forceUpdate()},onSupplierChange:function(t){this.search(),this.$forceUpdate()},onSettlementMethodChange:function(){this.$forceUpdate()},onAccountPeriodChange:function(){this.$forceUpdate()},onSave:function(){var t=this;this.$refs.editObject.validate(function(e){if(e)if(t.data&&0!=t.data.length){t.confirmLoading=!0;var r="";if(t.tableData.forEach(function(t){t.product&&t.product.price||(r+="产品".concat(t.product.skuCode,"价格必须输入!\n")),t.numberOfCarton||(r+="产品".concat(t.product.skuCode,"装箱数必须输入!\n")),t.cartonSpecId&&-1!=t.cartonSpecId||(r+="产品".concat(t.product.skuCode,"箱规不正确! 如不确定箱规可以箱规可以选择Undefined。\n")),t.supplierId||(r+="产品".concat(t.product.skuCode,"必须选择供货商。\n")),t.purchaseOrderQty||(r+="产品".concat(t.product.skuCode,"必须选择设置采购箱数。\n"))}),""!=r)return t.$message.error(r),void(t.confirmLoading=!1);t.saveObject(),t.confirmLoading=!1}else t.$message.error("采购单内容不能为空!")})},onDefaultEdit:function(t){this.$refs.planDetailDialog.openDialog(JSON.parse(JSON.stringify(t)),JSON.parse(JSON.stringify(this.selCurrency)))},modifyDetailCBEvent:function(t){this.data.forEach(function(e,r,i){e.id==t.id&&(i[r]=t)});var e=!1;this.supplierSelectOptions.forEach(function(r,i,a){r.id==t.supplierId&&(e=!0)}),0==e&&this.supplierSelectOptions.push({id:t.supplierId,name:t.supplierName}),this.search()},onDefaultDelete:function(t){var e=this;this.$confirm("确认删除吗","提示",{type:"warning",beforeClose:function(r,i,a){if("confirm"==r){var n=null;e.data.forEach(function(e,r){e.skuCode!==t.skuCode||(n=r)}),e.date=e.data.splice(n,1),e.search(),a()}else a()}}).catch(function(t){})},saveObject:function(){var t=this,e={};e.procurementPlanId=this.editObject.id,e.supplierId=this.editObject.supplierId,e.warehouseId=this.editObject.warehouseId,e.settlementMethod=this.editObject.settlementMethod,e.currencyId=this.editObject.currencyId,e.accountPeriod=this.editObject.accountPeriod;var r=[];this.tableData.forEach(function(t){var e={};e.productId=t.productId,e.cartonSpecId=t.supplierId,e.numberOfCarton=t.numberOfCarton,e.cartonQty=t.purchaseOrderCartonQty,e.skuCode=t.product.skuCode,e.price=t.product.price,r.push(e)}),e.orderItems=r;var i=this.$loading({lock:!0,text:"下单中...",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"});this.global.axios.post("/procurementOrders",e).then(function(e){var r=e.data;t.$message({type:"success",message:"操作成功"}),i.close(),t.$emit("step1CBEvent",r)}).catch(function(t){i.close()})}}},u=c,d=(r("7f08"),r("2877")),p=Object(d["a"])(u,i,a,!1,null,"1413e70a",null);e["default"]=p.exports},a5a0:function(t,e,r){"use strict";r.r(e);var i=function(){var t=this,e=t.$createElement,r=t._self._c||e;return t.dialogVisible?r("el-dialog",{attrs:{title:t.dialogTitle,"append-to-body":"",width:"85%",top:"20vh",visible:t.dialogVisible},on:{close:t.closeDialog,"update:visible":function(e){t.dialogVisible=e}}},[r("div",{staticClass:"ph-form"},[r("el-form",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"detailItem",attrs:{rules:t.rules,model:t.detailItem,"status-icon":"",inline:"","label-position":"right","label-width":"120px"}},[r("el-row",[r("el-col",{attrs:{md:8}},[r("el-form-item",{staticStyle:{"font-size":"12px"},attrs:{label:"SKU"}},[t._v("\n            "+t._s(t.detailItem.skuCode)+"\n          ")])],1),t._v(" "),r("el-col",{attrs:{md:8}},[r("el-form-item",{staticStyle:{"font-size":"12px"},attrs:{label:"产品名"}},[t._v("\n            "+t._s(t.detailItem.product.name)+"\n          ")])],1),t._v(" "),r("el-col",{attrs:{md:8}},[r("el-form-item",{staticStyle:{"font-size":"12px"},attrs:{label:"结算货币"}},[t._v("\n            "+t._s(t.selCurrency.name)+"\n          ")])],1)],1),t._v(" "),r("el-row",[r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"供货商",prop:"supplierId"}},[r("el-select",{attrs:{filterable:"",placeholder:"请选择供货商,可筛选"},model:{value:t.detailItem.supplierId,callback:function(e){t.$set(t.detailItem,"supplierId",e)},expression:"detailItem.supplierId"}},t._l(t.supplierSelectOptions,function(t,e){return r("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"产品供货商，从哪个厂商采购。",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"箱规",prop:"cartonSpecId"}},[r("el-select",{attrs:{filterable:"",placeholder:"外箱包装材料规格,可筛选"},model:{value:t.detailItem.cartonSpecId,callback:function(e){t.$set(t.detailItem,"cartonSpecId",e)},expression:"detailItem.cartonSpecId"}},t._l(t.cartonspecSelectOptions,function(t,e){return r("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"产品外箱包装材料规格。不输入使用产品上默认的箱规",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"装箱数",prop:"numberOfCarton"}},[r("el-input-number",{staticStyle:{width:"150px"},attrs:{precision:0,min:1,step:1,max:1e5,label:"装箱数"},model:{value:t.detailItem.numberOfCarton,callback:function(e){t.$set(t.detailItem,"numberOfCarton",e)},expression:"detailItem.numberOfCarton"}}),t._v(" "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"一箱有多少个产品.",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),r("el-row",[r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"采购单价",prop:"price"}},[r("el-input-number",{staticStyle:{width:"175px"},attrs:{precision:2,min:1,step:1,max:1e6,label:"采购价"},model:{value:t.detailItem.product.price,callback:function(e){t.$set(t.detailItem.product,"price",e)},expression:"detailItem.product.price"}}),t._v(" "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"产品的采购价格。",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"采购箱数",prop:"purchaseOrderCartonQty"}},[r("el-input-number",{staticStyle:{width:"175px"},attrs:{precision:3,min:1,step:1,max:1e6,label:"采购箱数"},model:{value:t.detailItem.purchaseOrderCartonQty,callback:function(e){t.$set(t.detailItem,"purchaseOrderCartonQty",e)},expression:"detailItem.purchaseOrderCartonQty"}}),t._v(" "),r("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"采购箱数,支持3位小树。",placement:"right"}},[r("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),r("el-col",{attrs:{md:8}},[r("el-form-item",{attrs:{label:"采购件数"}},[t._v("\n            "+t._s(t.orderQty)+" 件\n          ")])],1)],1),t._v(" "),r("hr"),t._v(" "),r("el-row",{staticStyle:{"text-align":"right","font-size":"13px","font-weight":"bold"}},[t._v("\n        总额: "+t._s(t._f("currency")(t.amount,t.selCurrency.symbolLeft))+"\n      ")])],1)],1),t._v(" "),r("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[r("el-button",{attrs:{type:"primary",loading:t.confirmLoading},on:{click:t.onSave}},[t._v("保 存")]),t._v(" "),r("el-button",{on:{click:t.closeDialog}},[t._v("取 消")])],1)]):t._e()},a=[],n=(r("ac6a"),r("b99d")),l=r("a6b9"),o=r("d186"),s=r("ed08"),c={components:{},props:{},filters:{currency:s["b"]},computed:{orderQty:function(){return this.calOrderQty()},amount:function(){return this.calAmount()},dialogTitle:function(){return null==this.detailItemId?"添加采购计划明细":"修改采购计划明细"},hasEdit:function(){return!0}},data:function(){return{dialogVisible:!1,loading:!1,confirmLoading:!1,detailItem:{},selCurrency:{},supplierSelectOptions:[],cartonspecSelectOptions:[],rules:{supplierId:[n["a"].required],cartonSpecId:[n["a"].required],price:[n["a"].number],numberOfCarton:[n["a"].integer],purchaseOrderCartonQty:[n["a"].number]}}},created:function(){},mounted:function(){this.$nextTick(function(){})},methods:{initData:function(){this.supplierSelectOptions=l["a"].getSelectOptions(),this.cartonspecSelectOptions=o["a"].getSelectOptions()},openDialog:function(t,e){this.detailItem=t,this.selCurrency=e,this.detailItem.supplierId=t.supplierId+"",this.detailItem.cartonSpecId=t.cartonSpecId+"",this.dialogVisible=!0,this.initData()},closeDialog:function(){this.dialogVisible=!1,this.loading=!1,this.confirmLoading=!1,this.detailItemId=null,this.detailItem=null,this.cartonspecSelectOptions=[],this.prioritySelectOptions=[]},calOrderQty:function(){return(this.detailItem.purchaseOrderCartonQty*this.detailItem.numberOfCarton).toFixed(0)},calAmount:function(){return(this.detailItem.product.price*this.calOrderQty()).toFixed(2)},onSave:function(){var t=this;this.$refs.detailItem.validate(function(e){if(!e)return!1;t.loading=!0,t.confirmLoading=!0,t.detailItem.purchaseOrderQty=t.calOrderQty(),t.detailItem.purchaseOrderAmount=t.calAmount(),t.supplierSelectOptions.forEach(function(e){e.value==t.detailItem.supplierId+""&&(t.detailItem.supplierName=e.label,t.detailItem.product.supplier||(t.detailItem.product.supplier={name:e.label,id:t.detailItem.supplierId}))}),t.cartonspecSelectOptions.forEach(function(e){e.value==t.detailItem.cartonSpecId+""&&(t.detailItem.cartonSpecCode=e.label)}),t.$emit("modifyDetailCBEvent",t.detailItem),t.loading=!1,t.confirmLoading=!1,t.closeDialog()})}}},u=c,d=r("2877"),p=Object(d["a"])(u,i,a,!1,null,"29f325b0",null);e["default"]=p.exports}}]);