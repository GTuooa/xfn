(window.webpackJsonp=window.webpackJsonp||[]).push([[18],{1223:function(e,t,n){},1224:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i,r,o,s=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),a=c(n(1)),u=c(n(0)),f=n(17);function c(e){return e&&e.__esModule?e:{default:e}}n(1223);var l=(0,f.immutableRenderDecorator)((o=r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),s(t,[{key:"render",value:function(){var e=this.props,t=e.type,n=e.className,i=e.onClick;return a.default.createElement("div",{className:"container-wrap container-width-"+t+" "+n,onClick:i},this.props.children)}}]),t}(),r.displayName="ContainerWrap",r.propTypes={type:u.default.string.isRequired,className:u.default.string.isRequired},i=o))||i;t.default=l},1226:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var i,r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var i=t[n];i.enumerable=i.enumerable||!1,i.configurable=!0,"value"in i&&(i.writable=!0),Object.defineProperty(e,i.key,i)}}return function(t,n,i){return n&&e(t.prototype,n),i&&e(t,i),t}}(),s=n(1),a=(r=s)&&r.__esModule?r:{default:r},u=n(17);n(1223);var f=(0,u.immutableRenderDecorator)(i=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),o(t,[{key:"render",value:function(){return a.default.createElement("div",{className:"flex-title"},this.props.children)}}]),t}())||i;t.default=f},1319:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.deleteExtraMessage=t.handleMeasureResultListShowChildAll=t.handleMeasureResultListShowChild=t.showMeasureResult=t.getMeasureProfitAndLossResult=t.getMeasureProfitResult=t.startMeasure=t.changeThisItemChecked=t.handleItemShowAll=t.handleItemChecked=t.handleItemShow=t.changeSwitchType=t.changeTestMonthaccumulation=t.changeTestShareOfMonth=t.getMeasureInitData=t.setExtraMessageList=t.getExtraInformationList=t.setReferDate=t.getInitListFetch=t.changeLrbString=t.changeReferChooseValue=t.changeDifferType=t.expandTable=t.upDateChlidProfitList=t.getinitincomestatement=t.clearInitLrb=t.showInitLrb=t.saveInitLrbFetch=t.changeInitLrbAmount=t.getInitIncomeStatementFetch=t.changeListType=t.changeLrbChooseMorePeriods=t.changeLrbRuleModal=t.getIncomeStatementFetch=t.getPeriodAndIncomeStatementFetch=void 0;var i,r=d(n(1605)),o=d(n(43)),s=d(n(102)),a=n(22),u=n(31),f=(i=u)&&i.__esModule?i:{default:i},c=d(n(30)),l=n(18);function d(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}t.getPeriodAndIncomeStatementFetch=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments[3],r=arguments[4];return function(o){o(E(e,t,n,r,i,"true")),o(S(!1))}},t.getIncomeStatementFetch=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,i=arguments[3],r=arguments[4];return function(o,s){o(E(e,t,n,i,r))}};var E=function(e,t,n,i,s,u){return function(s,c){s({type:r.SWITCH_LOADING_MASK});var l=c().homeState.getIn(["data","userInfo"]).get("sobInfo"),d=c().homeState.getIn(["data","userInfo","sobInfo","newJr"]),E="",S={};if(!!l&&(l.get("moduleInfo").indexOf("RUNNING")>-1&&d))E="getJrincomestatement",S={begin:e?e.substr(0,4)+"-"+e.substr(6,2):"",end:e?t.substr(0,4)+"-"+t.substr(6,2):"",needPeriod:u};else if(0===n)e==t?(E="getincomestatement",S={year:e?e.substr(0,4):"",month:e?e.substr(6,2):"",getPeriod:u}):(E="getincomestatementquarter",S={begin:e?""+e.substr(0,4)+e.substr(6,2):"",end:e?""+t.substr(0,4)+t.substr(6,2):"",getPeriod:u});else{var _=c().lrbState.get("assSelectableList"),h=_.getIn([n,"assid"]),I=_.getIn([n,"asscategory"]);s({type:r.CHANGE_SELECTASSID,selectAssId:n}),e==t?(E="getincomestatementass",S={year:e?e.substr(0,4):"",month:e?e.substr(6,2):"",asscategory:I,assid:h,getPeriod:u}):(E="getincomestatementquarterass",S={begin:e?""+e.substr(0,4)+e.substr(6,2):"",end:e?""+t.substr(0,4)+t.substr(6,2):"",asscategory:I,assid:h,getPeriod:u})}(0,f.default)(E,"POST",JSON.stringify(S),function(f){if((0,a.showMessage)(f)){if(s({type:r.CHANGE_INCOME_STATEMENT,receivedData:f.data.profitlist}),"true"==u){var c=s(o.everyTableGetPeriod(f)),l=e||c,d=t||c;i||s({type:r.CHANGE_ISSUDATE,issuedate:l,endissuedate:d})}else i||s({type:r.CHANGE_ISSUDATE,issuedate:e,endissuedate:t});if(0===n&&e==t&&!i&&f.data.assList)if(f.data.assList.length>1){var E=f.data.assList;E.unshift({assid:0,assname:"全部核算项目"}),E.forEach(function(e,t){return e.key=t}),s({type:r.CHANGE_ASSSELECTABLELIST,assSelectableList:E})}else{s({type:r.CHANGE_ASSSELECTABLELIST,assSelectableList:[]})}0===n&&s({type:r.CHANGE_SELECTASSID,selectAssId:n})}else s({type:r.INIT_LRB});s({type:r.SWITCH_LOADING_MASK})})}},S=(t.changeLrbRuleModal=function(){return{type:r.CHANGE_LRB_RULE_MODAL}},t.changeLrbChooseMorePeriods=function(){return{type:r.CHANGE_LRB_CHOOSE_MORE_PERIODS}},t.changeListType=function(){return{type:r.CHANGE_LIST_TYPE}},t.getInitIncomeStatementFetch=function(e,t){return function(n,i){var o=i().homeState.getIn(["data","userInfo"]).get("sobInfo"),s=i().homeState.getIn(["data","userInfo","sobInfo","newJr"]),u=!!o&&(o.get("moduleInfo").indexOf("RUNNING")>-1&&s);(0,f.default)(u?"getJrinitincomestatement":"getinitincomestatement","GET","",function(i){if((0,a.showMessage)(i)){n({type:r.GET_INIT_INCOMESTATEMENT,receivedData:i.data});var o=Number(t)-1,s="当前账套起始账期为"+e+"-"+t+"期,请填写下列项目"+e+"-01期至"+e+"-"+(o<10?"0"+o:""+o)+"期的累计发生额,以修正利润表本年累计金额(注：起始账期修改后,调整数据将会被清零)。";c.Alert(s)}})}},t.changeInitLrbAmount=function(e,t){return{type:r.CHANGE_INIT_LRB_AMOUNT,lineIndex:e,amount:t}},t.saveInitLrbFetch=function(){return function(e,t){var n=t().homeState.getIn(["data","userInfo"]).get("sobInfo"),i=t().homeState.getIn(["data","userInfo","sobInfo","newJr"]),r=!!n&&(n.get("moduleInfo").indexOf("RUNNING")>-1&&i),o=t().lrbState.get("initPeriodList");o=o.filter(function(e){return""!==e.get("amount")}),(0,f.default)(r?"incomeJrstatementinit":"incomestatementinit","POST",JSON.stringify({initPeriodList:o}),function(e){return(0,a.showMessage)(e,"show")})}},t.showInitLrb=function(e){return{type:r.SHOW_INIT_LRB,value:e}}),_=(t.clearInitLrb=function(){return{type:r.CLEAR_INIT_LRB}},t.getinitincomestatement=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"true";return function(i,u){i({type:r.SWITCH_LOADING_MASK});var c=u().homeState.getIn(["data","userInfo"]).get("sobInfo"),l=u().homeState.getIn(["data","userInfo","sobInfo","newJr"]),d=!!c&&(c.get("moduleInfo").indexOf("RUNNING")>-1&&l),E={};E=e?{begin:e?e.substr(0,4)+(d?"-":"")+e.substr(6,2):"",end:t?t.substr(0,4)+(d?"-":"")+t.substr(6,2):""+e.substr(0,4)+e.substr(6,2),getPeriod:n,needPeriod:n,referBegin:"",referEnd:""}:{getPeriod:"true",needPeriod:"true",begin:"",end:""},(0,f.default)(d?"getJrProfit":"getIncomestatementCustomize","POST",JSON.stringify(E),function(n){if((0,a.showMessage)(n)){var u=[],f=[],c=n.data.periodDtoJson?i(o.everyTableGetIssuedate(n.data.periodDtoJson)):"",l=n.data.result;for(var E in l)l[E].linename?u.push(l[E]):f.push(l[E]);i({type:r.GET_SELF_MADE_PROFIT_LIST,payload:u,extraMessage:f,issues:c});var S=i(d?s.reportGetIssuedateAndFreshPeriod(n):o.everyTableGetPeriod(n)),_=e||S,h=t||S;i({type:r.CHANGE_ISSUDATE,issuedate:_,endissuedate:h})}i({type:r.SWITCH_LOADING_MASK})})}},t.upDateChlidProfitList=function(e){return{type:r.UPDATE_CHILD_PROFIT_LIST,payload:e}},t.expandTable=function(e){return{type:r.EXPAND_TABLE,payload:e}},t.changeDifferType=function(e){return function(t){t({type:r.CHANGE_DIFFERENCE_TYPE,value:e})}},t.changeReferChooseValue=function(e){return function(t){t({type:r.SET_REFER_CHOOSE_VALUE,value:e})}},t.changeLrbString=function(e,t){return function(n){n({type:r.SET_LRB_COMMON_VALUE,name:e,value:t})}}),h=(t.getInitListFetch=function(e,t,n,i){var u=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"true";return function(c,l){c({type:r.SWITCH_LOADING_MASK});var d=l().homeState.getIn(["data","userInfo"]).get("sobInfo"),E=l().homeState.getIn(["data","userInfo","sobInfo","newJr"]),S=!!d&&(d.get("moduleInfo").indexOf("RUNNING")>-1&&E),_={begin:e?e.substr(0,4)+(S?"-":"")+e.substr(6,2):"",end:t?t.substr(0,4)+(S?"-":"")+t.substr(6,2):""+e.substr(0,4)+e.substr(6,2),referBegin:n?S?n.substr(0,4)+"-"+n.substr(4,2):n:"",referEnd:i?S?i.substr(0,4)+"-"+i.substr(4,2):i:"",getPeriod:u,needPeriod:u};(0,f.default)(S?"getJrProfit":"getSelfTypeListData","POST",JSON.stringify(_),function(u){if((0,a.showMessage)(u)){c({type:r.SWITCH_LOADING_MASK});var f=c(S?s.reportGetIssuedateAndFreshPeriod(u):o.everyTableGetPeriod(u)),l=_.begin?e:f,d=t||"",E=u.data.periodDtoJson?c(o.everyTableGetIssuedate(u.data.periodDtoJson)):"",I=[],T=[],L=u.data.result;for(var m in L)L[m].linename?I.push(L[m]):T.push(L[m]);c({type:r.SET_SELF_TYPE_LIST_DATA,selfListData:I,extraMessage:T,issues:E}),c({type:r.CHANGE_ISSUDATE,issuedate:l,endissuedate:d}),c(h(n||"",i||""))}})}},t.setReferDate=function(e,t){return function(n){n({type:r.SET_REFER_DATE,referBegin:e,referEnd:t})}}),I=(t.getExtraInformationList=function(e){return function(t,n){var i=n().homeState.getIn(["data","userInfo"]).get("sobInfo"),o=n().homeState.getIn(["data","userInfo","sobInfo","newJr"]),s=!!i&&(i.get("moduleInfo").indexOf("RUNNING")>-1&&o);(0,f.default)(s?"getJrExtraMessage":"getSelfTypeListExtraMessage","GET","",function(n){(0,a.showMessage)(n)&&(t({type:r.SET_LRB_COMMON_VALUE,name:"extraMessageList",value:(0,l.fromJS)(n.data)}),e())})}},t.setExtraMessageList=function(e,t){return function(n,i){var r=i().homeState.getIn(["data","userInfo"]).get("sobInfo"),o=i().homeState.getIn(["data","userInfo","sobInfo","newJr"]),s=!!r&&(r.get("moduleInfo").indexOf("RUNNING")>-1&&o);(0,f.default)(s?"setJrExtraMessageList":"setExtraMessageList","POST",JSON.stringify({messageList:e}),function(e){(0,a.showMessage)(e,"show")&&t()})}},t.getMeasureInitData=function(e,t){return function(n,i){var o=i().homeState.getIn(["data","userInfo"]).get("sobInfo"),s=i().homeState.getIn(["data","userInfo","sobInfo","newJr"]),u=!!o&&(o.get("moduleInfo").indexOf("RUNNING")>-1&&s);n({type:r.SWITCH_LOADING_MASK}),n({type:r.SHOW_MEASURE_RESULT,bool:!1});var c=i().lrbState.get("cannotChecked").toJS(),l=i().lrbState.get("haveSwitchList");(0,f.default)(u?"getJrMeasureList":"getMeasureList","POST",JSON.stringify({begin:e?e.substr(0,4)+(u?"-":"")+e.substr(6,2):"",end:t?t.substr(0,4)+(u?"-":"")+t.substr(6,2):e.substr(0,4)+(u?"-":"")+e.substr(5,2),referBegin:"",referEnd:"",needPeriod:"false"}),function(e){if(n({type:r.SWITCH_LOADING_MASK}),(0,a.showMessage)(e)){var t=e.data.result[0],i=e.data.result.find(function(e){return"业务利润"===e.linename.substr(-4,4)||"营业利润"===e.linename.substr(-4,4)}),o=e.data.result.findIndex(function(e){return"业务利润"===e.linename.substr(-4,4)||"营业利润"===e.linename.substr(-4,4)}),s=e.data.result.slice(1,o);!function e(t,n){return t.map(function(t){c.includes(t.linename)||(t.showChild=!1,t.checked=n,t.testMonthaccumulation=""+t.monthaccumulation.toFixed(2),t.testShareOfMonth=""+100*t.shareOfMonth),t.childProfit.length>0&&e(t.childProfit,!1),l.includes(t.linename)&&("管理费用"===t.linename?(t.testAmount=!1,t.childProfit.length>0&&t.childProfit.map(function(e){e.testAmount=!1})):(t.testAmount=!0,t.childProfit.length>0&&t.childProfit.map(function(e){e.testAmount=!0})))})}(s,!0),n({type:r.SET_MEASURE_INIT_DATA,incomeTotal:t,profit:i,detailList:s,checkedList:[],showChildList:[]}),n(_("calculatePage",!0))}})}},t.changeTestShareOfMonth=function(e,t){return function(n,i){var o=i().lrbState.get("detailList").toJS();!function n(i){return i.map(function(i,r){if((i.lineindex?i.lineindex:i.acId)===t?(i.testShareOfMonth=e,i.childProfit.length>0&&i.childProfit.map(function(e){e.checked=!1})):n(i.childProfit),i.childProfit.find(function(e){var n=e.lineindex?e.lineindex:e.acId;return t===n})){var o=0;i.childProfit.filter(function(e){return e.checked}).map(function(e,t){o+=Number(e.testShareOfMonth)}),i.testShareOfMonth=""+o}})}(o),n({type:r.UPDATE_MEASURE_DETAIL_LIST,detailList:o})}},t.changeTestMonthaccumulation=function(e,t){return function(n,i){var o=i().lrbState.get("detailList").toJS();!function n(i){return i.map(function(i,r){if((i.lineindex?i.lineindex:i.acId)===t?(i.testMonthaccumulation=e,i.childProfit.length>0&&i.childProfit.map(function(e){e.checked=!1})):n(i.childProfit),i.childProfit.find(function(e){var n=e.lineindex?e.lineindex:e.acId;return t===n})){var o=0;i.childProfit.filter(function(e){return e.checked}).map(function(e,t){o+=Number(e.testMonthaccumulation)}),i.testMonthaccumulation=""+o.toFixed(2)}})}(o),n({type:r.UPDATE_MEASURE_DETAIL_LIST,detailList:o})}},t.changeSwitchType=function(e){return function(t,n){var i=n().lrbState.get("detailList").toJS(),o=function e(t){return t.map(function(t,n){t.testAmount=!t.testAmount,t.testMonthaccumulation=""+t.monthaccumulation.toFixed(2),t.testShareOfMonth=""+100*t.shareOfMonth,t.childProfit.length>0&&e(t.childProfit)})};!function t(n){return n.map(function(n,i){n.linename===e?(n.testAmount=!n.testAmount,n.testMonthaccumulation=""+n.monthaccumulation.toFixed(2),n.testShareOfMonth=""+100*n.shareOfMonth,n.childProfit.length>0&&o(n.childProfit)):t(n.childProfit)})}(i),t({type:r.UPDATE_MEASURE_DETAIL_LIST,detailList:i})}},t.handleItemShow=function(e,t,n){return function(i,o){var s=o().lrbState.get("detailList").toJS();!function t(i){return i.map(function(i,r){(i.lineindex?i.lineindex:i.acId)===e&&(i.showChild=n),i.childProfit.length>0&&t(i.childProfit)})}(s),i({type:r.UPDATE_MEASURE_DETAIL_LIST,detailList:s}),i({type:r.SET_RESULT_SHOW_CHILD_LIST,resultShowChildItem:t})}}),T=t.handleItemChecked=function(e,t){return function(n,i){var o=i().lrbState.get("detailList").toJS(),s=function e(n){return n.map(function(n,i){n.checked=!t,n.childProfit.length>0&&e(n.childProfit)})};!function n(i){return i.map(function(i,r){var o=i.lineindex?i.lineindex:i.acId;if(o===e?(i.checked=!t,i.childProfit.length>0&&s(i.childProfit)):n(i.childProfit),i.childProfit.find(function(t){var n=t.lineindex?t.lineindex:t.acId;return e===n})){var a=0,u=0;i.childProfit.filter(function(e){return e.checked}).map(function(e,t){a+=Number(e.testShareOfMonth),u+=Number(e.testMonthaccumulation)}),i.testShareOfMonth=""+a,i.testMonthaccumulation=""+u.toFixed(2),0===i.childProfit.filter(function(e){return e.checked}).length?i.checked=!1:i.checked=!0}else if(o===e&&i.childProfit.length>0){var f=0,c=0;i.childProfit.filter(function(e){return e.checked}).map(function(e,t){f+=Number(e.testShareOfMonth),c+=Number(e.testMonthaccumulation)}),i.testShareOfMonth=""+f,i.testMonthaccumulation=""+c.toFixed(2)}})}(o),n({type:r.UPDATE_MEASURE_DETAIL_LIST,detailList:o})}},L=(t.handleItemShowAll=function(e,t){return function(n,i){!function e(i){i.map(function(i){var r=i.get("lineindex")?i.get("lineindex"):i.get("acId");i.get("childProfit")&&i.get("childProfit").size&&e(i.get("childProfit")),n(I(r,i.get("linename"),t)),n(t?T(r,!1):L(r,!1))})}(e.filter(function(e){return e.get("childProfit").size}))}},t.changeThisItemChecked=function(e,t){return function(n,i){var o=i().lrbState.get("detailList").toJS(),s=function e(n){return n.map(function(n,i){n.checked=t,n.childProfit.length>0&&e(n.childProfit)})};!function n(i){return i.map(function(i,r){(i.lineindex?i.lineindex:i.acId)===e?(i.checked=!t,i.testMonthaccumulation=""+i.monthaccumulation.toFixed(2),i.testShareOfMonth=""+100*i.shareOfMonth,i.childProfit.length>0&&s(i.childProfit)):n(i.childProfit)})}(o),n({type:r.UPDATE_MEASURE_DETAIL_LIST,detailList:o})}}),m=(t.startMeasure=function(e){return function(t,n){t("利润"===e?m():A())}},t.getMeasureProfitResult=function(){return function(e,t){var n=t().lrbState.get("detailList").toJS().filter(function(e){return!0===e.checked}),i=t().lrbState.get("amountInput"),o=[],s=[];n.map(function(e){!0===e.testAmount?s.push(e):o.push(e)});var a=Number(i),u=1,f=0;s.map(function(e){u-=Number(e.testShareOfMonth)/100}),o.map(function(e){f+=Number(e.testMonthaccumulation)});var c=a*u-f,l=t().lrbState.get("detailList").toJS().filter(function(e){return!0===e.checked});e({type:r.SET_MEASURE_RESULT,profitResult:c,ProfitAndLossResult:a,resultList:l})}}),A=t.getMeasureProfitAndLossResult=function(){return function(e,t){var n=t().lrbState.get("detailList").toJS().filter(function(e){return!0===e.checked}),i=t().lrbState.get("amountInput"),o=Number(i),s=[],a=[];n.map(function(e){!0===e.testAmount?a.push(e):s.push(e)});var u=Number(i),f=0;s.map(function(e){u+=Number(e.testMonthaccumulation)}),a.map(function(e){f+=Number(e.testShareOfMonth)});var c=u/(1-f/100),l=t().lrbState.get("detailList").toJS().filter(function(e){return!0===e.checked});e({type:r.SET_MEASURE_RESULT,profitResult:o,ProfitAndLossResult:c,resultList:l})}},g=(t.showMeasureResult=function(e){return function(t){t({type:r.SHOW_MEASURE_RESULT,bool:e})}},t.handleMeasureResultListShowChild=function(e,t){return function(n){n({type:r.HANDLE_MEASURE_RESULT_LIST_SHOW_CHILD,id:e,show:t})}});t.handleMeasureResultListShowChildAll=function(e,t){return function(n){var i=[];!function e(t){t.forEach(function(t){i.push(t.linename),t.childProfit.length&&e(t.childProfit)})}(e),i.map(function(e){return n(g(e,t))})}},t.deleteExtraMessage=function(e,t){return function(n,i){var r=i().homeState.getIn(["data","userInfo"]).get("sobInfo"),o=i().homeState.getIn(["data","userInfo","sobInfo","newJr"]),s=!!r&&(r.get("moduleInfo").indexOf("RUNNING")>-1&&o);(0,f.default)(s?"deleteJrExtraMessage":"deleteExtraMessage","POST",JSON.stringify({idList:e}),function(e){(0,a.showMessage)(e,"show")&&t()})}}},1605:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.SWITCH_LOADING_MASK="SWITCH_LOADING_MASK",t.INIT_LRB="INIT_LRB",t.BEFORE_GET_INCOME_STATEMENT_FETCH="BEFORE_GET_INCOME_STATEMENT_FETCH",t.CHANGE_SELECTASSID="CHANGE_SELECTASSID",t.CHANGE_ASSSELECTABLELIST="CHANGE_ASSSELECTABLELIST",t.CHANGE_ISSUDATE="CHANGE_ISSUDATE",t.CHANGE_INCOME_STATEMENT="CHANGE_INCOME_STATEMENT",t.CHANGE_LRB_RULE_MODAL="CHANGE_LRB_RULE_MODAL",t.GET_INIT_INCOMESTATEMENT="GET_INIT_INCOMESTATEMENT",t.CHANGE_INIT_LRB_AMOUNT="CHANGE_INIT_LRB_AMOUNT",t.CHANGE_LRB_CHOOSE_MORE_PERIODS="CHANGE_LRB_CHOOSE_MORE_PERIODS",t.SHOW_INIT_LRB="SHOW_INIT_LRB",t.CLEAR_INIT_LRB="CLEAR_INIT_LRB",t.CHANGE_LIST_TYPE="CHANGE_LIST_TYPE",t.GET_SELF_MADE_PROFIT_LIST="GET_SELF_MADE_PROFIT_LIST",t.UPDATE_CHILD_PROFIT_LIST="UPDATE_CHILD_PROFIT_LIST",t.EXPAND_TABLE="EXPAND_TABLE",t.CHANGE_DIFFERENCE_TYPE="CHANGE_DIFFERENCE_TYPE",t.SET_REFER_CHOOSE_VALUE="SET_REFER_CHOOSE_VALUE",t.SET_SELF_TYPE_LIST_DATA="SET_SELF_TYPE_LIST_DATA",t.SET_REFER_DATE="SET_REFER_DATE",t.SET_LRB_COMMON_VALUE="SET_LRB_COMMON_VALUE",t.SET_MEASURE_INIT_DATA="SET_MEASURE_INIT_DATA",t.SET_MEASURE_INIT_DATE="SET_MEASURE_INIT_DATE",t.SHOW_MEASURE_RESULT="SHOW_MEASURE_RESULT",t.UPDATE_MEASURE_DETAIL_LIST="UPDATE_MEASURE_DETAIL_LIST",t.SET_RESULT_SHOW_CHILD_LIST="SET_RESULT_SHOW_CHILD_LIST",t.SET_MEASURE_RESULT="SET_MEASURE_RESULT",t.HANDLE_MEASURE_RESULT_LIST_SHOW_CHILD="HANDLE_MEASURE_RESULT_LIST_SHOW_CHILD"},1688:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s,n=arguments[1];return((e={},o(e,r.INIT_LRB,function(){return s}),o(e,r.BEFORE_GET_INCOME_STATEMENT_FETCH,function(){return t}),o(e,r.CHANGE_SELECTASSID,function(){return t.set("selectAssId",n.selectAssId)}),o(e,r.CHANGE_ASSSELECTABLELIST,function(){return t.set("assSelectableList",(0,i.fromJS)(n.assSelectableList))}),o(e,r.CHANGE_ISSUDATE,function(){return t.set("issuedate",n.issuedate).set("endissuedate",n.endissuedate)}),o(e,r.CHANGE_INCOME_STATEMENT,function(){return t.set("incomestatement",(0,i.fromJS)(n.receivedData))}),o(e,r.CHANGE_LRB_RULE_MODAL,function(){return t.update("lrbRuleModal",function(e){return!e})}),o(e,r.GET_INIT_INCOMESTATEMENT,function(){var e=t.get("incomestatement"),r=n.receivedData.initPeriodList?n.receivedData.initPeriodList:[],o=[];return e.forEach(function(e){var t=e.get("lineindex"),n=e.get("linename"),i=r.find(function(e){return e.lineIndex===t}),s=i?i.amount:"";o.push({lineName:n,lineIndex:t,amount:s})}),t.set("initPeriodList",(0,i.fromJS)(o))}),o(e,r.CHANGE_INIT_LRB_AMOUNT,function(){var e=n.amount,i=n.lineIndex;return(/^[-\d]\d*\.?\d{0,2}$/g.test(e)||""===n.amount)&&(t=t.setIn(["initPeriodList",i-1,"amount"],e)),t}),o(e,r.CHANGE_LRB_CHOOSE_MORE_PERIODS,function(){return t.update("chooseperiods",function(e){return!e})}),o(e,r.SHOW_INIT_LRB,function(){return t.set("showInitLrb",n.value)}),o(e,r.CLEAR_INIT_LRB,function(){var e=t.get("initPeriodList");return e.map(function(t,n){e=e.setIn([n,"amount"],"")}),t.set("initPeriodList",e)}),o(e,r.CHANGE_LIST_TYPE,function(){return t.update("ifSelfMadeProfitList",function(e){return!e})}),o(e,r.GET_SELF_MADE_PROFIT_LIST,function(){return n.issues&&(t=t.set("issues",(0,i.fromJS)(n.issues))),t.set("selfMadeProfitList",(0,i.fromJS)(n.payload)).set("extraMessage",(0,i.fromJS)(n.extraMessage)).set("curReferValue","本年累计").set("referBegin","").set("referEnd","")}),o(e,r.UPDATE_CHILD_PROFIT_LIST,function(){var e=n.payload,r=t.get("showChildProfitList").toJS(),o=void 0;if(r.includes(e)){var s=r.findIndex(function(t,n){return t==e});r.splice(s,1),o=r}else o=r.concat(e);return t.set("showChildProfitList",(0,i.fromJS)(o))}),o(e,r.EXPAND_TABLE,function(){var e=[];function r(t){if(t.childProfit&&0!==t.childProfit.length){var n=0!==t.lineindex?t.lineindex:t.acId;for(var i in e.push(n),t.childProfit)r(t.childProfit[i])}}if(n.payload){var o=t.get("selfMadeProfitList").toJS();for(var s in o)r(o[s])}return t.set("showChildProfitList",(0,i.fromJS)(e))}),o(e,r.CHANGE_DIFFERENCE_TYPE,function(){return t.set("proportionDifference",n.value)}),o(e,r.SET_REFER_CHOOSE_VALUE,function(){return t.set("referChooseValue",n.value)}),o(e,r.SET_LRB_COMMON_VALUE,function(){return t.set(n.name,n.value)}),o(e,r.SET_SELF_TYPE_LIST_DATA,function(){return n.issues&&(t=t.set("issues",(0,i.fromJS)(n.issues))),t.set("selfMadeProfitList",(0,i.fromJS)(n.selfListData)).set("extraMessage",(0,i.fromJS)(n.extraMessage))}),o(e,r.SET_REFER_DATE,function(){return t.set("referBegin",n.referBegin).set("referEnd",n.referEnd)}),o(e,r.SET_MEASURE_INIT_DATA,function(){return t.set("incomeTotal",(0,i.fromJS)(n.incomeTotal)).set("profit",n.profit).set("detailList",(0,i.fromJS)(n.detailList)).set("checkedList",(0,i.fromJS)(n.checkedList)).set("showChildList",(0,i.fromJS)(n.showChildList)).set("resultShowChild",(0,i.fromJS)([]))}),o(e,r.SET_MEASURE_INIT_DATE,function(){return t.set("measureIssuedate",n.issuedate).set("measureIEndissuedate",n.endissuedate)}),o(e,r.UPDATE_MEASURE_DETAIL_LIST,function(){return t.set("detailList",(0,i.fromJS)(n.detailList))}),o(e,r.SET_RESULT_SHOW_CHILD_LIST,function(){var e=n.resultShowChildItem,r=t.get("resultShowChild").toJS(),o=void 0;if(r.includes(e)){var s=r.findIndex(function(t,n){return t===e});r.splice(s,1),o=r}else o=r.concat(e);return t.set("resultShowChild",(0,i.fromJS)(o))}),o(e,r.SET_MEASURE_RESULT,function(){return t.set("profitResult",n.profitResult).set("ProfitAndLossResult",n.ProfitAndLossResult).set("resultList",n.resultList)}),o(e,r.SHOW_MEASURE_RESULT,function(){var e=t.get("resultShowChild").toJS();return(e.includes("销售费用")||e.includes("管理费用")||e.includes("财务费用"))&&e.push("减：营业费用"),t.set("showResult",n.bool).set("resultListShowChildList",(0,i.fromJS)(e))}),o(e,r.HANDLE_MEASURE_RESULT_LIST_SHOW_CHILD,function(){var e=n.id,r=t.get("resultListShowChildList").toJS(),o=r;if(r.includes(e)&&!n.show){var s=r.findIndex(function(t,n){return t===e});r.splice(s,1),o=r}else!r.includes(e)&&n.show&&(o=r.concat(e));return t.set("resultListShowChildList",(0,i.fromJS)(o))}),e)[n.type]||function(){return t})()};var i=n(18),r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1605));function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var s=(0,i.fromJS)({issuedate:"",endissuedate:"",chooseperiods:!1,selectAssId:0,lrbRuleModal:!1,assSelectableList:[],issues:[],amountInput:0,incomestatement:[{balance:"",hashname:"",line:"",total:""}],initPeriodList:[],showInitLrb:!1,selfMadeProfitList:[],ifSelfMadeProfitList:!0,showChildProfitList:[],proportionDifference:"increaseDecreasePercent",referChooseValue:"本年累计",curReferValue:"本年累计",selfListData:[],extraMessage:[],referBegin:"",referEnd:"",extraMessageList:[],cannotChecked:["减：营业费用"],haveSwitchList:["减：营业成本","减：营业税金","销售费用","管理费用","财务费用"],cannotTestList:["减：营业费用"],resultShowChild:[],resultListShowChildList:[],checkedList:[],showChildList:[],detailList:[],resultList:[],calculType:"利润",incomeTotal:{}})}}]);