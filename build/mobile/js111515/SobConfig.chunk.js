(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[111],{1859:function(e,t,n){},1860:function(e,t,n){"use strict";(function(e){n.d(t,"a",(function(){return N}));n(32),n(55),n(98),n(61),n(33),n(34),n(31),n(77),n(65),n(76);var o,a=n(7),l=n(8),s=n(9),i=n(10),p=n(0),u=n.n(p),r=(n(1),n(47)),c=n(17),m=n(14),d=n(11),g=n(135),I=n(2),b=n(12),E=(n(1861),n(38)),S=n(101);d.k.Label,d.k.Control,d.k.Item;var O=["01","02","03","04","05","06","07","08","09","10","11","12"],N=Object(r.c)((function(e){return e}))(o=function(t){Object(i.a)(o,t);var n=Object(s.a)(o);function o(e){var t;Object(a.a)(this,o);var l=(t=n.call(this,e)).props.sobConfigState.get("tempSob"),s=l.get("sobid"),i=l.get("moduleInfo"),p=i.get("RUNNING"),u=!1,r=!1,c=!1,m=!1,d=!1,g=!1,I=!1,b=!1,E=!1;return s&&(p&&p.get("beOpen")?(u=!!i.get("SCXM")&&i.getIn(["SCXM","beOpen"]),r=!!i.get("SGXM")&&i.getIn(["SGXM","beOpen"]),c=!!i.get("QUANTITY")&&i.getIn(["QUANTITY","beOpen"]),m=!!i.get("WAREHOUSE")&&i.getIn(["WAREHOUSE","beOpen"]),d=!!i.get("PROCESS")&&i.getIn(["PROCESS","beOpen"]),b=!!i.get("SERIAL")&&i.getIn(["SERIAL","beOpen"]),I=!!i.get("ASSIST")&&i.getIn(["ASSIST","beOpen"]),E=!!i.get("BATCH")&&i.getIn(["BATCH","beOpen"])):g=!!i.get("AMB")&&i.getIn(["AMB","beOpen"])),t.state={showRoleList:!1,gettedIdentifyingCodeList:!1,oldScxmBeOpen:u,oldSgxmBeOpen:r,oldQuantityBeOpen:c,oldWarehouseBeOpen:m,oldProcessBeOpen:d,oldAmbBeOpen:g,oldAssistBeOpen:I,oldSerialBeOpen:b,oldBatchBeOpen:E},t}return Object(l.a)(o,[{key:"componentDidMount",value:function(){"insert"===this.props.sobConfigState.get("sobConfigMode")?I.a.setTitle({title:"\u65b0\u589e\u8d26\u5957"}):"modify"===this.props.sobConfigState.get("sobConfigMode")&&I.a.setTitle({title:"\u7f16\u8f91\u8d26\u5957"}),I.a.setRight({show:!1}),this.props.dispatch(E.b.setDdConfig())}},{key:"render",value:function(){var t=this,n=this.props,o=n.sobConfigState,a=n.allState,l=n.dispatch,s=n.homeState,i=n.history,p=this.state,r=p.showRoleList,E=p.gettedIdentifyingCodeList,N=p.oldScxmBeOpen,f=p.oldSgxmBeOpen,C=p.oldQuantityBeOpen,T=p.oldWarehouseBeOpen,h=p.oldProcessBeOpen,A=p.oldAmbBeOpen,R=p.oldAssistBeOpen,M=p.oldSerialBeOpen,y=p.oldBatchBeOpen,v=(o.get("sobConfigMode"),o.get("sobSelectedIndex"),a.get("currencyModelList")),Y=o.get("tempSob"),k=Y.get("template")||"0",U=Y.get("sobname"),P=Y.get("sobid"),B=Y.get("firstyear"),_=Y.get("firstmonth"),G=Y.get("moduleInfo"),L=G.get("RUNNING"),x=G.get("GL"),H=G.get("CURRENCY"),X=(Y.get("adminlist"),Y.get("observerlist"),Y.get("operatorlist"),Y.get("vcObserverList"),Y.get("cashierList"),Y.get("flowObserverList"),Y.get("reviewList"),Y.get("vcReviewList"),Y.get("flowReviewList"),Y.get("jrModelList")),w=Y.get("sobModel"),j=Y.get("currency"),J=Y.get("customizeList"),Q=Y.get("moduleMap"),D=Y.get("accountModelList"),W=s.getIn(["data","userInfo","isAdmin"]),z=s.getIn(["data","userInfo","isFinance"]),V=s.getIn(["data","userInfo","isDdAdmin"]),q=s.getIn(["data","userInfo","isDdPriAdmin"]),F=s.getIn(["data","userInfo","emplID"]),K=(a.get("isloading"),[]);D.forEach((function(e){K.push({key:e.get("modelName"),value:e.get("modelNumber")})}));var Z=Y.get("periodStartMonth"),$=[];O.forEach((function(e){$.push({key:"\u6bcf\u5e74".concat(Number(e),"\u6708\u8d77\u59cb"),value:e})}));var ee=[];X.forEach((function(e){if(e.get("modelId"))ee.push({key:e.get("modelId"),label:e.get("modelName"),childList:[]});else{var t=[];J.forEach((function(e){return t.push({key:e.get("sobId"),label:e.get("sobName"),childList:[]})})),ee.push({key:e.get("modelId"),label:e.get("modelName"),childList:t})}})),ee.push({key:"\u8bc6\u522b\u7801\u590d\u5236",label:"\u8bc6\u522b\u7801\u590d\u5236",childList:[]});var te=["3"],ne=[];P?ne=["4","5"]:D.forEach((function(e){ne.push(e.get("modelNumber"))}));var oe=Y.get("smartRoleInfo"),ae=Y.get("accountingRoleInfo"),le=te.indexOf(k)>-1?"SMART":"ACCOUNTING",se="SMART"===le?oe:ae,ie="SMART"===le?"smartRoleInfo":"accountingRoleInfo",pe=function(e){if(!P)return!!G.getIn([e,"beOverdue"])||!(!w||!0!==w.get("newJr"))&&(!(!Q||!Q.get(e))&&Q.getIn([e,"beOpen"]));if(G.getIn([e,"beOverdue"])){if("SCXM"==e)return!N;if("SGXM"==e)return!f;if("QUANTITY"==e)return!C;if("ASSIST"==e)return!R;if("SERIAL"==e)return!M;if("BATCH"==e)return!y;if("WAREHOUSE"==e)return!T;if("PROCESS"==e)return!h}},ue=[],re=[],ce=[];te.indexOf(k)>-1?(G.get("RUNNING_GL")&&G.getIn(["RUNNING_GL","beOpen"])&&(ue.push(G.getIn(["RUNNING_GL","moduleName"])),ce.push(G.getIn(["RUNNING_GL","moduleCode"]))),G.get("RUNNING_GL")&&re.push({key:G.getIn(["RUNNING_GL","moduleName"]),value:G.getIn(["RUNNING_GL","moduleCode"])}),G.get("PROCESS")&&G.getIn(["PROCESS","beOpen"])&&(ue.push(G.getIn(["PROCESS","moduleName"])),ce.push(G.getIn(["PROCESS","moduleCode"]))),G.get("PROCESS")&&re.push({key:G.getIn(["PROCESS","moduleName"]),value:G.getIn(["PROCESS","moduleCode"]),disabled:pe("PROCESS")}),G.get("PROJECT")&&G.getIn(["PROJECT","beOpen"])&&(ue.push(G.getIn(["PROJECT","moduleName"])),ce.push(G.getIn(["PROJECT","moduleCode"]))),G.get("PROJECT")&&re.push({key:G.getIn(["PROJECT","moduleName"]),value:G.getIn(["PROJECT","moduleCode"]),disabled:!P&&(!w||!0!==w.get("newJr")||!(!Q||!Q.get("PROJECT"))&&Q.getIn(["PROJECT","beOpen"]))}),G.get("SCXM")&&G.getIn(["SCXM","beOpen"])&&(ue.push(G.getIn(["SCXM","moduleName"])),ce.push(G.getIn(["SCXM","moduleCode"]))),G.get("SCXM")&&re.push({key:G.getIn(["SCXM","moduleName"]),value:G.getIn(["SCXM","moduleCode"]),disabled:pe("SCXM")}),G.get("SGXM")&&G.getIn(["SGXM","beOpen"])&&(ue.push(G.getIn(["SGXM","moduleName"])),ce.push(G.getIn(["SGXM","moduleCode"]))),G.get("SGXM")&&re.push({key:G.getIn(["SGXM","moduleName"]),value:G.getIn(["SGXM","moduleCode"]),disabled:pe("SGXM")}),G.get("INVENTORY")&&G.getIn(["INVENTORY","beOpen"])&&(ue.push(G.getIn(["INVENTORY","moduleName"])),ce.push(G.getIn(["INVENTORY","moduleCode"]))),G.get("INVENTORY")&&re.push({key:G.getIn(["INVENTORY","moduleName"]),value:G.getIn(["INVENTORY","moduleCode"]),disabled:!P&&(!w||!0!==w.get("newJr")||!(!Q||!Q.get("INVENTORY"))&&Q.getIn(["INVENTORY","beOpen"]))}),G.get("WAREHOUSE")&&G.getIn(["WAREHOUSE","beOpen"])&&(ue.push(G.getIn(["WAREHOUSE","moduleName"])),ce.push(G.getIn(["WAREHOUSE","moduleCode"]))),G.get("WAREHOUSE")&&re.push({key:G.getIn(["WAREHOUSE","moduleName"]),value:G.getIn(["WAREHOUSE","moduleCode"]),disabled:pe("WAREHOUSE")}),G.get("QUANTITY")&&G.getIn(["QUANTITY","beOpen"])&&(ue.push(G.getIn(["QUANTITY","moduleName"])),ce.push(G.getIn(["QUANTITY","moduleCode"]))),G.get("QUANTITY")&&re.push({key:G.getIn(["QUANTITY","moduleName"]),value:G.getIn(["QUANTITY","moduleCode"]),disabled:pe("QUANTITY")}),G.get("ASSIST")&&G.getIn(["ASSIST","beOpen"])&&(ue.push(G.getIn(["ASSIST","moduleName"])),ce.push(G.getIn(["ASSIST","moduleCode"]))),G.get("ASSIST")&&re.push({key:G.getIn(["ASSIST","moduleName"]),value:G.getIn(["ASSIST","moduleCode"]),disabled:pe("ASSIST")}),G.get("SERIAL")&&G.getIn(["SERIAL","beOpen"])&&(ue.push(G.getIn(["SERIAL","moduleName"])),ce.push(G.getIn(["SERIAL","moduleCode"]))),G.get("SERIAL")&&re.push({key:G.getIn(["SERIAL","moduleName"]),value:G.getIn(["SERIAL","moduleCode"]),disabled:pe("SERIAL")}),G.get("BATCH")&&G.getIn(["BATCH","beOpen"])&&(ue.push(G.getIn(["BATCH","moduleName"])),ce.push(G.getIn(["BATCH","moduleCode"]))),G.get("BATCH")&&re.push({key:G.getIn(["BATCH","moduleName"]),value:G.getIn(["BATCH","moduleCode"]),disabled:pe("BATCH")})):(G.get("ASSETS")&&G.getIn(["ASSETS","beOpen"])&&(ue.push(G.getIn(["ASSETS","moduleName"])),ce.push(G.getIn(["ASSETS","moduleCode"]))),G.get("ASSETS")&&re.push({key:G.getIn(["ASSETS","moduleName"]),value:G.getIn(["ASSETS","moduleCode"])}),G.get("CURRENCY")&&G.getIn(["CURRENCY","beOpen"])&&(ue.push(G.getIn(["CURRENCY","moduleName"])),ce.push(G.getIn(["CURRENCY","moduleCode"]))),G.get("CURRENCY")&&re.push({key:G.getIn(["CURRENCY","moduleName"]),value:G.getIn(["CURRENCY","moduleCode"])}),G.get("ASS")&&G.getIn(["ASS","beOpen"])&&(ue.push(G.getIn(["ASS","moduleName"])),ce.push(G.getIn(["ASS","moduleCode"]))),G.get("ASS")&&re.push({key:G.getIn(["ASS","moduleName"]),value:G.getIn(["ASS","moduleCode"])}),G.get("AMB")&&G.getIn(["AMB","beOpen"])&&(ue.push(G.getIn(["AMB","moduleName"])),ce.push(G.getIn(["AMB","moduleCode"]))),G.get("AMB")&&re.push({key:G.getIn(["AMB","moduleName"]),value:G.getIn(["AMB","moduleCode"]),disabled:P?!!G.getIn(["AMB","beOverdue"])&&!A:!!G.getIn(["AMB","beOverdue"])}),G.get("NUMBER")&&G.getIn(["NUMBER","beOpen"])&&(ue.push(G.getIn(["NUMBER","moduleName"])),ce.push(G.getIn(["NUMBER","moduleCode"]))),G.get("NUMBER")&&re.push({key:G.getIn(["NUMBER","moduleName"]),value:G.getIn(["NUMBER","moduleCode"])}));s.getIn(["views","isPlay"]);var me=[];v.forEach((function(e){me.push({key:e.get("name"),value:e.get("fcNumber")})}));var de={display:P||r?"":"none"};return u.a.createElement(d.h,{className:"sob-option"},u.a.createElement(d.s,{flex:"1"},u.a.createElement("ul",{className:"sob-option-sob-type"},(P?te.indexOf(k)>-1:L)?u.a.createElement("li",{className:te.indexOf(k)>-1?"sob-option-sob-type-current":"",onClick:function(){-1===te.indexOf(k)&&l(S.g("3"))}},"\u667a\u80fd\u7248"):"",(P?ne.indexOf(k)>-1:x)?u.a.createElement("li",{className:ne.indexOf(k)>-1?"sob-option-sob-type-current":"",onClick:function(){-1===ne.indexOf(k)&&l(S.g(ne[0]))}},"\u4f1a\u8ba1\u7248"):""),te.indexOf(k)>-1?u.a.createElement("div",{className:"sob-option-title-tip"},u.a.createElement("p",null,"\u4e13\u4e3a0\u57fa\u7840\u8d22\u52a1\u6253\u9020\uff0c\u8001\u677f\u3001\u51fa\u7eb3\u5747\u53ef\u4f7f\u7528\u3002"),u.a.createElement("p",null,"\u573a\u666f\u5316\u5f55\u5165\u6d41\u6c34\uff0c\u7cbe\u51c6\u8f93\u51fa\u4e13\u4e1a\u62a5\u8868")):u.a.createElement("div",{className:"sob-option-title-tip"},u.a.createElement("p",null,"\u4e13\u4e3a\u8d22\u52a1\u8001\u9e1f\u6253\u9020\uff0c\u4e13\u4e1a\u51ed\u8bc1\u5f55\u5165\u6a21\u5f0f\uff0c"),u.a.createElement("p",null,"\u652f\u6301\u9009\u914d\u8f85\u52a9\u6838\u7b97\u3001\u5916\u5e01\u3001\u8d44\u4ea7\u7b49\u6a21\u677f\u3002")),u.a.createElement("ul",{className:"sob-option-input-wrap"},u.a.createElement("li",{className:"sob-option-input"},u.a.createElement("span",{className:"sob-option-input-lable"},u.a.createElement("span",{className:"sob-option-input-label sob-option-input-label-main"},"\u8d26\u5957\u540d\u79f0"),u.a.createElement("span",{style:{color:"#d10000"}},"*")),u.a.createElement(d.z,{className:"sob-option-input-input",value:U,placeholder:"\u8bf7\u8f93\u5165\u8d26\u5957\u540d\u79f0",onChange:function(e){return l(S.e(e))}}),u.a.createElement(d.l,{className:"icon",type:"arrow-right",size:"12"})),u.a.createElement("li",{className:"sob-option-input sob-option-input-month"},u.a.createElement("span",{className:"sob-option-input-lable"},u.a.createElement("span",{className:"sob-option-input-label sob-option-input-label-main"},"\u8d77\u59cb\u8d26\u671f"),u.a.createElement("span",{style:{color:"#d10000"}},"*")),u.a.createElement(d.m,{format:"YYYY_MM",onChange:function(e){var t=new b.a(e);l(S.d(t.getYear(),t.getMonth()))}},u.a.createElement("div",{className:B?"sob-option-month-picker-wrap":"sob-option-month-picker-wrap sob-option-month-picker-wrap-placeholder"},B?"".concat(B,"\u5e74").concat(_,"\u6708"):"\u8bf7\u9009\u62e9\u65e5\u671f")),u.a.createElement(d.l,{className:"icon",type:"arrow-right",size:"12"})),ne.indexOf(k)>-1&&!P?u.a.createElement("li",{className:"sob-option-input"},u.a.createElement("span",{className:"sob-option-input-lable"},u.a.createElement("span",{className:"sob-option-input-label sob-option-input-label-main"},"\u8d26\u5957\u6a21\u7248"),u.a.createElement("span",{style:{color:"#d10000"}},"*")),u.a.createElement(d.v,{className:"sob-option-input-singlepicker",district:K,onOk:function(e){var t=D.find((function(t){return t.get("modelNumber")===e.value}));l(S.h(t)),l(S.g(e.value))}},u.a.createElement("span",{className:"sob-option-input-singlepicker-inner"},K.find((function(e){return e.value===k})).key)),u.a.createElement(d.l,{className:"icon",type:"arrow-right",size:"12"})):"",te.indexOf(k)>-1&&!P?u.a.createElement("li",{className:"sob-option-input"},u.a.createElement("span",{className:"sob-option-input-lable"},u.a.createElement("span",{className:"sob-option-input-label sob-option-input-label-main"},"\u8d26\u5957\u6a21\u7248"),u.a.createElement("span",{style:{color:"#d10000"}},"*")),u.a.createElement(g.a,{className:"sob-option-input-singlepicker",parentDisabled:!0,onChange:function(e){if("\u8bc6\u522b\u7801\u590d\u5236"===e.key)return E||(t.setState({gettedIdentifyingCodeList:!0}),l(S.j())),l(S.l()),void i.push("/config/sob/copymodule");if(X.find((function(t){return t.get("modelId")===e.key}))){var n=X.find((function(t){return t.get("modelId")===e.key}));if(l(S.h(n)),!0===n.get("newJr"))n.getIn(["moduleMap","INVENTORY"])&&(G=G.setIn(["INVENTORY","beOpen"],n.getIn(["moduleMap","INVENTORY","beOpen"]))),n.getIn(["moduleMap","PROJECT"])&&(G=G.setIn(["PROJECT","beOpen"],n.getIn(["moduleMap","PROJECT","beOpen"]))),n.getIn(["moduleMap","QUANTITY"])&&!G.getIn(["QUANTITY","beOverdue"])&&(G=G.setIn(["QUANTITY","beOpen"],n.getIn(["moduleMap","QUANTITY","beOpen"]))),n.getIn(["moduleMap","ASSIST"])&&!G.getIn(["ASSIST","beOverdue"])&&(G=G.setIn(["ASSIST","beOpen"],n.getIn(["moduleMap","ASSIST","beOpen"]))),n.getIn(["moduleMap","SERIAL"])&&!G.getIn(["SERIAL","beOverdue"])&&(G=G.setIn(["SERIAL","beOpen"],n.getIn(["moduleMap","SERIAL","beOpen"]))),n.getIn(["moduleMap","BATCH"])&&!G.getIn(["BATCH","beOverdue"])&&(G=G.setIn(["BATCH","beOpen"],n.getIn(["moduleMap","BATCH","beOpen"]))),n.getIn(["moduleMap","WAREHOUSE"])&&!G.getIn(["WAREHOUSE","beOverdue"])&&(G=G.setIn(["WAREHOUSE","beOpen"],n.getIn(["moduleMap","WAREHOUSE","beOpen"]))),n.getIn(["moduleMap","SCXM"])&&!G.getIn(["SCXM","beOverdue"])&&(G=G.setIn(["SCXM","beOpen"],n.getIn(["moduleMap","SCXM","beOpen"]))),n.getIn(["moduleMap","SGXM"])&&!G.getIn(["SGXM","beOverdue"])&&(G=G.setIn(["SGXM","beOpen"],n.getIn(["moduleMap","SGXM","beOpen"]))),l(S.o("moduleInfo",G)),l(S.o("moduleMap",n.get("moduleMap")));else{var o=G.setIn(["INVENTORY","beOpen"],!0).setIn(["PROJECT","beOpen"],!0);l(S.o("moduleInfo",o)),l(S.o("moduleMap",o))}}else{var a=J.find((function(t){return t.get("sobId")===e.key}));l(S.m(a,e.key,!1)),i.push("/config/sob/copymodule")}},district:ee},u.a.createElement("span",{className:w?"sob-option-input-single-inner":"sob-option-input-single-inner sob-option-month-picker-wrap-placeholder"},w?!0===w.get("customize")?"".concat(w.get("sobName")," (\u8d77\u59cb\u8d26\u671f:").concat(w.get("firstYear"),"\u5e74").concat(w.get("firstMonth"),"\u6708)"):w.get("modelName")?w.get("modelName"):w.get("sobName"):"\u8bf7\u9009\u62e9")),u.a.createElement(d.l,{className:"icon",type:"arrow-right",size:"12"})):"",ne.indexOf(k)>-1?u.a.createElement("li",{className:"sob-option-input"},u.a.createElement("span",{className:"sob-option-input-lable"},u.a.createElement("span",{className:"sob-option-input-label sob-option-input-label-main"},"\u4f1a\u8ba1\u5e74\u5ea6"),u.a.createElement("span",{style:{color:"#d10000"}},"*")),u.a.createElement(d.u,{className:"sob-option-input-singlepicker",district:$,onOk:function(e){return l(S.o("periodStartMonth",e.value))}},u.a.createElement("span",{className:"sob-option-input-single-inner"},$.find((function(e){return e.value===Z})).key)),u.a.createElement(d.l,{className:"icon",type:"arrow-right",size:"12"})):"",ne.indexOf(k)>-1&&H&&H.get("beOpen")?u.a.createElement("li",{className:"sob-option-input"},u.a.createElement("span",{className:"sob-option-input-lable"},u.a.createElement("span",{className:"sob-option-input-label sob-option-input-label-main"},"\u672c\u4f4d\u5e01"),u.a.createElement("span",{style:{color:"#d10000"}},"*")),u.a.createElement(d.u,{className:"sob-option-input-singlepicker",district:me,value:j?v.find((function(e){return e.get("fcNumber")==j}))?v.find((function(e){return e.get("fcNumber")==j})).get("name"):"":"\u4eba\u6c11\u5e01",onOk:function(e){l(S.c(e.value))}},u.a.createElement("span",{className:"sob-option-input-single-inner"},j?v.find((function(e){return e.get("fcNumber")==j}))?v.find((function(e){return e.get("fcNumber")==j})).get("name"):"":"\u4eba\u6c11\u5e01")),u.a.createElement(d.l,{className:"icon",type:"arrow-right",size:"12"})):"",u.a.createElement(d.n,{district:re,value:ce,title:"\u529f\u80fd\u6a21\u5757",onOk:function(e){var t=e.map((function(e){return e.value}));l(S.p(t,re))}},u.a.createElement("li",{className:"sob-option-input"},u.a.createElement("span",{className:"sob-option-input-lable"},u.a.createElement("span",{className:"sob-option-input-label sob-option-input-label-main"},"\u529f\u80fd\u6a21\u5757")),u.a.createElement("div",{className:"sob-option-input-fun"},u.a.createElement("span",{className:"sob-option-input-fun-detail"},ue.map((function(e,t){return u.a.createElement("span",{key:t},ue.length-1==t?e:e+"\u3001")}))),u.a.createElement(d.l,{className:"icon",type:"arrow-right",size:"12"})))),u.a.createElement("li",{className:"sob-option-input",style:{background:r?"#fbfbfb":"#fff"},onClick:function(){return t.setState({showRoleList:!r})}},u.a.createElement("span",{className:"sob-option-input-lable"},u.a.createElement("span",{className:"sob-option-input-label sob-option-input-label-main"},"\u89d2\u8272\u6743\u9650")),u.a.createElement("div",{className:"sob-option-input-fun"}),u.a.createElement(d.l,{type:"arrow-down",size:"12"})),se.map((function(t,n){return u.a.createElement("li",{className:"sob-option-input",style:de},u.a.createElement("span",{className:"sob-option-input-lable"},u.a.createElement("span",{className:"sob-option-input-label"},"  - ",t.get("roleName"))),u.a.createElement("div",{className:"sob-option-input-fun",onClick:function(){!function(t,n,o){if(!e.isplayground){var a="";c.b.indexOf("mtst.xfannix.com")>-1?a=m.i:c.b.indexOf("mpre.xfannix.com")>-1?a=m.h:c.b.indexOf("mobile.xfannix.com")>-1&&(a=m.g),I.a.complexPicker({title:n,corpId:sessionStorage.getItem("corpId"),multiple:!0,limitTips:"\u8d85\u51fa\u4e86",maxUsers:1e3,pickedUsers:t.map((function(e){return e.get("emplId")})).toJS(),pickedDepartments:[],disabledUsers:[],disabledDepartments:[],requiredUsers:[],requiredDepartments:[],appId:a,permissionType:"xxx",responseUserOnly:!0,startWithDepartmentId:0,onSuccess:function(e){e=e.users.map((function(e){return e.emplId=e.emplId.toString(),e})),o(e)},onFail:function(e){}})}}(t.get("userList"),"\u9009\u62e9".concat(t.get("roleName")),(function(e){l(S.f(ie,n,e))}))}},u.a.createElement("div",{className:"sob-option-input-fun-role"},t.get("userList").size?u.a.createElement("span",{className:"sob-option-input-fun-role-list"},u.a.createElement("span",null,t.get("userList").map((function(e){return e.get("name")})).join("\u3001"))):u.a.createElement("span",{className:"sob-option-input-fun-role-placeholder"})),u.a.createElement(d.l,{className:"icon",type:"arrow-right",size:"12"})))})))),u.a.createElement(d.d,{type:"ghost",height:50},u.a.createElement(d.c,{onClick:function(){return i.goBack()}},u.a.createElement(d.l,{type:"cancel"}),"\u53d6\u6d88"),u.a.createElement(d.c,{onClick:function(){if(""!==U){var e=30;if(/[\u4e00-\u9fa5]/g.test(U)||/[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g.test(U)||(e=60),U.length>e)I.a.toast.info("\u8d26\u5957\u540d\u79f0\u5305\u542b\u4e2d\u6587\u53ca\u4e2d\u6587\u6807\u70b9\u5b57\u7b26\uff0c\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc730\u4f4d\uff1b\u5426\u5219\uff0c\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc760\u4f4d");else if(""!==B)if(Y.get("sobid")){o.get("sobList").filter((function(e){return e.get("sobid")===Y.get("sobid")})).get(0).get("adminlist").find((function(e){return e.get("emplId")===F}))||"TRUE"===W?l(S.q(i)):I.a.Alert("\u60a8\u6ca1\u6709\u6743\u9650")}else{if(te.indexOf(k)>-1&&(!w||!w.get("modelId")))return void I.a.toast.info("\u8d26\u5957\u6a21\u7248\u4e0d\u53ef\u4e3a\u7a7a");"TRUE"===W||"TRUE"===z||"TRUE"===V||"TRUE"===q?l(S.q(i)):I.a.Alert("\u60a8\u6ca1\u6709\u6743\u9650")}else I.a.toast.info("\u8d77\u59cb\u8d26\u671f\u4e0d\u53ef\u4e3a\u7a7a")}else I.a.toast.info("\u8d26\u5957\u540d\u79f0\u4e0d\u53ef\u4e3a\u7a7a")}},u.a.createElement(d.l,{type:"save"}),"\u4fdd\u5b58")))}}]),o}(u.a.Component))||o}).call(this,n(49))},1861:function(e,t,n){},956:function(e,t,n){"use strict";n.r(t),n.d(t,"reducer",(function(){return h})),n.d(t,"view",(function(){return T}));var o,a,l,s=n(7),i=n(8),p=n(9),u=n(10),r=n(0),c=n.n(r),m=n(47),d=(n(1),n(11)),g=n(6),I=(n(31),n(1859),n(116),n(24)),b=(n(55),n(13),n(17),n(38)),E=n(2),S=(n(12),n(101)),O=(n(14),Object(I.immutableRenderDecorator)(o=function(e){Object(u.a)(n,e);var t=Object(p.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"render",value:function(){var e=this.props,t=(e.idx,e.allCheckboxDisplay),n=e.sob,o=e.username,a=e.dispatch,l=e.isEnd,s=e.history,i=e.isAdmin,p=n.get("adminlist").some((function(e){return e.get("name")===o}));return c.a.createElement("div",{className:"sob-item-wrap"},c.a.createElement("div",{className:"sob-item",style:{borderBottom:l?"0":""},onClick:function(){(p||i)&&a(S.b(n.get("sobid"),s))}},c.a.createElement(d.e,{className:"checkbox",style:{display:t?"inline-block":"none"},checked:n.get("selected")}),c.a.createElement("div",{className:"sob-info"},c.a.createElement("p",{className:"sob-info-sobname"},n.get("sobname"))),c.a.createElement(d.l,{className:"icon",type:"arrow-right"})))}}]),n}(c.a.Component))||o),N=Object(m.c)((function(e){return e}))(a=function(e){Object(u.a)(n,e);var t=Object(p.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"componentDidMount",value:function(){E.a.setTitle({title:"\u8d26\u5957\u7f16\u8f91"}),E.a.setIcon({showIcon:!1}),E.a.setRight({show:!1}),this.props.dispatch(b.b.setDdConfig())}},{key:"render",value:function(){var e=this.props,t=e.homeState,n=e.dispatch,o=e.sobConfigState,a=e.history,l=o.get("sobList").map((function(e,t){return e.set("key",t)})),s=o.get("allCheckboxDisplay"),i=o.get("toolBarDisplayIndex"),p=(o.get("xuanzeboxDisplay"),t.getIn(["data","userInfo","username"])),u=t.getIn(["data","userInfo"]),r=u.get("isAdmin"),m=u.get("isDdAdmin"),g=u.get("isDdPriAdmin"),I=u.get("isFinance"),b=t.getIn(["data","userInfo","moduleInfo"]),E=!!b&&!(!b.get("GL")||!0!==b.get("GL"));return c.a.createElement(d.h,{className:"sob-config"},c.a.createElement(d.s,{flex:"1"},l.map((function(e,t){return c.a.createElement(O,{allCheckboxDisplay:s,key:t,sob:e,idx:t,username:p,dispatch:n,history:a,isEnd:t==l.size-1,isAdmin:r})})),c.a.createElement("div",{className:"sob-config-tip-text"},"\u4ec5\u8d26\u5957\u7ba1\u7406\u5458\u53ef\u7f16\u8f91\u8d26\u5957")),c.a.createElement(d.d,{type:"ghost",height:50,style:{display:1===i?"":"none"}},c.a.createElement(d.c,{disabled:!E&&(r||m||g||I),onClick:function(){return n(S.b("",a))}},c.a.createElement(d.l,{type:"add-plus"}),c.a.createElement("span",null,"\u65b0\u589e"))))}}]),n}(c.a.Component))||a,f=n(1860),C=(n(223),n(98),Object(m.c)((function(e){return e}))(l=function(e){Object(u.a)(n,e);var t=Object(p.a)(n);function n(e){var o;return Object(s.a)(this,n),(o=t.call(this,e)).state={identifyingCode:""},o}return Object(i.a)(n,[{key:"render",value:function(){var e=this,t=this.props,n=t.sobConfigState,o=t.dispatch,a=t.history,l=this.state.identifyingCode,s=n.get("currentCopySobId"),i=n.get("isIdentifyingCode"),p=n.get("copyModuleMapItem"),u=n.get("identifyingCodeList"),r=n.get("tempSob"),m=r.get("moduleInfo"),g=r.get("customizeList"),I=r.get("jrModelList"),b=n.get("copyModuleIsNewJr"),E=["COPY_BASIS_SETTING","COPY_PRODUCTION_SETTING","COPY_CONSTRUCTION_SETTING","COPY_DEPOT_SETTING","COPY_QUANTITY_SETTING",,"COPY_ASSIST_SETTING","COPY_SERIAL_SETTING","COPY_BATCH_SETTING","COPY_BALANCE_SETTING"];return c.a.createElement(d.h,{className:"sob-option"},c.a.createElement(d.s,{flex:"1"},i?c.a.createElement("div",{className:"sob-option-copy-input"},c.a.createElement(d.z,{placeholder:"\u8bf7\u8f93\u5165\u8bc6\u522b\u7801",value:l,onChange:function(t){e.setState({identifyingCode:t});var n=u.find((function(e){return e.get("copyCode")===t}));n&&o(S.m(n,"",!0))}})):null,i&&l?c.a.createElement("div",{className:"sob-option-choosen-right-or-not"},u.find((function(e){return e.get("copyCode")===l}))?c.a.createElement("span",{style:{color:"green"}},"\u8bc6\u522b\u7801\u6b63\u786e\uff0c\u8bf7\u9009\u62e9\u9700\u590d\u5236\u7684\u5185\u5bb9"):c.a.createElement("span",{style:{color:"red"}},"\u8bc6\u522b\u7801\u9519\u8bef\uff0c\u8bf7\u6838\u5bf9\u540e\u518d\u8f93\u5165")):"",c.a.createElement("div",{className:"sob-option-choosen-tip",style:{display:i?l&&u.find((function(e){return e.get("copyCode")===l}))?"":"none":""}},"\u9009\u62e9\u9700\u8981\u590d\u5236\u7684\u5185\u5bb9"),c.a.createElement("ul",{className:"sob-option-choosen-copy-list",style:{display:i?l&&u.find((function(e){return e.get("copyCode")===l}))?"":"none":""}},E.map((function(e,t){if(p.get(e)){var n="COPY_BALANCE_SETTING"===e?p.getIn([e,"canModify"])&&E.every((function(e){return!p.get(e)||"COPY_BALANCE_SETTING"===e||p.getIn([e,"beOpen"])})):p.getIn([e,"canModify"]),a=!1;return"COPY_ASSIST_SETTING"!==e&&"COPY_SERIAL_SETTING"!==e&&"COPY_BATCH_SETTING"!==e||p.getIn(["COPY_QUANTITY_SETTING","beOpen"])||(a=!0),c.a.createElement("li",{key:t,className:"sob-option-choosen-copy-item",onClick:function(){b&&n&&!a&&(o(S.n(p.getIn([e,"moduleCode"]),!p.getIn([e,"beOpen"]))),!1===!p.getIn([e,"beOpen"])&&"COPY_BALANCE_SETTING"!==e&&o(S.n(p.getIn(["COPY_BALANCE_SETTING","moduleCode"]),!1)),"COPY_QUANTITY_SETTING"===e&&!1===!p.getIn([e,"beOpen"])&&(p.get("COPY_ASSIST_SETTING")&&o(S.n(p.getIn(["COPY_ASSIST_SETTING","moduleCode"]),!1)),p.get("COPY_SERIAL_SETTING")&&o(S.n(p.getIn(["COPY_SERIAL_SETTING","moduleCode"]),!1)),p.get("COPY_BATCH_SETTING")&&o(S.n(p.getIn(["COPY_BATCH_SETTING","moduleCode"]),!1))))}},c.a.createElement("span",{className:"sob-option-choosen-copy-item-text"},p.getIn([e,"moduleName"])),c.a.createElement(d.e,{disabled:!b||!n||a,checked:p.getIn([e,"beOpen"])}))}return null})),["COPY_PROCESS_SETTING"].map((function(e,t){if(p.get(e)){var n=p.getIn([e,"canModify"]);return c.a.createElement("li",{key:t,className:"sob-option-choosen-copy-item",onClick:function(){b&&n&&o(S.n(p.getIn([e,"moduleCode"]),!p.getIn([e,"beOpen"])))}},c.a.createElement("span",{className:"sob-option-choosen-copy-item-text"},p.getIn([e,"moduleName"])),c.a.createElement(d.e,{disabled:!b||!n,checked:p.getIn([e,"beOpen"])}))}return null})))),c.a.createElement(d.d,{type:"ghost",height:50},c.a.createElement(d.c,{onClick:function(){a.goBack()}},c.a.createElement(d.l,{type:"cancel"}),c.a.createElement("span",null,"\u53d6\u6d88")),c.a.createElement(d.c,{onClick:function(){var e;if(i){var t=u.find((function(e){return e.get("copyCode")===l}));e=t.set("modelId",t.get("sobId")).set("copyModuleMap",p)}else{var n=g.find((function(e){return e.get("sobId")===s}));e=(e=I.find((function(e){return!0===e.get("customize")}))).merge(n).set("modelId",n.get("sobId")).set("copyModuleMap",p)}if(o(S.h(e)),!0===e.get("newJr")){var r=e.get("moduleMap");e.getIn(["moduleMap","PROCESS"])&&!m.getIn(["PROCESS","beOverdue"])&&(m=m.set("PROCESS",e.getIn(["moduleMap","PROCESS"])),r=r.setIn(["PROCESS","beOpen"],e.getIn(["copyModuleMap","COPY_PROCESS_SETTING","beOpen"]))),e.getIn(["moduleMap","INVENTORY"])&&(m=m.set("INVENTORY",e.getIn(["moduleMap","INVENTORY"]))),e.getIn(["moduleMap","PROJECT"])&&(m=m.set("PROJECT",e.getIn(["moduleMap","PROJECT"]))),e.getIn(["moduleMap","QUANTITY"])&&!m.getIn(["QUANTITY","beOverdue"])&&(m=m.set("QUANTITY",e.getIn(["moduleMap","QUANTITY"])),r=r.setIn(["QUANTITY","beOpen"],e.getIn(["copyModuleMap","COPY_QUANTITY_SETTING","beOpen"]))),e.getIn(["moduleMap","ASSIST"])&&!m.getIn(["ASSIST","beOverdue"])&&(m=m.setIn(["ASSIST","beOpen"],e.getIn(["moduleMap","ASSIST","beOpen"])),r=r.setIn(["ASSIST","beOpen"],e.getIn(["copyModuleMap","COPY_ASSIST_SETTING","beOpen"]))),e.getIn(["moduleMap","SERIAL"])&&!m.getIn(["SERIAL","beOverdue"])&&(m=m.setIn(["SERIAL","beOpen"],e.getIn(["moduleMap","SERIAL","beOpen"])),r=r.setIn(["SERIAL","beOpen"],e.getIn(["copyModuleMap","COPY_SERIAL_SETTING","beOpen"]))),e.getIn(["moduleMap","BATCH"])&&!m.getIn(["BATCH","beOverdue"])&&(m=m.setIn(["BATCH","beOpen"],e.getIn(["moduleMap","BATCH","beOpen"])),r=r.setIn(["BATCH","beOpen"],e.getIn(["copyModuleMap","COPY_BATCH_SETTING","beOpen"]))),e.getIn(["moduleMap","WAREHOUSE"])&&!m.getIn(["WAREHOUSE","beOverdue"])&&(m=m.set("WAREHOUSE",e.getIn(["moduleMap","WAREHOUSE"])),r=r.setIn(["WAREHOUSE","beOpen"],e.getIn(["copyModuleMap","COPY_DEPOT_SETTING","beOpen"]))),e.getIn(["moduleMap","SCXM"])&&!m.getIn(["SCXM","beOverdue"])&&(m=m.set("SCXM",e.getIn(["moduleMap","SCXM"])),r=r.setIn(["SCXM","beOpen"],e.getIn(["copyModuleMap","COPY_PRODUCTION_SETTING","beOpen"]))),e.getIn(["moduleMap","SGXM"])&&!m.getIn(["SGXM","beOverdue"])&&(m=m.set("SGXM",e.getIn(["moduleMap","SGXM"])),r=r.setIn(["SGXM","beOpen"],e.getIn(["copyModuleMap","COPY_CONSTRUCTION_SETTING","beOpen"]))),o(S.o("moduleInfo",m)),o(S.o("moduleMap",r))}else{var c=m.setIn(["INVENTORY","beOpen"],!0).setIn(["PROJECT","beOpen"],!0);o(S.o("moduleInfo",c)),o(S.o("moduleMap",c))}a.goBack()}},c.a.createElement(d.l,{type:"choose"}),c.a.createElement("span",null,"\u786e\u5b9a"))))}}]),n}(c.a.Component))||l),T=function(e){Object(u.a)(n,e);var t=Object(p.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"render",value:function(){return c.a.createElement(d.h,{className:"project-config"},c.a.createElement(g.a,{path:"/config/sob/index",component:N}),c.a.createElement(g.a,{path:"/config/sob/option",component:f.a}),c.a.createElement(g.a,{path:"/config/sob/copymodule",component:C}))}}]),n}(c.a.Component),h={sobConfigState:n(209).a}}}]);