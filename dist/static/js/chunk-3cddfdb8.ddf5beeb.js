(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-3cddfdb8"],{"27dd":function(e,t,l){},3514:function(e,t,l){"use strict";l.r(t);var a=function(){var e=this,t=e.$createElement,l=e._self._c||t;return l("div",[l("el-form",{ref:"createForm",attrs:{rules:e.rules,model:e.newProduct,"status-icon":"","label-position":"right",inline:"","label-width":"90px"}},[l("fieldset",{staticClass:"panel-heading"},[l("legend",{staticClass:"panel-title"},[e._v("基本信息")]),e._v(" "),l("el-row",[l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"状态",prop:"status"}},[l("el-radio-group",{model:{value:e.newProduct.status,callback:function(t){e.$set(e.newProduct,"status",e._n(t))},expression:"newProduct.status"}},[l("el-radio-button",{attrs:{label:"1"}},[e._v("开启")]),e._v(" "),l("el-radio-button",{attrs:{label:"0"}},[e._v("关闭")])],1)],1),e._v(" "),l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"超大",prop:"oversize"}},[l("el-radio-group",{model:{value:e.newProduct.oversize,callback:function(t){e.$set(e.newProduct,"oversize",e._n(t))},expression:"newProduct.oversize"}},[l("el-radio-button",{attrs:{label:"1"}},[e._v("开启")]),e._v(" "),l("el-radio-button",{attrs:{label:"0"}},[e._v("关闭")])],1)],1)],1),e._v(" "),l("el-row",[l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"SKU",prop:"skuCode"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"使用全英文,空格用-号代替。如：gym-104"},model:{value:e.newProduct.skuCode,callback:function(t){e.$set(e.newProduct,"skuCode",t)},expression:"newProduct.skuCode"}})],1),e._v(" "),l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"名称",prop:"name"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"请输入产品名称"},model:{value:e.newProduct.name,callback:function(t){e.$set(e.newProduct,"name",t)},expression:"newProduct.name"}})],1)],1),e._v(" "),l("el-row",[l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"分类",prop:"categoryId"}},[l("el-col",{attrs:{span:20}},[l("el-select",{staticStyle:{width:"200px"},attrs:{filterable:"",placeholder:"请选择分类,可筛选"},model:{value:e.newProduct.categoryId+"",callback:function(t){e.$set(e.newProduct,"categoryId + ''",t)},expression:"newProduct.categoryId + ''"}},e._l(e.categorySelectOptions,function(e,t){return l("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),l("el-col",{attrs:{span:4}},[l("el-button",{attrs:{type:"primary",icon:"el-icon-circle-plus"},on:{click:e.openNewCategoryDialog}})],1)],1),e._v(" "),l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"款式"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"请输入产品款式"},model:{value:e.newProduct.groupName,callback:function(t){e.$set(e.newProduct,"groupName",t)},expression:"newProduct.groupName"}})],1)],1),e._v(" "),l("el-row",[l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"箱规",prop:"cartonSpecId"}},[l("el-col",{attrs:{span:20}},[l("el-select",{staticStyle:{width:"200px"},attrs:{filterable:"",placeholder:"外箱包装材料规格,可筛选"},model:{value:e.newProduct.cartonSpecId+"",callback:function(t){e.$set(e.newProduct,"cartonSpecId+ ''",t)},expression:"newProduct.cartonSpecId+ ''"}},e._l(e.cartonspecSelectOptions,function(e,t){return l("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),l("el-col",{attrs:{span:4}},[l("el-button",{attrs:{type:"primary",icon:"el-icon-circle-plus"},on:{click:e.openNewCartonspecDialog}})],1)],1),e._v(" "),l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"装箱数",prop:"numberOfCarton"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"一箱有多少个产品"},model:{value:e.newProduct.numberOfCarton,callback:function(t){e.$set(e.newProduct,"numberOfCarton",t)},expression:"newProduct.numberOfCarton"}})],1)],1),e._v(" "),l("el-row",[l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"型号"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"请输入产品型号"},model:{value:e.newProduct.model,callback:function(t){e.$set(e.newProduct,"model",t)},expression:"newProduct.model"}})],1),e._v(" "),l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"颜色"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"请输入产品颜色"},model:{value:e.newProduct.color,callback:function(t){e.$set(e.newProduct,"color",t)},expression:"newProduct.color"}})],1)],1),e._v(" "),l("el-row",[l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"净重(Kg)",prop:"grossWeight"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"单个商品的净重(不包括外箱重量)"},model:{value:e.newProduct.grossWeight,callback:function(t){e.$set(e.newProduct,"grossWeight",t)},expression:"newProduct.grossWeight"}})],1),e._v(" "),l("el-form-item",{staticStyle:{width:"500px"},attrs:{label:"体积(Cm³ )"}},[l("el-col",{attrs:{span:6}},[l("el-input",{staticStyle:{width:"90px"},attrs:{placeholder:"长(Cm)"},model:{value:e.newProduct.length,callback:function(t){e.$set(e.newProduct,"length",t)},expression:"newProduct.length"}})],1),e._v(" "),l("el-col",{attrs:{span:3}},[e._v(" x")]),e._v(" "),l("el-col",{attrs:{span:6}},[l("el-input",{staticStyle:{width:"90px"},attrs:{placeholder:"宽(Cm)"},model:{value:e.newProduct.width,callback:function(t){e.$set(e.newProduct,"width",t)},expression:"newProduct.width"}})],1),e._v(" "),l("el-col",{attrs:{span:3}},[e._v(" x")]),e._v(" "),l("el-col",{attrs:{span:6}},[l("el-input",{staticStyle:{width:"90px"},attrs:{placeholder:"高(Cm)"},model:{value:e.newProduct.height,callback:function(t){e.$set(e.newProduct,"height",t)},expression:"newProduct.height"}})],1)],1)],1)],1),e._v(" "),l("fieldset",{staticClass:"panel-heading",staticStyle:{"margin-top":"10px"}},[l("legend",{staticClass:"panel-title"},[e._v("采购信息")]),e._v(" "),l("el-row",[l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"供货商",prop:"supplierId"}},[l("el-col",{attrs:{span:20}},[l("el-select",{staticStyle:{width:"200px"},attrs:{filterable:"",placeholder:"请选择供货商,可筛选"},model:{value:e.newProduct.supplierId+"",callback:function(t){e.$set(e.newProduct,"supplierId+ ''",t)},expression:"newProduct.supplierId+ ''"}},e._l(e.supplierSelectOptions,function(e,t){return l("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),l("el-col",{attrs:{span:4}},[l("el-button",{attrs:{type:"primary",icon:"el-icon-circle-plus"},on:{click:e.openNewSupplierDialog}})],1)],1),e._v(" "),l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"交期(天)"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"请输入产品交期"},model:{value:e.newProduct.leadDay,callback:function(t){e.$set(e.newProduct,"leadDay",t)},expression:"newProduct.leadDay"}})],1)],1),e._v(" "),l("el-row",[l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"结算货币",prop:"currencyId"}},[l("el-select",{staticStyle:{width:"200px"},attrs:{placeholder:"请选择结算货币"},model:{value:e.newProduct.currencyId+"",callback:function(t){e.$set(e.newProduct,"currencyId+ ''",t)},expression:"newProduct.currencyId+ ''"}},e._l(e.currencySelectOptions,function(e,t){return l("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"采购价",prop:"price"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"请输入产品采购价格"},model:{value:e.newProduct.price,callback:function(t){e.$set(e.newProduct,"price",t)},expression:"newProduct.price"}})],1)],1)],1),e._v(" "),l("fieldset",{staticClass:"panel-heading",staticStyle:{"margin-top":"10px"}},[l("legend",{staticClass:"panel-title"},[e._v("销售信息")]),e._v(" "),l("el-row",[l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"FNSKU"}},[l("el-input",{staticStyle:{width:"300px"},attrs:{placeholder:"请输入产品FNSKU"},model:{value:e.newProduct.fnSku,callback:function(t){e.$set(e.newProduct,"fnSku",t)},expression:"newProduct.fnSku"}})],1),e._v(" "),l("el-form-item",{staticStyle:{width:"400px"},attrs:{label:"Vip级别"}},[l("el-select",{staticStyle:{width:"200px"},attrs:{placeholder:"请输入产品Vip级别"},model:{value:e.newProduct.vipLevel+"",callback:function(t){e.$set(e.newProduct,"vipLevel+ ''",t)},expression:"newProduct.vipLevel+ ''"}},e._l(e.currencySelectOptions,function(e,t){return l("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1)],1),e._v(" "),l("el-row")],1),e._v(" "),l("fieldset",{staticClass:"panel-heading",staticStyle:{"margin-top":"10px"}},[l("legend",{staticClass:"panel-title"},[e._v("备注")]),e._v(" "),l("el-form-item",{staticStyle:{width:"400px"}},[l("el-input",{staticStyle:{width:"400px"},attrs:{type:"textarea",autosize:{minRows:6,maxRows:10}},model:{value:e.newProduct.comment,callback:function(t){e.$set(e.newProduct,"comment",t)},expression:"newProduct.comment"}})],1)],1),e._v(" "),e.isNew?l("el-row",{attrs:{type:"flex",justify:"center"}},[l("el-button",{staticStyle:{"margin-top":"15px"},attrs:{type:"primary",loading:e.confirmLoading},on:{click:e.onCreateProduct}},[e._v("立即创建\n      ")])],1):e._e()],1)],1)},r=[],o=(l("7f7f"),l("5256")),n=l("40801"),c=l("4946"),i=l("c405"),s=l("d186"),u=l("a6b9"),d=l("b9a9"),p={components:{},props:{init_data:{type:Object,default:null}},computed:{},data:function(){return{categorySelectOptions:[],cartonspecSelectOptions:[],supplierSelectOptions:[],currencySelectOptions:[],isNew:!this.init_data,confirmLoading:!1,newProduct:this.init_data?this.init_data:{status:1,skuCode:null,groupName:null,fnSku:null,categoryId:"",name:null,model:null,color:null,comment:null,grossWeight:null,length:null,width:null,height:null,supplierId:"",price:null,cartonSpecId:"",numberOfCarton:null,currencyId:"",leadDay:null,vipLevel:0,oversize:0},rules:{status:[{required:!0,message:"必须输入",trigger:"blur"}],skuCode:[{required:!0,message:"必须输入",trigger:"blur"}],name:[{required:!0,message:"必须输入",trigger:"blur"}],categoryId:[{required:!0,message:"必须输入",trigger:"blur"}],cartonSpecId:[{required:!0,message:"必须输入",trigger:"blur"}],numberOfCarton:[{required:!0,message:"必须输入",trigger:"blur"}],grossWeight:[],supplierId:[],currencyId:[],price:[]}}},created:function(){this.categorySelectOptions=i["a"].getMineSelectProdcutOptions(),this.cartonspecSelectOptions=s["a"].getSelectOptions(),this.supplierSelectOptions=u["a"].getSelectOptions(),this.currencySelectOptions=d["a"].getSelectOptions()},mounted:function(){},methods:{openNewCategoryDialog:function(){var e=this,t={title:"添加分类",component:o["a"],_width_:"70%",callback:function(t){e.categorySelectOptions.unshift({label:t.name,value:t.id+""}),e.newProduct.categoryId=t.id+""}};common.dialog(t)},openNewCartonspecDialog:function(){var e=this,t=(arguments.length>0&&void 0!==arguments[0]&&arguments[0],{title:"添加箱规",component:n["a"],_width_:"70%",callback:function(t){e.cartonspecSelectOptions.unshift({label:t.name,value:t.id+""}),e.newProduct.cartonSpecId=t.id+""}});common.dialog(t)},openNewSupplierDialog:function(){var e=this,t=(arguments.length>0&&void 0!==arguments[0]&&arguments[0],{title:"添加供货商",component:c["a"],_width_:"70%",callback:function(t){e.supplierSelectOptions.unshift({label:t.name,value:t.id+""}),e.newProduct.supplierId=t.id+""}});common.dialog(t)},onCreateProduct:function(){var e=this;this.$refs.createForm.validate(function(t){if(t){var l="/products";e.confirmLoading=!0,e.global.axios.post(l,e.newProduct).then(function(t){e.$message({type:"success",message:"产品添加成功"}),e.$refs.createForm.resetFields(),e.confirmLoading=!1}).catch(function(t){e.confirmLoading=!1})}})},confirm:function(){var e=this;this.$refs.createForm.validate(function(t){if(!t)return e.$emit("callback",null),!1;var l=e.newProduct;if(!l.id)return e.$message.error("无效的产品ID"),e.$emit("callback",null),!1;var a="/products/"+l.id;e.global.axios.put(a,l).then(function(t){e.$message({type:"success",message:"商品编辑成功"});var l=t.data;e.$emit("callback",{type:"sure",data:l})}).catch(function(t){e.$emit("callback",null)})})}}},m=p,w=(l("e0936"),l("2877")),h=Object(w["a"])(m,a,r,!1,null,"1a204be3",null);t["default"]=h.exports},e0936:function(e,t,l){"use strict";var a=l("27dd"),r=l.n(a);r.a}}]);