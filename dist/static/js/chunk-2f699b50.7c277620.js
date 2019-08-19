(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2f699b50"],{7765:function(e,t,a){},a72a:function(e,t,a){"use strict";a.r(t);var l=function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.dialogVisible?a("el-dialog",{attrs:{title:"智能备货",visible:e.dialogVisible,fullscreen:""},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("el-form",{ref:"searchForm",attrs:{inline:!0,model:e.searchParam,id:"filter-form"},nativeOn:{submit:function(e){e.preventDefault()}}},[a("el-form-item",{attrs:{label:"SKU"}},[a("el-input",{attrs:{placeholder:"请输入SKU",clearable:""},model:{value:e.searchParam.skuCode,callback:function(t){e.$set(e.searchParam,"skuCode",t)},expression:"searchParam.skuCode"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"分类"}},[a("el-input",{attrs:{placeholder:"请输入分类名称",clearable:""},model:{value:e.searchParam.category,callback:function(t){e.$set(e.searchParam,"category",t)},expression:"searchParam.category"}})],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{"native-type":"submit",type:"primary",size:"small"},on:{click:e.search}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{size:"small"},on:{click:e.resetSearch}},[e._v("重置")])],1)],1),e._v(" "),a("div",{staticClass:"ph-table"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{stripe:"",border:"","highlight-current-row":"","max-height":e.tableMaxHeight,"row-class-name":e.dangerClassName,"cell-style":{padding:"2px 0","font-size":"13px"},"header-cell-style":{padding:"2px 0"},data:e.tableData,"show-summary":"","summary-method":e.getSummaries,"default-sort":{prop:"replenishmentCartonPlanQty",order:"descending"},id:"table"},on:{"selection-change":e.handleSelectionChange}},[a("el-table-column",{attrs:{type:"selection",width:"55"}}),e._v(" "),a("el-table-column",{attrs:{prop:"skuCode",label:"SKU",sortable:"",width:"200",fixed:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"categoryName",label:"分类",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"numberOfCarton",label:"装箱数",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"safetyWeek",label:"备货周数",width:"90"}}),e._v(" "),a("el-table-column",{attrs:{prop:"demandedCartonQty",sortable:"",label:"需求总量(箱)",width:"130"}}),e._v(" "),a("el-table-column",{attrs:{prop:"sevenAmendQty",sortable:"",label:"7日销量(件)",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"totalQty",sortable:"",label:"亚马逊含在途库存(件)",width:"200"}}),e._v(" "),a("el-table-column",{attrs:{prop:"domesticStockCartonQty",sortable:"",label:"国内库存(箱)",width:"130"}}),e._v(" "),a("el-table-column",{attrs:{prop:"unfinishedPlanCartonQty",sortable:"",label:"国内在途(箱)",width:"130"}}),e._v(" "),a("el-table-column",{attrs:{prop:"productName",label:"名称",width:"200"}}),e._v(" "),a("el-table-column",{attrs:{prop:"fnSku",label:"FNSKU","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"vipLevel",label:"Vip级别",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"cartonSpecCode",label:"箱规",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"numberOfPallets",label:"托盘装箱数",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"saleWeek",sortable:"",label:"可售周数",width:"120",fixed:"right"}}),e._v(" "),a("el-table-column",{attrs:{prop:"replenishmentCartonPlanQty",sortable:"",label:"采购箱数",width:"120",fixed:"right"}}),e._v(" "),e.hasOperation?a("el-table-column",{attrs:{label:"操作",width:"50",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasDelete?a("el-button",{attrs:{type:"danger",size:"mini",id:"ph-table-del",icon:"el-icon-delete",circle:""},on:{click:function(a){return e.onDefaultDelete(t.row)}}}):e._e()]}}],null,!1,2340255448)}):e._e()],1),e._v(" "),a("el-col",{attrs:{md:24}},[a("el-row",{attrs:{type:"flex",justify:"center"}},[a("el-button",{staticStyle:{"margin-top":"15px"},attrs:{type:"primary",loading:e.confirmLoading},on:{click:e.onCreateObject}},[e._v("\n          生成采购计划\n        ")])],1)],1)],1)],1):e._e()},n=[],i=(a("c5f6"),a("386d"),a("ac6a"),a("cebc")),r=a("2f62"),o={components:{},props:{},computed:Object(i["a"])({},Object(r["b"])(["device"])),data:function(){return{tableMaxHeight:"mobile"!==this.device?400:4e7,dialogVisible:!1,confirmLoading:!1,hasOperation:!0,hasDelete:!0,selected:[],object:null,url:null,searchParam:{skuCode:null,category:null},relations:[],data:[],tableData:[],loading:!1,row:{}}},created:function(){},mounted:function(){var e=this;this.$nextTick(function(){e.getTableHeight(),e.initData(),e.getList()})},methods:{initData:function(){},getTableHeight:function(){if("mobile"!==this.device){var e=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,t=e;t-=200,this.tableMaxHeight=t}else this.tableMaxHeight=400},openDialog:function(e){this.dialogVisible=!0,this.object=e,this.url="/amazonStocks/plans/".concat(e.merchantId,"?warehouse=").concat(e.warehouseId.join(","),"&category=").concat(e.categoryId.join(","),"&safetyStockWeek=").concat(e.safetyStockWeek,"&vip1SafetyStockWeek=").concat(e.vip1SafetyStockWeek,"&vip2SafetyStockWeek=").concat(e.vip2SafetyStockWeek,"&exclude=").concat(e.handleMethod),this.getTableHeight(),this.initData(),this.getList()},dangerClassName:function(e){e.row;return""},onDefaultDelete:function(e){var t=this;this.$confirm("确认删除吗","提示",{type:"warning",beforeClose:function(a,l,n){if("confirm"==a){var i=null;t.data.forEach(function(t,a){t.skuCode!==e.skuCode||(i=a)}),t.date=t.data.splice(i,1),t.search(),n()}else n()}}).catch(function(e){})},getSummaries:function(e){var t=e.columns,a=e.data,l=[];return t.forEach(function(e,t){if(0!==t){if("replenishmentCartonPlanQty"==e.property){var n=a.map(function(t){return Number(t[e.property])});n.every(function(e){return isNaN(e)})?l[t]="N/A":(l[t]=n.reduce(function(e,t){var a=Number(t);return isNaN(a)?e:e+t},0),l[t]+=" 箱")}if("skuCode"==e.property){var i=a.map(function(t){return t[e.property]});l[t]=i.reduce(function(e){return e+1},0),l[t]+=" 行"}}else l[t]="合计"}),l},getList:function(){var e=this,t=this.url;t&&(t.indexOf("?")>-1?t+="&":t+="?",this.relations&&this.relations.length>0&&(params+="&relations="+JSON.stringify(this.relations)),this.loading=!0,this.global.axios.get(t).then(function(t){var a=t.data,l=a||[];e.data=l,e.search(),e.loading=!1,e.$emit("update",l,a)}).catch(function(t){e.$emit("error",t),e.loading=!1}))},handleSelectionChange:function(e){this.selected=e},onCreateObject:function(){var e=this;null==this.selected||0==this.selected.length?this.$confirm("您没有选择任何推荐备货的商品，如果您确认。将手工维护采购计划明细，是否继续？","提示",{type:"warning",beforeClose:function(t,a,l){"confirm"==t?(l(),e.createObject()):l()}}).catch(function(e){}):this.createObject()},createObject:function(){var e=this;this.loading=!0,this.confirmLoading=!0;var t=JSON.parse(JSON.stringify(this.object));t.warehouseId=t.warehouseId?t.warehouseId.join(","):"";var a=[];this.selected.forEach(function(e){e.safetyStockWeek=e.safetyWeek,e.cartonQty=e.replenishmentCartonPlanQty,e.sevenSalesCount=e.sevenAmendQty,e.amazonTotalStock=e.totalQty,a.push(e)}),t.planItems=JSON.parse(JSON.stringify(a)),this.global.axios.post("/procurementPlans",t).then(function(t){var a=t.data;e.$message({type:"success",message:"操作成功"}),e.loading=!1,e.confirmLoading=!1,e.dialogVisible=!1,e.$emit("createCBEvent",a.id)}).catch(function(t){e.loading=!1,e.confirmLoading=!1})},search:function(){var e=this;this.tableData=this.data,null!=this.searchParam.category&&""!=this.searchParam.category&&(this.tableData=this.tableData.filter(function(t){if(t.categoryName&&-1!==t.categoryName.indexOf(e.searchParam.category))return!0})),null!=this.searchParam.skuCode&&""!=this.searchParam.skuCode&&(this.tableData=this.tableData.filter(function(t){if(-1!==t.skuCode.indexOf(e.searchParam.skuCode))return!0}))},resetSearch:function(){this.$refs.searchForm.resetFields(),this.searchParam.skuCode=null,this.searchParam.category=null,this.search()}}},s=o,c=(a("ecf3"),a("2877")),u=Object(c["a"])(s,l,n,!1,null,"669ac0ad",null);t["default"]=u.exports},ecf3:function(e,t,a){"use strict";var l=a("7765"),n=a.n(l);n.a}}]);