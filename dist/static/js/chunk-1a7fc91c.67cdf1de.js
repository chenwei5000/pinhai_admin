(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-1a7fc91c"],{"0e8f":function(e,t,s){"use strict";s("ac6a"),s("96cf");var n=s("3b8d"),a=s("b1ef"),r={getDepartments:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,s="/departments";return e&&(s+="?tenantId="+e),a["a"].searchResource(s,null,null,t).then(function(e){return e})},getSelectOptions:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,s=[],a=function(){var a=Object(n["a"])(regeneratorRuntime.mark(function n(){return regeneratorRuntime.wrap(function(n){while(1)switch(n.prev=n.next){case 0:e.getDepartments(t).then(function(e){e&&e.forEach(function(e){s.push({label:e.allName,value:e.id+""})})});case 1:case"end":return n.stop()}},n)}));return function(){return a.apply(this,arguments)}}();return a(),s}};t["a"]=r},"14b9":function(e,t,s){var n=s("5ca1");n(n.P,"String",{repeat:s("9744")})},"5ee2":function(e,t,s){},"6e6f":function(e,t,s){"use strict";s("7f7f"),s("ac6a"),s("96cf");var n=s("3b8d"),a=s("b1ef"),r={getPositions:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:-1,s="/positions";return e&&(s+="?tenantId="+e),a["a"].searchResource(s,null,null,t).then(function(e){return e})},getSelectOptions:function(){var e=this,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:null,s=[],a=function(){var a=Object(n["a"])(regeneratorRuntime.mark(function n(){return regeneratorRuntime.wrap(function(n){while(1)switch(n.prev=n.next){case 0:e.getPositions(t).then(function(e){e&&e.forEach(function(e){s.push({label:e.name,value:e.id+""})})});case 1:case"end":return n.stop()}},n)}));return function(){return a.apply(this,arguments)}}();return a(),s}};t["a"]=r},9744:function(e,t,s){"use strict";var n=s("4588"),a=s("be13");e.exports=function(e){var t=String(a(this)),s="",r=n(e);if(r<0||r==1/0)throw RangeError("Count can't be negative");for(;r>0;(r>>>=1)&&(t+=t))1&r&&(s+=t);return s}},c4a8:function(e,t,s){e.exports=s.p+"static/img/logo-2.4f0b157c.png"},d5c2:function(e,t,s){"use strict";s.r(t);var n=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",{staticClass:"register-bg"},[n("div",{staticClass:"register"},[n("div",{staticClass:"message"},[n("img",{attrs:{src:s("c4a8")}}),e._v("\n      "+e._s(e.global.config.NAME)+"\n      "),n("small",[e._v(e._s(e.global.config.VERSION))])]),e._v(" "),n("div",{attrs:{id:"darkbannerwrap"}}),e._v(" "),n("el-form",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],ref:"user",attrs:{model:e.user,rules:e.registerRules,"label-position":"left"}},[n("el-form-item",{attrs:{prop:"account"}},[n("span",{staticClass:"svg-container"},[n("svg-icon",{attrs:{"icon-class":"email"}})],1),e._v(" "),n("el-input",{attrs:{placeholder:"请输入邮箱",type:"text",tabindex:"1"},model:{value:e.user.account,callback:function(t){e.$set(e.user,"account",t)},expression:"user.account"}})],1),e._v(" "),n("el-form-item",{attrs:{prop:"name"}},[n("span",{staticClass:"svg-container"},[n("svg-icon",{attrs:{"icon-class":"peoples"}})],1),e._v(" "),n("el-input",{ref:"name",attrs:{placeholder:"请输入姓名",name:"name",type:"text",tabindex:"1"},model:{value:e.user.name,callback:function(t){e.$set(e.user,"name",t)},expression:"user.name"}})],1),e._v(" "),n("el-tooltip",{attrs:{content:"当前键盘为大写模式",placement:"right",manual:""},model:{value:e.capsTooltip,callback:function(t){e.capsTooltip=t},expression:"capsTooltip"}},[n("el-form-item",{attrs:{prop:"password"}},[n("span",{staticClass:"svg-container svg-password"},[n("svg-icon",{attrs:{"icon-class":"password"}})],1),e._v(" "),n("el-input",{key:e.passwordType,ref:"password",attrs:{type:e.passwordType,placeholder:"请输入密码",name:"password",tabindex:"2",autocomplete:"new-password"},on:{blur:function(t){e.capsTooltip=!1}},nativeOn:{keyup:[function(t){return e.checkCapslock(t)},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.register(t)}]},model:{value:e.user.password,callback:function(t){e.$set(e.user,"password",t)},expression:"user.password"}}),e._v(" "),n("span",{staticClass:"show-pwd",on:{click:e.showPwd}},[n("svg-icon",{attrs:{"icon-class":"password"===e.passwordType?"eye":"eye-open"}})],1)],1)],1),e._v(" "),n("el-tooltip",{attrs:{content:"当前键盘为大写模式",placement:"right",manual:""},model:{value:e.capsTooltip,callback:function(t){e.capsTooltip=t},expression:"capsTooltip"}},[n("el-form-item",{attrs:{prop:"repeat"}},[n("span",{staticClass:"svg-container svg-password"},[n("svg-icon",{attrs:{"icon-class":"repeat"}})],1),e._v(" "),n("el-input",{key:e.repeatType,attrs:{type:e.repeatType,placeholder:"请再输入密码",name:"repeat",tabindex:"2"},on:{blur:function(t){e.capsTooltip=!1}},nativeOn:{keyup:[function(t){return e.checkCapslock(t)},function(t){return!t.type.indexOf("key")&&e._k(t.keyCode,"enter",13,t.key,"Enter")?null:e.register(t)}]},model:{value:e.user.repeatPassword,callback:function(t){e.$set(e.user,"repeatPassword",t)},expression:"user.repeatPassword"}}),e._v(" "),n("span",{staticClass:"show-pwd",on:{click:e.showRepeatPwd}},[n("svg-icon",{attrs:{"icon-class":"password"===e.repeatType?"eye":"eye-open"}})],1)],1)],1),e._v(" "),n("el-form-item",{attrs:{prop:"position"}},[n("span",{staticClass:"svg-container"},[n("svg-icon",{attrs:{"icon-class":"warehouse"}})],1),e._v(" "),n("el-select",{attrs:{filterable:"",placeholder:"请选择部门,可筛选"},model:{value:e.user.departmentId,callback:function(t){e.$set(e.user,"departmentId",t)},expression:"user.departmentId"}},e._l(e.departmentSelectOptions,function(e,t){return n("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),n("el-form-item",{attrs:{prop:"position"}},[n("span",{staticClass:"svg-container"},[n("svg-icon",{attrs:{"icon-class":"position"}})],1),e._v(" "),n("el-select",{attrs:{filterable:"",placeholder:"请选择职位,可筛选"},model:{value:e.user.positionId,callback:function(t){e.$set(e.user,"positionId",t)},expression:"user.positionId"}},e._l(e.positionSelectOptions,function(e,t){return n("el-option",{key:t,attrs:{label:e.label,value:e.value}})}),1)],1),e._v(" "),n("input",{staticClass:"registerin",attrs:{value:"注册",type:"button"},on:{click:e.register}}),e._v(" "),n("el-row",[n("el-col",{attrs:{space:24}},[n("router-link",{staticClass:"btnBack",attrs:{to:"/login"}},[e._v("\n            <返回登录\n          ")])],1)],1)],1)],1)])},a=[],r=(s("14b9"),s("61f7")),o=s("0e8f"),i=s("6e6f"),c={name:"Login",data:function(){var e=this,t=function(e,t,s){Object(r["d"])(t)?s():s(new Error("账号为邮箱格式!"))},s=function(t,s,n){e.user.password!=e.user.repeatPassword&&n(new Error("两次密码不一致")),n()};return{user:{tenantId:this.global.config.TENANT_ID,account:"",job:"",name:"",password:"",phoneNo:"",repeatPassword:""},registerRules:{account:[{required:!0,message:"必须提供邮箱",trigger:"blur"},{required:!0,trigger:"blur",validator:t}],password:[{min:6,message:"密码至少6个字符",trigger:"blur"}],repeat:[{required:!0,trigger:"blur",validator:s}]},positionSelectOptions:[],departmentSelectOptions:[],passwordType:"password",repeatType:"password",capsTooltip:!1,loading:!1,showDialog:!1,redirect:void 0}},watch:{$route:{handler:function(e){this.redirect=e.query&&e.query.redirect},immediate:!0}},created:function(){},mounted:function(){var e=this;this.$nextTick(function(){""===e.user.username?e.$refs.username.focus():""===e.user.password&&e.$refs.password.focus(),e.departmentSelectOptions=o["a"].getSelectOptions(e.user.tenantId),e.positionSelectOptions=i["a"].getSelectOptions(e.user.tenantId)})},destroyed:function(){},methods:{checkCapslock:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.shiftKey,s=e.key;s&&1===s.length&&(this.capsTooltip=!!(t&&s>="a"&&s<="z"||!t&&s>="A"&&s<="Z")),"CapsLock"===s&&!0===this.capsTooltip&&(this.capsTooltip=!1)},showPwd:function(){var e=this;"password"===this.passwordType?this.passwordType="text":this.passwordType="password",this.$nextTick(function(){e.$refs.password.focus()})},showRepeatPwd:function(){var e=this;"password"===this.repeatType?this.repeatType="text":this.repeatType="password",this.$nextTick(function(){e.$refs.repeat.focus()})},register:function(){var e=this;this.$refs.user.validate(function(t){if(!t)return!1;e.loading=!0;var s="/users/register";e.global.axios.post(s,e.user).then(function(t){if(200==t.status)return e.$message.info("注册成功，待管理员审核"),e.$router.push({path:"/login"}),void(e.loading=!1);e.loading=!1,e.$message.info("注册失败")}).catch(function(t){e.loading=!1})})}}},l=c,p=(s("fd43"),s("2877")),u=Object(p["a"])(l,n,a,!1,null,"75481e20",null);t["default"]=u.exports},fd43:function(e,t,s){"use strict";var n=s("5ee2"),a=s.n(n);a.a}}]);