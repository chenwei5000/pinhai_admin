(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-15cc4bda","chunk-ee1cd38e","chunk-1976d21e","chunk-17993ff0","chunk-c5340766","chunk-36088a30","chunk-6a749b29"],{"04a0":function(t,e,i){},"0bb6":function(t,e,i){},"0c50":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-collapse",{model:{value:t.activeNames,callback:function(e){t.activeNames=e},expression:"activeNames"}},[i("el-collapse-item",{attrs:{name:"infoFrom"}},[i("div",{staticClass:"title",attrs:{slot:"title"},slot:"title"},[t._v("1. 基本信息")]),t._v(" "),t.completed?i("infoFrom",{ref:"infoFrom",attrs:{primary:t.primary},on:{modifyCBEvent:t.modifyCBEvent}}):t._e()],1),t._v(" "),i("el-collapse-item",{staticStyle:{"margin-top":"10px"},attrs:{name:"itemTable"}},[i("div",{staticClass:"title",attrs:{slot:"title"},slot:"title"},[t._v("2. 采购计划内容")]),t._v(" "),t.completed?i("itemTable",{ref:"itemTable",attrs:{primary:t.primary}}):t._e()],1),t._v(" "),i("el-collapse-item",{staticStyle:{"margin-top":"10px"},attrs:{name:"attachment"}},[i("div",{staticClass:"title",attrs:{slot:"title"},slot:"title"},[t._v("3. 附件")]),t._v(" "),t.completed?i("attachment",{ref:"attachment",attrs:{primary:t.primary}}):t._e()],1)],1),t._v(" "),i("el-row",[i("el-col",{attrs:{md:24}},[i("el-row",{attrs:{type:"flex",justify:"center"}},[i("el-button",{staticStyle:{"margin-top":"15px"},attrs:{type:"primary"},on:{click:t.onNext}},[t._v("\n          下一步 >\n        ")])],1)],1)],1)],1)},n=[],o=(i("c5f6"),i("1311")),s=i("ee0f"),r=i("4595"),l={components:{infoFrom:o["default"],itemTable:s["default"],attachment:r["default"]},props:{primaryId:{type:[Number,String],default:null}},computed:{},data:function(){return{completed:!1,primary:{},activeNames:["infoFrom","itemTable","attachment"]}},created:function(){},mounted:function(){var t=this;this.$nextTick(function(){t.initData()})},methods:{initData:function(){var t=this;this.primaryId&&this.global.axios.get("/procurementPlans/".concat(this.primaryId)).then(function(e){var i=e.data;t.primary=i||{},t.completed=!0}).catch(function(e){t.completed=!0})},onNext:function(){this.$emit("step2CBEvent",2)},onBack:function(){this.$emit("step2CBEvent",0)},modifyCBEvent:function(t){},reloadCBEvent:function(){this.initData()}}},c=l,u=(i("5e08"),i("2877")),d=Object(u["a"])(c,a,n,!1,null,"7fe0a509",null);e["default"]=d.exports},"127b":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"page-container"},[i("aside",[t._v("\n    为了保证本采购计划的执行，需要指派对应的采购负责人，可多选。指派的采购负责人将会收到对应的邮件和系统消息提醒。\n    默认会自动把对应品类的采购负责人自动选中。\n  ")]),t._v(" "),i("h5",[t._v("采购负责人：")]),t._v(" "),t.completed?i("person",{ref:"person",attrs:{primary:t.primary},on:{reloadCBEvent:t.reloadCBEvent}}):t._e(),t._v(" "),i("el-row",[i("el-col",{attrs:{md:12}},[i("el-row",{attrs:{type:"flex",justify:"center"}},[i("el-button",{staticStyle:{"margin-top":"40px"},attrs:{type:"warning"},on:{click:t.onBack}},[t._v("\n          < 上一步\n        ")])],1)],1),t._v(" "),i("el-col",{attrs:{md:12}},[i("el-row",{attrs:{type:"flex",justify:"center"}},[i("el-button",{staticStyle:{"margin-top":"40px"},attrs:{type:"primary"},on:{click:t.onNext}},[t._v("\n          下一步 >\n        ")])],1)],1)],1)],1)},n=[],o=(i("c5f6"),i("84d5")),s={components:{person:o["default"]},props:{primaryId:{type:[Number,String],default:null}},computed:{},data:function(){return{completed:!1,primary:{}}},created:function(){},mounted:function(){var t=this;this.$nextTick(function(){t.initData()})},methods:{initData:function(){var t=this;this.primaryId&&this.global.axios.get("/procurementPlans/".concat(this.primaryId)).then(function(e){var i=e.data;t.primary=i||{},t.completed=!0}).catch(function(e){t.completed=!0})},onNext:function(){this.primary&&this.primary.dataAuthories&&this.primary.dataAuthories.length>0?this.$emit("step3CBEvent",3):this.$message.error("必须选择采购负责人")},onBack:function(){this.$emit("step3CBEvent",1)},reloadCBEvent:function(){this.initData()}}},r=s,l=(i("91aa"),i("2877")),c=Object(l["a"])(r,a,n,!1,null,"14653e61",null);e["default"]=c.exports},1311:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ph-form"},[i("el-form",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"editObject",attrs:{rules:t.rules,model:t.editObject,"status-icon":"",inline:"","label-position":"right","label-width":"120px","inline-message":""}},[i("el-row",[i("el-col",{attrs:{md:10}},[i("el-form-item",{attrs:{label:"销售渠道",prop:"merchantId"}},[i("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",placeholder:"请选择销售渠道"},model:{value:t.editObject.merchantId,callback:function(e){t.$set(t.editObject,"merchantId",e)},expression:"editObject.merchantId"}},t._l(t.merchantSelectOptions,function(t,e){return i("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"以选定的销售渠道（销售店铺）的销售情况为备货依据。",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),i("el-col",{attrs:{md:14}},[i("el-form-item",{attrs:{label:"标签",prop:"tags"}},[i("el-input",{staticStyle:{width:"220px"},attrs:{maxlength:"20","show-word-limit":"",placeholder:"请填写标签",clearable:""},model:{value:t.editObject.tags,callback:function(e){t.$set(t.editObject,"tags",e)},expression:"editObject.tags"}}),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"给计划打上一个标签方便查找",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),i("el-row",[i("el-col",{attrs:{md:10}},[i("el-form-item",{attrs:{label:"分类",prop:"categoryId"}},[i("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",multiple:"",placeholder:"请选择分类,可多选"},on:{change:t.onCateChange},model:{value:t.editObject.categoryId,callback:function(e){t.$set(t.editObject,"categoryId",e)},expression:"editObject.categoryId"}},t._l(t.categorySelectOptions,function(t,e){return i("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"选择需要备货的分类",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),i("el-col",{attrs:{md:14}},[i("el-form-item",{attrs:{label:"款式",prop:"categoryId"}},[i("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",multiple:"",disabled:t.hasCategory,placeholder:"请选择产品款式。可多选"},model:{value:t.editObject.groupName,callback:function(e){t.$set(t.editObject,"groupName",e)},expression:"editObject.groupName"}},t._l(t.groupSelectOptions,function(t,e){return i("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"请选择产品款式,请优先选择分类",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),i("el-row",[i("el-col",{attrs:{md:10}},[i("el-form-item",{attrs:{label:"国内库存",prop:"warehouseId"}},[i("el-select",{staticStyle:{width:"220px"},attrs:{disabled:t.hasCategory,filterable:"",multiple:"",placeholder:"请选择库存,可多选"},model:{value:t.editObject.warehouseId,callback:function(e){t.$set(t.editObject,"warehouseId",e)},expression:"editObject.warehouseId"}},t._l(t.warehouseSelectOptions,function(t,e){return i("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"以选定的仓库库存情况为当前库存依据。请优先选择分类。",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),i("el-col",{attrs:{md:14}},[i("el-form-item",{attrs:{label:"期望交货日期",prop:"limitTime"}},[i("el-date-picker",{attrs:{format:"yyyy-MM-dd","value-format":"yyyy-MM-dd",type:"date",placeholder:"期望交货日期"},model:{value:t.editObject.limitTime,callback:function(e){t.$set(t.editObject,"limitTime",e)},expression:"editObject.limitTime"}}),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"销售期望的交货日期",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),i("el-row",[i("el-col",{attrs:{md:10}},[i("el-form-item",{attrs:{label:"非Vip备货周数",prop:"safetyStockWeek"}},[i("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",placeholder:"请选择非Vip备货周数"},model:{value:t.editObject.safetyStockWeek,callback:function(e){t.$set(t.editObject,"safetyStockWeek",e)},expression:"editObject.safetyStockWeek"}},t._l(52,function(t){return i("el-option",{key:t,attrs:{label:t,value:t}})}),1),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"普通类型的产品，希望支持销售的周数。可在产品管理中查看产品类型。",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),i("el-col",{attrs:{md:14}},[i("el-form-item",{attrs:{label:"Vip1备货周数",prop:"vip1SafetyStockWeek"}},[i("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",placeholder:"请选择Vip1备货周数"},model:{value:t.editObject.vip1SafetyStockWeek,callback:function(e){t.$set(t.editObject,"vip1SafetyStockWeek",e)},expression:"editObject.vip1SafetyStockWeek"}},t._l(52,function(t){return i("el-option",{key:t,attrs:{label:t,value:t}})}),1),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"热卖类型的产品，希望支持销售的周数。可在产品管理中查看产品类型。",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),i("el-row",[i("el-col",{attrs:{md:10}},[i("el-form-item",{attrs:{label:"Vip2备货周数",prop:"vip2SafetyStockWeek"}},[i("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",placeholder:"请选择Vip2备货周数"},model:{value:t.editObject.vip2SafetyStockWeek,callback:function(e){t.$set(t.editObject,"vip2SafetyStockWeek",e)},expression:"editObject.vip2SafetyStockWeek"}},t._l(52,function(t){return i("el-option",{key:t,attrs:{label:t,value:t}})}),1),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"爆款类型的产品，希望支持销售的周数。可在产品管理中查看产品类型。",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),i("el-col",{attrs:{md:14}},[i("el-form-item",{attrs:{label:"未完成采购计划处理方式",prop:"handleMethod"}},[i("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",placeholder:"请选择未完成采购计划处理方式"},model:{value:t.editObject.handleMethod,callback:function(e){t.$set(t.editObject,"handleMethod",e)},expression:"editObject.handleMethod"}},[i("el-option",{attrs:{label:"不考虑",value:"0"}}),t._v(" "),i("el-option",{attrs:{label:"采购计划数量",value:"1"}}),t._v(" "),i("el-option",{attrs:{label:"已下采购单数量",value:"2"}}),t._v(" "),i("el-option",{attrs:{label:"已发货数量",value:"3"}}),t._v(" "),i("el-option",{attrs:{label:"已收货数量",value:"4"}})],1),t._v(" "),i("el-tooltip",{staticClass:"item",attrs:{effect:"light",placement:"right"}},[i("div",{attrs:{slot:"content"},slot:"content"},[t._v("对当前没有结束的其它采购计划的处理方式。"),i("BR"),t._v("\n              例如：选择已发货数量。表示最终需要减去没有完成采购计划中，已经发货的数量。"),i("BR"),t._v("\n              具体各种状态数量可以在采购计划中查看。\n            ")],1),t._v(" "),i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),i("el-row",[i("el-col",{attrs:{md:24}},[i("el-form-item",{attrs:{label:"交货要求",prop:"note"}},[i("el-col",{attrs:{span:22}},[i("el-input",{attrs:{type:"textarea",maxlength:"500","show-word-limit":"",rows:"3",cols:"80","show-word-limit":""},model:{value:t.editObject.note,callback:function(e){t.$set(t.editObject,"note",e)},expression:"editObject.note"}})],1),t._v(" "),i("el-col",{attrs:{span:2}},[i("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"交货要求。提供给采购查看的计划描述。支持换行！",placement:"right"}},[i("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1)],1),t._v(" "),i("el-row",[i("el-col",{attrs:{md:24}},[i("el-row",{attrs:{type:"flex",justify:"center"}},[t.hasEdit?i("el-button",{staticStyle:{"margin-top":"15px"},attrs:{type:"primary",loading:t.confirmLoading},on:{click:t.onSave}},[t._v("\n            保存基本信息\n          ")]):t._e()],1)],1)],1)],1)],1)},n=[],o=(i("7f7f"),i("ac6a"),i("28a5"),i("c405")),s=i("8492"),r=i("8593"),l=i("ed08"),c={components:{},props:{primary:{type:[Object],default:{}}},computed:{hasEdit:function(){return!([0,8].indexOf(this.primary.status)>-1)},hasCategory:function(){return null==this.editObject.categoryId||0==this.editObject.categoryId.length}},data:function(){return{loading:!1,confirmLoading:!1,categorySelectOptions:[],warehouseSelectOptions:[],merchantSelectOptions:[],groupSelectOptions:[],editObject:{id:null,categoryId:null,limitTime:null,executeTime:null,groupName:null,tags:null,note:null,merchantId:null,warehouseId:null,handleMethod:"3",safetyStockWeek:null,vip1SafetyStockWeek:null,vip2SafetyStockWeek:null},rules:{limitTime:[{required:!0,message:"必须输入",trigger:"blur"}],executeTime:[{required:!0,message:"必须输入",trigger:"blur"}],categoryId:[{required:!0,message:"必须输入",trigger:"blur"}],merchantId:[{required:!0,message:"必须输入",trigger:"blur"}],warehouseId:[{required:!0,message:"必须输入",trigger:"blur"}],safetyStockWeek:[{required:!0,message:"必须输入",trigger:"blur"}],vip1SafetyStockWeek:[{required:!0,message:"必须输入",trigger:"blur"}],vip2SafetyStockWeek:[{required:!0,message:"必须输入",trigger:"blur"}],handleMethod:[{required:!0,message:"必须输入",trigger:"blur"}]}}},created:function(){},mounted:function(){var t=this;this.$nextTick(function(){t.initData()})},methods:{initData:function(){var t=this;this.loading=!0,this.primary?(this.editObject=JSON.parse(JSON.stringify(this.primary)),this.editObject.limitTime=this.primary.formatLimitTime,this.editObject.executeTime=this.primary.formatExecuteTime,this.editObject.categoryId=Object(l["f"])(this.primary.categoryId),this.editObject.handleMethod=this.primary.handleMethod+"",this.categorySelectOptions=o["a"].getMineSelectOptions(),this.merchantSelectOptions=s["a"].getSelectOptions(),this.initWarehouseData(this.editObject.categoryId),this.initGroupData(this.editObject.categoryId),r["a"].getConfigInfos().then(function(e){null==t.editObject.safetyStockWeek&&(t.editObject.safetyStockWeek=e.safetyStockWeek),null==t.editObject.vip1SafetyStockWeek&&(t.editObject.vip1SafetyStockWeek=e.vip1SafetyStockWeek),null==t.editObject.vip2SafetyStockWeek&&(t.editObject.vip2SafetyStockWeek=e.vip2SafetyStockWeek)}),this.loading=!1):(this.$message.error("无效的采购计划!"),this.loading=!1)},initGroupData:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(this.primary.groupName&&"string"==typeof this.primary.groupName&&this.primary.groupName.constructor==String?this.editObject.groupName=Object(l["f"])(this.primary.groupName.split(",")):this.primary.groupName&&(this.editObject.groupName=Object(l["f"])(this.primary.groupName)),e){this.loading=!0;var i="/products/listProductGroups";i+="?cateId="+e.join(","),this.global.axios.get(i).then(function(e){var i=e.data||[];t.groupSelectOptions=[],i.forEach(function(e){t.groupSelectOptions.push({label:e,value:e})}),t.loading=!1}).catch(function(e){t.loading=!1})}},initWarehouseData:function(){var t=this,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null;if(this.primary.warehouseId&&"string"==typeof this.primary.warehouseId&&this.primary.warehouseId.constructor==String?this.editObject.warehouseId=Object(l["f"])(this.primary.warehouseId.split(",")):this.primary.warehouseId&&(this.editObject.warehouseId=Object(l["f"])(this.primary.warehouseId)),e){this.loading=!0;var i="/warehouses/category";i+="?cateId="+e.join(","),this.global.axios.get(i).then(function(e){var i=e.data||[];t.warehouseSelectOptions=[],i.forEach(function(e){t.warehouseSelectOptions.push({label:e.name,value:e.id+""})}),t.loading=!1}).catch(function(e){t.loading=!1})}},onSave:function(){var t=this;this.$confirm("注意保存基本信息只会修改对应的参数，不会重新计算明细数据，您是否继续？","提示",{type:"warning",beforeClose:function(e,i,a){"confirm"==e?(a(),t.modifyObject()):a()}}).catch(function(t){})},modifyObject:function(){var t=this,e=JSON.parse(JSON.stringify(this.editObject));e.warehouseId=e.warehouseId?e.warehouseId.join(","):"",e.groupName=e.groupName?e.groupName.join(","):"";var i=this.$loading({lock:!0,text:"保存中..",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"});this.global.axios.put("/procurementPlans/".concat(this.editObject.id),e).then(function(e){var a=e.data;t.$message({type:"success",message:"操作成功"}),i.close(),t.$emit("modifyCBEvent",a)}).catch(function(t){i.close()})},onCateChange:function(t){this.initGroupData(t),this.initWarehouseData(t)}}},u=c,d=(i("33d9"),i("2877")),p=Object(d["a"])(u,a,n,!1,null,"01b4e6b6",null);e["default"]=p.exports},"2d27":function(t,e,i){},"33d9":function(t,e,i){"use strict";var a=i("58d7"),n=i.n(a);n.a},4595:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"ph-form"},[i("el-upload",{staticClass:"upload-demo",attrs:{action:t.uploadUrl,"on-preview":t.handlePreview,"before-remove":t.beforeRemove,"on-success":t.handleSuccess,multiple:"","file-list":t.attachments}},[i("el-button",{staticClass:"button-new-tag",attrs:{size:"small"}},[t._v("+ 添加附件")])],1)],1)},n=[],o=(i("7f7f"),i("ac6a"),i("ed08"),{components:{},props:{primary:{type:[Object],default:{}}},computed:{uploadUrl:function(){return"".concat(this.global.generateUrl(this.url),"/uploadFiles/").concat(this.primary.id,"?accessToken=").concat(this.$store.state.user.token)}},data:function(){return{url:"/attachments/procurementPlan",relations:["creator"],filters:[{field:"relevanceId",op:"eq",data:this.primary.id}],attachments:[]}},created:function(){},mounted:function(){var t=this;this.$nextTick(function(){t.initData()})},methods:{initData:function(){var t=this;if(this.primary){var e=this.url;this.filters&&this.filters.length>0&&(e+="?filters="+JSON.stringify({groupOp:"AND",rules:this.filters})),this.relations&&this.relations.length>0&&(e+="&relations="+JSON.stringify(this.relations)),this.global.axios.get(e).then(function(e){var i=e.data,a=i||[];t.attachments=[],a.forEach(function(e){t.attachments.push({id:e.id,name:e.fileName,url:"".concat(t.global.generateUrl(t.url),"/view/").concat(e.id,"?accessToken=").concat(t.$store.state.user.token)})})}).catch(function(t){})}},remove:function(t){var e=this;if(this.primary){var i="".concat(this.global.generateUrl(this.url),"/").concat(t.id,"?accessToken=").concat(this.$store.state.user.token);this.global.axios.delete(i).then(function(t){e.$message.info("附件删除成功!")}).catch(function(t){})}},handleSuccess:function(){this.initData()},handlePreview:function(t){window.open(t.url,"_blank")},beforeRemove:function(t,e){var i=this;return this.$confirm("确定移除 ".concat(t.name,"？"),"提示",{beforeClose:function(e,a,n){"confirm"==e?(i.remove(t),n(!0)):n(!1)}})}}}),s=o,r=(i("eae2"),i("2877")),l=Object(r["a"])(s,a,n,!1,null,"56bb7895",null);e["default"]=l.exports},"58d7":function(t,e,i){},"5e08":function(t,e,i){"use strict";var a=i("04a0"),n=i.n(a);n.a},"84d5":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("div",{staticClass:"tag-group"},[t._l(t.primary.dataAuthories,function(e){return i("el-tag",{key:e.userId,attrs:{type:"success",closable:"","disable-transitions":!1},on:{close:function(i){return t.handleRemove(e)}}},[t._v("\n      "+t._s(e.user.name)+"\n    ")])}),t._v(" "),i("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:t.openPersonDialog}},[t._v("+ 添加负责人")])],2),t._v(" "),i("phMembers",{ref:"members",attrs:{title:"选择采购负责人"},on:{saveCBEvent:t.saveCBEvent}})],1)},n=[],o=(i("5df3"),i("ac6a"),i("ed08"),i("d2d1")),s={components:{phMembers:o["a"]},props:{primary:{type:[Object],default:{}}},computed:{},data:function(){return{loading:!1,url:"/procurementPlans",relations:["creator"],filters:[],attachments:[]}},created:function(){},mounted:function(){var t=this;this.$nextTick(function(){t.initData()})},methods:{initData:function(){},openPersonDialog:function(){this.$refs.members.openDialog()},assign:function(t){var e="".concat(this.url,"/assign/").concat(this.primary.id,"/").concat(t);return this.global.axios.put(e).then(function(t){}).catch(function(t){})},saveCBEvent:function(t){var e=this;if(t&&this.primary){var i=this.$loading({lock:!0,text:"Loading",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"}),a=[];t.forEach(function(t){a.push(e.assign(t))}),Promise.all(a).then(function(t){e.$refs.members.closeDialog(),e.$message.info("操作成功!"),i.close(),e.$emit("reloadCBEvent")})}},handleRemove:function(t){var e=this;t&&t.userId&&this.$confirm("确认删除吗","提示",{type:"warning",beforeClose:function(i,a,n){if("confirm"==i){var o=e.$loading({lock:!0,text:"Loading",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"}),s="".concat(e.url,"/cancelAssign/").concat(e.primary.id,"/").concat(t.userId);e.global.axios.put(s).then(function(t){n(),e.$message.info("操作成功!"),o.close(),e.$emit("reloadCBEvent")}).catch(function(t){o.close()}),n()}else n()}}).catch(function(t){})}}},r=s,l=(i("b847"),i("2877")),c=Object(l["a"])(r,a,n,!1,null,"ab871064",null);e["default"]=c.exports},"8c62":function(t,e,i){"use strict";var a=i("2d27"),n=i.n(a);n.a},"8c66":function(t,e,i){},"90b4":function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",[i("el-steps",{attrs:{active:t.stepsActive,"finish-status":"success","align-center":"",simple:""}},[i("el-step",{attrs:{title:"1.智能备货",icon:"el-icon-s-opportunity"}}),t._v(" "),i("el-step",{attrs:{title:"2.采购计划",icon:"el-icon-edit-outline"}}),t._v(" "),i("el-step",{attrs:{title:"3.指派工作",icon:"el-icon-s-custom"}}),t._v(" "),i("el-step",{attrs:{title:"4.提交审核",icon:"el-icon-s-check"}})],1),t._v(" "),0==t.stepsActive?i("step1",{on:{step1CBEvent:t.step1CBEvent}}):t._e(),t._v(" "),1==t.stepsActive?i("step2",{attrs:{primaryId:t.object.id},on:{step2CBEvent:t.step2CBEvent}}):t._e(),t._v(" "),2==t.stepsActive?i("step3",{attrs:{primaryId:t.object.id},on:{step3CBEvent:t.step3CBEvent}}):t._e(),t._v(" "),3==t.stepsActive?i("step4",{attrs:{primaryId:t.object.id},on:{step4CBEvent:t.step4CBEvent}}):t._e()],1)},n=[],o=i("40c6"),s=i("0c50"),r=i("127b"),l=i("d2d0"),c={components:{step1:o["default"],step2:s["default"],step3:r["default"],step4:l["default"]},props:{},computed:{},data:function(){return{stepsActive:0,object:{id:null}}},created:function(){},mounted:function(){},methods:{step1CBEvent:function(t){this.$emit("createCBEvent",t),t&&(this.object.id=t,this.stepsActive=1)},step2CBEvent:function(t){this.stepsActive=t,this.$emit("createCBEvent",this.object.id)},step3CBEvent:function(t){this.stepsActive=t},step4CBEvent:function(t){this.stepsActive=t}}},u=c,d=(i("8c62"),i("2877")),p=Object(d["a"])(u,a,n,!1,null,"17c49ec4",null);e["default"]=p.exports},"91aa":function(t,e,i){"use strict";var a=i("9b90"),n=i.n(a);n.a},"9b90":function(t,e,i){},b847:function(t,e,i){"use strict";var a=i("0bb6"),n=i.n(a);n.a},d053:function(t,e,i){},d2d0:function(t,e,i){"use strict";i.r(e);var a=function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{staticClass:"page-container"},[t.completed?i("aside",[t._v("\n    采购计划已经创建完毕，你可以提交上级审核了。如果不想马上提交审核，可放弃提交操作。\n    之后你可以在编辑中的采购计划中，找到本次计划，可再次进行提交。\n    您可以在计划说明中，添加本次计划的一些说明，可帮助上级更快的审核您的计划。"),i("hr"),t._v("\n    计划编号："+t._s(this.primary.code)),i("BR"),t._v("\n    计划名称："+t._s(this.primary.name)),i("BR"),t._v("\n      负责人：\n    "),t._l(this.primary.dataAuthories,function(e){return[t._v(t._s(e.user.name)+" ")]}),t._v(" "),i("BR"),t._v("\n    采购总件数："+t._s(this.primary.qty.qty)+" 件\n\n  ")],2):t._e(),t._v(" "),i("el-row",[i("el-col",{attrs:{md:12}},[i("el-row",{attrs:{type:"flex",justify:"center"}},[i("el-button",{staticStyle:{"margin-top":"40px"},attrs:{type:"warning"},on:{click:t.onBack}},[t._v("\n          < 上一步\n        ")])],1)],1),t._v(" "),i("el-col",{attrs:{md:12}},[i("el-row",{attrs:{type:"flex",justify:"center"}},[i("el-button",{staticStyle:{"margin-top":"40px"},attrs:{type:"primary"},on:{click:t.onNext}},[t._v("\n          提交审核 >\n        ")])],1)],1)],1),t._v(" "),i("auditing",{ref:"auditing",on:{saveAuditCBEvent:t.saveAuditCBEvent}})],1)},n=[],o=(i("c5f6"),i("84d5")),s=i("88d9"),r={components:{person:o["default"],auditing:s["a"]},props:{primaryId:{type:[Number,String],default:null}},computed:{},data:function(){return{completed:!1,primary:{}}},created:function(){},mounted:function(){var t=this;this.$nextTick(function(){t.initData()})},methods:{initData:function(){var t=this;this.primaryId&&this.global.axios.get("/procurementPlans/".concat(this.primaryId)).then(function(e){var i=e.data;t.primary=i||{},t.completed=!0}).catch(function(e){t.completed=!0})},saveAuditCBEvent:function(t){var e=this;this.$confirm("确认将该计划提交给上级审核吗?","提示",{type:"warning",beforeClose:function(i,a,n){if("confirm"==i){var o=e.$loading({lock:!0,text:"Loading",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"}),s="/procurementPlans/commit/".concat(e.primaryId);e.global.axios.put(s,t).then(function(t){n(),e.$message.info("提交成功,请耐心等待上级处理! 您还可以继续创建新的采购计划! "),e.$refs.auditing.closeDialog(),o.close(),e.$emit("step4CBEvent",0)}).catch(function(t){o.close()}),n()}else n()}}).catch(function(t){})},onNext:function(){this.$refs.auditing.openDialog("commit")},onBack:function(){this.$emit("step4CBEvent",2)},reloadCBEvent:function(){this.initData()}}},l=r,c=(i("e98d"),i("2877")),u=Object(c["a"])(l,a,n,!1,null,"432ed818",null);e["default"]=u.exports},e98d:function(t,e,i){"use strict";var a=i("8c66"),n=i.n(a);n.a},eae2:function(t,e,i){"use strict";var a=i("d053"),n=i.n(a);n.a}}]);