(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[56],{1041:function(e,t,n){"use strict";n.d(t,"f",(function(){return d})),n.d(t,"h",(function(){return l})),n.d(t,"g",(function(){return f})),n.d(t,"e",(function(){return g})),n.d(t,"i",(function(){return b})),n.d(t,"l",(function(){return m})),n.d(t,"m",(function(){return E})),n.d(t,"d",(function(){return v})),n.d(t,"a",(function(){return p})),n.d(t,"j",(function(){return O})),n.d(t,"n",(function(){return C})),n.d(t,"c",(function(){return h})),n.d(t,"k",(function(){return y})),n.d(t,"b",(function(){return N}));n(32),n(55),n(61),n(34),n(31),n(116),n(29),n(82),n(76);var a=n(51),c=n(12),i=n(17),r=n(130),u=n(1057),s=n(2),o=n(14),d=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return function(n){s.a.toast.loading(o.p,0),Object(i.g)("pagindvc","POST",JSON.stringify({year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",pageSize:20,currentPage:t+1,getPeriod:"true"}),(function(a){if(Object(c.u)(a)){s.a.toast.hide();var i=n(r.e(a)),o=e||i;a.data.jsonArray;n({type:u.a,receivedData:a,issuedate:o,currentPage:t})}}))}},l=function(e){return function(t){var n=e.substring(0,7);s.a.toast.loading(o.p,0),Object(i.g)("getvclist","POST",JSON.stringify(Object(c.q)(e)),(function(e){Object(c.u)(e)&&(s.a.toast.hide(),t({type:u.h,receivedData:e,issuedate:n}))}))}},f=function(e,t){return function(n){0!=t&&(s.a.toast.loading(o.p,0),Object(i.g)("sortvc","POST",JSON.stringify({year:e.substr(0,4),month:e.substr(5,2),sort:t}),(function(t){Object(c.u)(t,"show",800)&&n(b(e))})))}},g=function(e){return function(t,n){var a=e.get("vclist").filter((function(e){return e.get("selected")})).some((function(e){return e.get("enclosurecount")}))?"\u51ed\u8bc1\u4e0b\u5b58\u5728\u9644\u4ef6,\u9644\u4ef6\u4e5f\u5c06\u88ab\u5220\u9664":"\u786e\u5b9a\u5220\u9664\u5417";s.a.Confirm({message:a,title:"\u63d0\u793a",buttonLabels:["\u53d6\u6d88","\u786e\u5b9a"],onSuccess:function(n){if(1===n.buttonIndex){var a=e.get("vclist"),r=e.get("vclist").filter((function(e){return e.get("selected")})).map((function(e){return e.get("vcindex")})),d=a.size===r.size;s.a.toast.loading(o.p,0),Object(i.g)("deletevc","POST",JSON.stringify({year:e.getIn(["vclist",0,"year"]),month:e.getIn(["vclist",0,"month"]),vcindexlist:r,action:"QUERY_VC-DELETE_VC-BATCH_DELETE"}),(function(n){if(Object(c.u)(n)){if(t({type:u.f,receivedData:n}),Object(i.g)("getperiod","GET","",(function(e){Object(c.u)(e)&&(s.a.toast.hide(),t({type:u.g,receivedData:e}))})),d){var a="".concat(e.getIn(["vclist",0,"year"]),"-").concat(e.getIn(["vclist",0,"month"]));t(b(a))}t(p())}}))}},onFail:function(e){return alert(e)}})}},b=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,n=arguments.length>2&&void 0!==arguments[2]&&arguments[2],r=arguments.length>3?arguments[3]:void 0;return function(d,l){var f=Object(c.q)(e),g=e.substring(0,7),b=l().cxpzState,m=b.get("searchContentType"),E=b.get("condition");!n&&s.a.toast.loading(o.p,0),Object(i.g)("pagindvc","POST",JSON.stringify(Object(a.a)({},f,{pageSize:20,currentPage:t+1,searchContentType:m,condition:E})),(function(e){!n&&s.a.toast.hide(),Object(c.u)(e)&&(n&&r.setState({isLoading:!1}),d({type:u.a,receivedData:e,issuedate:g,currentPage:t}))}))}},m=function(e){return{type:u.l,idx:e}},E=function(){return{type:u.m}},v=function(e){return{type:u.c,idx:e}},p=function(){return{type:u.b}},O=function(e){return{type:u.j,voucher:e}},C=function(){return function(e,t){var n=t().cxpzState.get("issuedate");e({type:u.d,issuedate:n})}},h=function(e,t){return{type:u.e,dataType:e,value:t}},y=function(e){return function(t,n){var a=n().cxpzState.get("vclist"),r=e.split("-"),u=[];a.forEach((function(e){e.get("selected")&&!e.get("reviewedby")&&u.push(e.get("vcindex"))})),s.a.toast.loading(o.p,0),Object(i.g)("reviewvc","POST",JSON.stringify({year:r[0],month:r[1],vcindexlist:u,action:"QUERY_VC-AUDIT"}),(function(n){Object(c.u)(n)&&(s.a.toast.hide(),0==n.data.success&&s.a.Alert(n.data.failList.join("\u3001")),t(b(e)))}))}},N=function(e){return function(t,n){var a=n().cxpzState.get("vclist"),r=e.split("-"),u=[];a.forEach((function(e){e.get("selected")&&e.get("reviewedby")&&u.push(e.get("vcindex"))})),s.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(i.g)("backreviewvc","POST",JSON.stringify({year:r[0],month:r[1],vcindexlist:u,action:"QUERY_VC-CANCEL_AUDIT"}),(function(n){Object(c.u)(n)&&(s.a.toast.hide(),0==n.data.success&&s.a.Alert(n.data.failList.join("\u3001")),t(b(e)))}))}}},1057:function(e,t,n){"use strict";n.d(t,"i",(function(){return a})),n.d(t,"h",(function(){return c})),n.d(t,"f",(function(){return i})),n.d(t,"c",(function(){return r})),n.d(t,"b",(function(){return u})),n.d(t,"m",(function(){return s})),n.d(t,"l",(function(){return o})),n.d(t,"k",(function(){return d})),n.d(t,"a",(function(){return l})),n.d(t,"e",(function(){return f})),n.d(t,"j",(function(){return g})),n.d(t,"g",(function(){return b})),n.d(t,"d",(function(){return m}));var a="INIT_CXPZ",c="GET_VC_LIST_FETCH",i="DELETE_VC_FETCH",r="CHANGE_ALL_VC_CHECKBOX_DISPLAY",u="CANCEL_CHANGE_VC_CHECKBOX_DISPALY",s="SELECT_VC_ALL",o="SELECT_VC",d="REVERSE_VC_LIST",l="AFTER_PAGING_VC",f="CXPZ_CHANGE_DATA",g="PUSH_VOUCHER_TO_LRPZ_REDUCER",b="GET_PERIOD_FETCH",m="CHANGE_FJGL_ISSUEDATE"},1142:function(e,t,n){},1197:function(e,t,n){"use strict";n.d(t,"f",(function(){return a})),n.d(t,"d",(function(){return c})),n.d(t,"c",(function(){return i})),n.d(t,"b",(function(){return r})),n.d(t,"a",(function(){return u})),n.d(t,"e",(function(){return s}));var a="INIT_CURRENCY_MXB",c="GET_CURRENCY_MXB_ACLIST",i="GET_CURRENCY_DETAIL_FETCH",r="CHANGE_CUR_MXB_BEGIN_DATE",u="CHANGE_CURRENCY_CURRENTPAGE",s="GET_CURRENCY_MXB_ACNAME"},1252:function(e,t,n){"use strict";n.d(t,"c",(function(){return l})),n.d(t,"b",(function(){return f})),n.d(t,"d",(function(){return g})),n.d(t,"a",(function(){return b}));n(32);var a=n(51),c=n(12),i=n(17),r=n(1197),u=n(552),s=n(1041),o=n(2),d=n(14),l=function(e,t,n,a,u){return function(s){var l="".concat(t.substr(0,4)).concat(t.substr(5,2)),g=n?"".concat(n.substr(0,4)).concat(n.substr(5,2)):l;o.a.toast.loading(d.p,0),Object(i.g)("getFCDetailAc","POST",JSON.stringify({begin:l,end:g}),(function(i){Object(c.u)(i)&&(o.a.toast.hide(),s({type:r.d,receivedData:i.data}),s({type:r.e,acid:a,acName:u}),s(f(t,n,e,a,u)))}))}},f=function(e,t,n,a,u,s,l){return function(u){var f="".concat(e.substr(0,4)).concat(e.substr(5,2)),g=t?"".concat(t.substr(0,4)).concat(t.substr(5,2)):f;o.a.toast.loading(d.p,0),Object(i.g)("getFCDetail","POST",JSON.stringify({begin:f,end:g,fcNumber:n,acid:a||"",asscategory:s||"",assid:l||""}),(function(i){Object(c.u)(i)&&(o.a.toast.hide(),u({type:r.c,receivedData:i.data,issuedate:e,endissuedate:t,fcNumber:n,acid:a||""}))}))}},g=function(e,t,n,r){return function(l){var f=Object(c.q)(e);o.a.toast.loading(d.p,0),Object(i.g)("getvc","POST",JSON.stringify(Object(a.a)({},f,{vcindex:t})),(function(e){Object(c.u)(e)&&(o.a.toast.hide(),sessionStorage.setItem("lrpzHandleMode","modify"),l(Object(s.j)(e.data)),sessionStorage.setItem("router-from","currencymxb"),n.push("/lrpz"),l(u.e(r)),l(u.d(!0)))}))}},b=function(e){return{type:r.a,currentPage:e}}},1310:function(e,t,n){"use strict";n.d(t,"a",(function(){return u}));var a=n(4),c=n(1),i=n(1197),r=Object(c.fromJS)({issuedate:"",endissuedate:"",currentFcNumber:"",currentPage:1,currentAcId:"",acid:"",acName:"",currencyAcList:[],currencyDetailList:{acid:"",name:"",number:"",direction:"",debit:"",credit:"",fcDebit:"",fcCredit:"",openingBalance:"",closingBalance:"",fcOpeningBalance:"",fcClosingBalance:"",jvList:[]}});function u(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,n=arguments.length>1?arguments[1]:void 0;return((e={},Object(a.a)(e,i.f,(function(){return r})),Object(a.a)(e,i.d,(function(){return t.set("currencyAcList",Object(c.fromJS)(n.receivedData))})),Object(a.a)(e,i.c,(function(){return t.set("currencyDetailList",Object(c.fromJS)(n.receivedData)).set("issuedate",n.issuedate).set("currentFcNumber",n.fcNumber).set("currentAcId",n.acid).set("endissuedate",n.endissuedate).set("currentPage",1)})),Object(a.a)(e,i.e,(function(){return t.set("acid",n.acid).set("acName",n.acName)})),Object(a.a)(e,i.b,(function(){return t=n.bool?t.set("endissuedate",n.begin):t.set("issuedate",n.begin)})),Object(a.a)(e,i.a,(function(){return t=t.set("currentPage",n.currentPage)})),e)[n.type]||function(){return t})()}},1831:function(e,t,n){},947:function(e,t,n){"use strict";n.r(t),n.d(t,"reducer",(function(){return A})),n.d(t,"view",(function(){return j}));n(32),n(115),n(33),n(31),n(56);var a,c,i=n(7),r=n(8),u=n(9),s=n(10),o=n(0),d=n.n(o),l=n(47),f=n(1),g=n(2),b=n(542),m=n(11),E=n(12),v=n(17),p=n(130),O=n(14),C=function(e,t){return function(n){e?Object(v.g)("getperiod","GET","",(function(a){Object(E.u)(a)&&(n({type:"GET_PERIOD_FETCH",receivedData:a}),n(h(e,t)))})):p.g("",n,(function(e,t){return n(h(e,t))}))}},h=function(e,t){return function(n){var a=t||e;g.a.toast.loading(O.p,0),Object(v.g)("getFCYebList","POST",JSON.stringify({begin:"".concat(e.substr(0,4)).concat(e.substr(5,2)),end:"".concat(a.substr(0,4)).concat(a.substr(5,2))}),(function(a){Object(E.u)(a)&&(g.a.toast.hide(),n({type:"ALL_GET_CURRENCY_YEB_LIST_FETCH",receivedData:a.data,issuedate:e,endissuedate:t}))}))}},y=function(e){return{type:"SHOW_CURRENCY_BACHILD_ITIEM",fcNumber:e}},N=n(24),_=n(1252),S=Object(N.immutableRenderDecorator)(a=function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,[{key:"render",value:function(){var e=this.props,t=(e.key,e.idx),n=e.item,a=e.dispatch,c=e.issuedate,i=e.endissuedate,r=e.history,u=e.style,s=e.level,o=e.hasSub,l=e.isExpanded;return d.a.createElement("div",{className:"item",line:t+1,style:u},1===s?d.a.createElement("div",null,d.a.createElement("span",{className:"item-number",onClick:function(){sessionStorage.setItem("previousPage","currencyYeb"),a(_.c(n.get("fcNumber"),c,i,n.get("acid"),n.get("acName"))),r.push("/currencymxb")}},d.a.createElement("span",null,"".concat(n.get("fcNumber"),"_").concat(n.get("numberName")))),d.a.createElement("span",{className:"btn",onClick:function(){return o&&a(y(n.get("fcNumber")))}},d.a.createElement(m.l,{type:"arrow-down",style:{visibility:o?"visible":"hidden",transform:l?"rotate(180deg)":""}}))):d.a.createElement("div",null,d.a.createElement("span",{className:"item-number",onClick:function(){sessionStorage.setItem("previousPage","currencyYeb"),a(_.c(n.get("fcNumber"),c,i,n.get("acid"),n.get("acName"))),r.push("/currencymxb")}},d.a.createElement("span",null,"".concat(n.get("acid"),"_").concat(n.get("acName")))),d.a.createElement("span",{className:"btn",onClick:function(){return o&&a(y(n.get("acid")))}},d.a.createElement(m.l,{type:"arrow-down",style:{visibility:o?"visible":"hidden",transform:l?"rotate(180deg)":""}}))),1===s?d.a.createElement("div",{onClick:function(){return o&&a(y(n.get("fcNumber")))}},d.a.createElement("div",{className:"item-name"},d.a.createElement("span",null,"\u539f\u5e01\uff1a")),d.a.createElement("div",{className:"item-amount item-amount-color"},d.a.createElement(m.a,{showZero:!0},n.get("fcDebitOpeningBalance")||-n.get("fcCreditOpeningBalance")||0),d.a.createElement(m.a,{showZero:!0},n.get("fcDebit")),d.a.createElement(m.a,{showZero:!0},n.get("fcCredit")),d.a.createElement(m.a,{showZero:!0},n.get("fcDebitClosingBalance")||-n.get("fcCreditClosingBalance")||0)),d.a.createElement("div",{className:"item-name"},"\u672c\u4f4d\u5e01\uff1a"),d.a.createElement("div",{className:"item-amount"},d.a.createElement(m.a,{showZero:!0},n.get("debitOpeningBalance")||-n.get("creditOpeningBalance")||0),d.a.createElement(m.a,{showZero:!0},n.get("debit")),d.a.createElement(m.a,{showZero:!0},n.get("credit")),d.a.createElement(m.a,{showZero:!0},n.get("debitClosingBalance")||-n.get("creditClosingBalance")||0))):d.a.createElement("div",{onClick:function(){return o&&a(y(n.get("acid")))}},d.a.createElement("div",{className:"item-name"},d.a.createElement("span",null,"\u539f\u5e01\uff1a")),d.a.createElement("div",{className:"item-amount item-amount-color"},d.a.createElement(m.a,{showZero:!0},n.get("fcDebitOpeningBalance")||-n.get("fcCreditOpeningBalance")||0),d.a.createElement(m.a,{showZero:!0},n.get("fcDebit")),d.a.createElement(m.a,{showZero:!0},n.get("fcCredit")),d.a.createElement(m.a,{showZero:!0},n.get("fcDebitClosingBalance")||-n.get("fcCreditClosingBalance")||0)),d.a.createElement("div",{className:"item-name"},"\u672c\u4f4d\u5e01\uff1a"),d.a.createElement("div",{className:"item-amount"},d.a.createElement(m.a,{showZero:!0},n.get("debitOpeningBalance")||-n.get("creditOpeningBalance")||0),d.a.createElement(m.a,{showZero:!0},n.get("debit")),d.a.createElement(m.a,{showZero:!0},n.get("credit")),d.a.createElement(m.a,{showZero:!0},n.get("debitClosingBalance")||-n.get("creditClosingBalance")||0))))}}]),n}(d.a.Component))||a,j=(n(1142),n(1831),Object(l.c)((function(e){return e}))(c=function(e){Object(s.a)(n,e);var t=Object(u.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,[{key:"componentDidMount",value:function(){g.a.setTitle({title:"\u5916\u5e01\u4f59\u989d\u8868"}),g.a.setIcon({showIcon:!1}),"home"===sessionStorage.getItem("prevPage")&&(sessionStorage.removeItem("prevPage"),this.props.dispatch(C()))}},{key:"render",value:function(){var e=this.props,t=e.dispatch,n=e.allState,a=e.currencyYebState,c=e.history,i=n.get("issues"),r=a.get("issuedate"),u=a.get("currencyList"),s=a.get("childitemlist"),o=a.get("endissuedate"),l=i.findIndex((function(e){return e.get("value")===r})),f=i.slice(0,l),g=o||r;t(p.i("lrb",(function(){return function(e){return e(p.a("pdfFcBa",{begin:"".concat(r.substr(0,4)).concat(r.substr(5,2)),end:"".concat(g.substr(0,4)).concat(g.substr(5,2))}))}}),(function(){return function(e){return e(p.a("excelFcBa",{begin:"".concat(r.substr(0,4)).concat(r.substr(5,2)),end:"".concat(g.substr(0,4)).concat(g.substr(5,2))}))}})));return d.a.createElement(m.h,{className:"kmyeb currencyyeb"},d.a.createElement(b.f,{issuedate:r,source:i,callback:function(e){return t(C(e,o))},onOk:function(e){return t(C(e.value,o))},showSwitch:!0,endissuedate:o,nextperiods:f,onBeginOk:function(e){t(C(e.value,""))},onEndOk:function(e){t(C(r,e.value))},changeEndToBegin:function(){return t(C(r,""))}}),d.a.createElement(m.r,{className:"ba-title"},d.a.createElement("div",{className:"ba-title-item"},"\u671f\u521d\u4f59\u989d"),d.a.createElement("div",{className:"ba-title-item"},"\u672c\u671f\u501f\u65b9"),d.a.createElement("div",{className:"ba-title-item"},"\u672c\u671f\u8d37\u65b9"),d.a.createElement("div",{className:"ba-title-item"},"\u671f\u672b\u4f59\u989d")),d.a.createElement(m.s,{flex:"1",uniqueKey:"currencyyeb-scroll",savePosition:!0},d.a.createElement("div",{className:"ba-list"},function e(n,a){return n.map((function(n,i){var u=n.get("baFcWithAcList").size>0,l=s.indexOf(n.get("fcNumber"))>-1,f=""===n.get("acid")?"#fff":"#FEF3E3";if(u){if(1===a)return d.a.createElement("div",null,d.a.createElement(S,{key:i,idx:i,item:n,history:c,dispatch:t,issuedate:r,endissuedate:o,hasSub:u,isExpanded:l,level:a,style:{backgroundColor:f}}),l&&e(n.get("baFcWithAcList"),a+1));var g=s.indexOf(n.get("acid"))>-1;return d.a.createElement("div",null,d.a.createElement(S,{key:i,idx:i,item:n,history:c,dispatch:t,issuedate:r,endissuedate:o,hasSub:u,isExpanded:g,level:a,style:{backgroundColor:f}}),g&&e(n.get("baFcWithAcList"),a+1))}return d.a.createElement(S,{key:i,idx:i,item:n,history:c,dispatch:t,issuedate:r,endissuedate:o,hasSub:u,isExpanded:l,level:a,style:{backgroundColor:f}})}))}(u,1))))}}]),n}(d.a.Component))||c),T=(n(131),n(4)),I=Object(f.fromJS)({issuedate:"",endissuedate:"",currencyList:[],childitemlist:[]});var A={currencyYebState:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:I,n=arguments.length>1?arguments[1]:void 0;return((e={},Object(T.a)(e,"INIT_CURRENCY_YEB",(function(){return I})),Object(T.a)(e,"ALL_GET_CURRENCY_YEB_LIST_FETCH",(function(){return t.set("currencyList",Object(f.fromJS)(n.receivedData)).set("issuedate",n.issuedate).set("endissuedate",n.endissuedate)})),Object(T.a)(e,"CHANGE_CUR_YEB_BEGIN_DATE",(function(){return t=n.bool?t.set("endissuedate",n.begin):t.set("issuedate",n.begin)})),Object(T.a)(e,"SHOW_CURRENCY_BACHILD_ITIEM",(function(){var e=t.get("childitemlist").toJS();return e.indexOf(n.fcNumber)>-1?(e.splice(e.indexOf(n.fcNumber),1),t=t.set("childitemlist",Object(f.fromJS)(e))):(e.push(n.fcNumber),t=t.set("childitemlist",Object(f.fromJS)(e))),t})),e)[n.type]||function(){return t})()},currencyMxbState:n(1310).a}}}]);