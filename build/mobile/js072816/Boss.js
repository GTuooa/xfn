(window.webpackJsonp=window.webpackJsonp||[]).push([[110],{1072:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.cancelReviewedJvlist=t.reviewedJvlist=t.changeData=t.setFjglData=t.pushVouhcerToLrpzReducer=t.reverseVcList=t.sortAndChangeVcId=t.cancelChangeVcCheckBoxDisplay=t.changeVcCheckBoxDisplay=t.selectVcAll=t.selectVc=t.pagingVc=t.deleteVcFetch=t.getSortVcFetch=t.getVcListFetch=t.getPeriodAndVcListFetch=void 0;var n,a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n])}return e},o=s(13),r=s(24),i=(n=r)&&n.__esModule?n:{default:n},c=f(s(181)),l=f(s(1077)),u=f(s(10)),d=f(s(25));function f(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}t.getPeriodAndVcListFetch=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return function(s){u.toast.loading(d.LOADING_TIP_TEXT,0),(0,i.default)("pagindvc","POST",JSON.stringify({year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",pageSize:20,currentPage:t+1,getPeriod:"true"}),function(n){if((0,o.showMessage)(n)){u.toast.hide();var a=s(c.everyTableGetPeriod(n)),r=e||a;n.data.jsonArray;s({type:l.AFTER_PAGING_VC,receivedData:n,issuedate:r,currentPage:t})}})}},t.getVcListFetch=function(e){return function(t){var s=e.substring(0,7);u.toast.loading(d.LOADING_TIP_TEXT,0),(0,i.default)("getvclist","POST",JSON.stringify((0,o.jsonifyDate)(e)),function(e){(0,o.showMessage)(e)&&(u.toast.hide(),t({type:l.GET_VC_LIST_FETCH,receivedData:e,issuedate:s}))})}},t.getSortVcFetch=function(e,t){return function(s){0!=t&&(u.toast.loading(d.LOADING_TIP_TEXT,0),(0,i.default)("sortvc","POST",JSON.stringify({year:e.substr(0,4),month:e.substr(5,2),sort:t}),function(t){(0,o.showMessage)(t,"show",800)&&s(E(e))}))}},t.deleteVcFetch=function(e){return function(t,s){var n=e.get("vclist").filter(function(e){return e.get("selected")}).some(function(e){return e.get("enclosurecount")})?"凭证下存在附件,附件也将被删除":"确定删除吗";u.Confirm({message:n,title:"提示",buttonLabels:["取消","确定"],onSuccess:function(s){if(1===s.buttonIndex){var n=e.get("vclist"),a=e.get("vclist").filter(function(e){return e.get("selected")}).map(function(e){return e.get("vcindex")}),r=n.size===a.size;u.toast.loading(d.LOADING_TIP_TEXT,0),(0,i.default)("deletevc","POST",JSON.stringify({year:e.getIn(["vclist",0,"year"]),month:e.getIn(["vclist",0,"month"]),vcindexlist:a,action:"QUERY_VC-DELETE_VC-BATCH_DELETE"}),function(s){if((0,o.showMessage)(s)){if(t({type:l.DELETE_VC_FETCH,receivedData:s}),(0,i.default)("getperiod","GET","",function(e){(0,o.showMessage)(e)&&(u.toast.hide(),t({type:l.GET_PERIOD_FETCH,receivedData:e}))}),r){var n=e.getIn(["vclist",0,"year"])+"-"+e.getIn(["vclist",0,"month"]);t(E(n))}t(m())}})}},onFail:function(e){return alert(e)}})}};var E=t.pagingVc=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,s=arguments.length>2&&void 0!==arguments[2]&&arguments[2],n=arguments[3];return function(r,c){var f=(0,o.jsonifyDate)(e),E=e.substring(0,7),m=c().cxpzState,_=m.get("searchContentType"),p=m.get("condition");!s&&u.toast.loading(d.LOADING_TIP_TEXT,0),(0,i.default)("pagindvc","POST",JSON.stringify(a({},f,{pageSize:20,currentPage:t+1,searchContentType:_,condition:p})),function(e){!s&&u.toast.hide(),(0,o.showMessage)(e)&&(s&&n.setState({isLoading:!1}),r({type:l.AFTER_PAGING_VC,receivedData:e,issuedate:E,currentPage:t}))})}},m=(t.selectVc=function(e){return{type:l.SELECT_VC,idx:e}},t.selectVcAll=function(){return{type:l.SELECT_VC_ALL}},t.changeVcCheckBoxDisplay=function(e){return{type:l.CHANGE_ALL_VC_CHECKBOX_DISPLAY,idx:e}},t.cancelChangeVcCheckBoxDisplay=function(){return{type:l.CANCEL_CHANGE_VC_CHECKBOX_DISPALY}});t.sortAndChangeVcId=function(){return{type:l.SORT_AND_CHANGE_VC_ID}},t.reverseVcList=function(){return{type:l.REVERSE_VC_LIST}},t.pushVouhcerToLrpzReducer=function(e){return{type:l.PUSH_VOUCHER_TO_LRPZ_REDUCER,voucher:e}},t.setFjglData=function(){return function(e,t){var s=t().cxpzState.get("issuedate");e({type:l.CHANGE_FJGL_ISSUEDATE,issuedate:s})}},t.changeData=function(e,t){return{type:l.CXPZ_CHANGE_DATA,dataType:e,value:t}},t.reviewedJvlist=function(e){return function(t,s){var n=s().cxpzState.get("vclist"),a=e.split("-"),r=[];n.forEach(function(e){e.get("selected")&&!e.get("reviewedby")&&r.push(e.get("vcindex"))}),u.toast.loading(d.LOADING_TIP_TEXT,0),(0,i.default)("reviewvc","POST",JSON.stringify({year:a[0],month:a[1],vcindexlist:r,action:"QUERY_VC-AUDIT"}),function(s){(0,o.showMessage)(s)&&(u.toast.hide(),0==s.data.success&&u.Alert(s.data.failList.join("、")),t(E(e)))})}},t.cancelReviewedJvlist=function(e){return function(t,s){var n=s().cxpzState.get("vclist"),a=e.split("-"),r=[];n.forEach(function(e){e.get("selected")&&e.get("reviewedby")&&r.push(e.get("vcindex"))}),u.toast.loading("加载中...",0),(0,i.default)("backreviewvc","POST",JSON.stringify({year:a[0],month:a[1],vcindexlist:r,action:"QUERY_VC-CANCEL_AUDIT"}),function(s){(0,o.showMessage)(s)&&(u.toast.hide(),0==s.data.success&&u.Alert(s.data.failList.join("、")),t(E(e)))})}}},1077:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_CXPZ="INIT_CXPZ",t.GET_VC_LIST_FETCH="GET_VC_LIST_FETCH",t.DELETE_VC_FETCH="DELETE_VC_FETCH",t.CHANGE_ALL_VC_CHECKBOX_DISPLAY="CHANGE_ALL_VC_CHECKBOX_DISPLAY",t.CANCEL_CHANGE_VC_CHECKBOX_DISPALY="CANCEL_CHANGE_VC_CHECKBOX_DISPALY",t.SELECT_VC_ALL="SELECT_VC_ALL",t.SELECT_VC="SELECT_VC",t.REVERSE_VC_LIST="REVERSE_VC_LIST",t.AFTER_PAGING_VC="AFTER_PAGING_VC",t.CXPZ_CHANGE_DATA="CXPZ_CHANGE_DATA",t.PUSH_VOUCHER_TO_LRPZ_REDUCER="PUSH_VOUCHER_TO_LRPZ_REDUCER",t.GET_PERIOD_FETCH="GET_PERIOD_FETCH",t.CHANGE_FJGL_ISSUEDATE="CHANGE_FJGL_ISSUEDATE"},1231:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_MXB="INIT_MXB",t.GET_MXB_ACLIST="GET_MXB_ACLIST",t.GET_SUBSIDIARY_LEDGER_FETCH="GET_SUBSIDIARY_LEDGER_FETCH",t.REVERSE_LEDGER_JV_LIST="REVERSE_LEDGER_JV_LIST",t.CHANGE_MXB_BEGIN_DATE="CHANGE_MXB_BEGIN_DATE",t.CHANGE_AC_MXB_CHOOSE_VALUE="CHANGE_AC_MXB_CHOOSE_VALUE"},1245:function(e,t,s){},1263:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,s=arguments[1];return((e={},o(e,a.INIT_MXB,function(){return r}),o(e,a.GET_MXB_ACLIST,function(){return t.set("mxbAclist",(0,n.fromJS)(s.receivedData))}),o(e,a.GET_SUBSIDIARY_LEDGER_FETCH,function(){return t.set("issuedate",s.param.issuedate).set("endissuedate",s.param.endissuedate).set("ledger",(0,n.fromJS)(s.receivedData)).setIn(["views","currentAcId"],s.param.acId).setIn(["views","currentAssId"],s.param.assId).setIn(["views","currentAssCategory"],s.param.assCategory)}),o(e,a.REVERSE_LEDGER_JV_LIST,function(){return t.updateIn(["ledger","jvlist"],function(e){return e.reverse()})}),o(e,a.CHANGE_MXB_BEGIN_DATE,function(){return t=s.bool?t.set("endissuedate",s.begin):t.set("issuedate",s.begin)}),o(e,a.CHANGE_AC_MXB_CHOOSE_VALUE,function(){return t=t.setIn(["views","chooseValue"],s.value)}),e)[s.type]||function(){return t})()};var n=s(9),a=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}(s(1231));function o(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var r=(0,n.fromJS)({views:{currentAcId:"",currentAssId:"",currentAssCategory:"",chooseValue:"ISSUE"},issuedate:"",endissuedate:"",currentAcid:"",currentAss:"",mxbAclist:[],ledger:{acId:"",acName:"",direction:"",assCategory:"",assId:"",assName:"",allDebitAmount:0,allCreditAmount:0,allBalanceAmount:0,detailList:[]}})},1285:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changeAcMxbChooseValue=t.changeMxbBeginDate=t.reverseLedgerJvlist=t.changeCascadeDisplay=t.getVcFetch=t.getSubsidiaryLedgerFetch=t.getMxbAclistFetch=t.getOnlyMxbAclistFetch=void 0;var n,a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var s=arguments[t];for(var n in s)Object.prototype.hasOwnProperty.call(s,n)&&(e[n]=s[n])}return e},o=s(13),r=s(24),i=(n=r)&&n.__esModule?n:{default:n},c=E(s(1231)),l=E(s(184)),u=s(1072),d=E(s(10)),f=E(s(25));function E(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}t.getOnlyMxbAclistFetch=function(e,t){return function(s){(0,i.default)("getreportacdetailtree","POST",JSON.stringify({begin:e||"",end:t||""}),function(e){(0,o.showMessage)(e)&&s({type:c.GET_MXB_ACLIST,receivedData:e.data.tree})})}},t.getMxbAclistFetch=function(e,t,s){return function(n){d.toast.loading(f.LOADING_TIP_TEXT,0),(0,i.default)("getreportacdetailtree","POST",JSON.stringify({begin:e||"",end:t||""}),function(a){(0,o.showMessage)(a)&&(n({type:c.GET_MXB_ACLIST,receivedData:a.data.tree}),n(m({issuedate:e,endissuedate:t,acId:s,assId:"",assCategory:""})),d.toast.hide())})}};var m=t.getSubsidiaryLedgerFetch=function(e){return function(t){var s=e.issuedate,n=e.endissuedate,a=e.acId,r=e.assCategory,l=e.assId;d.toast.loading(f.LOADING_TIP_TEXT,0),(0,i.default)("getreportacdetail","POST",JSON.stringify({begin:s||"",end:n||"",acId:a,assCategory:r||"",assId:l||""}),function(s){(0,o.showMessage)(s)&&(d.toast.hide(),t({type:c.GET_SUBSIDIARY_LEDGER_FETCH,receivedData:s.data.detail,param:e}),s.data.detail.needDownSize&&d.Alert("本次查询数据量较大，目前仅返回前7500条。若需查询后续数据，请缩小账期及科目范围。"))})}};t.getVcFetch=function(e,t,s,n){return function(r){var c=(0,o.jsonifyDate)(e);d.toast.loading(f.LOADING_TIP_TEXT,0),(0,i.default)("getvc","POST",JSON.stringify(a({},c,{vcindex:t})),function(e){(0,o.showMessage)(e)&&(d.toast.hide(),sessionStorage.setItem("lrpzHandleMode","modify"),r((0,u.pushVouhcerToLrpzReducer)(e.data)),sessionStorage.setItem("router-from","mxb"),s.push("/lrpz"),r(l.setVcList(n)),r(l.setCkpzIsShow(!0)))})}},t.changeCascadeDisplay=function(){return{type:c.CHANGE_CASCADE_VISIBLE}},t.reverseLedgerJvlist=function(){return{type:c.REVERSE_LEDGER_JV_LIST}},t.changeMxbBeginDate=function(e,t){return{type:c.CHANGE_MXB_BEGIN_DATE,begin:e,bool:t}},t.changeAcMxbChooseValue=function(e){return{type:c.CHANGE_AC_MXB_CHOOSE_VALUE,value:e}}},1363:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_BOSS="INIT_BOSS",t.CHANGE_BOSS_ISSUEDATE="CHANGE_BOSS_ISSUEDATE",t.CHANGE_BOSS_SELECT_ASSINDEX="CHANGE_BOSS_SELECT_ASSINDEX",t.CHANGE_BOSS_ASSLIST="CHANGE_BOSS_ASSLIST",t.GET_BOSS_SHEET_FETCH="GET_BOSS_SHEET_FETCH"},1401:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,s=arguments[1];return((e={},o(e,a.INIT_BOSS,function(){return r}),o(e,a.CHANGE_BOSS_ISSUEDATE,function(){return t.set("issuedate",s.issuedate)}),o(e,a.CHANGE_BOSS_SELECT_ASSINDEX,function(){return t.set("bossSelectAssIndex",s.bossSelectAssIndex)}),o(e,a.CHANGE_BOSS_ASSLIST,function(){return t.set("bossAssList",(0,n.fromJS)(s.bossAssList))}),o(e,a.GET_BOSS_SHEET_FETCH,function(){return t.set("bosssheet",(0,n.fromJS)(s.receivedData)).set("expenditure",s.expenditure).set("income",s.income)}),e)[s.type]||function(){return t})()};var n=s(9),a=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}(s(1363));function o(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var r=(0,n.fromJS)({issuedate:"",expenditure:"",income:"",bosssheet:[],bossSelectAssIndex:"0",bossAssList:[]})},1953:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,a,o=function(){function e(e,t){for(var s=0;s<t.length;s++){var n=t[s];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,s,n){return s&&e(t.prototype,s),n&&e(t,n),t}}(),r=s(0),i=(a=r)&&a.__esModule?a:{default:a},c=s(31),l=s(9),u=_(s(10));s(1954),s(1245);var d=s(16),f=s(123),E=_(s(1956)),m=_(s(1285));_(s(1076));function _(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}var p=(0,c.connect)(function(e){return e})(n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default.Component),o(t,[{key:"componentDidMount",value:function(){u.setTitle({title:"老板表"}),u.setIcon({showIcon:!1}),u.setRight({show:!1}),"home"==sessionStorage.getItem("prevPage")?(sessionStorage.removeItem("prevPage"),this.props.dispatch(E.getPeriodAndBossSheetFetch())):this.props.dispatch(E.getBossSheetFetch(this.props.bossState.get("issuedate"),this.props.bossState.get("bossSelectAssIndex")))}},{key:"render",value:function(){var e=this.props,t=e.allState,s=e.bossState,n=e.dispatch,a=e.history,o=t.get("issues"),r=s.get("issuedate"),c=s.get("bosssheet"),u=s.get("bossSelectAssIndex"),_=s.get("bossAssList"),p={cash:[],deposit:[],inventory:[],income:[],otherincome:[],cost:[],othercost:[],businesstax:[],salesExpenses:[],manageExpenses:[],financeExpenses:[],investment:[],receivables:[],payables:[]};c&&c.forEach(function(e){p[{1001:"cash",1002:"deposit",1405:"inventory",5001:"income",5051:"otherincome",5401:"cost",5402:"othercost",5403:"businesstax",5601:"salesExpenses",5602:"manageExpenses",5603:"financeExpenses",5111:"investment",1122:"receivables",2202:"payables"}[e.get("acid")]].push(e)});var g=(0,l.fromJS)(p);function S(e){return g.get(e).size?g.get(e).getIn(["0","balance"]):"0"}var b=s.get("income"),h=s.get("expenditure"),v=b-h;function C(e){if(g.get(e).size){sessionStorage.setItem("previousPage","kmyeb");var t=g.get(e).getIn(["0","acid"]);n(m.getMxbAclistFetch(r,r,t)),n(m.changeAcMxbChooseValue("ISSUE")),a.push("/kmmxb")}}var A=_.size>1?"boss-lr-ass":"boss-lr",y=_.size>1?"boss-icon-list-ass":"boss-icon-list",T=_.map(function(e,t){return{value:""+t,key:e.get("assname")}});return i.default.createElement(d.Container,{className:"boss"},i.default.createElement(f.TopMonthPicker,{issuedate:r,source:o,callback:function(e){return n(E.getBossSheetFetch(e,u.toString()))},onOk:function(e){return n(E.getBossSheetFetch(e.value,u.toString()))}}),i.default.createElement(d.ScrollView,{className:"boss"},i.default.createElement("div",{className:_.size>1?"boss-top-ass":"boss-top"},i.default.createElement("div",{className:"asset"},i.default.createElement("div",{className:"asset-item",onClick:function(){return C("receivables")}},i.default.createElement(d.Icon,{className:"asset-icon",color:"#FF943E",size:"24",type:"receivables"}),i.default.createElement(d.Amount,{showZero:!0,className:"amount"},S("receivables")),i.default.createElement("span",{className:"label text-underline"},"应收账款")),i.default.createElement("div",{className:"asset-item",onClick:function(){return C("deposit")}},i.default.createElement(d.Icon,{className:"asset-icon",color:"#F65E5E",size:"24",type:"batchpaytobank"}),i.default.createElement(d.Amount,{showZero:!0,className:"amount"},S("deposit")),i.default.createElement("span",{className:"label text-underline"},"银行存款")),i.default.createElement("div",{className:"asset-item",onClick:function(){return C("inventory")}},i.default.createElement(d.Icon,{className:"asset-icon",color:"#13B5B1",size:"24",type:"inventory"}),i.default.createElement(d.Amount,{showZero:!0,className:"amount"},S("inventory")),i.default.createElement("span",{className:"label text-underline"},"库存商品")),i.default.createElement("div",{className:"asset-item",onClick:function(){return C("payables")}},i.default.createElement(d.Icon,{className:"asset-icon",color:"#78919D",size:"24",type:"payable"}),i.default.createElement(d.Amount,{showZero:!0,className:"amount"},S("payables")?S("payables"):0),i.default.createElement("span",{className:"label text-underline"},"应付账款")))),i.default.createElement(d.SinglePicker,{district:T,onOk:function(e){return n(E.getBossSheetFetch(r,e.value))},style:{display:_.size>1?"":"none"}},i.default.createElement(d.Row,{className:"bassselect"},i.default.createElement("span",{className:"lrbselect-assmane"},_.size>1?_.getIn([u,"assname"]):""),i.default.createElement(d.Icon,{className:"lrbselect-icon",type:"triangle",size:"11"}))),i.default.createElement("div",{className:"boss-botton"},i.default.createElement("div",{className:v>0?A+" boss-lrbg-kaixin":A+" boss-lrbg-kuqi"},i.default.createElement("p",{className:A+"-tip"},v<=0?"汲取教训，不妨先来定个小目标！":"报告老板，离小目标又进一步啦！"),i.default.createElement("div",{className:A+"-main"},i.default.createElement("span",null,"营业利润"),i.default.createElement("span",null,i.default.createElement(d.Amount,{showZero:!0,style:{color:"#fff"}},v)))),i.default.createElement("ul",{className:y},i.default.createElement("li",{className:"boss-icon-list-left",onClick:function(){return C("income")}},i.default.createElement(d.Amount,{showZero:!0,className:"amount-item"},S("income")),i.default.createElement("span",{className:"boss-icon-list-tip text-underline"},"主营收入")),i.default.createElement("li",{className:"boss-icon-list-icon icon-first"},i.default.createElement(d.Icon,{color:"#fff",style:{background:"#F29B76"},type:"income"})),i.default.createElement("li",{className:"boss-icon-list-right",onClick:function(){return C("cost")}},i.default.createElement("span",{className:"boss-icon-list-tip text-underline"},"主营成本"),i.default.createElement(d.Amount,{showZero:!0,className:"amount-item"},S("cost")))),i.default.createElement("ul",{className:y},i.default.createElement("li",{className:"boss-icon-list-left",onClick:function(){return C("otherincome")}},i.default.createElement(d.Amount,{showZero:!0,className:"amount-item"},S("otherincome")),i.default.createElement("span",{className:"boss-icon-list-tip text-underline"},"其它收入")),i.default.createElement("li",{className:"boss-icon-list-icon"},i.default.createElement(d.Icon,{color:"#fff",style:{background:"#E9CE88"},type:"expenses"})),i.default.createElement("li",{className:"boss-icon-list-right",onClick:function(){return C("othercost")}},i.default.createElement("span",{className:"boss-icon-list-tip text-underline"},"其他成本"),i.default.createElement(d.Amount,{showZero:!0,className:"amount-item"},S("othercost")))),i.default.createElement("ul",{className:y},i.default.createElement("li",{className:"boss-icon-list-left"}),i.default.createElement("li",{className:"boss-icon-list-icon"},i.default.createElement(d.Icon,{color:"#fff",style:{background:"#AFC3C4"},type:"business-tax"})),i.default.createElement("li",{className:"boss-icon-list-right",onClick:function(){return C("businesstax")}},i.default.createElement("span",{className:"boss-icon-list-tip text-underline"},"营业税金"),i.default.createElement(d.Amount,{showZero:!0,className:"amount-item"},S("businesstax")))),i.default.createElement("ul",{className:y},i.default.createElement("li",{className:"boss-icon-list-left"}),i.default.createElement("li",{className:"boss-icon-list-icon"},i.default.createElement(d.Icon,{color:"#fff",style:{background:"#94D7C9"},size:"17",type:"selling-expenses"})),i.default.createElement("li",{className:"boss-icon-list-right",onClick:function(){return C("salesExpenses")}},i.default.createElement("span",{className:"boss-icon-list-tip text-underline"},"销售费用"),i.default.createElement(d.Amount,{showZero:!0,className:"amount-item"},S("salesExpenses")))),i.default.createElement("ul",{className:y},i.default.createElement("li",{className:"boss-icon-list-left"}),i.default.createElement("li",{className:"boss-icon-list-icon"},i.default.createElement(d.Icon,{color:"#fff",style:{background:"#FDB79A"},type:"management-feet"})),i.default.createElement("li",{className:"boss-icon-list-right",onClick:function(){return C("manageExpenses")}},i.default.createElement("span",{className:"boss-icon-list-tip text-underline"},"管理费用"),i.default.createElement(d.Amount,{showZero:!0,className:"amount-item"},S("manageExpenses")))),i.default.createElement("ul",{className:y},i.default.createElement("li",{className:"boss-icon-list-left"}),i.default.createElement("li",{className:"boss-icon-list-icon"},i.default.createElement(d.Icon,{color:"#fff",style:{background:"#8DC9D4"},type:"financial-expenses"})),i.default.createElement("li",{className:"boss-icon-list-right",onClick:function(){return C("financeExpenses")}},i.default.createElement("span",{className:"boss-icon-list-tip text-underline"},"财务费用"),i.default.createElement(d.Amount,{showZero:!0,className:"amount-item"},S("financeExpenses")))),i.default.createElement("ul",{className:y},i.default.createElement("li",{className:"boss-icon-list-left",onClick:function(){return C("investment")}},i.default.createElement(d.Amount,{showZero:!0,className:"amount-item"},S("investment")),i.default.createElement("span",{className:"boss-icon-list-tip text-underline"},"投资收益")),i.default.createElement("li",{className:"boss-icon-list-icon"},i.default.createElement(d.Icon,{color:"#fff",style:{background:"#FFADAD"},type:"income-from-investment"})),i.default.createElement("li",{className:"boss-icon-list-right"})))),i.default.createElement("div",{className:"boss-botton-sobmoney"},i.default.createElement("div",{className:"boss-botton-sobmoney-money-left"},i.default.createElement(d.Amount,{showZero:!0,className:"boss-botton-sobmoney-money-txt"},b),i.default.createElement("span",null," 收入合计")),i.default.createElement("div",{className:"boss-botton-sobmoney-money-right"},i.default.createElement("span",null,"支出合计 "),i.default.createElement(d.Amount,{showZero:!0,className:"boss-botton-sobmoney-money-txt"},h))))}}]),t}())||n;t.default=p},1954:function(e,t,s){},1956:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getBossSheetFetch=t.getPeriodAndBossSheetFetch=void 0;var n,a=d(s(1363)),o=s(24),r=(n=o)&&n.__esModule?n:{default:n},i=d(s(181)),c=s(13),l=d(s(25)),u=d(s(10));function d(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}t.getPeriodAndBossSheetFetch=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"0";return function(s){s(f(e,t,"true"))}},t.getBossSheetFetch=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"0";return function(s,n){s(f(e,t))}};var f=function(e,t,s){return function(n,o){var d={},f="";if("0"===t)f="getbosssheet",d={year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",getPeriod:s};else{var E=o().bossState.getIn(["bossAssList",t]),m=E.get("asscategory"),_=E.get("assid");f="getbosssheetamb",d={year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",asscategory:m,assid:_}}u.toast.loading(l.LOADING_TIP_TEXT,0),(0,r.default)(f,"POST",JSON.stringify(d),function(o){if((0,c.showMessage)(o)){u.toast.hide();var r="";if("true"==s){var l=n(i.everyTableGetPeriod(o));r=e||l}else r=e;if(n({type:a.CHANGE_BOSS_SELECT_ASSINDEX,bossSelectAssIndex:t}),n({type:a.CHANGE_BOSS_ISSUEDATE,issuedate:r}),n({type:a.GET_BOSS_SHEET_FETCH,receivedData:o.data.resultList,expenditure:o.data.expenditure,income:o.data.income}),"0"===t){var d=o.data.assList;o.data.assList.length&&d.unshift({assid:0,assname:"全部",asscategory:"asscategory"}),n({type:a.CHANGE_BOSS_ASSLIST,bossAssList:d})}}})}}},969:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var n=o(s(1953)),a=o(s(1401));function o(e){return e&&e.__esModule?e:{default:e}}var r={kmmxbState:o(s(1263)).default,bossState:a.default};t.reducer=r,t.view=n.default}}]);