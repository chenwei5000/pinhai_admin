(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-156cafe5","chunk-64fd2a60","chunk-b323bc76"],{"0d03":function(e,t,a){},2835:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("div",{staticClass:"ph-card"},[a("ph-card-header",{attrs:{title:e.title,type:"table"}}),e._v(" "),a("div",{staticClass:"ph-card-body"},[a("roleTable",{on:{openRoleList:e.openRoleList}})],1)],1),e._v(" "),a("roleList",{ref:"roleList"})],1)},n=[],r=a("a4b0"),s=a("71e7"),o={name:"roleMgr",components:{roleTable:r["default"],roleList:s["default"]},data:function(){return{title:"角色管理"}},computed:{},methods:{openRoleList:function(e,t){this.$refs.roleList.$emit("openDiaLog",e,t)}},watch:{}},l=o,c=(a("6280"),a("2877")),h=Object(c["a"])(l,i,n,!1,null,"d9c832e6",null);t["default"]=h.exports},"2f21":function(e,t,a){"use strict";var i=a("79e5");e.exports=function(e,t){return!!e&&i(function(){t?e.call(null,function(){},1):e.call(null)})}},"3cc6":function(e,t,a){},"55dd":function(e,t,a){"use strict";var i=a("5ca1"),n=a("d8e8"),r=a("4bf8"),s=a("79e5"),o=[].sort,l=[1,2,3];i(i.P+i.F*(s(function(){l.sort(void 0)})||!s(function(){l.sort(null)})||!a("2f21")(o)),"Array",{sort:function(e){return void 0===e?o.call(r(this)):o.call(r(this),n(e))}})},6280:function(e,t,a){"use strict";var i=a("d5ae"),n=a.n(i);n.a},"71e7":function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.dialogVisible?a("el-dialog",{attrs:{title:e.title,visible:e.dialogVisible,fullscreen:""},on:{"update:visible":function(t){e.dialogVisible=t}}},[a("div",{staticClass:"custom-tree-container"},[a("el-input",{attrs:{placeholder:"输入关键字进行过滤"},model:{value:e.filterText,callback:function(t){e.filterText=t},expression:"filterText"}}),e._v(" "),a("div",{staticClass:"block",staticStyle:{height:"400px"}},[a("el-scrollbar",{staticStyle:{height:"100%"}},[a("el-tree",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"tree",attrs:{data:e.list,"show-checkbox":"","node-key":"id","default-expand-all":!0,"expand-on-click-node":!1,"check-on-click-node":!0,"filter-node-method":e.filterNode}})],1)],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:e.save}},[e._v("保 存")]),e._v(" "),a("el-button",{on:{click:function(t){e.dialogVisible=!1}}},[e._v("取 消")])],1)]):e._e()},n=[],r=(a("20d6"),{props:{},data:function(){return{title:"",roleId:0,list:[],dialogVisible:!1,loading:!1,filterText:""}},watch:{filterText:function(e){this.$refs.tree.filter(e)}},methods:{save:function(){var e=this,t=this.$refs.tree.getCheckedNodes();this.loading=!0;for(var a=[],i=0;i<t.length;i++){var n=t[i],r={};r.actionId=n.id,a.push(r)}var s="/rolePowers?roleId=".concat(this.roleId);this.global.axios.post(s,a).then(function(t){200==t.status&&e.$message.info("操作成功！"),e.loading=!1})},setDefault:function(e){var t=this,a="/rolePowers?roleId=".concat(e);this.global.axios.get(a).then(function(e){var a=[];if(200==e.status){for(var i=e.data,n=0;n<i.length;n++){var r=i[n],s=r.actionId,o={id:s};a.push(o)}t.$refs.tree.setCheckedNodes(a),t.loading=!1}})},filterNode:function(e,t){return!e||-1!==t.label.indexOf(e)}},mounted:function(){var e=this;this.$on("openDiaLog",function(t,a){e.roleId=t,e.title="".concat(a," 权限管理"),e.dialogVisible=!0,e.loading=!0;var i="/actions";e.global.axios.get(i).then(function(a){var i=[{label:"权限",children:[]}];if(200==a.status){for(var n=a.data,r=function(e){var t=n[e],a=t["resource"],r=i[0].children.findIndex(function(e){return e.label==a});if(-1==r){var s={label:a,children:[{id:"".concat(t.id),label:t["title"]}]};i[0].children.push(s)}else{var o={id:"".concat(t.id),label:t["title"]};i[0].children[r].children.push(o)}},s=0;s<n.length;s++)r(s);e.list=i,e.setDefault(t)}})})}}),s=r,o=(a("8090"),a("2877")),l=Object(o["a"])(s,i,n,!1,null,"664a35b2",null);t["default"]=l.exports},"7e4d":function(e,t,a){"use strict";var i=a("3cc6"),n=a.n(i);n.a},8090:function(e,t,a){"use strict";var i=a("0d03"),n=a.n(i);n.a},a4b0:function(e,t,a){"use strict";a.r(t);var i=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"ph-table"},[a("el-form",{ref:"searchForm",attrs:{inline:!0,model:e.searchParam,id:"filter-form"},nativeOn:{submit:function(e){e.preventDefault()}}},[a("el-form-item",{attrs:{label:"名称"}},[a("el-input",{attrs:{placeholder:"请输入名称"},model:{value:e.searchParam.name.value,callback:function(t){e.$set(e.searchParam.name,"value",t)},expression:"searchParam.name.value"}})],1),e._v(" "),a("el-form-item",{attrs:{label:"状态"}},[a("el-select",{attrs:{placeholder:"请选择状态"},model:{value:e.searchParam.status.value,callback:function(t){e.$set(e.searchParam.status,"value",t)},expression:"searchParam.status.value"}},[a("el-option",{attrs:{label:"开启",value:"1"}}),e._v(" "),a("el-option",{attrs:{label:"关闭",value:"0"}})],1)],1),e._v(" "),a("el-form-item",[a("el-button",{attrs:{"native-type":"submit",type:"primary",size:"small"},on:{click:e.search}},[e._v("查询")]),e._v(" "),a("el-button",{attrs:{size:"small"},on:{click:e.resetSearch}},[e._v("重置")])],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"table",staticStyle:{width:"100%"},attrs:{stripe:"",border:"","highlight-current-row":"","row-class-name":e.dangerClassName,"cell-class-name":"ph-cell","header-cell-class-name":"ph-cell-header",data:e.data,"max-height":e.tableMaxHeight,id:"table"},on:{"selection-change":e.handleSelectionChange,"sort-change":e.handleSortChange,"filter-change":e.handleFilterChange}},[a("el-table-column",{attrs:{prop:"id",label:"ID",width:"100",fixed:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"name",label:"名称","min-width":"250",fixed:"left"}}),e._v(" "),a("el-table-column",{attrs:{prop:"status",label:"状态",width:"100"},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-tag",{attrs:{type:1===t.row.status?"success":"info","disable-transitions":""}},[e._v(e._s(1===t.row.status?"启用":"关闭")+"\n        ")])]}}])}),e._v(" "),a("el-table-column",{attrs:{prop:"formatLastModified",label:"修改时间",width:"150",fixed:"left"}}),e._v(" "),e.hasOperation?a("el-table-column",{attrs:{label:"操作",width:"150",fixed:"right"},scopedSlots:e._u([{key:"default",fn:function(t){return[e.hasEdit?a("el-button",{attrs:{size:"mini",icon:"el-icon-edit",circle:"",type:"primary",id:"ph-table-edit"},on:{click:function(a){return e.onDefaultEdit(t.row)}}}):e._e(),e._v(" "),e.hasDelete?a("el-button",{attrs:{type:"danger",size:"mini",id:"ph-table-del",icon:"el-icon-delete",circle:""},on:{click:function(a){return e.onDefaultDelete(t.row)}}}):e._e(),e._v(" "),e.hasSetting?a("el-button",{attrs:{type:"warning",size:"mini",id:"ph-table-setting",icon:"el-icon-setting",circle:""},on:{click:function(a){return e.onDefaultSetting(t.row)}}}):e._e()]}}],null,!1,2777522398)}):e._e()],1),e._v(" "),a("el-pagination",{ref:"pageForm",staticStyle:{"text-align":"right",padding:"10px 0"},attrs:{"current-page":e.page,"page-sizes":e.paginationSizes,"page-size":e.size,total:e.total,background:"",layout:e.layout,id:"ph-table-page"},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}},[a("el-button",{staticClass:"btn-prev",attrs:{icon:"el-icon-refresh",circle:""},on:{click:e.onRefreshTable}})],1)],1)},n=[],r=(a("386d"),a("6b54"),a("456d"),a("ac6a"),a("7f7f"),a("55dd"),a("a481"),a("4917"),a("cebc")),s=(a("3b2b"),a("2f62")),o=a("4328"),l=a.n(o),c="~",h=new RegExp(c,"g"),u=",",d="=",f=/=/g,p="q=",g=new RegExp("q=.*"+u),m={components:{},props:{},computed:Object(r["a"])({},Object(s["b"])(["device","rolePower","rolePower"]),{phTableAttrs:function(){return Object.assign(this.defaultTableAttrs,this.tableAttrs)}}),data:function(){return{tableMaxHeight:"mobile"!==this.device?400:4e7,hasOperation:!0,hasEdit:!0,hasDelete:!0,hasSetting:!0,selected:[],size:20,page:1,layout:"total, sizes, slot, prev, pager, next, jumper",paginationSizes:[20,50,100],total:0,url:"/roles",countUrl:"/roles/count",relations:[],data:[],phSort:{prop:"id",order:"asc"},loading:!1,searchParam:{name:{value:null,op:"bw",id:"name"},status:{value:null,op:"eq",id:"status"}},dialogTitle:"新增",dialogVisible:!1,isNew:!0,isEdit:!1,isView:!1,confirmLoading:!1,row:{}}},created:function(){},mounted:function(){var e=this;window.onresize=function(){e.getTableHeight()};var t=location.href.match(g);if(t){var a=t[0].substr(2).replace(h,d),i=l.a.parse(a,{delimiter:u});this.page=i.currentPage?1*i.currentPage:this.page,this.size=i.pageSize?1*i.pageSize:this.size,this.phSort.prop=i.sort?i.sort:this.phSort.prop,this.phSort.order=i.dir?i.dir:this.phSort.order,i.name&&(this.searchParam.name.value=i.name),null!==i.status&&(this.searchParam.status.value=i.status)}this.$nextTick(function(){e.getTableHeight(),e.getList()})},methods:{getTableHeight:function(){if("mobile"!==this.device){var e=window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight,t=e;t-=84,t-=82,t-=this.$refs.searchForm?this.$refs.searchForm.$el.offsetHeight:0,t-=this.$refs.operationForm?this.$refs.operationForm.$el.offsetHeight:0,t-=this.$refs.pageForm?this.$refs.pageForm.$el.offsetHeight:0,t-=42,this.tableMaxHeight=t}else this.tableMaxHeight=400},getList:function(e){var t=this,a=this.url,i=this.countUrl,n="",r="",s=this.size,o=this.page;if(a){a.indexOf("?")>-1?a+="&":a+="?",i.indexOf("?")>-1?i+="&":i+="?",n+="pageSize=".concat(s,"&currentPage=").concat(o),r+="pageSize=".concat(s,"&currentPage=").concat(o),this.phSort&&(n+="&sort=".concat(this.phSort.prop,"&dir=").concat(this.phSort.order),r+="&sort=".concat(this.phSort.prop,"&dir=").concat(this.phSort.order));var l=[];if(Object.keys(this.searchParam).filter(function(e){return t.searchParam[e]&&""!==t.searchParam[e].value&&null!==t.searchParam[e].value&&void 0!==t.searchParam[e].value}).forEach(function(e){l.push({field:e,op:t.searchParam[e].op?t.searchParam[e].op:"eq",data:t.searchParam[e].value?encodeURIComponent(t.searchParam[e].value.toString().trim()):""})}),l.forEach(function(e,t){r+="&"+e.field+"="+encodeURIComponent(e.data?e.data.toString().trim():"")}),l&&l.length>0&&(n+="&filters="+JSON.stringify({groupOp:"AND",rules:l})),this.relations&&this.relations.length>0&&(n+="&relations="+JSON.stringify(this.relations)),this.loading=!0,this.global.axios.get(i+n).then(function(e){var a=e.data;t.total=a||0}).catch(function(e){}),this.global.axios.get(a+n).then(function(e){var a=e.data,i=a||[];t.data=i,t.loading=!1,t.$emit("update",i,a)}).catch(function(e){t.$emit("error",e),t.loading=!1}),e>0){var h="",d=p+r.replace(/&/g,u).replace(f,c)+u;if(location.href.indexOf(p)>-1)h=location.href.replace(g,d);else{var m=location.hash.indexOf("?")>-1?"&".concat(d):"?".concat(d);h=location.origin+location.pathname+location.search+location.hash+m}history.pushState(history.state,"ph-table search",h)}}else console.warn("url 为空, 不发送请求")},search:function(){var e=this;this.$refs.searchForm.validate(function(t){t&&(e.page=1,e.getList(!0))})},resetSearch:function(){var e=this;this.$refs.searchForm.resetFields(),this.searchParam.name.value=null,this.searchParam.status.value=null,this.page=1,history.replaceState(history.state,"",location.href.replace(g,"")),this.$nextTick(function(){e.getList()}),this.$emit("reset"),this.$emit("update:customQuery",Object.assign(this.customQuery,JSON.parse(this.initCustomQuery)))},dangerClassName:function(e){e.row;return""},handleSizeChange:function(e){this.size!==e&&(this.page=1,this.size=e,this.getList(!0))},handleCurrentChange:function(e){this.page!==e&&(this.page=e,this.getList(!0))},handleSelectionChange:function(e){this.selected=e,this.$emit("selection-change",e)},handleSortChange:function(e){e.prop&&(this.phSort.prop=e.prop,this.phSort.order="ascending"===e.order?"asc":"desc"),this.page=1,this.getList(!0)},handleFilterChange:function(e){for(var t in e)t,e[t]},onDefaultEdit:function(e){var t=this;this.$message.info(e.id);var a="/products/"+e.id;this.relations&&this.relations.length>0&&(a+="?relations="+JSON.stringify(this.relations)),this.global.axios.get(a).then(function(e){var a={title:"编辑产品",component:createFrom,_top_:"3vh",_width_:"90%",data:e.data,callback:function(e){e&&t.getList()}};common.dialog(a)}).catch(function(e){})},onDefaultSetting:function(e){this.$emit("openRoleList",e.id,e.name),this.$message.info(e.id+"")},cancel:function(){},confirm:function(){},onRefreshTable:function(){this.getList()}}},v=m,b=(a("7e4d"),a("2877")),x=Object(b["a"])(v,i,n,!1,null,"450d3349",null);t["default"]=x.exports},d5ae:function(e,t,a){}}]);