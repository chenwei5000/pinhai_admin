(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-6a749b29"],{"0bb6":function(n,t,e){},"84d5":function(n,t,e){"use strict";e.r(t);var a=function(){var n=this,t=n.$createElement,e=n._self._c||t;return e("div",[e("div",{staticClass:"tag-group"},[n._l(n.primary.dataAuthories,function(t){return e("el-tag",{key:t.userId,attrs:{type:"success",closable:"","disable-transitions":!1},on:{close:function(e){return n.handleRemove(t)}}},[n._v("\n      "+n._s(t.user.name)+"\n    ")])}),n._v(" "),e("el-button",{staticClass:"button-new-tag",attrs:{size:"small"},on:{click:n.openPersonDialog}},[n._v("+ 添加负责人")])],2),n._v(" "),e("phMembers",{ref:"members",attrs:{title:"选择采购负责人"},on:{saveCBEvent:n.saveCBEvent}})],1)},i=[],o=(e("5df3"),e("ac6a"),e("ed08"),e("d2d1")),s={components:{phMembers:o["a"]},props:{primary:{type:[Object],default:{}}},computed:{},data:function(){return{loading:!1,url:"/procurementPlans",relations:["creator"],filters:[],attachments:[]}},created:function(){},mounted:function(){var n=this;this.$nextTick(function(){n.initData()})},methods:{initData:function(){},openPersonDialog:function(){this.$refs.members.openDialog()},assign:function(n){var t="".concat(this.url,"/assign/").concat(this.primary.id,"/").concat(n);return this.global.axios.put(t).then(function(n){}).catch(function(n){})},saveCBEvent:function(n){var t=this;if(n&&this.primary){var e=this.$loading({lock:!0,text:"Loading",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"}),a=[];n.forEach(function(n){a.push(t.assign(n))}),Promise.all(a).then(function(n){t.$refs.members.closeDialog(),t.$message.info("操作成功!"),e.close(),t.$emit("reloadCBEvent")})}},handleRemove:function(n){var t=this;n&&n.userId&&this.$confirm("确认删除吗","提示",{type:"warning",beforeClose:function(e,a,i){if("confirm"==e){var o=t.$loading({lock:!0,text:"Loading",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.7)"}),s="".concat(t.url,"/cancelAssign/").concat(t.primary.id,"/").concat(n.userId);t.global.axios.put(s).then(function(n){i(),t.$message.info("操作成功!"),o.close(),t.$emit("reloadCBEvent")}).catch(function(n){o.close()}),i()}else i()}}).catch(function(n){})}}},c=s,r=(e("b847"),e("2877")),l=Object(r["a"])(c,a,i,!1,null,"ab871064",null);t["default"]=l.exports},b847:function(n,t,e){"use strict";var a=e("0bb6"),i=e.n(a);i.a}}]);