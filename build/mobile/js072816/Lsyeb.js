(window.webpackJsonp=window.webpackJsonp||[]).push([[98],{1327:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_LS_MXB="INIT_LS_MXB",t.GET_MXB_ACLIST="GET_MXB_ACLIST",t.REVERSE_LEDGER_JV_LIST="REVERSE_LEDGER_JV_LIST",t.CHANGE_MXB_BEGIN_DATE="CHANGE_MXB_BEGIN_DATE",t.GET_DETAIL_LIST="GET_DETAIL_LIST",t.GET_RUNNING_CATEGORY_DETAIL="GET_RUNNING_CATEGORY_DETAIL",t.LSMX_GET_RUNNING_ACCOUNT="LSMX_GET_RUNNING_ACCOUNT",t.CHANGE_LSMX_COMMON_STRING="CHANGE_LSMX_COMMON_STRING",t.LSMX_MENU_DATA="LSMX_MENU_DATA"},1386:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changeMenuData=t.getBusinessDetail=t.changeCommonStr=t.getDetailsListInfo=t.getDetailList=t.getRunningAccount=t.getPeriodDetailList=void 0;var n,r=a(13),u=a(182),o=(n=u)&&n.__esModule?n:{default:n},l=d(a(1327)),i=(d(a(1230)),a(1072),d(a(10))),s=d(a(25)),c=d(a(181));function d(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}t.getPeriodDetailList=function(e){return function(t){t(p(e)),i.toast.loading(s.LOADING_TIP_TEXT,0),(0,o.default)("getBusinessDetailList","POST",JSON.stringify({year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",getPeriod:"true",categoryUuid:"",currentPage:1,amountType:"DETAIL_AMOUNT_TYPE_HAPPEN",accountUuid:"",pageSize:s.LSMX_LIMIE_LENGTH}),function(a){if(i.toast.hide(),(0,r.showMessage)(a)){var n=t(c.everyTableGetPeriod(a)),u=e||n;t({type:l.GET_DETAIL_LIST,receivedData:a.data.result.detailList,period:a.data.periodDtoJson,issuedate:u,getPeriod:"true",currentPage:1,amountType:"DETAIL_AMOUNT_TYPE_HAPPEN",allHappenAmount:a.data.result.allHappenAmount,allHappenBalanceAmount:a.data.result.allHappenBalanceAmount,allIncomeAmount:a.data.result.allIncomeAmount,allExpenseAmount:a.data.result.allExpenseAmount,allBalanceAmount:a.data.result.allBalanceAmount,pageCount:a.data.result.pages,property:a.data.result.property})}}),t(f())}};var f=t.getRunningAccount=function(){return function(e){(0,o.default)("getRunningAccount","GET","",function(t){(0,r.showMessage)(t)&&e({type:l.LSMX_GET_RUNNING_ACCOUNT,receivedData:t.data})})}},p=(t.getDetailList=function(e,t,a,n,u){var c=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"",d=arguments[6],_=(arguments[7],arguments[8]),g=arguments[9];return function(m,T){var E=T().lsmxbState;n=n||E.getIn(["flags","amountType"]);var y=u?"全部"===u?"":u.split(s.TREE_JOIN_STR)[0]:"";m(p(t,n,u));var A=""===a?E.get("currentPage"):a;e="全部"==e?"":e,!_&&i.toast.loading("加载中...",0),(0,o.default)("getBusinessDetailList","POST",JSON.stringify({year:t?t.substr(0,4):"",month:t?t.substr(5,2):"",getPeriod:"true",accountUuid:y,categoryUuid:e,amountType:n,propertyCost:c,currentPage:A,pageSize:s.LSMX_LIMIE_LENGTH}),function(a){!_&&i.toast.hide(),(0,r.showMessage)(a)&&(_&&g.setState({isLoading:!1}),m({type:l.GET_DETAIL_LIST,receivedData:a.data.result.detailList,issuedate:t,currentPage:A,categorValue:e,amountType:n,accountUuid:u,getPeriod:"true",period:a.data.periodDtoJson,allHappenAmount:a.data.result.allHappenAmount,allHappenBalanceAmount:a.data.result.allHappenBalanceAmount,allIncomeAmount:a.data.result.allIncomeAmount,allExpenseAmount:a.data.result.allExpenseAmount,allBalanceAmount:a.data.result.allBalanceAmount,pageCount:a.data.result.pages,property:a.data.result.propertyName,shouldConcat:d}),m(f()))})}},t.getDetailsListInfo=function(e,t){var a=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";return function(n,u){var i=u().lsmxbState;t=t||i.getIn(["flags","amountType"]);var c=a?"全部"===a?"":a.split(s.TREE_JOIN_STR)[0]:"";(0,o.default)("getRunningDetailCategory","POST",JSON.stringify({year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",accountUuid:c,amountType:t}),function(e){(0,r.showMessage)(e)&&n({type:l.GET_RUNNING_CATEGORY_DETAIL,receivedData:e.data,accountUuid:a,amountType:t})})}});t.changeCommonStr=function(e,t,a){return function(n){var r="string"==typeof t?[e+"Temp",t]:[e+"Temp"].concat(function(e){if(Array.isArray(e)){for(var t=0,a=Array(e.length);t<e.length;t++)a[t]=e[t];return a}return Array.from(e)}(t));"flags"===t[0]&&(r=t),n({type:l.CHANGE_LSMX_COMMON_STRING,tab:e,placeArr:r,value:a})}},t.getBusinessDetail=function(e,t,a){return function(n){i.toast.loading(s.LOADING_TIP_TEXT,0);var u=t.get("categoryUuid"),c=0==t.get("monthHappenAmount")?"DETAIL_AMOUNT_TYPE_BALANCE":"DETAIL_AMOUNT_TYPE_HAPPEN",d=t.get("categoryName"),f=t.get("propertyCost");(0,o.default)("getBusinessDetailList","POST",JSON.stringify({year:a?a.substr(0,4):"",month:a?a.substr(5,2):"",categoryUuid:u,currentPage:1,amountType:c,propertyCost:f,pageSize:s.LSMX_LIMIE_LENGTH,getPeriod:"true"}),function(t){i.toast.hide(),(0,r.showMessage)(t)&&(n(p(a,c,"")),n({type:l.GET_DETAIL_LIST,receivedData:t.data.result.detailList,issuedate:a,categoryType:d,currentPage:1,categorValue:u,amountType:c,allHappenAmount:t.data.result.allHappenAmount,allHappenBalanceAmount:t.data.result.allHappenBalanceAmount,allIncomeAmount:t.data.result.allIncomeAmount,allExpenseAmount:t.data.result.allExpenseAmount,allBalanceAmount:t.data.result.allBalanceAmount,pageCount:t.data.result.pages,getPeriod:"true",period:t.data.periodDtoJson,property:t.data.result.propertyName,shouldConcat:!1}),e.push("Lsmxb"))})}},t.changeMenuData=function(e,t){return{type:l.LSMX_MENU_DATA,value:t,dataType:e}}},1434:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i,a=arguments[1];return((e={},l(e,r.INIT_LS_MXB,function(){return i}),l(e,r.GET_MXB_ACLIST,function(){return t.set("mxbAclist",(0,n.fromJS)(a.receivedData.data))}),l(e,r.REVERSE_LEDGER_JV_LIST,function(){return t.updateIn(["ledger","jvlist"],function(e){return e.reverse()})}),l(e,r.CHANGE_MXB_BEGIN_DATE,function(){return t=a.bool?t.set("endissuedate",a.begin):t.set("issuedate",a.begin)}),l(e,r.GET_DETAIL_LIST,function(){if("true"===a.getPeriod){for(var e=a.period,r=Number(e.firstyear),u=Number(e.lastyear),o=Number(e.firstmonth),l=Number(e.lastmonth),i=[],s=u;s>=r&&0!==r;--s)for(var c=s===u?l:12;c>=(s===r?o:1);--c)i.push({value:s+"-"+(c<10?"0"+c:c),key:s+"年第"+(c<10?"0"+c:c)+"期"});t=t.set("period",(0,n.fromJS)(a.period)).set("issues",(0,n.fromJS)(i))}var d=[],f=a.receivedData.filter(function(e){return e.uuid||(t=t.set("QcData",e)),e.uuid});if(a.shouldConcat){var p=t.get("detailsTemp").toJS();d=p.concat(f)}else d=f;var _=[];return d.forEach(function(e,t){_.push({idx:t,uuid:e.uuid})}),a.categoryType&&(t=t.setIn(["flags","categoryType"],a.categoryType)),a.accountType&&(t=t.setIn(["flags","accountType"],a.accountType)),t.set("detailsTemp",(0,n.fromJS)(d)).set("currentPage",a.currentPage).set("pageCount",a.pageCount).setIn(["flags","issuedate"],(0,n.fromJS)(a.issuedate)).setIn(["flags","curCategory"],(0,n.fromJS)(a.categorValue)).setIn(["flags","curAccountUuid"],(0,n.fromJS)(a.accountUuid)).setIn(["flags","property"],a.property).setIn(["flags","amountType"],a.amountType).setIn(["flags","allHappenAmount"],(0,n.fromJS)(a.allHappenAmount)).setIn(["flags","allHappenBalanceAmount"],(0,n.fromJS)(a.allHappenBalanceAmount)).setIn(["flags","allIncomeAmount"],(0,n.fromJS)(a.allIncomeAmount)).setIn(["flags","allExpenseAmount"],(0,n.fromJS)(a.allExpenseAmount)).setIn(["flags","allBalanceAmount"],(0,n.fromJS)(a.allBalanceAmount)).set("ylDataList",(0,n.fromJS)(_))}),l(e,r.GET_RUNNING_CATEGORY_DETAIL,function(){var e=[];if(a.receivedData.result.forEach(function(t){return e.push(t.uuid)}),a.accountUuid&&"全部"!==a.accountUuid){var r=a.accountUuid.split(u.TREE_JOIN_STR);t=t.setIn(["flags","accountName"],(0,n.fromJS)(r[1])).setIn(["flags","curAccountUuid"],(0,n.fromJS)(a.accountUuid))}else t=t.setIn(["flags","accountName"],"全部").setIn(["flags","curAccountUuid"],"全部");var o=[],l=function(e,t){return e.forEach(function(e){e.get("childList")&&e.get("childList").size?t.push({value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name"),label:e.get("name"),children:i(e.get("childList"))}):t.push({value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name"),label:e.get("name"),children:[]})})},i=function(e){var t=[];return l(e,t),t},s=a.receivedData.result[0];if(a.receivedData.result.length>0&&"DETAIL_AMOUNT_TYPE_BALANCE"==a.amountType&&"全部"===s.name){o.push({value:""+s.uuid+u.TREE_JOIN_STR+s.name+u.TREE_JOIN_STR+s.propertyCost,label:s.name,children:[{value:u.TREE_JOIN_STR+"全部"+u.TREE_JOIN_STR+s.propertyCost,label:"全部"}]});var c=a.receivedData.result[0].childList;(0,n.fromJS)(c).forEach(function(e){if(e.get("childList").size){var t=i(e.get("childList"));t[0]={value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name")+u.TREE_JOIN_STR+e.get("propertyCost"),label:e.get("name")},o.push({value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name")+u.TREE_JOIN_STR+e.get("propertyCost"),label:e.get("name"),children:t})}else o.push({value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name")+u.TREE_JOIN_STR+e.get("propertyCost"),label:e.get("name"),children:[{value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name")+u.TREE_JOIN_STR+e.get("propertyCost"),label:e.get("name")}]})})}else(0,n.fromJS)(a.receivedData.result).forEach(function(e){if(e.get("childList").size){var t=i(e.get("childList"));t[0]={value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name")+u.TREE_JOIN_STR+e.get("propertyCost"),label:e.get("name")},o.push({value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name")+u.TREE_JOIN_STR+e.get("propertyCost"),label:e.get("name"),children:t})}else o.push({value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name")+u.TREE_JOIN_STR+e.get("propertyCost"),label:e.get("name"),children:[{value:""+e.get("uuid")+u.TREE_JOIN_STR+e.get("name")+u.TREE_JOIN_STR+e.get("propertyCost"),label:e.get("name")}]})});return t.set("runningCategory",(0,n.fromJS)(o))}),l(e,r.LSMX_GET_RUNNING_ACCOUNT,function(){return t.set("accountList",(0,n.fromJS)(a.receivedData.resultList[0].childList))}),l(e,r.CHANGE_LSMX_COMMON_STRING,function(){return a.placeArr&&(t=t.setIn(a.placeArr,a.value)),a.place&&(t=t.set(a.place,a.value)),t}),l(e,r.LSMX_MENU_DATA,function(){return t.setIn(["flags",a.dataType],a.value)}),e)[a.type]||function(){return t})()};var n=a(9),r=o(a(1327)),u=o(a(25));function o(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function l(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var i=(0,n.fromJS)({issues:[{value:"",key:""}],currentAcid:"",currentAss:"",detailsTemp:[],QcData:{},flags:{issuedate:"",endissuedate:"",accountName:"",curAccountUuid:"",paymentType:"",categoryType:"请选择类别",accountType:"请选择账户",curCategory:"",property:"",amountType:"DETAIL_AMOUNT_TYPE_HAPPEN",allHappenAmount:0,allHappenBalanceAmount:0,allIncomeAmount:0,allExpenseAmount:0,allBalanceAmount:0,menuLeftIdx:0,menuType:""},pageCount:0,currentPage:1,runningCategory:[],accountList:[],ylDataList:[]})},1595:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.accountBalanceTriangleSwitch=t.getPeriodAndBalanceList=void 0;var n,r=a(13),u=a(182),o=(n=u)&&n.__esModule?n:{default:n},l=d(a(181)),i=(d(a(1386)),d(a(1596))),s=d(a(25)),c=d(a(10));function d(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}t.getPeriodAndBalanceList=function(e,t,a){return function(n,u){var i={};t?("getbamorelist",i={beginYear:e?e.substr(0,4):"",beginMonth:e?e.substr(5,2):"",endYear:t?t.substr(0,4):e.substr(0,4),endMonth:t?t.substr(5,2):e.substr(5,2),getPeriod:a}):("getbalist",i={year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",getPeriod:a}),c.toast.loading(s.LOADING_TIP_TEXT,0),(0,o.default)("getBusinessBalanceList","POST",JSON.stringify(i),function(u){if((0,r.showMessage)(u)){c.toast.hide();var o={data:u.data.result},i=n(l.everyTableGetPeriod(u)),s=e||i;if(t)n(f(o,s,t));else{var d={data:u.data.periodDtoJson};n(f(o,s,"",d,a))}}})}};var f=function(e,t,a,n,r){return function(u){u({type:i.GET_BALANCE_LIST,receivedData:e,issuedate:t,endissuedate:a,period:n,getPeriod:r})}};t.accountBalanceTriangleSwitch=function(e,t){return{type:i.ACCOUNTCONF_BALANCE_TRIANGLE_SWITCH,showChild:e,uuid:t}}},1596:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_LSYEB="INIT_LSYEB",t.GET_BALANCE_LIST="GET_BALANCE_LIST",t.ACCOUNTCONF_BALANCE_TRIANGLE_SWITCH="ACCOUNTCONF_BALANCE_TRIANGLE_SWITCH"},2323:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,r=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),u=p(a(0)),o=a(31),l=(a(9),f(a(10))),i=f(a(1595)),s=a(123),c=a(16);a(2324);var d=p(a(2326));function f(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function p(e){return e&&e.__esModule?e:{default:e}}var _=(0,o.connect)(function(e){return e})(n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,u.default.Component),r(t,[{key:"componentDidMount",value:function(){l.setTitle({title:"收支余额表"}),l.setIcon({showIcon:!1}),l.setRight({show:!1}),"home"===sessionStorage.getItem("prevPage")?(sessionStorage.removeItem("prevPage"),this.props.dispatch(i.getPeriodAndBalanceList("","","true"))):this.props.dispatch(i.getPeriodAndBalanceList(this.props.lsyebState.get("issuedate"),this.props.lsyebState.get("endissuedate")))}},{key:"render",value:function(){var e=this.props,t=e.history,a=e.dispatch,n=(e.allState,e.lsyebState),r=n.get("balanceTemp"),o=n.get("issuedate"),l=n.get("issues"),f=n.get("runningShowChild");return u.default.createElement(c.Container,{className:"lsyeb"},u.default.createElement(s.TopMonthPicker,{issuedate:o,source:l,callback:function(e){return a(i.getPeriodAndBalanceList(e,"","true"))},onOk:function(e){return a(i.getPeriodAndBalanceList(e.value,"","true"))}}),u.default.createElement(c.Row,{className:"ba-title"},u.default.createElement("div",{className:"ba-title-item"},"本期发生额"),u.default.createElement("div",{className:"ba-title-item"},"本期收款额"),u.default.createElement("div",{className:"ba-title-item"},"本期付款额")),u.default.createElement(c.ScrollView,{flex:"1",uniqueKey:"kmyeb-scroll",savePosition:!0},u.default.createElement("div",{className:"ba-list"},function e(n,r){return n.map(function(n,l){var i=f.indexOf(n.get("categoryUuid"))>-1,s=r>1?"#FEF3E3":"#fff";return n.get("childList").size?u.default.createElement("div",{key:l},u.default.createElement(d.default,{leve:r,className:"balance-running-tabel-width",style:{backgroundColor:s},ba:n,haveChild:!0,showChild:i,history:t,dispatch:a,issuedate:o}),i?e(n.get("childList"),r+1):""):u.default.createElement("div",{key:l},u.default.createElement(d.default,{leve:r,className:"balance-running-tabel-width",ba:n,style:{backgroundColor:s},history:t,dispatch:a,issuedate:o}))})}(r,1))))}}]),t}())||n;t.default=_},2324:function(e,t,a){},2326:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,r,u=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),o=a(0),l=(r=o)&&r.__esModule?r:{default:r},i=(a(9),a(22)),s=a(16),c=f(a(1595)),d=f(a(1386));function f(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}var p=(0,i.immutableRenderDecorator)(n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.default.Component),u(t,[{key:"render",value:function(){var e=this.props,t=e.ba,a=e.style,n=(e.hasSub,e.dispatch),r=e.className,u=e.issuedate,o=(e.endissuedate,e.leve),i=e.haveChild,f=e.showChild,p=e.history,_={background:{1:"#fff",2:"#D1C0A5",3:"#7E6B5A",4:"#59493f"}[o],minWidth:(o-1)/100*10+"rem"};return l.default.createElement("div",{className:"ba "+r,style:a},l.default.createElement("div",null,l.default.createElement("span",{className:"name",onClick:function(e){e.stopPropagation(),sessionStorage.setItem("fromPage","lsyeb"),n(d.getBusinessDetail(p,t,u))}},1==o?"":l.default.createElement("span",{className:"ba-flag",style:_}),l.default.createElement("span",{className:"name-name"},t.get("categoryName"))),l.default.createElement("span",{className:"lsye-category-type"},t.get("propertyName")),l.default.createElement("span",{className:"btn",onClick:function(){return n(c.accountBalanceTriangleSwitch(f,t.get("categoryUuid")))}},l.default.createElement(s.Icon,{type:"arrow-down",style:{visibility:i?"visible":"hidden",transform:f?"rotate(180deg)":""}}))),l.default.createElement("div",{className:"ba-info"},l.default.createElement(s.Amount,{showZero:!0},t.get("monthHappenAmount")),l.default.createElement(s.Amount,{showZero:!0},t.get("monthIncomeAmount")),l.default.createElement(s.Amount,{showZero:!0},t.get("monthExpenseAmount"))))}}]),t}())||n;t.default=p},2327:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,a=arguments[1];return((e={},u(e,r.INIT_LSYEB,function(){return o}),u(e,r.GET_BALANCE_LIST,function(){if("true"===a.getPeriod){for(var e=a.period.data,r=Number(e.firstyear),u=Number(e.lastyear),o=Number(e.firstmonth),l=Number(e.lastmonth),i=[],s=u;s>=r&&0!==r;--s)for(var c=s===u?l:12;c>=(s===r?o:1);--c)i.push({value:s+"-"+(c<10?"0"+c:c),key:s+"年第"+(c<10?"0"+c:c)+"期"});t=t.set("period",(0,n.fromJS)(a.period)).set("issues",(0,n.fromJS)(i))}var d=[],f=a.receivedData.data;return f.forEach(function(e){return d.push(e.categoryUuid)}),t.set("issuedate",a.issuedate).set("endissuedate",a.endissuedate).set("balanceTemp",(0,n.fromJS)(f)).set("runningShowChild",(0,n.fromJS)(d))}),u(e,r.CHANGE_KMYEB_BEGIN_DATE,function(){return t=a.bool?t.set("endissuedate",a.begin):t.set("issuedate",a.begin)}),u(e,r.ACCOUNTCONF_BALANCE_TRIANGLE_SWITCH,function(){var e=t.get("runningShowChild");if(a.showChild){var n=e.splice(e.findIndex(function(e){return e===a.uuid}),1);return t.set("runningShowChild",n)}var r=e.push(a.uuid);return t.set("runningShowChild",r)}),e)[a.type]||function(){return t})()};var n=a(9),r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(a(1596));function u(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var o=(0,n.fromJS)({issues:[{value:"",key:""}],issuedate:"",endissuedate:"",showedLowerAcIdList:[],balanceTemp:[],runningShowChild:[]})},981:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var n=o(a(2323)),r=o(a(2327)),u=o(a(1434));function o(e){return e&&e.__esModule?e:{default:e}}var l={lsyebState:r.default,lsmxbState:u.default};t.reducer=l,t.view=n.default}}]);