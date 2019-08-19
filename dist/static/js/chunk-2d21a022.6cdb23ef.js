(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d21a022"],{ba4a:function(t,e,l){"use strict";l.r(e);var i=function(){var t=this,e=t.$createElement,l=t._self._c||e;return t.dialogVisible?l("el-dialog",{attrs:{title:t.dialogTitle,"append-to-body":"",width:"80%",top:"20px",visible:t.dialogVisible},on:{"update:visible":function(e){t.dialogVisible=e}}},[l("el-form",{directives:[{name:"loading",rawName:"v-loading",value:t.loading,expression:"loading"}],ref:"detailItem",attrs:{rules:t.rules,model:t.detailItem,"status-icon":"",inline:"","label-position":"right","label-width":"120px"}},[l("el-row",[l("el-col",{attrs:{md:10}},[l("el-form-item",{attrs:{label:"SKU",prop:"skuCode"}},[l("el-input",{staticStyle:{width:"220px"},attrs:{maxlength:"50","show-word-limit":"",placeholder:"请填写SKU",clearable:""},model:{value:t.detailItem.skuCode,callback:function(e){t.$set(t.detailItem,"skuCode","string"===typeof e?e.trim():e)},expression:"detailItem.skuCode"}}),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"输入产品SKU编码",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),l("el-col",{attrs:{md:14}},[l("el-form-item",{attrs:{label:"采购箱数",prop:"cartonQty"}},[l("el-input-number",{attrs:{precision:2,min:1,step:1,max:1e5,label:"采购箱数"},model:{value:t.detailItem.cartonQty,callback:function(e){t.$set(t.detailItem,"cartonQty",e)},expression:"detailItem.cartonQty"}}),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"按箱采购，请输入箱数，支持3位小数！",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),l("el-row",[l("el-col",{attrs:{md:10}},[l("el-form-item",{attrs:{label:"箱规",prop:"cartonSpecId"}},[t._v("0\n\n            "),l("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",placeholder:"外箱包装材料规格,可筛选"},model:{value:t.detailItem.cartonSpecId,callback:function(e){t.$set(t.detailItem,"cartonSpecId",e)},expression:"detailItem.cartonSpecId"}},t._l(t.cartonspecSelectOptions,function(t,e){return l("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"产品外箱包装材料规格。不输入使用产品上默认的箱规",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),l("el-col",{attrs:{md:14}},[l("el-form-item",{attrs:{label:"装箱数",prop:"numberOfCarton"}},[l("el-input",{staticStyle:{width:"200px"},attrs:{placeholder:"请填写装箱数",clearable:""},model:{value:t.detailItem.numberOfCarton,callback:function(e){t.$set(t.detailItem,"numberOfCarton","string"===typeof e?e.trim():e)},expression:"detailItem.numberOfCarton"}}),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"一箱有多少个产品.不输入使用产品上默认的装箱数",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),l("el-row",[l("el-col",{attrs:{md:10}},[l("el-form-item",{attrs:{label:"备货周数",prop:"safetyStockWeek"}},[l("el-select",{staticStyle:{width:"220px"},attrs:{filterable:"",placeholder:"请选择备货周数"},model:{value:t.detailItem.safetyStockWeek,callback:function(e){t.$set(t.detailItem,"safetyStockWeek",e)},expression:"detailItem.safetyStockWeek"}},t._l(52,function(t){return l("el-option",{key:t,attrs:{label:t,value:t}})}),1),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"产品希望支持销售的周数。",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),l("el-col",{attrs:{md:14}},[l("el-form-item",{attrs:{label:"优先级",prop:"priority"}},[l("el-select",{staticStyle:{width:"200px"},attrs:{filterable:"",placeholder:"请选择优先级,可筛选"},model:{value:t.detailItem.priority,callback:function(e){t.$set(t.detailItem,"priority",e)},expression:"detailItem.priority"}},t._l(t.prioritySelectOptions,function(t,e){return l("el-option",{key:e,attrs:{label:t.label,value:t.value}})}),1),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"本产品在该采购计划中的优先等级",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),l("el-row",[l("el-col",{attrs:{md:10}},[l("el-form-item",{attrs:{label:"7日销量(件)",prop:"sevenSalesCount"}},[l("el-input",{staticStyle:{width:"220px"},attrs:{placeholder:"请填写7日销量，件数",clearable:""},model:{value:t.detailItem.sevenSalesCount,callback:function(e){t.$set(t.detailItem,"sevenSalesCount","string"===typeof e?e.trim():e)},expression:"detailItem.sevenSalesCount"}}),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"7日销售件数",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),l("el-col",{attrs:{md:14}},[l("el-form-item",{attrs:{label:"亚马逊含在途(箱)",prop:"amazonTotalStock"}},[l("el-input",{staticStyle:{width:"200px"},attrs:{placeholder:"亚马逊含在途，箱数",clearable:""},model:{value:t.detailItem.amazonTotalStock,callback:function(e){t.$set(t.detailItem,"amazonTotalStock","string"===typeof e?e.trim():e)},expression:"detailItem.amazonTotalStock"}}),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"亚马逊含在途库存箱数",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),l("el-row",[l("el-col",{attrs:{md:10}},[l("el-form-item",{attrs:{label:"国内库存(箱)",prop:"domesticStockQty"}},[l("el-input",{staticStyle:{width:"220px"},attrs:{placeholder:"国内库存，箱数",clearable:""},model:{value:t.detailItem.domesticStockQty,callback:function(e){t.$set(t.detailItem,"domesticStockQty","string"===typeof e?e.trim():e)},expression:"detailItem.domesticStockQty"}}),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"国内仓库库存箱数",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1),t._v(" "),l("el-col",{attrs:{md:14}},[l("el-form-item",{attrs:{label:"国内在途(箱)",prop:"unfinishedPlanQty"}},[l("el-input",{staticStyle:{width:"200px"},attrs:{placeholder:"国内在途，箱数",clearable:""},model:{value:t.detailItem.unfinishedPlanQty,callback:function(e){t.$set(t.detailItem,"unfinishedPlanQty","string"===typeof e?e.trim():e)},expression:"detailItem.unfinishedPlanQty"}}),t._v(" "),l("el-tooltip",{staticClass:"item",attrs:{effect:"light",content:"未完成采购计划箱数",placement:"right"}},[l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1),t._v(" "),l("el-row",[l("el-col",{attrs:{md:24}},[l("el-form-item",{attrs:{label:"优先要求",prop:"priorityNote"}},[l("el-col",{attrs:{span:22}},[l("el-input",{attrs:{type:"textarea",maxlength:"500","show-word-limit":"",rows:"3",cols:"80",placeholder:"示例:\n2018-08-16 : 5箱\n2018-08-26 : 45件\n2018-09-16 : 2箱","show-word-limit":""},model:{value:t.detailItem.priorityNote,callback:function(e){t.$set(t.detailItem,"priorityNote",e)},expression:"detailItem.priorityNote"}})],1),t._v(" "),l("el-col",{attrs:{span:2}},[l("el-tooltip",{staticClass:"item",attrs:{effect:"light",placement:"right"}},[l("div",{attrs:{slot:"content"},slot:"content"},[t._v("按时间维度定义优先要求。格式如下：\n                  "),l("HR"),t._v("\n                  2018-08-16 : 5箱"),l("BR"),t._v("\n                  2018-08-26 : 45件"),l("BR"),t._v("\n                  2018-09-16 : 2箱"),l("BR")],1),t._v(" "),l("i",{staticClass:"el-icon-question"},[t._v(" ")])])],1)],1)],1)],1),t._v(" "),l("el-row",[l("el-col",{attrs:{md:24}},[l("el-row",{attrs:{type:"flex",justify:"center"}},[l("el-button",{staticStyle:{"margin-top":"15px"},attrs:{type:"primary",loading:t.confirmLoading},on:{click:t.onSave}},[t._v("\n              保存\n            ")])],1)],1)],1)],1)],1):t._e()},a=[],o=(l("c5f6"),l("d186")),n=l("c971"),s=l("b99d"),r={components:{},props:{primaryId:{type:Number,default:null}},computed:{dialogTitle:function(){return null==this.detailItemId?"添加采购计划明细":"修改采购计划明细"}},data:function(){return{dialogVisible:!1,loading:!1,confirmLoading:!1,url:"/procurementShippedOrderItems",relations:["product"],detailItemId:null,detailItem:{},cartonspecSelectOptions:[],prioritySelectOptions:[],rules:{skuCode:[s["a"].required],cartonQty:[s["a"].required],priority:[s["a"].required],numberOfCarton:[s["a"].integer],sevenSalesCount:[s["a"].number],amazonTotalStock:[s["a"].number],domesticStockQty:[s["a"].number],unfinishedPlanQty:[s["a"].number]}}},created:function(){},mounted:function(){this.$nextTick(function(){})},methods:{initData:function(){var t=this;if(this.cartonspecSelectOptions=o["a"].getSelectOptions(),this.prioritySelectOptions=n["a"].getSelectOptions("Priority"),this.detailItemId){this.loading=!0;var e="".concat(this.url,"/").concat(this.detailItemId);this.relations&&this.relations.length>0&&(e+="?relations="+JSON.stringify(this.relations)),this.global.axios.get(e).then(function(e){var l=e.data,i=l||{};t.detailItem=i,t.detailItem.cartonSpecId=i.cartonSpecId+"",t.detailItem.priority=i.priority+"",t.loading=!1})}else this.detailItem={skuCode:"",priorityNote:"",cartonSpecId:null,priority:"2",safetyStockWeek:10,numberOfCarton:null,cartonQty:1,procurementPlanId:this.primaryId}},openDialog:function(t){this.detailItemId=t,this.dialogVisible=!0,this.initData()},onSave:function(){var t=this;this.$refs.detailItem.validate(function(e){if(!e)return!1;t.loading=!0,t.confirmLoading=!0;var l="post",i=t.url+"";!t.detailItemId&&t.detailItemId>0&&(l="put",i="".concat(t.url,"/").concat(t.detailItemId));var a=JSON.parse(JSON.stringify(t.detailItem));t.global.axios[l](i,a).then(function(e){t.$message.info("修改成功"),t.loading=!1,t.confirmLoading=!1,t.dialogVisible=!1,t.$emit("modifyCBEvent",e.data)}).catch(function(e){t.loading=!1,t.confirmLoading=!1})})}}},c=r,d=l("2877"),m=Object(d["a"])(c,i,a,!1,null,"7d9e3b79",null);e["default"]=m.exports}}]);