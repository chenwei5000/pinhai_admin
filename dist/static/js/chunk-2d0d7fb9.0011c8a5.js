(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-2d0d7fb9"],{"78ac":function(t,a,e){"use strict";e.r(a);var s=function(){var t=this,a=t.$createElement,e=t._self._c||a;return e("div",{staticClass:"app-container"},[e("div",{staticClass:"ph-card"},[e("ph-card-header",{attrs:{title:t.title,type:"table"}}),t._v(" "),e("div",{staticClass:"ph-card-body"},[e("ph-table",t._b({},"ph-table",t.tableConfig,!1))],1)],1)])},l=[],r=(e("7f7f"),e("b99d")),o=e("a97c"),i=e("7eee"),n=e("85f3"),c={data:function(){return{title:"港口列表",tableConfig:{url:"/harbours",relations:["creator"],tableAttrs:{"row-class-name":this.statusClassName},columns:[{type:"selection"},o["a"].id,{prop:"name",label:"名称",sortable:"custom","min-width":100,fixed:"left"},{prop:"location",label:"地址",sortable:"custom","min-width":100},{prop:"creator.name",label:"创建人",width:100},o["a"].status,o["a"].lastModified],searchForm:[i["a"].name,i["a"].status()],form:[n["a"].name,{$type:"input",$id:"location",label:"港口地址",$el:{placeholder:"请输入港口地址"},rules:[r["a"].required]},n["a"].status()]}}},computed:{},methods:{statusClassName:function(t){var a=t.row;return a.status&&0!==a.status?"":"warning-row"}},watch:{}},u=c,d=e("2877"),p=Object(d["a"])(u,s,l,!1,null,"4674bf1e",null);a["default"]=p.exports}}]);