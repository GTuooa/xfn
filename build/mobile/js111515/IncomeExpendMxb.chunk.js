(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[72],{1038:function(e,t,n){"use strict";n.d(t,"a",(function(){return d})),n.d(t,"b",(function(){return m}));n(115),n(219),n(56);var a=n(4),i=n(51),r=n(1),c=n(78),o=n(14),s=n(12),u=n(2),l=Object(r.fromJS)({views:{fromPage:"",uuidList:[]},currentItem:{},jrOri:{},category:{},processInfo:null});function d(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:l,n=arguments.length>1?arguments[1]:void 0;return((e={},Object(a.a)(e,g.GET_RUNNING_PREVIEW_BUSINESS_FETCH,(function(){return t=t.set("jrOri",Object(r.fromJS)(n.receivedData.jrOri)).set("category",Object(r.fromJS)(n.receivedData.category)).set("processInfo",n.receivedData.processInfo?Object(r.fromJS)(n.receivedData.processInfo):null).set("currentItem",n.currentItem).setIn(["views","fromPage"],n.fromPage).setIn(["views","uuidList"],n.uuidList)})),Object(a.a)(e,g.GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH,(function(){return t=t.set("jrOri",Object(r.fromJS)(n.receivedData.jrOri)).set("category",Object(r.fromJS)(n.receivedData.category)).set("processInfo",n.receivedData.processInfo?Object(r.fromJS)(n.receivedData.processInfo):null).set("lsItemData",Object(r.fromJS)(Object(i.a)({},n.receivedData.category,{},n.receivedData.jrOri)))})),Object(a.a)(e,g.PREVIEW_RUNNING_DATA,(function(){return t=t.setIn(["views","uuidList"],Object(r.fromJS)(n.data))})),e)[n.type]||function(){return t})()}var m={getRunningPreviewBusinessFetch:function(e,t,n,a,i){return function(r){e&&(u.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(c.a)("getRunningPreview","GET","oriUuid=".concat(e),(function(e){u.a.toast.hide(),Object(s.u)(e)&&(r({type:g.GET_RUNNING_PREVIEW_BUSINESS_FETCH,receivedData:e.data,currentItem:t,uuidList:n,fromPage:a}),i.push("/runningpreview"))})))}},getPreviewNextRunningBusinessFetch:function(e,t){return function(t){e&&(u.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(c.a)("getRunningPreview","GET","oriUuid=".concat(e),(function(e){u.a.toast.hide(),Object(s.u)(e)&&t({type:g.GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH,receivedData:e.data})})))}},insertRunningBusinessVc:function(e,t,n){return function(a,i){u.a.toast.loading(o.p,0),Object(c.a)("insertRunningBusinessVc","POST",JSON.stringify({uuidList:[e],vcindexlist:[n],year:t.slice(0,4),month:t.slice(5,7),action:"QUERY_JR-AUDIT"}),(function(t){if(u.a.toast.hide(),Object(s.u)(t)){if(t.data.result.length){var n=t.data.result.reduce((function(e,t){return e+","+t}));return void u.a.Alert(n)}a(m.getPreviewNextRunningBusinessFetch(e))}}))}},deleteRunningBusinessVc:function(e,t,n,a){return function(i,r){u.a.toast.loading(o.p,0),Object(c.a)("deletevc","POST",JSON.stringify({year:e,month:t,vcindexlist:n,action:"QUERY_JR-CANCEL_AUDIT"}),(function(e){u.a.toast.hide(),Object(s.u)(e)&&i(m.getPreviewNextRunningBusinessFetch(a))}))}},deleteRunning:function(e,t,n){return function(a){u.a.Confirm({message:"\u786e\u5b9a\u5220\u9664\u5417",title:"\u63d0\u793a",buttonLabels:["\u53d6\u6d88","\u786e\u5b9a"],onSuccess:function(i){if(1===i.buttonIndex){var r=t.findIndex((function(t){return t.get("oriUuid")===e})),l=r+1;u.a.toast.loading(o.p,0),Object(c.a)("deleteRunningbusiness","POST",JSON.stringify({deleteList:[e]}),(function(e){if(Object(s.u)(e)){if(e.data.errorList.length){var i=e.data.errorList.reduce((function(e,t){return e+","+t}));u.a.Alert(i)}if(0==e.data.errorList.length){var c=t.delete(r);a({type:g.PREVIEW_RUNNING_DATA,data:c}),l<t.size?a(m.getPreviewNextRunningBusinessFetch(t.getIn([l,"oriUuid"]))):n.goBack()}}}))}},onFail:function(e){return alert(e)}})}}},g={GET_RUNNING_PREVIEW_BUSINESS_FETCH:"GET_RUNNING_PREVIEW_BUSINESS_FETCH",GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH:"GET_PREVIEW_NEXT_RUNNING_BUSINESS_FETCH",PREVIEW_RUNNING_DATA:"PREVIEW_RUNNING_DATA"}},1077:function(e,t,n){"use strict";n.d(t,"a",(function(){return l}));var a=n(7),i=n(8),r=n(9),c=n(10),o=n(0),s=n.n(o),u=n(12),l=function(e){Object(c.a)(n,e);var t=Object(r.a)(n);function n(){return Object(a.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"render",value:function(){var e=this.props,t=e.className,n=(e.style,e.decimalPlaces),a=e.direction,i=e.isTitle,r=null==this.props.children?"":Number(this.props.children),c=n||0===n?Number(n):2,o=""===r?"":0===Number(Object(u.n)(r,c,""))?Object(u.n)(0,c,""):Object(u.n)(r,c,""),l=Math.abs(r)>=1e7;return s.a.createElement("span",{className:t,style:{color:"debit"===a?"#4166b8":"#ff8348",fontSize:l?i?".11rem":".1rem":""}},o)}}]),n}(o.Component)},1201:function(e,t,n){"use strict";n.d(t,"g",(function(){return a})),n.d(t,"d",(function(){return i})),n.d(t,"c",(function(){return r})),n.d(t,"f",(function(){return c})),n.d(t,"b",(function(){return o})),n.d(t,"e",(function(){return s})),n.d(t,"a",(function(){return u}));var a="INIT_INCOME_EXPEND_MXB",i="GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB",r="GET_INCOME_EXPEND_MXB_CATEGORY",c="GET_INCOME_EXPEND_MXB_NO_CATEGORY",o="CHANGE_INCOME_EXPEND_MXB_COMMON_STATE",s="GET_INCOME_EXPEND_MXB_LIST_FROM_PAGE",u="CHANGE_INCOME_EXPEND_MXB_CHOOSE_VALUE"},1316:function(e,t,n){"use strict";n.d(t,"d",(function(){return l})),n.d(t,"e",(function(){return d})),n.d(t,"c",(function(){return m})),n.d(t,"b",(function(){return E})),n.d(t,"a",(function(){return f}));n(31),n(1130);var a=n(1145),i=n(1201),r=n(78),c=n(12),o=n(2),s=n(14),u=n(130),l=function(e,t,n,l,d){return function(m){if(!e)return a.b.info("\u8d26\u671f\u5f02\u5e38\uff0c\u8bf7\u5237\u65b0\u518d\u8bd5",2);m(g(e,t)),o.a.toast.loading(s.p,0),Object(r.a)("getIncomeExpendMxbReport","POST",JSON.stringify({begin:e,end:t||"",jrCategoryUuid:n,jrAbstract:"",currentPage:1,pageSize:s.t,needPeriod:"true"}),(function(a){if(o.a.toast.hide(),Object(c.u)(a)){var r,s=a.data.periodDtoJson?m(u.d(a.data.periodDtoJson)):[],d=m(u.j(a));r=e||d,m({type:i.d,receivedData:a.data,issuedate:r,endissuedate:t,currentCategoryUuid:n,categoryName:l,jrAbstract:"",currentPage:1,issues:s,needPeriod:"true"})}})),d.push("incomeExpendMxb")}},d=function(e,t){arguments.length>2&&void 0!==arguments[2]&&arguments[2];var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";return function(a,l){o.a.toast.loading(s.p,0);var d=l().incomeExpendMxbState,m=d.getIn(["views","categoryUuid"]),g=d.getIn(["views","categoryName"]);Object(r.a)("getIncomeExpendMxbCategory","POST",JSON.stringify({begin:e||"",end:t||"",needPeriod:"true"}),(function(l){if(o.a.toast.hide(),Object(c.u)(l)){var d,E=l.data.periodDtoJson?a(u.d(l.data.periodDtoJson)):[],f=a(u.j(l));if(d=e||f,l.data.result[0]){a({type:i.c,receivedData:l.data.result});var p=!1,b=m,v=g;!function e(t){return t.map((function(t){t.jrCategoryUuid===m&&(p=!0),t.childList.length>0&&e(t.childList)}))}(l.data.result),p||(b=l.data.result[0].jrCategoryUuid,v=l.data.result[0].jrCategoryCompleteName),o.a.toast.loading(s.p,0),Object(r.a)("getIncomeExpendMxbReport","POST",JSON.stringify({begin:e||"",end:t||"",jrCategoryUuid:b,jrAbstract:n,currentPage:1,pageSize:s.t,needPeriod:""}),(function(e){Object(c.u)(e)&&a({type:i.d,receivedData:e.data,issuedate:d,endissuedate:t,currentCategoryUuid:b,categoryName:v,jrAbstract:n,currentPage:1,issues:E}),o.a.toast.hide()}))}else a({type:i.f,issuedate:d,issues:E})}}))}},m=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",l=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",d=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1,m=arguments.length>5?arguments[5]:void 0,g=arguments.length>6?arguments[6]:void 0,E=arguments.length>7?arguments[7]:void 0;return function(f,p){if(!e)return a.b.info("\u8d26\u671f\u5f02\u5e38\uff0c\u8bf7\u5237\u65b0\u518d\u8bd5",2);!g&&o.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(r.a)("getIncomeExpendMxbReport","POST",JSON.stringify({begin:e,end:t||"",jrCategoryUuid:n,jrAbstract:l,currentPage:d,pageSize:s.t,needPeriod:"true"}),(function(a){if(!g&&o.a.toast.hide(),Object(c.u)(a)){g&&E.setState({isLoading:!1});var r,s=a.data.periodDtoJson?f(u.d(a.data.periodDtoJson)):[],p=f(u.j(a));r=e||p,f({type:i.e,receivedData:a.data,issuedate:r,endissuedate:t,currentCategoryUuid:n,jrAbstract:l,currentPage:d,issues:s,shouldConcat:m})}}))}},g=function(e,t){return function(n){o.a.toast.loading(s.p,0),Object(r.a)("getIncomeExpendMxbCategory","POST",JSON.stringify({begin:e||"",end:t||""}),(function(e){Object(c.u)(e)&&n({type:i.c,receivedData:e.data.result}),o.a.toast.hide()}))}},E=function(e,t,n){return{type:i.b,parent:e,position:t,value:n}},f=function(e){return{type:i.a,value:e}}},1317:function(e,t,n){"use strict";n.d(t,"a",(function(){return o}));n(32);var a=n(4),i=n(1),r=n(1201),c=Object(i.fromJS)({views:{issuedate:"",endissuedate:"",categoryUuid:"",categoryName:"",chooseValue:"ISSUE"},totalAmountList:{},openDetail:{},incomeExpendDetailList:[],runningCategoryList:[{childList:[]}],issues:[],pageCount:1,currentPage:1});function o(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:c,n=arguments.length>1?arguments[1]:void 0;return((e={},Object(a.a)(e,r.g,(function(){return c})),Object(a.a)(e,r.d,(function(){var e=n.receivedData.result,a={incomeAmount:e.incomeAmount,expenseAmount:e.expenseAmount,realIncomeAmount:e.realIncomeAmount,realExpenseAmount:e.realExpenseAmount,closeARBalance:e.closeARBalance,closeAPBalance:e.closeAPBalance,direction:e.direction};return t=t.set("incomeExpendDetailList",Object(i.fromJS)(n.receivedData.result.detailList)).set("openDetail",Object(i.fromJS)(n.receivedData.result.openDetail)).set("totalAmountList",Object(i.fromJS)(a)).setIn(["views","issuedate"],n.issuedate).setIn(["views","endissuedate"],n.endissuedate).set("pageCount",n.receivedData.result.pages).set("currentPage",n.receivedData.result.currentPage).setIn(["views","categoryUuid"],n.currentCategoryUuid),"true"===n.needPeriod&&(t=t.set("issues",Object(i.fromJS)(n.issues))),n.currentCategoryUuid||(t=t.setIn(["views","categoryName"],"")),n.categoryName&&(t=t.setIn(["views","categoryName"],n.categoryName)),t})),Object(a.a)(e,r.e,(function(){var e=n.receivedData.result,a={incomeAmount:e.incomeAmount,expenseAmount:e.expenseAmount,realIncomeAmount:e.realIncomeAmount,realExpenseAmount:e.realExpenseAmount,closeARBalance:e.closeARBalance,closeAPBalance:e.closeAPBalance,direction:e.direction},r=[];n.shouldConcat?r=t.get("incomeExpendDetailList").toJS().concat(n.receivedData.result.detailList):r=n.receivedData.result.detailList;return t=t.set("incomeExpendDetailList",Object(i.fromJS)(r)).set("openDetail",Object(i.fromJS)(n.receivedData.result.openDetail)).set("totalAmountList",Object(i.fromJS)(a)).setIn(["views","issuedate"],n.issuedate).setIn(["views","endissuedate"],n.endissuedate).set("pageCount",n.receivedData.result.pages).set("currentPage",n.receivedData.result.currentPage).setIn(["views","categoryUuid"],n.currentCategoryUuid),"true"===n.needPeriod&&(t=t.set("issues",Object(i.fromJS)(n.issues))),n.currentCategoryUuid||(t=t.setIn(["views","categoryName"],"")),n.categoryName&&(t=t.setIn(["views","categoryName"],n.categoryName)),t})),Object(a.a)(e,r.c,(function(){return t=t.set("runningCategoryList",Object(i.fromJS)(n.receivedData))})),Object(a.a)(e,r.f,(function(){return t=t.setIn(["views","issuedate"],n.issuedate).set("incomeExpendDetailList",Object(i.fromJS)([])).set("runningCategoryList",Object(i.fromJS)([{childList:[]}])).set("openDetail",Object(i.fromJS)({})).set("totalAmountList",Object(i.fromJS)({incomeAmount:"",expenseAmount:"",realIncomeAmount:"",realExpenseAmount:"",closeARBalance:"",closeAPBalance:""})).setIn(["views","endissuedate"],"").setIn(["views","categoryName"],"\u6682\u65e0\u53ef\u9009\u7c7b\u578b").set("pageCount",1).set("currentPage",1)})),Object(a.a)(e,r.b,(function(){return t.setIn([n.parent,n.position],n.value)})),Object(a.a)(e,r.a,(function(){return t=t.setIn(["views","chooseValue"],n.value)})),e)[n.type]||function(){return t})()}},1852:function(e,t,n){},970:function(e,t,n){"use strict";n.r(t),n.d(t,"reducer",(function(){return S})),n.d(t,"view",(function(){return h}));n(115),n(31),n(56);var a,i,r,c,o,s=n(7),u=n(8),l=n(9),d=n(10),m=n(0),g=n.n(m),E=n(47),f=(n(1),n(1852),n(2)),p=(n(14),n(11)),b=n(542),v=n(1077),N=(n(32),n(24)),A=n(1038),O=Object(N.immutableRenderDecorator)(a=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){var e=this.props,t=e.item,n=e.style,a=e.dispatch,i=e.className,r=e.history,c=e.detailsTemp,o=t.get("incomeAmount")?"debit":"credit",s=t.get("realIncomeAmount")?"debit":"credit",u=t.get("closeARBalance")?"debit":"credit";return g.a.createElement("div",{className:"ba "+i,style:n},g.a.createElement("div",null,g.a.createElement("span",{className:"name",onClick:function(e){a(A.b.getRunningPreviewBusinessFetch(t.get("oriUuid"),t,c,"mxb",r))}},g.a.createElement("span",{className:"name-name"},t.get("jrJvCardAbstract")?"".concat(t.get("jrDate"),"_").concat(t.get("jrAbstract")).concat(t.get("jrJvCardAbstract")):"".concat(t.get("jrDate"),"_").concat(t.get("jrAbstract"))))),g.a.createElement("div",{className:"ba-info"},g.a.createElement("span",{className:"ba-type-name"},"".concat(t.get("jrIndex"),"\u53f7")),g.a.createElement(v.a,{direction:o},t.get("incomeAmount")?t.get("incomeAmount"):t.get("expenseAmount")?t.get("expenseAmount"):null),g.a.createElement(v.a,{direction:s},t.get("realIncomeAmount")?t.get("realIncomeAmount"):t.get("realExpenseAmount")?t.get("realExpenseAmount"):null),g.a.createElement(v.a,{direction:u},t.get("closeARBalance")?t.get("closeARBalance"):t.get("closeAPBalance"))))}}]),n}(g.a.Component))||a,I=(n(1082),Object(N.immutableRenderDecorator)(i=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(){return Object(s.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){var e=this.props,t=e.item,n=e.style,a=e.dispatch,i=e.className,r=e.history,c=e.detailsTemp;return g.a.createElement("div",{className:"ba "+i,style:n},g.a.createElement("div",null,g.a.createElement("span",{className:"name",onClick:function(e){a(A.b.getRunningPreviewBusinessFetch(t.get("oriUuid"),t,c,"mxb",r))}},g.a.createElement("span",{className:"name-name"},"".concat(t.get("jrDate"),"_").concat(t.get("jrAbstract"))))),g.a.createElement("div",{className:"ba-info"},g.a.createElement("span",{className:"ba-type-name"},"".concat(t.get("jrIndex"),"\u53f7")),g.a.createElement(p.a,{showZero:!1},"debit"===t.get("direction")?t.get("incomeAmount"):t.get("expenseAmount")),g.a.createElement(p.a,{showZero:!1},"debit"===t.get("direction")?0===t.get("realIncomeAmount")?-t.get("realExpenseAmount"):t.get("realIncomeAmount"):0===t.get("realExpenseAmount")?-t.get("realIncomeAmount"):t.get("realExpenseAmount")),g.a.createElement(p.a,{showZero:!0},"debit"===t.get("direction")?t.get("closeARBalance"):t.get("closeAPBalance"))))}}]),n}(g.a.Component))||i),j=n(1316),y=n(130),h=Object(E.c)((function(e){return e}))((o=c=function(e){Object(d.a)(n,e);var t=Object(l.a)(n);function n(e){var a;return Object(s.a)(this,n),(a=t.call(this,e)).state={showModal:!1},a}return Object(u.a)(n,[{key:"componentDidMount",value:function(){f.a.setTitle({title:"\u6536\u652f\u660e\u7ec6\u8868"}),f.a.setIcon({showIcon:!1}),this.props.homeState.getIn(["permissionInfo","Report","exportExcel","permission"])||f.a.setRight({show:!1})}},{key:"render",value:function(){var e=this.props,t=(e.allState,e.dispatch),n=e.incomeExpendMxbState,a=e.history,i=(this.state.showModal,n.getIn(["views","issuedate"])),r=n.getIn(["views","endissuedate"]),c=n.get("issues"),o=n.get("runningCategoryList"),s=n.get("incomeExpendDetailList"),u=n.get("currentPage"),l=n.get("pageCount"),d=n.get("openDetail"),m=n.get("totalAmountList"),E=n.getIn(["views","categoryName"]),f=n.getIn(["views","categoryUuid"]),N=n.getIn(["views","chooseValue"]),A=c.findIndex((function(e){return e.get("value")===i})),h=c.slice(0,A),S={debit:"\u6536\u5165",credit:"\u652f\u51fa",debitAndCredit:"\u6536\u652f"},_=i,P=r||_;return t(y.i("runningReport","",(function(){return function(e){return e(y.a("sendIncomeExcelDetail",{begin:_,end:P,jrCategoryUuid:f,jrCategoryCompleteName:E}))}}),"",(function(){return function(e){return e(y.a("sendAllIncomeExcelDetail",{begin:_,end:P}))}}))),g.a.createElement(p.h,{className:"incomeExpend-mxb"},g.a.createElement(b.b,{start:i,end:r,issues:c,nextperiods:h,chooseValue:N,onBeginOk:function(e){t(j.e(e,""))},onEndOk:function(e,n){t(j.e(e,n))},changeChooseValue:function(e){t(j.a(e))}}),g.a.createElement("div",{className:"incomeExpend-mxb-select"},g.a.createElement("div",{className:"select-category"},g.a.createElement("div",{className:"select-category-box"},g.a.createElement(b.d,{district:o.toJS(),value:E,nameString:"jrCategoryName",uuidString:"jrCategoryUuid",notLast:!0,onChange:function(e){t(j.c(i,r,e.jrCategoryUuid,"",1)),t(j.b("views","categoryUuid",e.jrCategoryUuid)),t(j.b("views","categoryName",e.jrCategoryCompleteName))}},g.a.createElement(p.r,null,g.a.createElement("span",{style:{color:"\u8bf7\u9009\u62e9\u7c7b\u522b"==E?"#ccc":""}},E),g.a.createElement(p.l,{type:"triangle"})))))),g.a.createElement(p.r,{className:"item-title-qc"},g.a.createElement("div",{className:"qc-title-item"},"\u671f\u521d",g.a.createElement("span",{className:"qc-title-direction"},"(",S[d.get("direction")],")")),"debitAndCredit"===m.get("direction")?g.a.createElement("div",{className:"qc-title-item"},d&&null!==d.get("closeARBalance")?g.a.createElement("div",null,"\u5e94\u6536\u4f59\u989d ",g.a.createElement(v.a,{direction:"debit",isTitle:!0},d.get("closeARBalance"))):null,d&&null!==d.get("closeAPBalance")?g.a.createElement("div",null,"\u5e94\u4ed8\u4f59\u989d ",g.a.createElement(v.a,{direction:"credit",isTitle:!0},d.get("closeAPBalance"))):null):g.a.createElement("div",{className:"qc-title-item"},d&&null!==d.get("closeARBalance")?g.a.createElement("div",null,"\u5e94\u6536\u4f59\u989d ",g.a.createElement(p.a,{showZero:!0,isTitle:!0},d.get("closeARBalance"))):null,d&&null!==d.get("closeAPBalance")?g.a.createElement("div",null,"\u5e94\u4ed8\u4f59\u989d ",g.a.createElement(p.a,{showZero:!0,isTitle:!0},d.get("closeAPBalance"))):null)),g.a.createElement(p.s,{flex:"1",uniqueKey:"relativemxb-scroll",className:"scroll-item",savePosition:!0},g.a.createElement("div",{className:"flow-content"},"debitAndCredit"===m.get("direction")?s.map((function(e,n){return g.a.createElement("div",{key:e.get("oriUuid")},g.a.createElement(O,{className:"balance-running-tabel-width",item:e,history:a,dispatch:t,issuedate:i,detailsTemp:s}))})):s.map((function(e,n){return g.a.createElement("div",{key:e.get("oriUuid")},g.a.createElement(I,{className:"balance-running-tabel-width",item:e,history:a,dispatch:t,issuedate:i,detailsTemp:s}))}))),g.a.createElement(b.c,{diff:100,classContent:"flow-content",callback:function(e){t(j.c(i,r,f,"",u+1,!0,!0,e))},isGetAll:u>=l,itemSize:s.size})),"debitAndCredit"===m.get("direction")?g.a.createElement(p.r,{className:"item-title-qm"},g.a.createElement("div",{className:"qm-title-item"},"\u671f\u672b",g.a.createElement("span",{className:"qc-title-direction"},"(\u6536\u652f)")),g.a.createElement("div",{className:"qm-title-item"},g.a.createElement("div",null,g.a.createElement(v.a,{direction:"debit",isTitle:!0},m.get("incomeAmount")),g.a.createElement(v.a,{direction:"debit",isTitle:!0},m.get("realIncomeAmount")),g.a.createElement(v.a,{direction:"debit",isTitle:!0},m.get("closeARBalance"))),g.a.createElement("div",null,g.a.createElement(v.a,{direction:"credit",isTitle:!0},m.get("expenseAmount")),g.a.createElement(v.a,{direction:"credit",isTitle:!0},m.get("realExpenseAmount")),g.a.createElement(v.a,{direction:"credit",isTitle:!0},m.get("closeAPBalance"))))):g.a.createElement(p.r,{className:"item-title-qm"},g.a.createElement("div",{className:"qm-title-item"},"\u671f\u672b",g.a.createElement("span",{className:"qc-title-direction"},"(",S[m.get("direction")],")")),g.a.createElement("div",{className:"qm-title-item"},g.a.createElement("div",null,g.a.createElement(p.a,{showZero:!0,isTitle:!0},"debit"===m.get("direction")?m.get("incomeAmount"):m.get("expenseAmount")),g.a.createElement(p.a,{showZero:!0,isTitle:!0},"debit"===m.get("direction")?m.get("realIncomeAmount")-m.get("realExpenseAmount"):m.get("realExpenseAmount")-m.get("realIncomeAmount")),g.a.createElement(p.a,{showZero:!0,isTitle:!0},m.get("closeAPBalance")?m.get("closeAPBalance"):m.get("closeARBalance"))))))}}]),n}(g.a.Component),c.displayName="IncomeExpendMxb",r=o))||r,S={incomeExpendMxbState:n(1317).a,runningPreviewState:A.a}}}]);