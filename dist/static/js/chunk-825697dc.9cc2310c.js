(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-825697dc","chunk-213f78a6","chunk-0020738e"],{"2f21":function(e,t,i){"use strict";var a=i("79e5");e.exports=function(e,t){return!!e&&a(function(){t?e.call(null,function(){},1):e.call(null)})}},"5128d":function(e,t,i){},"55dd":function(e,t,i){"use strict";var a=i("5ca1"),n=i("d8e8"),o=i("4bf8"),s=i("79e5"),c=[].sort,r=[1,2,3];a(a.P+a.F*(s(function(){r.sort(void 0)})||!s(function(){r.sort(null)})||!i("2f21")(c)),"Array",{sort:function(e){return void 0===e?c.call(o(this)):c.call(o(this),n(e))}})},"6ab9":function(e,t,i){"use strict";var a=i("9451"),n=i.n(a);n.a},9451:function(e,t,i){},a4de:function(e,t,i){"use strict";var a=i("5128d"),n=i.n(a);n.a},acb1:function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("el-upload",{staticClass:"upload-demo",attrs:{action:e.uploadUrl,"on-preview":e.handlePreview,"before-remove":e.beforeRemove,"on-success":e.handleSuccess,multiple:"","file-list":e.attachments}},[i("el-button",{staticClass:"button-new-tag"},[e._v("+ 添加附件")])],1)],1)},n=[],o=(i("7f7f"),i("ac6a"),i("ed08"),{components:{},props:{primary:{type:[Object],default:{}}},computed:{uploadUrl:function(){return"".concat(this.global.generateUrl(this.url),"/uploadFiles/").concat(this.primary.id,"?accessToken=").concat(this.$store.state.user.token)}},data:function(){return{url:"/attachments/procurementPlan",relations:["creator"],filters:[{field:"relevanceId",op:"eq",data:this.primary.id}],attachments:[]}},created:function(){},mounted:function(){var e=this;this.$nextTick(function(){e.initData()})},methods:{initData:function(){var e=this;if(this.primary){var t=this.url;this.filters&&this.filters.length>0&&(t+="?filters="+JSON.stringify({groupOp:"AND",rules:this.filters})),this.relations&&this.relations.length>0&&(t+="&relations="+JSON.stringify(this.relations)),this.global.axios.get(t).then(function(t){var i=t.data,a=i||[];e.attachments=[],a.forEach(function(t){e.attachments.push({id:t.id,name:t.fileName,url:"".concat(e.global.generateUrl(e.url),"/view/").concat(t.id,"?accessToken=").concat(e.$store.state.user.token)})})}).catch(function(e){})}},remove:function(e){var t=this;if(this.primary){var i="".concat(this.global.generateUrl(this.url),"/").concat(e.id,"?accessToken=").concat(this.$store.state.user.token);this.global.axios.delete(i).then(function(e){t.$message.info("附件删除成功!")}).catch(function(e){})}},handleSuccess:function(){this.initData()},handlePreview:function(e){window.open(e.url,"_blank")},beforeRemove:function(e,t){var i=this;return this.$confirm("确定移除 ".concat(e.name,"？"),"提示",{beforeClose:function(t,a,n){"confirm"==t?(i.remove(e),n(!0)):n(!1)}})}}}),s=o,c=(i("6ab9"),i("2877")),r=Object(c["a"])(s,a,n,!1,null,"1481a50c",null);t["default"]=r.exports},bc3f:function(e,t,i){"use strict";i.r(t);var a=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"editObject",attrs:{rules:e.rules,model:e.editObject,"status-icon":"",inline:"","label-position":"right","label-width":"120px"}},[i("el-row",[i("el-col",{attrs:{md:10}},[i("el-form-item",{attrs:{label:"发货计划编码",prop:"code"}},[i("el-input",{staticStyle:{width:"220px"},attrs:{"show-word-limit":"",placeholder:"请填写编码",clearable:""},model:{value:e.editObject.code,callback:function(t){e.$set(e.editObject,"code",t)},expression:"editObject.code"}})],1)],1),e._v(" "),i("el-col",{attrs:{md:14}},[i("el-form-item",{attrs:{label:"发货厂商",prop:"supplierId"}},[i("el-input",{staticStyle:{width:"220px"},attrs:{placeholder:"请填写编码",clearable:""},model:{value:e.editObject.supplier.name,callback:function(t){e.$set(e.editObject.supplier,"name",t)},expression:"editObject.supplier.name"}})],1)],1)],1),e._v(" "),i("el-row",[i("el-col",{attrs:{md:10}},[i("el-form-item",{attrs:{label:"收货仓库",prop:"warehouseId"}},[i("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",placeholder:"请选择",change:e.warehouseChange()},model:{value:e.editObject.warehouse.name,callback:function(t){e.$set(e.editObject.warehouse,"name",t)},expression:"editObject.warehouse.name"}},e._l(e.warehouseSelectOptions,function(e,t){return i("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1)],1),e._v(" "),i("el-col",{attrs:{md:14}},[i("el-form-item",{attrs:{label:"预计发货时间",prop:"expectTime"}},[i("el-date-picker",{attrs:{format:"yyyy-MM-dd",type:"date",placeholder:"交货截止日"},model:{value:e.editObject.expectTime,callback:function(t){e.$set(e.editObject,"expectTime",t)},expression:"editObject.expectTime"}})],1)],1)],1),e._v(" "),i("el-row",[i("el-col",{attrs:{md:24}},[i("el-form-item",{attrs:{label:"备注",prop:"note"}},[i("el-col",{attrs:{span:22}},[i("el-input",{attrs:{type:"textarea",maxlength:"500","show-word-limit":"",rows:"3",cols:"80","show-word-limit":""},model:{value:e.editObject.note,callback:function(t){e.$set(e.editObject,"note",t)},expression:"editObject.note"}})],1),e._v(" "),i("el-col",{attrs:{span:2}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"备注信息。支持换行！",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[e._v(" ")])])],1)],1)],1)],1),e._v(" "),i("el-row",[i("el-col",{attrs:{md:24}},[i("el-row",{attrs:{type:"flex",justify:"center"}},[i("el-button",{staticStyle:{"margin-top":"15px"},attrs:{type:"primary",loading:e.confirmLoading},on:{click:e.onSave}},[e._v("\n          保存基本信息\n        ")])],1)],1)],1)],1)},n=[],o=(i("7f7f"),i("ac6a"),i("c405")),s=i("64dc"),c=i("8492"),r=i("8593"),l=(i("ed08"),{components:{},props:{primary:{type:[Object],default:{}}},computed:{},data:function(){return{loading:!1,confirmLoading:!1,warehouseSelectOptions:[],editObject:{},rules:{code:[{required:!0,message:"必须输入",trigger:"blur"}],supplierId:[{required:!0,message:"必须输入",trigger:"blur"}],warehouseId:[{required:!0,message:"必须输入",trigger:"blur"}]}}},created:function(){},mounted:function(){var e=this;this.$nextTick(function(){e.initData()})},methods:{initData:function(){var e=this;if(this.loading=!0,this.primary){this.editObject=this.primary,this.editObject.limitTime=this.primary.formatLimitTime,this.editObject.executeTime=this.primary.formatExecuteTime,this.categorySelectOptions=o["a"].getMineSelectOptions(),this.merchantSelectOptions=c["a"].getSelectOptions(),this.warehouseSelectOptions=s["a"].getSelectDomesticOptions(),r["a"].getConfigInfos().then(function(t){null==e.editObject.safetyStockWeek&&(e.editObject.safetyStockWeek=t.safetyStockWeek),null==e.editObject.vip1SafetyStockWeek&&(e.editObject.vip1SafetyStockWeek=t.vip1SafetyStockWeek),null==e.editObject.vip2SafetyStockWeek&&(e.editObject.vip2SafetyStockWeek=t.vip2SafetyStockWeek)});var t=!0;this.warehouseSelectOptions.forEach(function(e){"-99"==e.value&&(t=!1)}),t&&this.warehouseSelectOptions.unshift({label:"供货商库存",value:"-99"}),this.loading=!1}else this.$message.error("无效的采购计划!"),this.loading=!1},onSave:function(){var e=this;this.$confirm("注意保存基本信息只会修改对应的参数，不会重新计算明细数据，您是否继续？","提示",{type:"warning",beforeClose:function(t,i,a){"confirm"==t?(a(),e.modifyObject()):a()}}).catch(function(e){})},modifyObject:function(){var e=this,t=JSON.parse(JSON.stringify(this.editObject));this.editObject.warehouseId=this.editObject.warehouse.name,this.loading=!0,this.confirmLoading=!0,this.global.axios.put("/procurementShippedOrders/".concat(this.editObject.id),t).then(function(t){var i=t.data;e.$message({type:"success",message:"操作成功"}),e.loading=!1,e.confirmLoading=!1,e.formVisible=!1,e.$emit("modifyCBEvent",i)}).catch(function(t){e.loading=!1,e.confirmLoading=!1})},warehouseChange:function(){this.editObject.warehouseId=this.editObject.warehouse.name}}}),u=l,d=(i("a4de"),i("2877")),f=Object(d["a"])(u,a,n,!1,null,"ff77f0f6",null);t["default"]=f.exports}}]);