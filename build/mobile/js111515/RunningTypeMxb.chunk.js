(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[106],{1038:function(e,t,n){"use strict";n.d(t,"a",(function(){return l})),n.d(t,"b",(function(){return g}));n(115),n(219),n(56);var a=n(4),i=n(51),r=n(1),c=n(78),s=n(14),o=n(12),u=n(2),d=Object(r.fromJS)({views:{fromPage:"",uuidList:[]},currentItem:{},jrOri:{},category:{},processInfo:null});function l(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:d,n=arguments.length>1?arguments[1]:void 0;return((e={},Object(a.a)(e,f.GET_RUNNING_PREVIEW_BUSINESS_FETCH,(function(){return t=t.set("jrOri",Object(r.fromJS)(n.receivedData.jrOri)).set("category",Object(r.fromJS)(n.receivedData.category)).set("processInfo",n.receivedData.processInfo?Object(r.fromJS)(n.receivedData.processInfo):null).set("currentItem",n.currentItem).setIn(["views","fromPage"],n.fromPage).setIn(["views","uuidList"],n.uuidList)})),Object(a.a)(e,f.GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH,(function(){return t=t.set("jrOri",Object(r.fromJS)(n.receivedData.jrOri)).set("category",Object(r.fromJS)(n.receivedData.category)).set("processInfo",n.receivedData.processInfo?Object(r.fromJS)(n.receivedData.processInfo):null).set("lsItemData",Object(r.fromJS)(Object(i.a)({},n.receivedData.category,{},n.receivedData.jrOri)))})),Object(a.a)(e,f.PREVIEW_RUNNING_DATA,(function(){return t=t.setIn(["views","uuidList"],Object(r.fromJS)(n.data))})),e)[n.type]||function(){return t})()}var g={getRunningPreviewBusinessFetch:function(e,t,n,a,i){return function(r){e&&(u.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(c.a)("getRunningPreview","GET","oriUuid=".concat(e),(function(e){u.a.toast.hide(),Object(o.u)(e)&&(r({type:f.GET_RUNNING_PREVIEW_BUSINESS_FETCH,receivedData:e.data,currentItem:t,uuidList:n,fromPage:a}),i.push("/runningpreview"))})))}},getPreviewNextRunningBusinessFetch:function(e,t){return function(t){e&&(u.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(c.a)("getRunningPreview","GET","oriUuid=".concat(e),(function(e){u.a.toast.hide(),Object(o.u)(e)&&t({type:f.GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH,receivedData:e.data})})))}},insertRunningBusinessVc:function(e,t,n){return function(a,i){u.a.toast.loading(s.p,0),Object(c.a)("insertRunningBusinessVc","POST",JSON.stringify({uuidList:[e],vcindexlist:[n],year:t.slice(0,4),month:t.slice(5,7),action:"QUERY_JR-AUDIT"}),(function(t){if(u.a.toast.hide(),Object(o.u)(t)){if(t.data.result.length){var n=t.data.result.reduce((function(e,t){return e+","+t}));return void u.a.Alert(n)}a(g.getPreviewNextRunningBusinessFetch(e))}}))}},deleteRunningBusinessVc:function(e,t,n,a){return function(i,r){u.a.toast.loading(s.p,0),Object(c.a)("deletevc","POST",JSON.stringify({year:e,month:t,vcindexlist:n,action:"QUERY_JR-CANCEL_AUDIT"}),(function(e){u.a.toast.hide(),Object(o.u)(e)&&i(g.getPreviewNextRunningBusinessFetch(a))}))}},deleteRunning:function(e,t,n){return function(a){u.a.Confirm({message:"\u786e\u5b9a\u5220\u9664\u5417",title:"\u63d0\u793a",buttonLabels:["\u53d6\u6d88","\u786e\u5b9a"],onSuccess:function(i){if(1===i.buttonIndex){var r=t.findIndex((function(t){return t.get("oriUuid")===e})),d=r+1;u.a.toast.loading(s.p,0),Object(c.a)("deleteRunningbusiness","POST",JSON.stringify({deleteList:[e]}),(function(e){if(Object(o.u)(e)){if(e.data.errorList.length){var i=e.data.errorList.reduce((function(e,t){return e+","+t}));u.a.Alert(i)}if(0==e.data.errorList.length){var c=t.delete(r);a({type:f.PREVIEW_RUNNING_DATA,data:c}),d<t.size?a(g.getPreviewNextRunningBusinessFetch(t.getIn([d,"oriUuid"]))):n.goBack()}}}))}},onFail:function(e){return alert(e)}})}}},f={GET_RUNNING_PREVIEW_BUSINESS_FETCH:"GET_RUNNING_PREVIEW_BUSINESS_FETCH",GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH:"GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH",PREVIEW_RUNNING_DATA:"PREVIEW_RUNNING_DATA"}},1114:function(e,t,n){"use strict";n.d(t,"h",(function(){return a})),n.d(t,"f",(function(){return i})),n.d(t,"d",(function(){return r})),n.d(t,"e",(function(){return c})),n.d(t,"b",(function(){return s})),n.d(t,"g",(function(){return o})),n.d(t,"a",(function(){return u})),n.d(t,"c",(function(){return d}));var a="INIT_RUNNING_TYPE_MXB",i="GET_RUNNING_TYPE_MXB_LIST_FROM_RUNNING_TYPE_YEB",r="GET_RUNNING_TYPE_MXB_CATEGORY",c="GET_RUNNING_TYPE_MXB_LIST_FROM_PAGE",s="CHANGE_RUNNING_TYPE_MXB_COMMON_STATE",o="GET_RUNNING_TYPE_MXB_LIST_NO_TYPE_TREE",u="CHANGE_RUNNING_TYPE_MXB_CHOOSE_VALUE",d="CHANGE_RUNNING_TYPE_STRING"},1177:function(e,t,n){"use strict";n.d(t,"g",(function(){return d})),n.d(t,"f",(function(){return g})),n.d(t,"d",(function(){return f})),n.d(t,"c",(function(){return m})),n.d(t,"e",(function(){return N})),n.d(t,"b",(function(){return b})),n.d(t,"a",(function(){return p}));n(31),n(1130);var a=n(1145),i=(n(1),n(1114)),r=n(78),c=n(12),s=n(2),o=n(14),u=n(130),d=function(e,t,n,d,g){return function(f){var m=n.get("acId");n.get("mergeName");if(!e)return a.b.info("\u8d26\u671f\u5f02\u5e38\uff0c\u8bf7\u5237\u65b0\u518d\u8bd5",2);f(l(e,t)),s.a.toast.loading(o.p,0),Object(r.a)("getRunningTypeMxbReport","POST",JSON.stringify({begin:e,end:t,acId:m,jrAbstract:"",pageNum:1,pageSize:o.t,needPeriod:"true"}),(function(n){if(s.a.toast.hide(),Object(c.u)(n)){var a=n.data.periodDtoJson?f(u.d(n.data.periodDtoJson)):[];f({type:i.f,receivedData:n.data,issuedate:e,endissuedate:t,currentTypeUuid:m,currentPage:1,needPeriod:"true",issues:a,acName:g})}})),d.push("runningTypeMxb")}},l=function(e,t){return function(n){s.a.toast.loading(o.p,0),Object(r.a)("getRunningTypeMxbCategory","POST",JSON.stringify({begin:e,end:t}),(function(e){Object(c.u)(e)&&n({type:i.d,receivedData:e.data.tree.childList}),s.a.toast.hide()}))}},g=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",u=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,d=arguments.length>4?arguments[4]:void 0,l=arguments.length>5?arguments[5]:void 0,g=arguments.length>6?arguments[6]:void 0;return function(f,m){if(!e)return a.b.info("\u8d26\u671f\u5f02\u5e38\uff0c\u8bf7\u5237\u65b0\u518d\u8bd5",2);!l&&s.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(r.a)("getRunningTypeMxbReport","POST",JSON.stringify({begin:e,end:t,acId:n,jrAbstract:"",pageSize:o.t,needPeriod:"true",pageNum:u}),(function(a){!l&&s.a.toast.hide(),Object(c.u)(a)&&(l&&g.setState({isLoading:!1}),f({type:i.e,receivedData:a.data,issuedate:e,endissuedate:t,currentTypeUuid:n,currentPage:u,shouldConcat:d}))}))}},f=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",d=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"debit",l=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,g=arguments.length>5?arguments[5]:void 0,f=arguments.length>6?arguments[6]:void 0,m=arguments.length>7?arguments[7]:void 0,N=arguments.length>8?arguments[8]:void 0;return function(b,p){if(!e)return a.b.info("\u8d26\u671f\u5f02\u5e38\uff0c\u8bf7\u5237\u65b0\u518d\u8bd5",2);!m&&s.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(r.a)("getJrRunningTypeList","POST",JSON.stringify({begin:e,end:t,acId:n,jrAbstract:"",pageSize:o.t,needPeriod:"true",pageNum:l,direction:d}),(function(a){if(!m&&s.a.toast.hide(),Object(c.u)(a)){m&&N.setState({isLoading:!1});var r=a.data.periodDtoJson?b(u.d(a.data.periodDtoJson)):[],o=e||b(u.j(a));b({type:i.e,receivedData:a.data,issuedate:o,endissuedate:t,currentTypeUuid:n,currentPage:l,shouldConcat:f,direction:d,issues:r,needPeriod:g})}}))}},m=function(e,t,n){return function(a,o){Object(r.a)("getJrAcList","POST",JSON.stringify({needPeriod:!0,begin:e,end:t,acId:n}),(function(e){if(Object(c.u)(e)){var t=e.data.tree,n=t.acId,r=t.typeName,o=t.direction,u=e.data.tree.childList;e.data.tree.acId?(a(b("views","acName",e.data.tree.typeName)),"\u5168\u90e8"===e.data.tree.typeName?u.unshift({acId:n,mergeName:r,acName:r,direction:o}):u=[e.data.tree]):s.a.toast.info("\u5f53\u524d\u8d26\u671f\u65e0\u6570\u636e"),a({type:i.d,receivedData:u})}}))}},N=function(e,t,n){return function(a){s.a.toast.loading(o.p,0),Object(r.a)("getRunningTypeMxbCategory","POST",JSON.stringify({begin:e,end:t,needPeriod:"true"}),(function(d){if(s.a.toast.hide(),Object(c.u)(d)){d.data.periodDtoJson&&a(u.d(d.data.periodDtoJson));var l=e||a(u.j(d));a({type:i.d,receivedData:d.data.tree.childList});var g=n,f="",m=!1;if(d.data.tree.childList.length>0){!function e(t){return t.map((function(t){t.acId==n&&(m=!0,f=t.acName),t.childList.length>0&&e(t.childList)}))}(d.data.tree.childList),m||(g=d.data.tree.childList[0].acId,f=d.data.tree.childList[0].acName),s.a.toast.loading(o.p,0),Object(r.a)("getRunningTypeMxbReport","POST",JSON.stringify({begin:e,end:t,acId:g,jrAbstract:"",pageNum:1,pageSize:o.t,needPeriod:"true"}),(function(e){s.a.toast.hide(),Object(c.u)(e)&&a({type:i.f,receivedData:e.data,issuedate:l,endissuedate:t,currentTypeUuid:g,acName:f,currentPage:1})}))}else a({type:i.g,issuedate:l,endissuedate:t})}}))}},b=function(e,t,n){return{type:i.b,parent:e,position:t,value:n}},p=function(e){return{type:i.a,value:e}}},1180:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));n(32),n(31),n(131),n(70);var a=n(4),i=n(1),r=n(1114),c=n(14),s=Object(i.fromJS)({views:{typeUuid:"",acName:"\u5168\u90e8",chooseValue:"ISSUE"},issuedate:"",endissuedate:"",issues:[{value:"",key:""}],runningCategoryList:[{key:"",label:"",childList:[]}],opendetail:{direction:"",balanceAmount:0},totalAmountList:{direction:"",allBalanceAmount:0},runningTypeDetailList:[],pageCount:1,currentPage:1});function o(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s,n=arguments.length>1?arguments[1]:void 0;return((e={},Object(a.a)(e,r.h,(function(){return s})),Object(a.a)(e,r.f,(function(){var e=n.receivedData.detail,a={allBalanceAmount:e.allBalanceAmount,direction:e.direction},r=n.receivedData.detail.childList,c=r[0],s=r.splice(1,r.length-1);return t=t.set("runningTypeDetailList",Object(i.fromJS)(s)).set("totalAmountList",Object(i.fromJS)(a)).set("issuedate",n.issuedate).set("endissuedate",n.endissuedate).set("pageCount",n.receivedData.detail.pages).set("currentPage",n.currentPage).set("opendetail",Object(i.fromJS)(c)).setIn(["views","typeUuid"],n.currentTypeUuid),"true"===n.needPeriod&&(t=t.set("issues",Object(i.fromJS)(n.issues))),n.currentTypeUuid||(t=t.setIn(["views","acName"],"")),n.acName&&(t=t.setIn(["views","acName"],n.acName)),t})),Object(a.a)(e,r.e,(function(){var e=n.receivedData.detail,a={allBalanceAmount:e.allBalanceAmount,direction:e.direction},r=n.receivedData.detail.childList,c=r[0],s=[],o=[];if(n.shouldConcat){var u=t.get("runningTypeDetailList").toJS();o=r.splice(1,r.length-1),s=u.concat(o)}else s=o=r.splice(1,r.length-1);return t=t.set("runningTypeDetailList",Object(i.fromJS)(s)).set("totalAmountList",Object(i.fromJS)(a)).set("issuedate",n.issuedate).set("endissuedate",n.endissuedate).set("pageCount",n.receivedData.detail.pages).set("currentPage",n.currentPage).set("opendetail",Object(i.fromJS)(c)).setIn(["views","typeUuid"],n.currentTypeUuid),n.currentTypeUuid||(t=t.setIn(["views","acName"],"")),n.acName&&(t=t.setIn(["views","acName"],n.acName)),n.direction&&(t=t.setIn(["views","direction"],n.direction)),n.issues&&(t=t.set("issues",Object(i.fromJS)(n.issues))),t})),Object(a.a)(e,r.d,(function(){var e=function e(t){return t.map((function(t,n){return t.childList&&t.childList.length?{key:"".concat(t.acId).concat(c.B).concat(t.mergeName).concat(c.B).concat(t.direction),label:t.acName,childList:e(t.childList)}:{key:"".concat(t.acId).concat(c.B).concat(t.mergeName).concat(c.B).concat(t.direction),label:t.acName,childList:[]}}))}(n.receivedData);return t=t.set("runningCategoryList",Object(i.fromJS)(e))})),Object(a.a)(e,r.b,(function(){return t.setIn([n.parent,n.position],n.value)})),Object(a.a)(e,r.g,(function(){return t=t.set("runningTypeDetailList",Object(i.fromJS)([])).set("runningCategoryList",Object(i.fromJS)([{key:"",label:"",childList:[]}])).set("totalAmountList",Object(i.fromJS)({allBalanceAmount:"",direction:""})).set("issuedate",n.issuedate).set("endissuedate",n.endissuedate).set("pageCount",1).set("currentPage",1).setIn(["views","typeUuid"],"").setIn(["views","acName"],""),n.currentTypeUuid||(t=t.setIn(["views","acName"],"")),n.acName&&(t=t.setIn(["views","acName"],n.acName)),t})),Object(a.a)(e,r.a,(function(){return t=t.setIn(["views","chooseValue"],n.value)})),Object(a.a)(e,r.c,(function(){return t=t.setIn(["views",n.name],n.value)})),e)[n.type]||function(){return t})()}},1855:function(e,t,n){},985:function(e,t,n){"use strict";n.r(t),n.d(t,"reducer",(function(){return T})),n.d(t,"view",(function(){return y}));n(115),n(31),n(56),n(29),n(82);var a,i,r,c,s=n(7),o=n(8),u=n(9),d=n(10),l=n(0),g=n.n(l),f=n(47),m=(n(1),n(1855),n(2)),N=n(14),b=n(11),p=n(542),v=(n(32),n(24)),E=(n(1082),n(1038)),I=Object(v.immutableRenderDecorator)(a=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(o.a)(n,[{key:"render",value:function(){var e=this.props,t=e.item,n=e.style,a=e.dispatch,i=e.className,r=e.history,c=e.detailsTemp;return g.a.createElement("div",{className:"ba "+i,style:n,onClick:function(e){a(E.b.getRunningPreviewBusinessFetch(t.get("oriUuid"),t,c,"mxb",r))}},g.a.createElement("div",null,g.a.createElement("span",{className:"name"},g.a.createElement("span",{className:"name-name"},t.get("jrJvCardAbstract")?"".concat(t.get("oriDate"),"_").concat(t.get("oriAbstract")).concat(t.get("jrJvCardAbstract")):"".concat(t.get("oriDate"),"_").concat(t.get("oriAbstract"))))),g.a.createElement("div",{className:"ba-info"},g.a.createElement("span",{className:"ba-type-name"},"".concat(t.get("jrIndex"),"\u53f7")),g.a.createElement("span",null,"debit"===t.get("direction")?0===t.get("debitAmount")&&0!==t.get("creditAmount")?"\u8d37":"\u501f":0===t.get("creditAmount")&&0!==t.get("debitAmount")?"\u501f":"\u8d37"),g.a.createElement(b.a,{showZero:!0},"debit"===t.get("direction")?0===t.get("debitAmount")?t.get("creditAmount"):t.get("debitAmount"):0===t.get("creditAmount")?t.get("debitAmount"):t.get("creditAmount")),g.a.createElement(b.a,{showZero:!0},t.get("balanceAmount"))))}}]),n}(g.a.Component))||a,O=n(1177),h=n(130),y=Object(f.c)((function(e){return e}))((c=r=function(e){Object(d.a)(n,e);var t=Object(u.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={showModal:!1},a}return Object(o.a)(n,[{key:"componentDidMount",value:function(){m.a.setTitle({title:"\u7c7b\u578b\u660e\u7ec6\u8868"}),m.a.setIcon({showIcon:!1})}},{key:"render",value:function(){var e=this.props,t=(e.allState,e.dispatch),n=e.runningTypeMxbState,a=e.history,i=(this.state.showModal,n.get("issuedate")),r=n.get("endissuedate"),c=n.get("issues"),s=c.findIndex((function(e){return e.get("value")===i})),o=c.slice(0,s),u=n.get("runningCategoryList"),d=n.get("runningTypeDetailList"),l=n.get("opendetail"),f=n.get("totalAmountList"),m=n.get("currentPage"),v=n.get("pageCount"),E=n.getIn(["views","acName"]),y=n.getIn(["views","fromPage"]),T=n.getIn(["views","typeUuid"]),_=n.getIn(["views","direction"])||"debit",S=n.getIn(["views","chooseValue"]),j={debit:"\u501f\u65b9",credit:"\u8d37\u65b9","":""},P=i,R=r||P;return t(h.i("runningReport","",(function(){return function(e){return e(h.a("sendTypeExcelDetail",{begin:P,end:R,acId:T,mergeName:E}))}}),"",(function(){return function(e){return e(h.a("sendAllTypeExcelDetail",{begin:P,end:R}))}}))),g.a.createElement(b.h,{className:"running-type-mxb"},g.a.createElement(p.b,{start:i,end:r,issues:c,nextperiods:o,chooseValue:S,onBeginOk:function(e){"boss"===y?(t(O.d(e,"",T,_)),t(O.c(e,"",T))):t(O.e(e,"",T))},onEndOk:function(e,n){"boss"===y?(t(O.d(e,n,T,_)),t(O.c(e,n,T))):t(O.e(e,n,T))},changeChooseValue:function(e){return t(O.a(e))}}),g.a.createElement("div",{className:"running-type-mxb-select"},g.a.createElement("div",{className:"select-category"},g.a.createElement("div",{className:"select-category-box"},g.a.createElement(b.f,{district:u.toJS(),value:T,parentDisabled:!1,onChange:function(e){var n=e.key.split(N.B);t("boss"===y?O.d(i,i,n[0],n[2]):O.f(i,r,n[0],1,!1,!1)),t(O.b("views","typeUuid",n[0])),t(O.b("views","acName",n[1]))}},g.a.createElement(b.r,null,g.a.createElement("span",{style:{color:"\u8bf7\u9009\u62e9\u7c7b\u578b"==E?"#ccc":""}},E),g.a.createElement(b.l,{type:"triangle"})))))),g.a.createElement(b.r,{className:"item-title-qc"},g.a.createElement("div",{className:"qc-title-item"},"\u671f\u521d\u4f59\u989d",g.a.createElement("span",{className:"qc-title-direction"},"(","".concat(j[l.get("direction")]),")")),g.a.createElement("div",{className:"qc-title-item"},g.a.createElement(b.a,{showZero:!0,isTitle:!0},l&&l.get("balanceAmount")))),g.a.createElement(b.s,{flex:"1",uniqueKey:"relativemxb-scroll",className:"scroll-item",savePosition:!0},g.a.createElement("div",{className:"flow-content"},d.map((function(e,n){return g.a.createElement("div",{key:n},g.a.createElement(I,{className:"balance-running-tabel-width",item:e,history:a,dispatch:t,issuedate:i,detailsTemp:d}))}))),g.a.createElement(p.c,{diff:100,classContent:"flow-content",callback:function(e){t("boss"===y?O.d(i,i,T,_,m+1,!1,!0,!0,e):O.f(i,r,T,m+1,!0,!0,e))},isGetAll:m>=v,itemSize:d.size})),g.a.createElement(b.r,{className:"item-title-qc"},g.a.createElement("div",{className:"qc-title-item"},"\u671f\u672b\u4f59\u989d",g.a.createElement("span",{className:"qc-title-direction"},"(","".concat(j[f.get("direction")]),")")),g.a.createElement("div",{className:"qc-title-item"},g.a.createElement(b.a,{showZero:!0,isTitle:!0},f.get("allBalanceAmount")))))}}]),n}(g.a.Component),r.displayName="RunningTypeMxb",i=c))||i,T={runningTypeMxbState:n(1180).a,runningPreviewState:E.a}}}]);