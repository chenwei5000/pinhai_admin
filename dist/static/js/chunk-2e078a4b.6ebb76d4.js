(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2e078a4b","chunk-4c2dc106"],{"2f21":function(e,t,a){"use strict";var r=a("79e5");e.exports=function(e,t){return!!e&&r(function(){t?e.call(null,function(){},1):e.call(null)})}},"55dd":function(e,t,a){"use strict";var r=a("5ca1"),i=a("d8e8"),s=a("4bf8"),n=a("79e5"),l=[].sort,o=[1,2,3];r(r.P+r.F*(n(function(){o.sort(void 0)})||!n(function(){o.sort(null)})||!a("2f21")(l)),"Array",{sort:function(e){return void 0===e?l.call(s(this)):l.call(s(this),i(e))}})},7701:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("infoTable",{ref:"infoTable",attrs:{type:e.type,defaultFilters:e.filters}})},i=[],s=a("7715"),n={components:{infoTable:s["default"]},props:{type:{type:String,default:"valid"}},computed:{filters:function(){return"shipped"===this.type?{field:"status",op:"in",data:4}:"complete"===this.type?{field:"status",op:"in",data:6}:"all"===this.type?{field:"status",op:"in",data:"4,6"}:void 0}},methods:{onRefreshTable:function(){this.$refs.infoTable.onRefreshTable()}}},l=n,o=a("2877"),c=Object(o["a"])(l,r,i,!1,null,null,null);t["default"]=c.exports},7715:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"ph-table"},[a("el-form",{ref:"searchForm",attrs:{inline:!0,model:e.searchParam,id:"filter-form"},nativeOn:{submit:function(e){e.preventDefault()}}},[a("el-form-item",{attrs:{label:"编码"}},[a("el-input",{staticStyle:{width:"110px"},attrs:{placeholder:"请输入编码"},model:{value:e.searchParam.code.value,callback:function(t){e.$set(e.searchParam.code,"value",t)},expression:"searchParam.code.value"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"供货商"}},[a("el-select",{staticStyle:{width:"120px"},attrs:{filterable:"",placeholder:"请选择供货商"},model:{value:e.searchParam.supplierId.value,callback:function(t){e.$set(e.searchParam.supplierId,"value",t)},expression:"searchParam.supplierId.value"}},e._l(e.supplierSelectOptions,function(e,t){return a("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("el-form-item",{attrs:{label:"收货仓库"}},[a("el-select",{staticStyle:{width:"120px"},attrs:{filterable:"",placeholder:"请选择收货仓库"},model:{value:e.searchParam.warehouseId.value,callback:function(t){e.$set(e.searchParam.warehouseId,"value",t)},expression:"searchParam.warehouseId.value"}},e._l(e.warehouseSelectOptions,function(e,t){return a("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{"native-type":"submit",type:"primary",size:"small"},on:{click:e.search}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{size:"small"},on:{click:e.resetSearch}},[e._v("重置")])],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{stripe:"",border:"","highlight-current-row":"","row-class-name":e.dangerClassName,"cell-class-name":"ph-cell","header-cell-class-name":"ph-cell-header",data:e.data,"max-height":e.tableMaxHeight,id:"table"},on:{"selection-change":e.handleSelectionChange,"sort-change":e.handleSortChange}},[a("el-table-column",{attrs:{prop:"code",label:"编码",width:"150",fixed:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"statusName",label:"状态",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-tag",{attrs:{type:0===t.row.status?"warning":3===t.row.status?"primary":6===t.row.status?"info":"success","disable-transitions":""}},[e._v(e._s(t.row.statusName)+"\n        ")])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"supplier.name",label:"供货商","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"warehouse.name",label:"收货仓库","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"trackNumber",label:"物流信息",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[e._v("\n      物流单号: "+e._s(t.row.trackNumber)),a("br"),e._v("\n    物流公司:  "+e._s(t.row.channel)),a("br"),e._v("\n    车牌:  "+e._s(t.row.plateNumber)),a("br"),e._v("\n    联系人: "+e._s(t.row.linkman)),a("br"),e._v("\n    电话: "+e._s(t.row.tel)),a("br")]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"formatExpectTime",label:"预计到货日期",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"formatReceivedTime",label:"收货日期",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"remark",label:"备注",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-popover",{attrs:{placement:"top-start",title:"备注",width:"250",trigger:"hover"}},[a("div",{domProps:{innerHTML:e._s(t.row.formatRemark)}}),e._v(" "),a("span",{attrs:{slot:"reference"},slot:"reference"},[e._v(e._s(t.row.remark?t.row.remark.substr(0,8)+"..":""))])])]}}])}),e._v(" "),e.hasOperation?a("el-table-column",{attrs:{label:"操作",width:"100",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasEdit?a("el-button",{attrs:{size:"small",icon:"el-icon-edit",circle:"",type:"primary",id:"ph-table-edit"},on:{click:function(a){return e.onDefaultEdit(t.row)}}}):e._e()]}}],null,!1,2159769287)}):e._e()],1),e._v(" "),a("el-pagination",{ref:"pageForm",staticStyle:{"text-align":"right",padding:"10px 0"},attrs:{"current-page":e.page,"page-sizes":e.paginationSizes,"page-size":e.size,total:e.total,background:"",layout:e.layout,id:"ph-table-page"},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},[a("el-button",{staticClass:"btn-prev",attrs:{icon:"el-icon-refresh",circle:""},on:{click:e.onRefreshTable}})],1),e._v(" "),a("editDialog",{ref:"editDialog",on:{modifyCBEvent:e.modifyCBEvent}})],1)},i=[],s=(a("386d"),a("6b54"),a("456d"),a("ac6a"),a("7f7f"),a("55dd"),a("a481"),a("4917"),a("cebc")),n=(a("3b2b"),a("2f62")),l=a("4328"),o=a.n(l),c=a("5c75"),h=a("c971"),u=a("3978"),p=a("a6b9"),d=a("64dc"),f="~",m=new RegExp(f,"g"),g=",",v="=",b=/=/g,w="q=",S=new RegExp("q=.*"+g),y={components:{editDialog:c["default"],phPercentage:u["a"]},props:{type:{type:String,default:"valid"},defaultFilters:{type:Object,default:{}}},computed:Object(s["a"])({},Object(n["b"])(["device","rolePower"])),data:function(){return{tableMaxHeight:"mobile"!==this.device?400:4e7,hasOperation:!0,hasEdit:!0,hasDelete:!0,selected:[],size:20,page:1,layout:"total, sizes, slot, prev, pager, next, jumper",paginationSizes:[1,20,50,100],total:0,url:"/procurementReceivedOrders",countUrl:"/procurementReceivedOrders/count",relations:["procurementOrder","supplier","warehouse"],data:[],phSort:{prop:"id",order:"desc"},loading:!1,supplierSelectOptions:[],warehouseSelectOptions:[],statusSelectOptions:[],searchParam:{supplierId:{value:null,op:"in",id:"supplierId"},warehouseId:{value:null,op:"in",id:"warehouseId"},code:{value:null,op:"bw",id:"name"}},dialogTitle:"新增",dialogVisible:!1,isNew:!0,isEdit:!1,isView:!1,row:{}}},created:function(){},mounted:function(){var e=this;window.onresize=function(){e.getTableHeight()};var t=location.href.match(S);if(t){var a=t[0].substr(2).replace(m,v),r=o.a.parse(a,{delimiter:g});this.page=r.currentPage?1*r.currentPage:this.page,this.size=r.pageSize?1*r.pageSize:this.size,this.phSort.prop=r.sort?r.sort:this.phSort.prop,this.phSort.order=r.dir?r.dir:this.phSort.order,r.categoryId&&(this.searchParam.categoryId.value=r.categoryId),r.supplierId&&(this.searchParam.supplierId.value=r.supplierId),r.warehouseId&&(this.searchParam.warehouseId.value=r.warehouseId),r.limitTime&&(this.searchParam.limitTime.value=r.limitTime),r.name&&(this.searchParam.name.value=r.name),r.status&&(this.searchParam.status.value=r.status),r.code&&(this.searchParam.code.value=r.code)}this.$nextTick(function(){e.getTableHeight(),e.initData(),e.getList()})},methods:{initData:function(){this.statusSelectOptions=h["a"].getSelectOptions("ProcurementShippedOrderStatus"),this.supplierSelectOptions=p["a"].getSelectOptions(),this.warehouseSelectOptions=d["a"].getSelectOptions()},getTableHeight:function(){if("mobile"!==this.device){var e=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,t=e;t-=84,t-=82,t-=this.$refs.searchForm?this.$refs.searchForm.$el.offsetHeight:0,t-=this.$refs.operationForm?this.$refs.operationForm.$el.offsetHeight:0,t-=this.$refs.pageForm?this.$refs.pageForm.$el.offsetHeight:0,t-=42,this.tableMaxHeight=t}else this.tableMaxHeight=400},search:function(){var e=this;this.$refs.searchForm.validate(function(t){t&&(e.page=1,e.getList(!0))})},resetSearch:function(){var e=this;this.$refs.searchForm.resetFields(),this.page=1,this.searchParam.code.value=null,this.searchParam.supplierId.value=null,this.searchParam.warehouseId.value=null,history.replaceState(history.state,"",location.href.replace(S,"")),this.$nextTick(function(){e.getList()}),this.$emit("reset"),this.$emit("update:customQuery",Object.assign(this.customQuery,JSON.parse(this.initCustomQuery)))},exempleFormatter:function(e,t){return""},dangerClassName:function(e){e.row;return""},getList:function(e){var t=this,a=this.url,r=this.countUrl,i="",s="",n=this.size,l=this.page;if(a)if(r){a.indexOf("?")>-1?a+="&":a+="?",r.indexOf("?")>-1?r+="&":r+="?",i+="pageSize=".concat(n,"&currentPage=").concat(l),s+="pageSize=".concat(n,"&currentPage=").concat(l),this.phSort&&(i+="&sort=".concat(this.phSort.prop,"&dir=").concat(this.phSort.order),s+="&sort=".concat(this.phSort.prop,"&dir=").concat(this.phSort.order));var o=[];if(Object.keys(this.searchParam).filter(function(e){return t.searchParam[e]&&""!==t.searchParam[e].value&&null!==t.searchParam[e].value&&void 0!==t.searchParam[e].value}).forEach(function(e){o.push({field:e,op:t.searchParam[e].op?t.searchParam[e].op:"eq",data:t.searchParam[e].value?encodeURIComponent(t.searchParam[e].value.toString().trim()):""})}),o.forEach(function(e,t){s+="&"+e.field+"="+encodeURIComponent(e.data?e.data.toString().trim():"")}),o.push(JSON.parse(JSON.stringify(this.defaultFilters))),o&&o.length>0&&(i+="&filters="+JSON.stringify({groupOp:"AND",rules:o})),this.relations&&this.relations.length>0&&(i+="&relations="+JSON.stringify(this.relations)),this.loading=!0,this.global.axios.get(r+i).then(function(e){var a=e.data;t.total=a||0}).catch(function(e){}),this.global.axios.get(a+i).then(function(e){var a=e.data,r=a||[];t.data=r,t.loading=!1,t.$emit("update",r,a)}).catch(function(e){t.$emit("error",e),t.loading=!1}),e>0){var c="",h=w+s.replace(/&/g,g).replace(b,f)+g;if(location.href.indexOf(w)>-1)c=location.href.replace(S,h);else{var u=location.href.indexOf("?")>-1?"&".concat(h):"?".concat(h);c=location.origin+location.pathname+location.search+location.hash+u}history.pushState(history.state,"ph-table search",c)}}else console.warn("countUrl 为空, 异常！如果不需要统计结果数量。请查找删除 countUrl 相关代码!");else console.warn("url 为空, 不发送请求")},handleSelectionChange:function(e){this.selected=e,this.$emit("selection-change",e)},handleSortChange:function(e){e.prop&&(this.phSort.prop=e.prop,this.phSort.order="ascending"===e.order?"asc":"desc"),this.page=1,this.getList(!0)},handleSizeChange:function(e){this.size!==e&&(this.page=1,this.size=e,this.getList(!0))},handleCurrentChange:function(e){this.page!==e&&(this.page=e,this.getList(!0))},onRefreshTable:function(){this.getList()},onDefaultEdit:function(e){this.$refs.editDialog.openDialog(e.id)},onDefaultDelete:function(e){var t=this,a="".concat(this.url,"/").concat(e.id);this.$confirm("确认删除吗?","提示",{type:"warning",beforeClose:function(e,r,i){"confirm"==e?(t.loading=!0,t.global.axios.delete(a).then(function(e){t.loading=!1,t.$message.info("删除成功!"),i(),t.getList()}).catch(function(e){t.loading=!1})):i()}}).catch(function(e){})},modifyCBEvent:function(e){this.getList()}}},_=y,P=(a("f230"),a("2877")),O=Object(P["a"])(_,r,i,!1,null,"ffb7129c",null);t["default"]=O.exports},"865e":function(e,t,a){},f230:function(e,t,a){"use strict";var r=a("865e"),i=a.n(r);i.a}}]);