(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0df2d4"],{8996:function(e,a,t){"use strict";t.r(a);var l=function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"app-container"},[t("div",{staticClass:"ph-card"},[t("ph-card-header",{attrs:{title:e.title,type:"table"}}),e._v(" "),t("div",{staticClass:"ph-card-body"},[t("ph-table",e._b({},"ph-table",e.tableConfig,!1))],1)],1)])},r=[],s=(t("7f7f"),t("b99d")),i=t("a97c"),o=t("7eee"),p=t("85f3"),n={data:function(){var e=this;return{title:"数据字典",tableConfig:{url:"/dataDicItems",tableAttrs:{"row-class-name":this.statusClassName},maxUploadCount:1,tplNoExportProps:["操作","修改时间","ID","创建人","状态"],exportFileName:"数据字典列表",hasExportTpl:!0,hasExport:!0,hasImport:!0,columns:[{type:"selection"},i["a"].id,{prop:"type",label:"字典类型",sortable:"custom","min-width":100},{prop:"name",label:"字典类型名称",sortable:"custom","min-width":100},{prop:"valueId",label:"字典值ID","min-width":100},{prop:"valueName",label:"字典值名称","min-width":100},i["a"].status,i["a"].lastModified],searchForm:[{$type:"input",$id:"name",label:"字典类型名",$el:{op:"bw",placeholder:"请输入字典类型名称",clearable:!0,maxlength:"40","show-word-limit":!0}},{$type:"input",$id:"valueName",label:"字典值名",$el:{op:"bw",placeholder:"请输入字典值名称",clearable:!0,maxlength:"40","show-word-limit":!0}},o["a"].status()],form:[{$type:"input",$id:"type",label:"字典类型",$el:{placeholder:"请输入字典类型",clearable:!0,maxlength:"40","show-word-limit":!0},rules:[s["a"].required]},p["a"].name(40),{$type:"input",$id:"valueId",label:"字典值ID",$el:{placeholder:"请输入字典值ID",clearable:!0,maxlength:"40","show-word-limit":!0},rules:[s["a"].required]},{$type:"input",$id:"valueName",label:"字典值",$el:{placeholder:"请输入字典值",clearable:!0,maxlength:"40","show-word-limit":!0},rules:[s["a"].required]},p["a"].status()],afterConfirm:function(){e.$store.commit("app/SET_DATADICS",null)}}}},computed:{},methods:{statusClassName:function(e){var a=e.row;return a.status&&0!==a.status?"":"warning-row"}},watch:{}},d=n,u=t("2877"),c=Object(u["a"])(d,l,r,!1,null,"32adccea",null);a["default"]=c.exports}}]);