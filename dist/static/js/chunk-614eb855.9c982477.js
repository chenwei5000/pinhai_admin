(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-614eb855"],{3387:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"ph-table"},[a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{stripe:"",border:"","highlight-current-row":"","row-class-name":e.dangerClassName,"cell-style":{padding:"2px 0","font-size":"13px"},"header-cell-style":{padding:"2px 0"},data:e.data,"max-height":e.tableMaxHeight,id:"table"},on:{"selection-change":e.handleSelectionChange,"sort-change":e.handleSortChange}},[a("el-table-column",{attrs:{prop:"statusName",label:"状态",width:"100",fixed:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"skuCode",label:"SKU编码",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"product.name",label:"产品名",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"priorityName",label:"优先级",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"cartonSpecName",label:"箱规",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"qty",label:"采购件数",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"numberOfCarton",label:"采购箱数",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"wu",label:"销售要求",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"price",label:"采购价",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"amount",label:"总金额",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"shippedQty",label:"发货数量",width:"100"}}),e._v(" "),a("el-table-column",{attrs:{prop:"receivedQty",label:"收货数量",width:"100"}})],1),e._v(" "),a("el-pagination",{ref:"pageForm",staticStyle:{"text-align":"right",padding:"10px 0"},attrs:{"current-page":e.page,"page-sizes":e.paginationSizes,"page-size":e.size,total:e.total,background:"",layout:e.layout,id:"ph-table-page"},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},[a("el-button",{staticClass:"btn-prev",attrs:{icon:"el-icon-refresh",circle:""},on:{click:e.onRefreshTable}})],1)],1)},n=[],r=(a("a481"),a("7f7f"),a("6b54"),a("456d"),a("ac6a"),a("cebc")),o=(a("3b2b"),a("2f62")),l=(a("4328"),a("1c46"),"~"),s=(new RegExp(l,"g"),","),c=new RegExp("q=.*"+s),h={components:{},props:{},computed:Object(r["a"])({},Object(o["b"])(["device"]),{phTableAttrs:function(){return Object.assign(this.defaultTableAttrs,this.tableAttrs)}}),data:function(){return{tableMaxHeight:"mobile"!==this.device?400:4e7,hasOperation:!0,hasEdit:!0,hasDelete:!0,hasSetting:!0,selected:[],size:20,page:1,layout:"total, sizes, slot, prev, pager, next, jumper",paginationSizes:[20,50,100],total:0,url:"/procurementOrderItems",relations:["product","currency","cartonSpec","procurementOrder","procurementPlanItem","product.supplier"],data:[],phSort:{prop:"id",order:"asc"},loading:!1,searchParam:{procurementOrderId:{value:"511",op:"eq",id:"procurementOrderId"},name:{value:null,op:"bw",id:"name"},status:{value:null,op:"eq",id:"status"}},dialogTitle:"新增",dialogVisible:!1,isNew:!0,isEdit:!1,isView:!1,confirmLoading:!1,row:{}}},created:function(){},mounted:function(){var e=this;console.log(11111),window.onresize=function(){e.getTableHeight()},this.getList(),this.$nextTick(function(){e.getTableHeight(),e.getList()})},methods:{getTableHeight:function(){this.tableMaxHeight=500},getList:function(e){var t=this,a=this.url,i="",n=this.size,r=this.page;if(a){a.indexOf("?")>-1?a+="&":a+="?",i+="pageSize=".concat(n,"&currentPage=").concat(r),this.phSort&&(i+="&sort=".concat(this.phSort.prop,"&dir=").concat(this.phSort.order));var o=[];Object.keys(this.searchParam).filter(function(e){return t.searchParam[e]&&""!==t.searchParam[e].value&&null!==t.searchParam[e].value&&void 0!==t.searchParam[e].value}).forEach(function(e){o.push({field:e,op:t.searchParam[e].op?t.searchParam[e].op:"eq",data:t.searchParam[e].value?encodeURIComponent(t.searchParam[e].value.toString().trim()):""})}),o&&o.length>0&&(i+="&filters="+JSON.stringify({groupOp:"AND",rules:o})),this.relations&&this.relations.length>0&&(i+="&relations="+JSON.stringify(this.relations)),this.loading=!0,this.global.axios.get(a+i).then(function(e){var a=e.data,i=a||[];t.data=i,t.total=i.length||0,t.loading=!1,t.$emit("update",i,a)}).catch(function(e){t.$emit("error",e),t.loading=!1})}else console.warn("url 为空, 不发送请求")},search:function(){var e=this;this.$refs.searchForm.validate(function(t){t&&(e.page=1,e.getList(!0))})},resetSearch:function(){var e=this;this.$refs.searchForm.resetFields(),this.searchParam.name.value=null,this.searchParam.status.value=null,this.page=1,history.replaceState(history.state,"",location.href.replace(c,"")),this.$nextTick(function(){e.getList()})},dangerClassName:function(e){e.row;return""},handleSizeChange:function(e){this.size!==e&&(this.page=1,this.size=e,this.getList(!0))},handleCurrentChange:function(e){this.page!==e&&(this.page=e,this.getList(!0))},handleSelectionChange:function(e){this.selected=e,this.$emit("selection-change",e)},handleSortChange:function(e){e.prop&&(this.phSort.prop=e.prop,this.phSort.order="ascending"===e.order?"asc":"desc"),this.page=1,this.getList(!0)},onDefaultEdit:function(e){this.$emit("openEditDialog",e)},onDefaultView:function(e){this.$emit("onDefaultView",e)},cancel:function(){},confirm:function(){},onRefreshTable:function(){this.getList()},onDefaultDelete:function(e){var t=this;this.$confirm("确认删除？").then(function(a){var i=e.id,n="/procurementOrders/".concat(i);console.log("delete ",n),t.global.axios.delete(n).then(function(e){console.log("data ",e)}).catch(function(e){console.log("删除失败")})}).catch(function(e){})}}},u=h,p=(a("4563"),a("2877")),d=Object(p["a"])(u,i,n,!1,null,"fc4a80d0",null);t["default"]=d.exports},4:function(e,t){},4563:function(e,t,a){"use strict";var i=a("84a4"),n=a.n(i);n.a},5:function(e,t){},6:function(e,t){},7:function(e,t){},"84a4":function(e,t,a){}}]);