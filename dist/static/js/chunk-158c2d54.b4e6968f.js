(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-158c2d54","chunk-2d944c03"],{"2f21":function(e,t,a){"use strict";var i=a("79e5");e.exports=function(e,t){return!!e&&i(function(){t?e.call(null,function(){},1):e.call(null)})}},"3e57":function(e,t,a){"use strict";var i=a("8f4f"),r=a.n(i);r.a},"55dd":function(e,t,a){"use strict";var i=a("5ca1"),r=a("d8e8"),s=a("4bf8"),n=a("79e5"),l=[].sort,o=[1,2,3];i(i.P+i.F*(n(function(){o.sort(void 0)})||!n(function(){o.sort(null)})||!a("2f21")(l)),"Array",{sort:function(e){return void 0===e?l.call(s(this)):l.call(s(this),r(e))}})},"8f4f":function(e,t,a){},a62a:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("infoTable",{ref:"infoTable",attrs:{type:e.type,defaultFilters:e.filters}})},r=[],s=a("ac58"),n={components:{infoTable:s["default"]},props:{type:{type:String,default:"valid"}},computed:{filters:function(){return"editing"===this.type?{field:"status",op:"in",data:1}:"auditing"===this.type?{field:"status",op:"in",data:0}:"executing"===this.type?{field:"status",op:"in",data:"2,3,4,5,6,7"}:"complete"===this.type?{field:"status",op:"in",data:8}:"all"===this.type?{}:void 0}},methods:{onRefreshTable:function(){this.$refs.infoTable.onRefreshTable()}}},l=n,o=a("2877"),c=Object(o["a"])(l,i,r,!1,null,null,null);t["default"]=c.exports},ac58:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"ph-table"},[a("el-form",{ref:"searchForm",attrs:{inline:!0,model:e.searchParam,id:"filter-form"},nativeOn:{submit:function(e){e.preventDefault()}}},[a("el-form-item",{attrs:{label:"编码"}},[a("el-input",{staticStyle:{width:"110px"},attrs:{placeholder:"请输入编码"},model:{value:e.searchParam.code.value,callback:function(t){e.$set(e.searchParam.code,"value",t)},expression:"searchParam.code.value"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"名称"}},[a("el-input",{staticStyle:{width:"110px"},attrs:{placeholder:"请输入名称"},model:{value:e.searchParam.name.value,callback:function(t){e.$set(e.searchParam.name,"value",t)},expression:"searchParam.name.value"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"下单截止日"}},[a("el-date-picker",{attrs:{format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",type:"daterange","range-separator":"-","start-placeholder":"开始日期","end-placeholder":"结束日期"},model:{value:e.searchParam.limitTime.value,callback:function(t){e.$set(e.searchParam.limitTime,"value",t)},expression:"searchParam.limitTime.value"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"状态"}},[a("el-select",{staticStyle:{width:"120px"},attrs:{filterable:"",placeholder:"请选择状态"},model:{value:e.searchParam.status.value,callback:function(t){e.$set(e.searchParam.status,"value",t)},expression:"searchParam.status.value"}},e._l(e.statusSelectOptions,function(e,t){return a("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{"native-type":"submit",type:"primary",size:"small"},on:{click:e.search}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{size:"small"},on:{click:e.resetSearch}},[e._v("重置")])],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{stripe:"",border:"","highlight-current-row":"","row-class-name":e.dangerClassName,"cell-style":{padding:"2px 0","font-size":"13px"},"header-cell-style":{padding:"2px 0"},data:e.data,"max-height":e.tableMaxHeight,id:"table"},on:{"selection-change":e.handleSelectionChange,"sort-change":e.handleSortChange}},[a("el-table-column",{attrs:{prop:"code",label:"编号",width:"150",fixed:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"statusName",label:"状态",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-tag",{attrs:{type:1===t.row.status?"warning":0===t.row.status?"danger":2===t.row.status?"primary":8===t.row.status?"info":"success","disable-transitions":""}},[e._v(e._s(t.row.statusName)+"\n        ")])]}}])}),e._v(" "),e.hasCompleteness?a("el-table-column",{attrs:{prop:"note",label:"完成度",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-popover",{attrs:{placement:"top-start",title:"完成度",width:"250",trigger:"hover"}},[a("div",[e._v("\n            完成度："+e._s(t.row.qty.completeness)+"%"),a("BR"),e._v("\n            总件数："+e._s(t.row.qty.qty)+" 件"),a("BR"),e._v("\n            已下单："+e._s(t.row.qty.orderQty)+" 件 ("+e._s(t.row.qty.orderedCompleteness)+"%) "),a("BR"),e._v("\n            已发货："+e._s(t.row.qty.shippedQty)+" 件 ("+e._s(t.row.qty.shippedCompleteness)+"%)"),a("BR"),e._v("\n            已收货："+e._s(t.row.qty.receivedQty)+" 件 ("+e._s(t.row.qty.receivedCompleteness)+"%) "),a("BR")],1),e._v(" "),a("span",{attrs:{slot:"reference"},slot:"reference"},[a("el-progress",{attrs:{"text-inside":!0,"stroke-width":16,percentage:t.row.qty.completeness>100?100:t.row.qty.completeness,status:"success"}})],1)])]}}],null,!1,547056202)}):e._e(),e._v(" "),a("el-table-column",{attrs:{prop:"categoryName",label:"分类","min-width":"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"name",label:"名称","min-width":"250"}}),e._v(" "),a("el-table-column",{attrs:{prop:"formatLimitTime",label:"下单截止日",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"formatExecuteTime",label:"交货截止日",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"tags",label:"标签",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"note",label:"备注",width:"120"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-popover",{attrs:{placement:"top-start",title:"备注",width:"250",trigger:"hover"}},[a("div",{domProps:{innerHTML:e._s(t.row.formatNote)}}),e._v(" "),a("span",{attrs:{slot:"reference"},slot:"reference"},[e._v(e._s(t.row.note?t.row.note.substr(0,8)+"..":""))])])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"creator.name",label:"创建人",width:"120"}}),e._v(" "),a("el-table-column",{attrs:{prop:"id",label:"ID",width:"90"}}),e._v(" "),e.hasOperation?a("el-table-column",{attrs:{label:"操作",width:"100",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasEdit?a("el-button",{attrs:{size:"small",icon:"el-icon-edit",circle:"",type:"primary",id:"ph-table-edit"},on:{click:function(a){return e.onDefaultEdit(t.row)}}}):e._e(),e._v(" "),e.hasDelete?a("el-button",{attrs:{type:"danger",size:"mini",id:"ph-table-del",icon:"el-icon-delete",circle:""},on:{click:function(a){return e.onDefaultDelete(t.row)}}}):e._e()]}}],null,!1,277848559)}):e._e()],1),e._v(" "),a("el-pagination",{ref:"pageForm",staticStyle:{"text-align":"right",padding:"10px 0"},attrs:{"current-page":e.page,"page-sizes":e.paginationSizes,"page-size":e.size,total:e.total,background:"",layout:e.layout,id:"ph-table-page"},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},[a("el-button",{staticClass:"btn-prev",attrs:{icon:"el-icon-refresh",circle:""},on:{click:e.onRefreshTable}})],1),e._v(" "),a("editDialog",{ref:"editDialog",on:{modifyCBEvent:e.modifyCBEvent}})],1)},r=[],s=(a("386d"),a("6b54"),a("456d"),a("ac6a"),a("7f7f"),a("55dd"),a("a481"),a("4917"),a("cebc")),n=(a("3b2b"),a("2f62")),l=a("4328"),o=a.n(l),c=a("d3cd"),h=a("c971"),u=a("3978"),d="~",p=new RegExp(d,"g"),f=",",m="=",g=/=/g,v="q=",b=new RegExp("q=.*"+f),y={components:{editDialog:c["default"],phPercentage:u["a"]},props:{type:{type:String,default:"valid"},defaultFilters:{type:Object,default:{}}},computed:Object(s["a"])({},Object(n["b"])(["device"]),{hasCompleteness:function(){return"editing"!==this.type&&("auditing"!==this.type&&("executing"===this.type||("complete"===this.type||("all"===this.type||void 0))))}}),data:function(){return{tableMaxHeight:"mobile"!==this.device?400:4e7,hasOperation:!0,hasEdit:!0,hasDelete:!0,selected:[],size:20,page:1,layout:"total, sizes, slot, prev, pager, next, jumper",paginationSizes:[1,20,50,100],total:0,url:"/procurementPlans",countUrl:"/procurementPlans/count",relations:["creator"],data:[],phSort:{prop:"id",order:"desc"},loading:!1,statusSelectOptions:[],categorySelectOptions:[],searchParam:{categoryId:{value:null,op:"in",id:"categoryId"},name:{value:null,op:"bw",id:"name"},limitTime:{value:null,op:"timeRange",id:"limitTime"},status:{value:null,op:"eq",id:"status"},code:{value:null,op:"bw",id:"name"}},dialogTitle:"新增",dialogVisible:!1,isNew:!0,isEdit:!1,isView:!1,row:{}}},created:function(){},mounted:function(){var e=this;window.onresize=function(){e.getTableHeight()};var t=location.href.match(b);if(t){var a=t[0].substr(2).replace(p,m),i=o.a.parse(a,{delimiter:f});this.page=i.currentPage?1*i.currentPage:this.page,this.size=i.pageSize?1*i.pageSize:this.size,this.phSort.prop=i.sort?i.sort:this.phSort.prop,this.phSort.order=i.dir?i.dir:this.phSort.order,i.categoryId&&(this.searchParam.categoryId.value=i.categoryId),i.limitTime&&(this.searchParam.limitTime.value=i.limitTime),i.name&&(this.searchParam.name.value=i.name),i.status&&(this.searchParam.status.value=i.status),i.code&&(this.searchParam.code.value=i.code)}this.$nextTick(function(){e.getTableHeight(),e.initData(),e.getList()})},methods:{initData:function(){this.statusSelectOptions=h["a"].getSelectOptions("ProcurementPlanStatus"),"editing"===this.type||("auditing"===this.type?this.hasDelete=!1:"executing"===this.type?this.hasDelete=!1:"complete"===this.type?this.hasDelete=!1:this.type)},getTableHeight:function(){if("mobile"!==this.device){var e=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,t=e;t-=84,t-=82,t-=this.$refs.searchForm?this.$refs.searchForm.$el.offsetHeight:0,t-=this.$refs.operationForm?this.$refs.operationForm.$el.offsetHeight:0,t-=this.$refs.pageForm?this.$refs.pageForm.$el.offsetHeight:0,t-=42,this.tableMaxHeight=t}else this.tableMaxHeight=400},search:function(){var e=this;this.$refs.searchForm.validate(function(t){t&&(e.page=1,e.getList(!0))})},resetSearch:function(){var e=this;this.$refs.searchForm.resetFields(),this.page=1,this.searchParam.categoryId.value=null,this.searchParam.limitTime.value=null,this.searchParam.name.value=null,this.searchParam.status.value=null,this.searchParam.code.value=null,history.replaceState(history.state,"",location.href.replace(b,"")),this.$nextTick(function(){e.getList()}),this.$emit("reset"),this.$emit("update:customQuery",Object.assign(this.customQuery,JSON.parse(this.initCustomQuery)))},exempleFormatter:function(e,t){return""},dangerClassName:function(e){e.row;return""},getList:function(e){var t=this,a=this.url,i=this.countUrl,r="",s="",n=this.size,l=this.page;if(a)if(i){a.indexOf("?")>-1?a+="&":a+="?",i.indexOf("?")>-1?i+="&":i+="?",r+="pageSize=".concat(n,"&currentPage=").concat(l),s+="pageSize=".concat(n,"&currentPage=").concat(l),this.phSort&&(r+="&sort=".concat(this.phSort.prop,"&dir=").concat(this.phSort.order),s+="&sort=".concat(this.phSort.prop,"&dir=").concat(this.phSort.order));var o=[];if(Object.keys(this.searchParam).filter(function(e){return t.searchParam[e]&&""!==t.searchParam[e].value&&null!==t.searchParam[e].value&&void 0!==t.searchParam[e].value}).forEach(function(e){o.push({field:e,op:t.searchParam[e].op?t.searchParam[e].op:"eq",data:t.searchParam[e].value?encodeURIComponent(t.searchParam[e].value.toString().trim()):""})}),o.forEach(function(e,t){s+="&"+e.field+"="+encodeURIComponent(e.data?e.data.toString().trim():"")}),o.push(JSON.parse(JSON.stringify(this.defaultFilters))),o&&o.length>0&&(r+="&filters="+JSON.stringify({groupOp:"AND",rules:o})),this.relations&&this.relations.length>0&&(r+="&relations="+JSON.stringify(this.relations)),this.loading=!0,this.global.axios.get(i+r).then(function(e){var a=e.data;t.total=a||0}).catch(function(e){}),this.global.axios.get(a+r).then(function(e){var a=e.data,i=a||[];t.data=i,t.loading=!1,t.$emit("update",i,a)}).catch(function(e){t.$emit("error",e),t.loading=!1}),e>0){var c="",h=v+s.replace(/&/g,f).replace(g,d)+f;if(location.href.indexOf(v)>-1)c=location.href.replace(b,h);else{var u=location.href.indexOf("?")>-1?"&".concat(h):"?".concat(h);c=location.origin+location.pathname+location.search+location.hash+u}history.pushState(history.state,"ph-table search",c)}}else console.warn("countUrl 为空, 异常！如果不需要统计结果数量。请查找删除 countUrl 相关代码!");else console.warn("url 为空, 不发送请求")},handleSelectionChange:function(e){this.selected=e,this.$emit("selection-change",e)},handleSortChange:function(e){e.prop&&(this.phSort.prop=e.prop,this.phSort.order="ascending"===e.order?"asc":"desc"),this.page=1,this.getList(!0)},handleSizeChange:function(e){this.size!==e&&(this.page=1,this.size=e,this.getList(!0))},handleCurrentChange:function(e){this.page!==e&&(this.page=e,this.getList(!0))},onRefreshTable:function(){this.getList()},onDefaultEdit:function(e){this.$refs.editDialog.openDialog(e.id)},onDefaultDelete:function(e){var t=this,a="".concat(this.url,"/").concat(e.id);this.$confirm("确认删除吗?","提示",{type:"warning",beforeClose:function(e,i,r){"confirm"==e?(t.loading=!0,t.global.axios.delete(a).then(function(e){t.loading=!1,t.$message.info("删除成功!"),r(),t.getList()}).catch(function(e){t.loading=!1})):r()}}).catch(function(e){})},modifyCBEvent:function(e){this.getList()}}},w=y,_=(a("3e57"),a("2877")),S=Object(_["a"])(w,i,r,!1,null,"058569ca",null);t["default"]=S.exports}}]);