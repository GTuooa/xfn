(window.webpackJsonp=window.webpackJsonp||[]).push([[111],{1501:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changeYjsfbBeginDate=t.handleShowChildList=t.toggleSfbProfitLineDisplay=t.getYjsfbFetch=t.getPeriodAndIncomeStatementSfbFetch=void 0;var r,o=n(13),a=n(24),i=(r=a)&&r.__esModule?r:{default:r},u=f(n(181)),s=f(n(1502)),l=f(n(25)),c=f(n(10));function f(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}t.getPeriodAndIncomeStatementSfbFetch=function(e){return function(t,n){c.toast.loading(l.LOADING_TIP_TEXT,0);var r=n().homeState.getIn(["data","userInfo"]).get("sobInfo"),a=r.get("newJr"),s=!!r&&(r.get("moduleInfo").indexOf("RUNNING")>-1&&a);(0,i.default)(s?"getJrYjsfbData":"getYjsfbData","POST",JSON.stringify({begin:"",end:"",getPeriod:"true",needPeriod:"true"}),function(n){if((0,o.showMessage)(n)){c.toast.hide();var r=t(s?u.reportGetIssuedateAndFreshPeriod(n):u.everyTableGetPeriod(n)),a=e||r,i=n.data.periodDtoJson?t(u.everyTableGetIssuedate(n.data.periodDtoJson)):"";t(d(n.data.dataList,a,"",i))}})}},t.getYjsfbFetch=function(e,t){return function(n,r){var a=r().homeState.getIn(["data","userInfo"]).get("sobInfo"),u=a.get("newJr"),s=!!a&&(a.get("moduleInfo").indexOf("RUNNING")>-1&&u),f=e.substr(0,4)+(s?"-":"")+e.substr(5,2),p=t?t.substr(0,4)+(s?"-":"")+t.substr(5,2):f;c.toast.loading(l.LOADING_TIP_TEXT,0),(0,i.default)(s?"getJrYjsfbData":"getYjsfbData","POST",JSON.stringify({begin:f,end:p}),function(r){(0,o.showMessage)(r)&&(c.toast.hide(),n(d(r.data.dataList,e,t)))})}};var d=function(e,t,n,r){return function(o){o({type:s.GET_SFB_DATA,receivedData:e,issues:r}),o({type:s.CHANGE_YJSFB_ISSUDATE,issuedate:t,endissuedate:n})}};t.toggleSfbProfitLineDisplay=function(e){return{type:s.TOGGLE_PROFIT_SFB_LINE_DISPLAY,blockIdx:e}},t.handleShowChildList=function(e){return function(t){t({type:s.HANDLE_YJSFB_SHOW_CHILD_LIST,lineIndex:e})}},t.changeYjsfbBeginDate=function(e,t){return{type:s.CHANGE_YJSFB_BEGIN_DATE,begin:e,bool:t}}},1502:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_YJSFB="INIT_YJSFB",t.CHANGE_YJSFB_ISSUDATE="CHANGE_YJSFB_ISSUDATE",t.TOGGLE_PROFIT_SFB_LINE_DISPLAY="TOGGLE_PROFIT_SFB_LINE_DISPLAY",t.GET_SFB_DATA="GET_SFB_DATA",t.CHANGE_YJSFB_BEGIN_DATE="CHANGE_YJSFB_BEGIN_DATE",t.HANDLE_YJSFB_SHOW_CHILD_LIST="HANDLE_YJSFB_SHOW_CHILD_LIST"},1948:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=g(n(0)),i=n(31),u=(n(9),n(16)),s=b(n(10)),l=g(n(1949)),c=n(123),f=n(13);n(1950);var d=b(n(1501)),p=b(n(181));function b(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function g(e){return e&&e.__esModule?e:{default:e}}(0,f.createArray)(3,23);var _=(0,i.connect)(function(e){return e})(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),o(t,[{key:"componentDidMount",value:function(){s.setTitle({title:"应交税费表"}),s.setIcon({showIcon:!1}),s.setRight({show:!1}),this.props.dispatch(d.getPeriodAndIncomeStatementSfbFetch())}},{key:"render",value:function(){var e=this.props,t=e.yjsfbState,n=e.allState,r=e.dispatch,o=e.homeState.getIn(["data","userInfo"]).get("sobInfo"),i=o.get("newJr"),s=!!o&&(o.get("moduleInfo").indexOf("RUNNING")>-1&&i),f=s?t.get("issues"):n.get("issues"),b=t.get("showedProfitLineBlockIdxList"),g=t.get("initPeriodList"),_=t.get("issuedate"),h=t.get("endissuedate"),m=f.findIndex(function(e){return e.get("value")===_}),y=_.substr(0,4),v=_.substr(5,2),I=n.getIn(["period","periodStartMonth"]),S=f.slice(0,m).filter(function(e){return Number(v)<Number(I)?0===e.get("value").indexOf(y)&&Number(e.get("key").substr(6,2))<Number(I):0===e.get("value").indexOf(y)||0===e.get("value").indexOf(y-1+2)&&Number(e.get("key").substr(6,2))<Number(I)}),E=""+_.substr(0,4)+_.substr(5,2),L=h?""+h.substr(0,4)+h.substr(5,2):E,w=_?_.substr(0,4)+"-"+_.substr(5,2):"",O=h?h.substr(0,4)+"-"+h.substr(5,2):w,N=t.get("showChildList");return r(p.navigationSetMenu("config","",function(){return function(e){return e(p.allExportDo(s?"taxPayJrTableExcel":"taxPayTableExcel",{start:E,begin:s?w:E,end:s?O:L}))}})),a.default.createElement(u.Container,null,a.default.createElement(c.TopMonthPicker,{issuedate:_,source:f,callback:function(e){return r(d.getYjsfbFetch(e,h))},onOk:function(e){return r(d.getYjsfbFetch(e.value,h))},showSwitch:!0,endissuedate:h,nextperiods:S,onBeginOk:function(e){r(d.getYjsfbFetch(e.value,""))},onEndOk:function(e){r(d.getYjsfbFetch(_,e.value))},changeEndToBegin:function(){return r(d.getYjsfbFetch(_,""))}}),a.default.createElement(u.Row,{className:"sjb-line title",onClick:function(){return r(d.toggleSfbProfitLineDisplay())}},a.default.createElement("span",{className:"linename"},"项目"),a.default.createElement("span",{className:"sumAmount"},"本年累计"),a.default.createElement("span",{className:"amount"},"本期金额")),a.default.createElement(u.ScrollView,{flex:"1"},a.default.createElement("dl",{className:"sjb-line-list"},g.map(function(e,t){return a.default.createElement(l.default,{lr:e,key:t,showedProfitLineBlockIdxList:b,dispatch:r,showChildList:N})}))))}}]),t}())||r;t.default=_},1949:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o,a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},i=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(0),s=(o=u)&&o.__esModule?o:{default:o},l=n(22),c=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1501)),f=n(16);var d=(0,l.immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,s.default.Component),i(t,[{key:"marginLeft",value:function(e){switch(e){case 1:case 2:case 3:return 0;case 4:return 24;default:return 18*(e-3)}}},{key:"render",value:function(){var e=this,t=this.props,n=t.lr,r=(t.key,t.dispatch),o=t.showChildList,i=(t.showedProfitLineBlockIdxList,function(e,t){var n={};for(var r in e)t.indexOf(r)>=0||Object.prototype.hasOwnProperty.call(e,r)&&(n[r]=e[r]);return n}(t,["lr","key","dispatch","showChildList","showedProfitLineBlockIdxList"]));return function t(n,u,l){if(n.get("payTaxList")&&n.get("payTaxList").size){var d=o.indexOf(n.get("lineIndex"))>-1,p=e.marginLeft(n.get("level"));return s.default.createElement("div",{key:l},s.default.createElement("dd",a({},i,{className:["sjb-line"].join(" "),style:{fontWeight:1===n.get("level")||2===n.get("level")?"bold":"",background:1===n.get("level")?"#FEF4E3":""},onClick:function(){r(c.handleShowChildList(n.get("lineIndex")))}}),s.default.createElement("span",{className:"linename"},s.default.createElement("span",{className:"linenametext",style:{marginLeft:p+"px"}},n.get("lineName").replace(/、/g,".").replace(/：/g,":").replace(/（/g,"(").replace(/）/g,")")),s.default.createElement(f.Icon,{className:"sjb-item-icon",type:d?"arrow-up":"arrow-down"})),s.default.createElement(f.Amount,{className:"sumAmount",showZero:"true"},n.get("yearAmount")),s.default.createElement(f.Amount,{className:"amount",showZero:"true"},n.get("currentAmount"))),d&&n.get("payTaxList").map(function(e,n){return t(e,u+1,l+1)}))}var b=e.marginLeft(n.get("level"));return s.default.createElement("dd",a({},i,{key:l,className:["sjb-line"].join(" "),style:{fontWeight:1===n.get("level")||2===n.get("level")?"bold":"",background:1===n.get("level")?"#FEF4E3":""}}),s.default.createElement("span",{className:"linename"},s.default.createElement("span",{className:"linenametext",style:{marginLeft:b+"px"}},n.get("lineName").replace(/、/g,".").replace(/：/g,":").replace(/（/g,"(").replace(/）/g,")"))),s.default.createElement(f.Amount,{className:"sumAmount",showZero:"true"},n.get("yearAmount")),s.default.createElement(f.Amount,{className:"amount",showZero:"true"},n.get("currentAmount")))}(n,0,1)}}]),t}())||r;t.default=d},1950:function(e,t,n){},1952:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i,n=arguments[1];return((e={},a(e,o.INIT_YJSFB,function(){return i}),a(e,o.CHANGE_YJSFB_ISSUDATE,function(){return t.set("issuedate",n.issuedate).set("endissuedate",n.endissuedate)}),a(e,o.TOGGLE_PROFIT_SFB_LINE_DISPLAY,function(){var e=t.get("showedProfitLineBlockIdxList");return n.blockIdx?e.indexOf(n.blockIdx)>-1?t.update("showedProfitLineBlockIdxList",function(e){return e.map(function(e){return e===n.blockIdx?-1:e}).filter(function(e){return-1!==e})}):t.update("showedProfitLineBlockIdxList",function(e){return e.push(n.blockIdx)}):t.update("showedProfitLineBlockIdxList",function(e){return e.size?e.clear():i.get("showedProfitLineBlockIdxList")})}),a(e,o.GET_SFB_DATA,function(){return n.issues&&(t=t.set("issues",(0,r.fromJS)(n.issues))),t.set("initPeriodList",(0,r.fromJS)(n.receivedData))}),a(e,o.CHANGE_YJSFB_BEGIN_DATE,function(){return t=n.bool?t.set("endissuedate",n.begin):t.set("issuedate",n.begin)}),a(e,o.HANDLE_YJSFB_SHOW_CHILD_LIST,function(){var e=n.lineIndex,o=t.get("showChildList").toJS(),a=void 0;if(o.includes(e)){var i=o.findIndex(function(t,n){return t==e});o.splice(i,1),a=o}else a=o.concat(e);return t.set("showChildList",(0,r.fromJS)(a))}),e)[n.type]||function(){return t})()};var r=n(9),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1502));function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var i=(0,r.fromJS)({issuedate:"",endissuedate:"",showedProfitLineBlockIdxList:[],initPeriodList:[],showChildList:[],issues:[]})},968:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var r=o(n(1948));function o(e){return e&&e.__esModule?e:{default:e}}var a={yjsfbState:o(n(1952)).default};t.reducer=a,t.view=r.default}}]);