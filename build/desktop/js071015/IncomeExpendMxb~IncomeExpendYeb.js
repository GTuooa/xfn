(window.webpackJsonp=window.webpackJsonp||[]).push([[19],{1223:function(e,t,n){},1224:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,a,o,u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),s=l(n(1)),i=l(n(0)),c=n(17);function l(e){return e&&e.__esModule?e:{default:e}}n(1223);var d=(0,c.immutableRenderDecorator)((o=a=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,s.default.Component),u(t,[{key:"render",value:function(){var e=this.props,t=e.type,n=e.className,r=e.onClick;return s.default.createElement("div",{className:"container-wrap container-width-"+t+" "+n,onClick:r},this.props.children)}}]),t}(),a.displayName="ContainerWrap",a.propTypes={type:i.default.string.isRequired,className:i.default.string.isRequired},r=o))||r;t.default=d},1226:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,a,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),s=(a=u)&&a.__esModule?a:{default:a},i=n(17);n(1223);var c=(0,i.immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,s.default.Component),o(t,[{key:"render",value:function(){return s.default.createElement("div",{className:"flex-title"},this.props.children)}}]),t}())||r;t.default=c},1227:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,a=l(n(176)),o=l(n(174)),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n(175),n(173);var s=l(n(1)),i=n(17),c=n(127);function l(e){return e&&e.__esModule?e:{default:e}}n(1232);var d=(0,i.immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,s.default.Component),u(t,[{key:"render",value:function(){var e=this.props,t=e.pageItem,n=e.onClick,r=s.default.createElement(o.default,null,t.get("pageList").map(function(e,r){return s.default.createElement(o.default.Item,{key:e.get("key")},s.default.createElement("span",{className:"page-switch-item setting-common-ant-dropdown-menu-item",onClick:function(){n(t.get("key"),e.get("name"),e.get("key"))}},e.get("name")))}));return s.default.createElement("div",null,s.default.createElement(a.default,{overlay:r,trigger:["click"]},s.default.createElement("div",{className:"page-switch-button"},s.default.createElement(c.XfnIcon,{type:"Menu"}))))}}]),t}())||r;t.default=d},1232:function(e,t,n){},1269:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,a=p(n(14)),o=p(n(37)),u=p(n(100)),s=p(n(45)),i=p(n(1230)),c=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n(78),n(38),n(99),n(55),n(1231);var l=p(n(1)),d=p(n(6)),f=n(17),E=n(127),_=n(22);function p(e){return e&&e.__esModule?e:{default:e}}function b(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}n(1284);var m=i.default.RangePicker,M=(s.default.Option,u.default.Group,(0,f.immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.default.Component),c(t,[{key:"render",value:function(){var e,t=this.props,n=t.issuedate,r=t.endissuedate,u=(t.beginMonth,t.endMonth,t.issues),c=t.changePeriodCallback,f=t.chooseValue,p=t.changeChooseperiodsStatu,M=u?u.findIndex(function(e){return e===n||e.substr(0,4)+"-"+e.substr(6,2)===n}):0,N=u?u.slice(0,M):[],O=function(e,t,n){var r="",a="";return n?1==t?(a=12,r=Number(e)-1):(a=Number(t)-1,r=Number(e)):(a=Number(t),r=Number(e)),{openedyear:r,openedmonth:a}},g=r||n,y=u.get(0),I=u.get(u.size-1),C="",h="";if(u.size){var v=O(I.substr(0,4),I.substr(6,2),!0).openedyear,A=O(I.substr(0,4),I.substr(6,2),!0).openedmonth,P=O(y.substr(0,4),y.substr(6,2)).openedyear,T=O(y.substr(0,4),y.substr(6,2)).openedmonth;C=new Date(v,A,1),h=new Date(P,T,1)}var D=function(e){return e&&((0,d.default)(C)>e||!((0,d.default)(h)>e))},S=[];switch(f){case"MONTH":S.push(l.default.createElement("span",{className:"muti-period-more-select"},l.default.createElement(s.default,{className:"title-more-choose-date",value:n?"-"===n.substr(4,1)?n.substr(0,4)+"年第"+n.substr(5,2)+"期":n:"",showArrow:!0,dropdownMatchSelectWidth:!1,onChange:function(e){return(0,_.debounce)(function(){-1===e.indexOf("Invalid")?c(e,e):o.default.info("日期格式错误，请刷新重试")})()}},u?u.map(function(e,t){return l.default.createElement(s.default.Option,{key:t,value:e.substr(0,4)+"-"+e.substr(6,2)},e)}):""),l.default.createElement(a.default,{type:"calendar",className:"title-more-calendar"})));break;case"MONTH_MONTH":S.push(l.default.createElement("div",{className:"title-more-choose-month-month"},l.default.createElement(s.default,{showArrow:!1,value:n,onChange:function(e){return c(e,e)},dropdownMatchSelectWidth:!1},u?u.map(function(e,t){return l.default.createElement(s.default.Option,{key:t,value:e.substr(0,4)+"-"+e.substr(6,2)},e.substr(0,4)+"-"+e.substr(6,2))}):""),l.default.createElement("span",{className:"choose-month-month-separator"},"~"),l.default.createElement(s.default,{showArrow:!1,value:r===n?"":r,onChange:function(e){return c(n,e)},dropdownMatchSelectWidth:!1},N.map(function(e,t){return l.default.createElement(s.default.Option,{key:t,value:e.substr(0,4)+"-"+e.substr(6,2)},e.substr(0,4)+"-"+e.substr(6,2))}))));break;case"DATE":S.push(l.default.createElement(i.default,{value:n?(0,d.default)(n,"YYYY-MM-DD"):"",allowClear:!1,disabledDate:D,className:"title-more-choose-date",onChange:function(e){return(0,_.debounce)(function(){var t=e.format("YYYY-MM-DD");-1===t.indexOf("Invalid")?c(t,t):o.default.info("日期格式错误，请刷新重试")})()},suffixIcon:l.default.createElement(a.default,{type:"down"})}));break;case"DATE_DATE":S.push(l.default.createElement(m,(b(e={disabledDate:D,className:"title-more-choose-month",allowClear:!1,value:n?[(0,d.default)(n,"YYYY-MM-DD"),(0,d.default)(g,"YYYY-MM-DD")]:[],format:"YYYY-MM-DD"},"allowClear",!1),b(e,"onChange",function(e,t){return(0,_.debounce)(function(){if(t.length>1){var e=t[0],n=t[1];-1===e.indexOf("Invalid")?(n.indexOf("Invalid")>-1&&(n=""),c(e,n)):o.default.info("日期格式错误，请刷新重试")}})()}),b(e,"suffixIcon",l.default.createElement(a.default,{type:"down"})),e)))}return l.default.createElement("div",{className:"common-data-change-box"},S,l.default.createElement(s.default,{className:"title-more-choose",dropdownMatchSelectWidth:!1,value:"",showArrow:!1,onChange:function(e){p(e);var t="-"===n.substr(4,1)?n:n.substr(0,4)+"-"+n.substr(6,2),r="-"===g.substr(4,1)?g:g.substr(0,4)+"-"+g.substr(6,2),a="MONTH"===e||"MONTH_MONTH"===e?(0,d.default)(t,"YYYY-MM").format("YYYY-MM"):(0,d.default)(t,"YYYY-MM-DD").format("YYYY-MM-DD"),u="MONTH"===e||"MONTH_MONTH"===e?(0,d.default)(r,"YYYY-MM").format("YYYY-MM"):(0,d.default)(r,"YYYY-MM-DD").format("YYYY-MM-DD");-1===a.indexOf("Invalid")?(u.indexOf("Invalid")>-1&&(u=""),c(a,"MONTH"===e||"DATE"===e?a:u)):o.default.info("日期格式错误，请刷新重试")}},l.default.createElement(s.default.Option,{value:"MONTH",key:"MONTH"},"按账期查询"),l.default.createElement(s.default.Option,{value:"DATE",key:"DATE"},"按日期查询"),l.default.createElement(s.default.Option,{value:"MONTH_MONTH",key:"MONTH_MONTH"},"按账期区间查询"),l.default.createElement(s.default.Option,{value:"DATE_DATE",key:"DATE_DATE"},"按日期区间查询")),l.default.createElement(E.XfnIcon,{type:"calendar-change",className:"title-more-choose-calendar"}))}}]),t}())||r);t.default=M},1284:function(e,t,n){},1567:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changeIncomeExpendMxbCommonState=t.changeIncomeExpendMxbSearchContent=t.changeIncomeExpendMxbChooseValue=t.getIncomeExpendDetailCategory=t.getIncomeExpendMxbBalanceListPages=t.getIncomeExpendMxbBalanceList=t.getPeriodAndIncomeExpendMxbListRefalsh=t.getPeriodAndIncomeExpendMxbList=t.getIncomeExpendMxbListFromIncomeExpendYeb=void 0;var r=l(n(37));n(38);var a=c(n(1714)),o=l(n(52)),u=n(22),s=(c(n(30)),c(n(27))),i=c(n(102));function c(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function l(e){return e&&e.__esModule?e:{default:e}}t.getIncomeExpendMxbListFromIncomeExpendYeb=function(e,t,n){return function(c){if(!e)return r.default.info("账期异常，请刷新再试",2);c(d(e,t));var l=e?"-"===e.substr(4,1)?e:e.substr(0,4)+"-"+e.substr(6,2):"",f=t?"-"===t.substr(4,1)?t:t.substr(0,4)+"-"+t.substr(6,2):"";c({type:a.SWITCH_LOADING_MASK}),(0,o.default)("getIncomeExpendMxbReport","POST",JSON.stringify({begin:l,end:f,jrCategoryUuid:n,jrAbstract:"",currentPage:1,pageSize:s.MXB_PAGE_SIZE,needPeriod:"true"}),function(r){c({type:a.SWITCH_LOADING_MASK}),(0,u.showMessage)(r)&&(c(i.reportGetIssuedateAndFreshPeriod(r)),c({type:a.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,receivedData:r.data,issuedate:e,endissuedate:t,currentCategoryUuid:n,jrAbstract:"",currentPage:1}))})}},t.getPeriodAndIncomeExpendMxbList=function(e,t){arguments.length>2&&void 0!==arguments[2]&&arguments[2];var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";return function(r,c){r({type:a.SWITCH_LOADING_MASK});var l=c().incomeExpendMxbState,d=l.getIn(["views","categoryUuid"]),f=l.getIn(["views","categoryName"]),E=l.getIn(["views","oriName"]),_=e?"-"===e.substr(4,1)?e:e.substr(0,4)+"-"+e.substr(6,2):"",p=t?"-"===t.substr(4,1)?t:t.substr(0,4)+"-"+t.substr(6,2):"";(0,o.default)("getIncomeExpendMxbCategory","POST",JSON.stringify({begin:_,end:p,needPeriod:"true"}),function(c){if(r({type:a.SWITCH_LOADING_MASK}),(0,u.showMessage)(c))if(r(i.reportGetIssuedateAndFreshPeriod(c)),c.data.result[0]){r({type:a.GET_INCOME_EXPEND_MXB_CATEGORY,receivedData:c.data.result});var l=!1,b=d,m=f,M=E;!function e(t){return t.map(function(t){t.jrCategoryUuid===d&&(l=!0),t.childList.length>0&&e(t.childList)})}(c.data.result),l||(b=c.data.result[0].jrCategoryUuid,m=c.data.result[0].jrCategoryCompleteName,M=c.data.result[0].jrCategoryName),r({type:a.SWITCH_LOADING_MASK}),(0,o.default)("getIncomeExpendMxbReport","POST",JSON.stringify({begin:_,end:p,jrCategoryUuid:b,jrAbstract:n,currentPage:1,pageSize:s.MXB_PAGE_SIZE,needPeriod:"true"}),function(o){if((0,u.showMessage)(o)){var s=e||r(i.reportGetIssuedateAndFreshPeriod(o));r({type:a.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,receivedData:o.data,issuedate:s,endissuedate:t,currentCategoryUuid:b,categoryName:m,oriName:M,jrAbstract:n,currentPage:1})}r({type:a.SWITCH_LOADING_MASK})})}else{var N=e||r(i.reportGetIssuedateAndFreshPeriod(c));r({type:a.GET_INCOME_EXPEND_MXB_NO_CATEGORY,issuedate:N})}})}},t.getPeriodAndIncomeExpendMxbListRefalsh=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",r=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"";return function(c){c({type:a.SWITCH_LOADING_MASK});var l=e?"-"===e.substr(4,1)?e:e.substr(0,4)+"-"+e.substr(6,2):"",d=t?"-"===t.substr(4,1)?t:t.substr(0,4)+"-"+t.substr(6,2):"";(0,o.default)("getIncomeExpendMxbCategory","POST",JSON.stringify({begin:l,end:d,needPeriod:"true"}),function(f){if(c({type:a.SWITCH_LOADING_MASK}),(0,u.showMessage)(f))if(c(i.reportGetIssuedateAndFreshPeriod(f)),f.data.result[0]){c({type:a.GET_INCOME_EXPEND_MXB_CATEGORY,receivedData:f.data.result});var E=!1,_=n,p="",b="";!function e(t){return t.map(function(t){t.jrCategoryUuid==n&&(E=!0,p=t.jrCategoryName,b=t.jrCategoryCompleteName),t.childList.length>0&&e(t.childList)})}(f.data.result),E||(_=""),c({type:a.SWITCH_LOADING_MASK}),(0,o.default)("getIncomeExpendMxbReport","POST",JSON.stringify({begin:l,end:d,jrCategoryUuid:_,jrAbstract:r,currentPage:1,pageSize:s.MXB_PAGE_SIZE,needPeriod:"true"}),function(n){if((0,u.showMessage)(n)){var o=e||c(i.reportGetIssuedateAndFreshPeriod(n));c({type:a.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,receivedData:n.data,issuedate:o,endissuedate:t,currentCategoryUuid:_,categoryName:b,oriName:p,jrAbstract:r,currentPage:1})}c({type:a.SWITCH_LOADING_MASK})})}else{var m=e||c(i.reportGetIssuedateAndFreshPeriod(f));c({type:a.GET_INCOME_EXPEND_MXB_NO_CATEGORY,issuedate:m})}})}},t.getIncomeExpendMxbBalanceList=function(e,t){return function(n,c){if(!e)return r.default.info("账期异常，请刷新再试",2);var l=e?"-"===e.substr(4,1)?e:e.substr(0,4)+"-"+e.substr(6,2):"",d=t?"-"===t.substr(4,1)?t:t.substr(0,4)+"-"+t.substr(6,2):"";n({type:a.SWITCH_LOADING_MASK}),(0,o.default)("getIncomeExpendMxbReport","POST",JSON.stringify({begin:l,end:d,jrCategoryUuid:"",jrAbstract:"",currentPage:1,pageSize:s.MXB_PAGE_SIZE,needPeriod:"true"}),function(r){(0,u.showMessage)(r)&&(n(i.reportGetIssuedateAndFreshPeriod(r)),n({type:a.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,receivedData:r.data,issuedate:e,endissuedate:t,currentCategoryUuid:"",jrAbstract:"",currentPage:1})),n({type:a.SWITCH_LOADING_MASK})})}},t.getIncomeExpendMxbBalanceListPages=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"",c=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"",l=arguments.length>4&&void 0!==arguments[4]?arguments[4]:1;return function(d,f){if(!e)return r.default.info("账期异常，请刷新再试",2);var E=e?"-"===e.substr(4,1)?e:e.substr(0,4)+"-"+e.substr(6,2):"",_=t?"-"===t.substr(4,1)?t:t.substr(0,4)+"-"+t.substr(6,2):"";d({type:a.SWITCH_LOADING_MASK}),(0,o.default)("getIncomeExpendMxbReport","POST",JSON.stringify({begin:E,end:_,jrCategoryUuid:n,jrAbstract:c,currentPage:l,pageSize:s.MXB_PAGE_SIZE,needPeriod:"true"}),function(r){(0,u.showMessage)(r)&&(d(i.reportGetIssuedateAndFreshPeriod(r)),d({type:a.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,receivedData:r.data,issuedate:e,endissuedate:t,currentCategoryUuid:n,jrAbstract:c,currentPage:l})),d({type:a.SWITCH_LOADING_MASK})})}};var d=t.getIncomeExpendDetailCategory=function(e,t){return function(n){n({type:a.SWITCH_LOADING_MASK});var r=e?"-"===e.substr(4,1)?e:e.substr(0,4)+"-"+e.substr(6,2):"",s=t?"-"===t.substr(4,1)?t:t.substr(0,4)+"-"+t.substr(6,2):"";(0,o.default)("getIncomeExpendMxbCategory","POST",JSON.stringify({begin:r,end:s}),function(e){(0,u.showMessage)(e)&&n({type:a.GET_INCOME_EXPEND_MXB_CATEGORY,receivedData:e.data.result}),n({type:a.SWITCH_LOADING_MASK})})}};t.changeIncomeExpendMxbChooseValue=function(e){return{type:a.CHANGE_INCOME_EXPEND_MXB_CHOOSE_VALUE,chooseValue:e}},t.changeIncomeExpendMxbSearchContent=function(e){return{type:a.CHANGE_INCOME_EXPEND_MXB_SEARCH_CONTENT,value:e}},t.changeIncomeExpendMxbCommonState=function(e,t,n){return{type:a.CHANGE_INCOME_EXPEND_MXB_COMMON_STATE,parent:e,position:t,value:n}}},1714:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.SWITCH_LOADING_MASK="SWITCH_LOADING_MASK",t.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB="GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB",t.GET_INCOME_EXPEND_MXB_CATEGORY="GET_INCOME_EXPEND_MXB_CATEGORY",t.CHANGE_INCOME_EXPEND_MXB_CHOOSE_VALUE="CHANGE_INCOME_EXPEND_MXB_CHOOSE_VALUE",t.CHANGE_INCOME_EXPEND_MXB_SEARCH_CONTENT="CHANGE_INCOME_EXPEND_MXB_SEARCH_CONTENT",t.CHANGE_INCOME_EXPEND_MXB_COMMON_STATE="CHANGE_INCOME_EXPEND_MXB_COMMON_STATE",t.INIT_INCOME_EXPEND_MXB="INIT_INCOME_EXPEND_MXB",t.GET_INCOME_EXPEND_MXB_NO_CATEGORY="GET_INCOME_EXPEND_MXB_NO_CATEGORY"},1715:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u,n=arguments[1];return((e={},o(e,a.INIT_INCOME_EXPEND_MXB,function(){return u}),o(e,a.GET_INCOME_EXPEND_MXB_LIST_FROM_INCOME_EXPENDYEB,function(){var e=n.receivedData.result?n.receivedData.result:{detailList:[],openDetail:{},pages:1,currentPage:1},a=e.incomeAmount,o=void 0===a?"":a,u=e.expenseAmount,s=void 0===u?"":u,i=e.realIncomeAmount,c=void 0===i?"":i,l=e.realExpenseAmount,d=void 0===l?"":l,f=e.closeARBalance,E=void 0===f?"":f,_=e.closeAPBalance,p=void 0===_?"":_,b=e.direction,m=void 0===b?"":b,M={incomeAmount:o,expenseAmount:s,realIncomeAmount:c,realExpenseAmount:d,closeARBalance:E,closeAPBalance:p,direction:m};return t=t.set("incomeExpendDetailList",(0,r.fromJS)(e.detailList)).set("openDetail",e.openDetail?(0,r.fromJS)(e.openDetail):(0,r.fromJS)({})).set("totalAmountList",(0,r.fromJS)(M)).set("issuedate",n.issuedate).set("endissuedate",n.endissuedate).set("pageCount",e.pages).set("currentPage",e.currentPage).setIn(["views","categoryUuid"],n.currentCategoryUuid).setIn(["views","searchAbstract"],n.jrAbstract),t=n.endissuedate&&n.endissuedate!==n.issuedate?t.setIn(["views","chooseperiods"],!0):t.setIn(["views","chooseperiods"],!1),n.currentCategoryUuid||(t=t.setIn(["views","categoryName"],"")),n.categoryName&&(t=t.setIn(["views","categoryName"],n.categoryName)),n.oriName&&(t=t.setIn(["views","oriName"],n.oriName)),t}),o(e,a.GET_INCOME_EXPEND_MXB_NO_CATEGORY,function(){return t=t.set("issuedate",n.issuedate).set("incomeExpendDetailList",(0,r.fromJS)([])).set("runningCategoryList",(0,r.fromJS)([{childList:[]}])).set("openDetail",(0,r.fromJS)({})).set("totalAmountList",(0,r.fromJS)({incomeAmount:"",expenseAmount:"",realIncomeAmount:"",realExpenseAmount:"",closeARBalance:"",closeAPBalance:""})).set("endissuedate","").set("pageCount",1).set("currentPage",1)}),o(e,a.GET_INCOME_EXPEND_MXB_CATEGORY,function(){return t=t.set("runningCategoryList",(0,r.fromJS)(n.receivedData))}),o(e,a.CHANGE_INCOME_EXPEND_MXB_CHOOSE_VALUE,function(){return t.setIn(["views","chooseValue"],n.chooseValue)}),o(e,a.CHANGE_INCOME_EXPEND_MXB_SEARCH_CONTENT,function(){return t.setIn(["views","searchAbstract"],n.value)}),o(e,a.CHANGE_INCOME_EXPEND_MXB_COMMON_STATE,function(){return t.setIn([n.parent,n.position],n.value)}),e)[n.type]||function(){return t})()};var r=n(18),a=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1714));function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u=(0,r.fromJS)({views:{chooseValue:"MONTH",categoryUuid:"",searchAbstract:"",categoryName:"",oriName:""},issuedate:"",endissuedate:"",incomeExpendDetailList:[],runningCategoryList:[{childList:[]}],openDetail:{},totalAmountList:{},currentPage:1,pageCount:1})}}]);