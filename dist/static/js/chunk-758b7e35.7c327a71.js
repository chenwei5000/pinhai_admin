(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-758b7e35","chunk-2d229081"],{b6a3:function(t,e,a){"use strict";var l=a("cfc0"),o=a.n(l);o.a},cfc0:function(t,e,a){},dc5a:function(t,e,a){"use strict";a.r(e);var l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return t.dialogVisible?a("el-dialog",{attrs:{title:t.dialogTitle,"append-to-body":"",width:"80%",top:"20px",visible:t.dialogVisible},on:{close:t.closeDialog,"update:visible":function(e){t.dialogVisible=e}}},[a("div",{staticClass:"ph-form"},[a("el-form",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"detailItem",attrs:{rules:t.rules,model:t.detailItem,"status-icon":"",inline:"","label-position":"right","label-width":"120px"}},[a("el-row",[a("el-col",{attrs:{md:10}},[a("el-form-item",{attrs:{label:"SKU",prop:"skuCode"}},[a("el-input",{staticStyle:{width:"200px"},attrs:{maxlength:"50","show-word-limit":"",placeholder:"请填写SKU",clearable:""},model:{value:t.detailItem.skuCode,callback:function(e){t.$set(t.detailItem,"skuCode","string"===typeof e?e.trim():e)},expression:"detailItem.skuCode"}}),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"输入产品SKU编码",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),a("el-col",{attrs:{md:14}},[a("el-form-item",{attrs:{label:"采购箱数",prop:"cartonQty"}},[a("el-input-number",{attrs:{precision:0,min:1,step:1,max:1e5,label:"采购箱数"},on:{change:t.onQtyChange},model:{value:t.detailItem.cartonQty,callback:function(e){t.$set(t.detailItem,"cartonQty",e)},expression:"detailItem.cartonQty"}}),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"按箱采购，请输入箱数，支持3位小数！",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{md:10}},[a("el-form-item",{attrs:{label:"箱规",prop:"cartonSpecId"}},[a("el-select",{staticStyle:{width:"200px"},attrs:{filterable:"",placeholder:"外箱包装材料规格,可筛选"},model:{value:t.detailItem.cartonSpecId,callback:function(e){t.$set(t.detailItem,"cartonSpecId",e)},expression:"detailItem.cartonSpecId"}},t._l(t.cartonspecSelectOptions,function(t,e){return a("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"产品外箱包装材料规格。不输入使用产品上默认的箱规",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),a("el-col",{attrs:{md:14}},[a("el-form-item",{attrs:{label:"装箱数",prop:"numberOfCarton"}},[a("el-input",{staticStyle:{width:"200px"},attrs:{placeholder:"请填写装箱数",clearable:""},model:{value:t.detailItem.numberOfCarton,callback:function(e){t.$set(t.detailItem,"numberOfCarton","string"===typeof e?e.trim():e)},expression:"detailItem.numberOfCarton"}}),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"一箱有多少个产品.不输入使用产品上默认的装箱数",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),a("el-row",[a("el-col",{attrs:{md:10}},[a("el-form-item",{attrs:{label:"备货周数",prop:"safetyStockWeek"}},[a("el-input-number",{staticStyle:{width:"200px"},attrs:{precision:0,min:1,step:1,max:52,label:"备货周数"},model:{value:t.detailItem.safetyStockWeek,callback:function(e){t.$set(t.detailItem,"safetyStockWeek",e)},expression:"detailItem.safetyStockWeek"}}),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"产品希望支持销售的周数。",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),this.detailItemId?a("el-col",{attrs:{md:14}},[a("el-form-item",{attrs:{label:"可售周数",prop:"saleWeek"}},[a("el-input",{staticStyle:{width:"200px"},attrs:{readonly:"",placeholder:"可售周数，自动计算",clearable:""},model:{value:t.detailItem.saleWeek,callback:function(e){t.$set(t.detailItem,"saleWeek","string"===typeof e?e.trim():e)},expression:"detailItem.saleWeek"}}),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"采购的产品可以销售的周数",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1):t._e()],1),t._v(" "),this.detailItemId?a("el-row",[a("el-col",{attrs:{md:10}},[a("el-form-item",{attrs:{label:"7日销量(件)",prop:"sevenSalesCount"}},[a("el-input",{staticStyle:{width:"200px"},attrs:{readonly:"",placeholder:"请填写7日销量，件数",clearable:""},model:{value:t.detailItem.sevenSalesCount,callback:function(e){t.$set(t.detailItem,"sevenSalesCount","string"===typeof e?e.trim():e)},expression:"detailItem.sevenSalesCount"}}),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"7日销售件数, 不能修改。可以去销售设置中调整。",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),a("el-col",{attrs:{md:14}},[a("el-form-item",{attrs:{label:"亚马逊含在途(箱)",prop:"amazonTotalStock"}},[a("el-input",{staticStyle:{width:"200px"},attrs:{readonly:"",clearable:""},model:{value:t.detailItem.amazonTotalStock,callback:function(e){t.$set(t.detailItem,"amazonTotalStock","string"===typeof e?e.trim():e)},expression:"detailItem.amazonTotalStock"}}),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"亚马逊含在途库存箱数，不能修改",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1):t._e(),t._v(" "),this.detailItemId?a("el-row",[a("el-col",{attrs:{md:10}},[a("el-form-item",{attrs:{label:"国内库存(箱)",prop:"domesticStockQty"}},[a("el-input",{staticStyle:{width:"200px"},attrs:{readonly:"",placeholder:"国内库存，箱数",clearable:""},model:{value:t.detailItem.domesticStockQty,callback:function(e){t.$set(t.detailItem,"domesticStockQty","string"===typeof e?e.trim():e)},expression:"detailItem.domesticStockQty"}}),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"国内仓库库存箱数，不能修改",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),a("el-col",{attrs:{md:14}},[a("el-form-item",{attrs:{label:"国内在途(箱)",prop:"unfinishedPlanQty"}},[a("el-input",{staticStyle:{width:"200px"},attrs:{readonly:"",placeholder:"国内在途，箱数",clearable:""},model:{value:t.detailItem.unfinishedPlanQty,callback:function(e){t.$set(t.detailItem,"unfinishedPlanQty","string"===typeof e?e.trim():e)},expression:"detailItem.unfinishedPlanQty"}}),t._v(" "),a("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"未完成采购计划箱数",placement:"right"}},[a("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1):t._e(),t._v(" "),t._e(),t._v(" "),a("el-row",[a("el-col",{attrs:{md:24}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[t.hasEdit?a("el-button",{staticStyle:{"margin-top":"15px"},attrs:{type:"primary",loading:t.confirmLoading},on:{click:t.onSave}},[t._v("\n                保存\n              ")]):t._e()],1)],1)],1)],1)],1)]):t._e()},o=[],r=a("d186"),i=a("c971"),n=a("b99d"),s={components:{},props:{primary:{type:[Object],default:null}},computed:{dialogTitle:function(){return null==this.detailItemId?"添加采购计划明细":"修改采购计划明细"},hasEdit:function(){return!([0,8].indexOf(this.primary.status)>-1)}},data:function(){return{dialogVisible:!1,loading:!1,confirmLoading:!1,url:"/procurementPlanItems",relations:["product"],detailItemId:null,detailItem:{},cartonspecSelectOptions:[],prioritySelectOptions:[],rules:{skuCode:[n["a"].required],cartonQty:[n["a"].required],priority:[n["a"].required],numberOfCarton:[n["a"].integer],sevenSalesCount:[n["a"].number],amazonTotalStock:[n["a"].number],domesticStockQty:[n["a"].number],unfinishedPlanQty:[n["a"].number]}}},created:function(){},mounted:function(){this.$nextTick(function(){})},methods:{initData:function(){var t=this;if(this.cartonspecSelectOptions=r["a"].getSelectOptions(),this.prioritySelectOptions=i["a"].getSelectOptions("Priority"),this.detailItemId){this.loading=!0;var e="".concat(this.url,"/").concat(this.detailItemId);this.relations&&this.relations.length>0&&(e+="?relations="+JSON.stringify(this.relations)),this.global.axios.get(e).then(function(e){var a=e.data,l=a||{};t.detailItem=l,t.detailItem.cartonSpecId=l.cartonSpecId+"",t.detailItem.priority=l.priority+"",t.loading=!1})}else this.detailItem={skuCode:"",priorityNote:"",cartonSpecId:null,priority:"2",safetyStockWeek:10,numberOfCarton:null,cartonQty:1,procurementPlanId:this.primary.id}},openDialog:function(t){this.detailItemId=t,this.dialogVisible=!0,this.initData()},closeDialog:function(){this.dialogVisible=!1,this.loading=!1,this.confirmLoading=!1,this.detailItemId=null,this.detailItem=null,this.cartonspecSelectOptions=[],this.prioritySelectOptions=[]},onQtyChange:function(t){if(this.detailItem){var e=this.detailItem.amazonTotalStock||0,a=this.detailItem.domesticStockCartonQty||0,l=this.detailItem.unfinishedPlanQty||0,o=this.detailItem.numberOfCarton||1,r=e+a+l+t*o;this.detailItem.sevenSalesCount&&(this.detailItem.saleWeek=(r/this.detailItem.sevenSalesCount).toFixed(1))}},onSave:function(){var t=this;this.$refs.detailItem.validate(function(e){if(!e)return!1;t.loading=!0,t.confirmLoading=!0;var a="post",l=t.url+"";!t.detailItemId&&t.detailItemId>0&&(a="put",l="".concat(t.url,"/").concat(t.detailItemId));var o=JSON.parse(JSON.stringify(t.detailItem));t.global.axios[a](l,o).then(function(e){t.$message.info("修改成功"),t.loading=!1,t.confirmLoading=!1,t.dialogVisible=!1,t.$emit("modifyCBEvent",e.data)}).catch(function(e){t.loading=!1,t.confirmLoading=!1})})}}},c=s,d=a("2877"),u=Object(d["a"])(c,l,o,!1,null,"64ade225",null);e["default"]=u.exports},ee0f:function(t,e,a){"use strict";a.r(e);var l=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"ph-table"},[a("el-form",{ref:"searchForm",attrs:{inline:!0,model:t.searchParam,id:"filter-form"},nativeOn:{submit:function(t){t.preventDefault()}}},[a("el-form-item",{attrs:{label:"SKU"}},[a("el-input",{attrs:{placeholder:"请输入SKU",clearable:""},model:{value:t.searchParam.skuCode,callback:function(e){t.$set(t.searchParam,"skuCode",e)},expression:"searchParam.skuCode"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"分类"}},[a("el-input",{attrs:{placeholder:"请输入分类名称",clearable:""},model:{value:t.searchParam.category,callback:function(e){t.$set(t.searchParam,"category",e)},expression:"searchParam.category"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"款式"}},[a("el-input",{attrs:{placeholder:"请输入产品款式",clearable:""},model:{value:t.searchParam.groupName,callback:function(e){t.$set(t.searchParam,"groupName",e)},expression:"searchParam.groupName"}})],1),t._v(" "),a("el-form-item",{attrs:{label:"状态"}},[a("el-select",{attrs:{filterable:"",placeholder:"请选择状态"},model:{value:t.searchParam.status,callback:function(e){t.$set(t.searchParam,"status",e)},expression:"searchParam.status"}},t._l(t.statusSelectOptions,function(t,e){return a("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1)],1),t._v(" "),a("el-form-item",[a("el-button",{attrs:{"native-type":"submit",type:"primary",size:"small"},on:{click:t.search}},[t._v("查询")]),t._v(" "),a("el-button",{attrs:{size:"small"},on:{click:t.resetSearch}},[t._v("重置")])],1)],1),t._v(" "),a("tableToolBar",t._b({on:{onToolBarAdd:t.onToolBarAdd,onToolBarEdit:t.onToolBarEdit,onToolBarDelete:t.onToolBarDelete,onToolBarDownloadTpl:t.onToolBarDownloadTpl,onToolBarDownloadData:t.onToolBarDownloadData,onToolBarImportData:t.onToolBarImportData}},"tableToolBar",t.toolbarConfig,!1)),t._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{stripe:"",border:"","highlight-current-row":"","max-height":t.tableMaxHeight,"row-class-name":t.dangerClassName,"cell-class-name":"ph-cell","header-cell-class-name":"ph-cell-header",data:t.tableData,"show-summary":"","summary-method":t.getSummaries,"default-sort":{prop:"product.skuCode",order:"ascending"},id:"table"},on:{"selection-change":t.handleSelectionChange}},[a("el-table-column",{attrs:{prop:"product.skuCode",label:"SKU",sortable:"",width:"150",fixed:"left"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.product.skuCode&&e.row.product.skuCode.length>22?a("el-popover",{attrs:{placement:"top-start",width:"200",trigger:"hover"}},[a("div",{domProps:{innerHTML:t._s(e.row.product.skuCode)}}),t._v(" "),a("span",{attrs:{slot:"reference"},slot:"reference"},[t._v(t._s(e.row.product.skuCode?e.row.product.skuCode.length>22?e.row.product.skuCode.substr(0,20)+"..":e.row.product.skuCode:""))])]):a("span",[t._v("\n          "+t._s(e.row.skuCode)+"\n        ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"statusName",label:"状态",width:"90"},scopedSlots:t._u([{key:"default",fn:function(e){return[a("el-tag",{attrs:{type:1===e.row.status?"warning":0===e.row.status?"danger":2===e.row.status?"primary":8===e.row.status?"info":"success","disable-transitions":""}},[t._v(t._s(e.row.statusName)+"\n        ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"product.category.name",label:"分类",width:"100"}}),t._v(" "),a("el-table-column",{attrs:{prop:"product.groupName",label:"款式",width:"150"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.product.groupName&&e.row.product.groupName.length>12?a("el-popover",{attrs:{placement:"top-start",width:"200",trigger:"hover"}},[a("div",{domProps:{innerHTML:t._s(e.row.product.groupName)}}),t._v(" "),a("span",{attrs:{slot:"reference"},slot:"reference"},[t._v(t._s(e.row.product.groupName?e.row.product.groupName.length>12?e.row.product.groupName.substr(0,10)+"..":e.row.product.groupName:""))])]):a("span",[t._v("\n          "+t._s(e.row.product.groupName)+"\n          ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"numberOfCarton",label:"装箱数",width:"80"}}),t._v(" "),a("el-table-column",{attrs:{prop:"safetyStockWeek",label:"备货周数",width:"80"}}),t._v(" "),a("el-table-column",{attrs:{prop:"demandedCartonQty",label:"需求总量(箱)",width:"100"}}),t._v(" "),a("el-table-column",{attrs:{prop:"sevenSalesCount",label:"7日销量(件)",width:"100"}}),t._v(" "),a("el-table-column",{attrs:{prop:"amazonTotalStock",label:"亚马逊含在途库存(件)",width:"140"}}),t._v(" "),a("el-table-column",{attrs:{prop:"domesticStockCartonQty",label:"国内库存(箱)",width:"100"}}),t._v(" "),a("el-table-column",{attrs:{prop:"unfinishedPlanQty",label:"国内在途(箱)",width:"100"}}),t._v(" "),a("el-table-column",{attrs:{prop:"qty",label:"采购件数",width:"80"}}),t._v(" "),t.hasExecute?a("el-table-column",{attrs:{prop:"orderQty",label:"下单件数",width:"80"}}):t._e(),t._v(" "),t.hasExecute?a("el-table-column",{attrs:{prop:"shippedQty",label:"发货件数",width:"80"}}):t._e(),t._v(" "),t.hasExecute?a("el-table-column",{attrs:{prop:"receivedQty",label:"收货件数",width:"80"}}):t._e(),t._v(" "),a("el-table-column",{attrs:{prop:"productName",label:"名称",width:"200"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.product.name&&e.row.product.name.length>17?a("el-popover",{attrs:{placement:"top-start",width:"200",trigger:"hover"}},[a("div",{domProps:{innerHTML:t._s(e.row.product.name)}}),t._v(" "),a("span",{attrs:{slot:"reference"},slot:"reference"},[t._v(t._s(e.row.product.name?e.row.product.name.length>17?e.row.product.name.substr(0,15)+"..":e.row.product.name:""))])]):a("span",[t._v("\n          "+t._s(e.row.product.name)+"\n          ")])]}}])}),t._v(" "),a("el-table-column",{attrs:{prop:"product.fnSku",label:"FNSKU","min-width":"120"}}),t._v(" "),a("el-table-column",{attrs:{prop:"product.vipLevel",label:"Vip级别",width:"100"}}),t._v(" "),a("el-table-column",{attrs:{prop:"cartonSpecCode",label:"箱规",width:"120"}}),t._v(" "),a("el-table-column",{attrs:{prop:"numberOfPallets",label:"托盘装箱数",width:"120"}}),t._v(" "),a("el-table-column",{attrs:{prop:"id",label:"ID",width:"80"}}),t._v(" "),a("el-table-column",{attrs:{prop:"saleWeek",sortable:"",label:"可售周数",width:"110",fixed:"right"}}),t._v(" "),a("el-table-column",{attrs:{prop:"cartonQty",sortable:"",label:"采购箱数",width:"110",fixed:"right"}}),t._v(" "),a("el-table-column",{attrs:{prop:"amount",sortable:"",label:"金额",width:"100",fixed:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[t._v("\n        "+t._s(t._f("currency")(e.row.amount,e.row.product.currency?e.row.product.currency.symbolLeft:""))+"\n      ")]}}])}),t._v(" "),t._e(),t._v(" "),t._e(),t._v(" "),t.hasOperation?a("el-table-column",{attrs:{label:"操作","no-export":"true",width:"120",fixed:"right"},scopedSlots:t._u([{key:"default",fn:function(e){return[t.hasEdit?a("el-button",{attrs:{size:"small",icon:"el-icon-edit",circle:"",type:"primary",id:"ph-table-edit"},on:{click:function(a){return t.onDefaultEdit(e.row)}}}):t._e(),t._v(" "),t.hasDelete?a("el-button",{attrs:{type:"danger",size:"mini",id:"ph-table-del",icon:"el-icon-delete",circle:""},on:{click:function(a){return t.onDefaultDelete(e.row)}}}):t._e()]}}],null,!1,277848559)}):t._e()],1),t._v(" "),a("itemDialog",{ref:"itemDialog",attrs:{primary:t.primary},on:{modifyCBEvent:t.modifyCBEvent}})],1)},o=[],r=(a("7f7f"),a("386d"),a("c5f6"),a("ac6a"),a("cebc")),i=a("2f62"),n=a("ed08"),s=a("a4af"),c=a("c971"),d=a("dc5a"),u={components:{tableToolBar:s["a"],itemDialog:d["default"]},props:{primary:{type:[Object],default:null}},computed:Object(r["a"])({},Object(i["b"])(["device","rolePower"]),{hasExecute:function(){return[2,3,4,5,6,7,8].indexOf(this.primary.status)>-1}}),filters:{currency:n["b"]},data:function(){return{statusSelectOptions:[],prioritySelectOptions:[],tableMaxHeight:"mobile"!==this.device?500:4e7,confirmLoading:!1,hasOperation:!0,hasAdd:!0,hasEdit:!0,hasDelete:!0,selected:[],url:"/procurementPlanItems",downloadUrl:"",searchParam:{skuCode:null,category:null,status:null,groupName:null},filters:[{field:"procurementPlanId",op:"eq",data:this.primary?this.primary.id:-1}],relations:["cartonSpec","product","product.currency","product.category"],data:[],tableData:[],loading:!1,row:{},toolbarConfig:{hasEdit:!0,hasDelete:!1,hasAdd:!0,hasExportTpl:!0,hasExport:!0,hasImport:!1}}},created:function(){},mounted:function(){var t=this;this.$nextTick(function(){t.initData(),t.getList()})},methods:{initData:function(){this.loading=!0,this.prioritySelectOptions=c["a"].getSelectOptions("Priority"),this.statusSelectOptions=c["a"].getSelectOptions("ProcurementPlanStatus"),this.downloadUrl=this.url,this.filters&&this.filters.length>0&&(this.downloadUrl+="?filters="+JSON.stringify({groupOp:"AND",rules:this.filters})),this.relations&&this.relations.length>0&&(this.downloadUrl+="&relations="+JSON.stringify(this.relations)),[0,8].indexOf(this.primary.status)>-1&&(this.hasDelete=!1,this.toolbarConfig.hasAdd=!1,this.toolbarConfig.hasImport=!1)},dangerClassName:function(t){var e=t.row;t.rowIndex;if(e.saleWeek>0){if(e.safetyStockWeek-e.saleWeek>=2)return"warning-row";if(e.saleWeek-e.safetyStockWeek>=2)return"danger-row"}return""},getSummaries:function(t){var e=t.columns,a=t.data,l=[];return e.forEach(function(t,e){if("product.skuCode"==t.property){var o=a.map(function(e){return e[t.property]});l[e]=o.reduce(function(t){return t+1},0),l[e]="合计: "+l[e]+" 行"}if("cartonQty"==t.property){var r=a.map(function(e){return Number(e[t.property])});r.every(function(t){return isNaN(t)})?l[e]="N/A":(l[e]=r.reduce(function(t,e){var a=Number(e);return isNaN(a)?t:t+e},0),l[e]+=" 箱")}if("amount"==t.property){var i=a.map(function(e){return Number(e[t.property])});i.every(function(t){return isNaN(t)})?l[e]="N/A":(l[e]=i.reduce(function(t,e){var a=Number(e);return isNaN(a)?t:t+e},0),l[e]=Object(n["b"])(l[e]))}}),l},getList:function(){var t=this,e=this.url,a="";e?(this.filters&&this.filters.length>0&&(a+="?filters="+JSON.stringify({groupOp:"AND",rules:this.filters})),this.relations&&this.relations.length>0&&(a+="&relations="+JSON.stringify(this.relations)),this.loading=!0,this.global.axios.get(e+a).then(function(e){var a=e.data,l=a||[];t.data=l,t.search(),t.total=a.length||0,t.loading=!1,t.$emit("update",l,a)}).catch(function(e){t.$emit("error",e),t.loading=!1})):console.warn("url 为空, 不发送请求")},handleSelectionChange:function(t){this.selected=t},search:function(){var t=this;this.tableData=this.data,null!=this.searchParam.category&&""!=this.searchParam.category&&(this.tableData=this.tableData.filter(function(e){if(e.product&&e.product.category&&-1!==e.product.category.name.indexOf(t.searchParam.category))return!0})),null!=this.searchParam.skuCode&&""!=this.searchParam.skuCode&&(this.tableData=this.tableData.filter(function(e){if(e.product&&-1!==e.product.skuCode.indexOf(t.searchParam.skuCode))return!0})),null!=this.searchParam.status&&""!=this.searchParam.status&&(this.tableData=this.tableData.filter(function(e){if(e.status==t.searchParam.status)return!0})),null!=this.searchParam.groupName&&""!=this.searchParam.groupName&&(this.tableData=this.tableData.filter(function(e){if(e.product&&-1!==e.product.groupName.indexOf(t.searchParam.groupName))return!0}))},resetSearch:function(){this.$refs.searchForm.resetFields(),this.searchParam.skuCode=null,this.searchParam.category=null,this.searchParam.groupName=null,this.searchParam.status=null,this.search()},onDefaultEdit:function(t){this.$refs.itemDialog.openDialog(t.id)},onDefaultDelete:function(t){var e=this;this.$confirm("确认删除吗","提示",{type:"warning",beforeClose:function(t,a,l){"confirm"==t?(e.getList(),l()):l()}}).catch(function(t){})},modifyCBEvent:function(t){this.getList()},onToolBarAdd:function(){this.$refs.itemDialog.openDialog(null)},onToolBarEdit:function(){},onToolBarDelete:function(){},onToolBarDownloadTpl:function(){var t=this.$refs.table,e=this.downloadUrl;Promise.all([a.e("chunk-d2907d8a"),a.e("chunk-748b566e")]).then(a.bind(null,"4bf8d")).then(function(a){a.export_el_table_to_excel({table:t,downloadUrl:e,filename:"采购计划内容-模版",noExportProps:["操作","金额","ID","下单件数","发货件数","收货件数"],tpl:!0})})},onToolBarDownloadData:function(){var t=this,e=this.$refs.table,l=this.downloadUrl;Promise.all([a.e("chunk-d2907d8a"),a.e("chunk-748b566e")]).then(a.bind(null,"4bf8d")).then(function(a){t.loading=!0,a.export_el_table_to_excel({table:e,downloadUrl:l,filename:"采购计划内容",noExportProps:["操作","金额","ID"]}),t.loading=!1})},onToolBarImportData:function(){}}},p=u,m=(a("b6a3"),a("2877")),h=Object(m["a"])(p,l,o,!1,null,"24be1b12",null);e["default"]=h.exports}}]);