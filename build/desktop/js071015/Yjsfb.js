(window.webpackJsonp=window.webpackJsonp||[]).push([[96],{1148:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var r=o(n(2111));function o(e){return e&&e.__esModule?e:{default:e}}var a={yjsfbState:o(n(2117)).default};t.reducer=a,t.view=r.default},1223:function(e,t,n){},1224:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o,a,u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=f(n(1)),l=f(n(0)),s=n(17);function f(e){return e&&e.__esModule?e:{default:e}}n(1223);var c=(0,s.immutableRenderDecorator)((a=o=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default.Component),u(t,[{key:"render",value:function(){var e=this.props,t=e.type,n=e.className,r=e.onClick;return i.default.createElement("div",{className:"container-wrap container-width-"+t+" "+n,onClick:r},this.props.children)}}]),t}(),o.displayName="ContainerWrap",o.propTypes={type:l.default.string.isRequired,className:l.default.string.isRequired},r=a))||r;t.default=c},1226:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),i=(o=u)&&o.__esModule?o:{default:o},l=n(17);n(1223);var s=(0,l.immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default.Component),a(t,[{key:"render",value:function(){return i.default.createElement("div",{className:"flex-title"},this.props.children)}}]),t}())||r;t.default=s},1227:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=f(n(176)),a=f(n(174)),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n(175),n(173);var i=f(n(1)),l=n(17),s=n(127);function f(e){return e&&e.__esModule?e:{default:e}}n(1232);var c=(0,l.immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default.Component),u(t,[{key:"render",value:function(){var e=this.props,t=e.pageItem,n=e.onClick,r=i.default.createElement(a.default,null,t.get("pageList").map(function(e,r){return i.default.createElement(a.default.Item,{key:e.get("key")},i.default.createElement("span",{className:"page-switch-item setting-common-ant-dropdown-menu-item",onClick:function(){n(t.get("key"),e.get("name"),e.get("key"))}},e.get("name")))}));return i.default.createElement("div",null,i.default.createElement(o.default,{overlay:r,trigger:["click"]},i.default.createElement("div",{className:"page-switch-button"},i.default.createElement(s.XfnIcon,{type:"Menu"}))))}}]),t}())||r;t.default=c},1232:function(e,t,n){},1689:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.handleShowChildList=t.changeSfbRuleModal=t.changeSjbChooseMorePeriods=t.getIncomeStatementSfbFetch=t.getPeriodAndIncomeStatementSfbFetch=void 0;var r,o=f(n(1690)),a=f(n(43)),u=f(n(102)),i=n(22),l=n(31),s=(r=l)&&r.__esModule?r:{default:r};function f(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}t.getPeriodAndIncomeStatementSfbFetch=function(e,t){return function(n,r){var o={};if(e){var a=r().homeState.getIn(["data","userInfo"]).get("sobInfo"),u=r().homeState.getIn(["data","userInfo","sobInfo","newJr"]),i=!!a&&(a.get("moduleInfo").indexOf("RUNNING")>-1&&u);o={begin:e.substr(0,4)+(i?"-":"")+e.substr(6,2),end:t.substr(0,4)+(i?"-":"")+t.substr(6,2),getPeriod:"true",needPeriod:"true"}}else o={getPeriod:"true",needPeriod:"true",begin:"",end:""};n(c(o,e,t))}};var c=function(e,t,n){return function(r,l){r({type:o.SWITCH_LOADING_MASK});var f=l().homeState.getIn(["data","userInfo"]).get("sobInfo"),c=l().homeState.getIn(["data","userInfo","sobInfo","newJr"]),d=!!f&&(f.get("moduleInfo").indexOf("RUNNING")>-1&&c);(0,s.default)(d?"getJrRate":"getYjsfbData","POST",JSON.stringify(e),function(e){if((0,i.showMessage)(e)){var l=r(d?u.reportGetIssuedateAndFreshPeriod(e):a.everyTableGetPeriod(e)),s=t||l,f=n||l,c=e.data.periodDtoJson?r(a.everyTableGetIssuedate(e.data.periodDtoJson)):"";r({type:o.GET_SFB_DATA,receivedData:e.data.dataList,issues:c}),r({type:o.CHANGE_SFB_ISSUDATE,issuedate:s,endissuedate:f})}else r({type:o.INIT_SJB});r({type:o.SWITCH_LOADING_MASK})})}};t.getIncomeStatementSfbFetch=function(e,t){arguments.length>2&&void 0!==arguments[2]&&arguments[2],arguments[3],arguments[4];return function(n,r){n({type:o.SWITCH_LOADING_MASK});var a=r().homeState.getIn(["data","userInfo"]).get("sobInfo"),u=r().homeState.getIn(["data","userInfo","sobInfo","newJr"]),l=!!a&&(a.get("moduleInfo").indexOf("RUNNING")>-1&&u),f=e.substr(0,4)+(l?"-":"")+e.substr(6,2),c=t.substr(0,4)+(l?"-":"")+t.substr(6,2);(0,s.default)(l?"getJrRate":"getYjsfbData","POST",JSON.stringify({begin:f,end:c}),function(r){(0,i.showMessage)(r)?(n({type:o.GET_SFB_DATA,receivedData:r.data.dataList}),n({type:o.CHANGE_SFB_ISSUDATE,issuedate:e,endissuedate:t}),n({type:o.SWITCH_LOADING_MASK})):(0,i.showMessage)(r)})}},t.changeSjbChooseMorePeriods=function(){return{type:o.CHANGE_SFB_CHOOSE_MORE_PERIODS}},t.changeSfbRuleModal=function(){return{type:o.CHANGE_SFB_RULE_MODAL}},t.handleShowChildList=function(e){return function(t){t({type:o.HANDLE_YJSFB_SHOW_CHILD_LIST,lineIndex:e})}}},1690:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.SWITCH_LOADING_MASK="SWITCH_LOADING_MASK",t.INIT_SJB="INIT_SJB",t.CHANGE_SFB_ISSUDATE="CHANGE_SFB_ISSUDATE",t.CHANGE_SFB_RULE_MODAL="CHANGE_SFB_RULE_MODAL",t.GET_SFB_DATA="GET_SFB_DATA",t.CHANGE_SFB_CHOOSE_MORE_PERIODS="CHANGE_SFB_CHOOSE_MORE_PERIODS",t.HANDLE_YJSFB_SHOW_CHILD_LIST="HANDLE_YJSFB_SHOW_CHILD_LIST"},2111:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=O(n(32)),a=O(n(37)),u=O(n(129)),i=O(n(45)),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n(51),n(38),n(128),n(55);var s=O(n(1)),f=(n(18),n(56)),c=S(n(1689)),d=S(n(43)),p=S(n(60)),b=O(n(1227)),m=n(22),y=O(n(2112)),_=O(n(2114)),h=n(31),g=n(127),v=O(n(1224)),E=O(n(1226));function S(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function O(e){return e&&e.__esModule?e:{default:e}}n(2115);var I=(0,f.connect)(function(e){return e})(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,s.default.Component),l(t,[{key:"componentDidMount",value:function(){this.props.dispatch(c.getPeriodAndIncomeStatementSfbFetch())}},{key:"shouldComponentUpdate",value:function(e){return this.props.allState!=e.allState||this.props.yjsfbState!=e.yjsfbState||this.props.homeState!=e.homeState}},{key:"render",value:function(){var e=this.props,t=e.yjsfbState,n=e.dispatch,r=e.allState,l=e.homeState,f=l.getIn(["data","userInfo","pageController","REPORT","preDetailList","TAX_PAYABLE_REPORT","detailList"]),S=t.get("initPeriodList"),O=t.get("issuedate"),I=t.get("sfbRuleModal"),w=l.getIn(["data","userInfo"]).get("sobInfo"),P=l.getIn(["data","userInfo","sobInfo","newJr"]),C=!!w&&(w.get("moduleInfo").indexOf("RUNNING")>-1&&P),T=C&&P?t.get("issues"):r.get("issues"),j=r.getIn(["period","firstyear"]),A=(r.getIn(["period","firstmonth"]),t.get("selectAssId")),N=t.get("endissuedate"),L=t.get("chooseperiods"),M=T.findIndex(function(e){return e===O}),R=O.substr(0,4),x=T.slice(0,M).filter(function(e){return 0===e.indexOf(R)}),k=""+O.substr(0,4)+O.substr(6,2),D=""+N.substr(0,4)+N.substr(6,2),H=O.substr(0,4)+"-"+O.substr(6,2),F=N.substr(0,4)+"-"+N.substr(6,2),G=l.get("pageList"),B=l.getIn(["views","isSpread"]),J=l.getIn(["views","URL_POSTFIX"]),U=l.getIn(["views","isPlay"]),W=l.getIn(["permissionInfo","Report"]),Y=t.get("showChildList");return s.default.createElement(v.default,{type:"report-one",className:"yjsfb"},s.default.createElement(E.default,null,s.default.createElement("div",{className:"flex-title-left"},B||G.getIn(["Report","pageList"]).size<=1?"":s.default.createElement(b.default,{pageItem:G.get("Report"),onClick:function(e,t,r){n(p.addPageTabPane("ReportPanes",r,r,t)),n(p.addHomeTabpane(e,r,t))}}),s.default.createElement(i.default,{className:"title-date",value:O,onChange:function(e){return n(c.getIncomeStatementSfbFetch(e,e,A))}},T.map(function(e,t){return s.default.createElement(i.default.Option,{key:t,value:e},e)})),s.default.createElement("span",{className:"title-checkboxtext",onClick:function(){L&&N!==O&&n(c.getIncomeStatementSfbFetch(O,O,A)),n(c.changeSjbChooseMorePeriods())}},s.default.createElement(u.default,{className:"title-checkbox",checked:L}),s.default.createElement("span",null,"至")),s.default.createElement(i.default,{disabled:!L,className:"title-date",value:N===O?"":N,onChange:function(e){return n(c.getIncomeStatementSfbFetch(O,e,A))}},x.map(function(e,t){return s.default.createElement(i.default.Option,{key:t,value:e},e)})),C?"":s.default.createElement("span",{className:"title-sfb-rule",onClick:function(){return n(c.changeSfbRuleModal())}},"应交税费表取值规则"),s.default.createElement(_.default,{sfbRuleModal:I,onCancel:function(){return n(c.changeSfbRuleModal())},onClick:function(){return n(c.changeSfbRuleModal())}})),s.default.createElement("div",{className:"flex-title-right"},s.default.createElement("span",{className:"title-right title-dropdown"},s.default.createElement(g.Export,{isAdmin:W.getIn(["exportExcel","permission"]),type:"first",exportDisable:!O||!W.getIn(["exportExcel","permission"])||U,excelDownloadUrl:C?h.ROOTJR+"/jr/excel/export/rate?"+J+"&begin="+H+"&end="+F:h.ROOT+"/excel/export/payTaxTable?"+J+"&start="+k+"&end="+D,ddExcelCallback:function(e){(0,m.judgePermission)(f.get("EXPORT_EXCEL")).disabled?a.default.info("当前角色无该请求权限"):n(d.allExportReceiverlist(e,C?"taxJrPayTableExcel":"taxPayTableExcel",{start:k,begin:C?H:k,end:C?F:D}))},onErrorSendMsg:function(e,t,r){n(d.sendMessageToDeveloper({title:"导出发送钉钉文件异常",message:"type:"+e+",valueFirst:"+t+",valueSecond:"+r,remark:"应交税费表"}))}})),s.default.createElement(o.default,{className:"title-right refresh-btn",type:"ghost",onClick:function(){n(c.getPeriodAndIncomeStatementSfbFetch(j?O:"NO_VALID_ISSUE_DATE",N,A)),n(d.freshReportPage("应交税费表"))}},"刷新"))),s.default.createElement(y.default,{initPeriodList:S,showChildList:Y,dispatch:n}))}}]),t}())||r;t.default=I},2112:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),a=s(n(1)),u=(n(18),n(17)),i=s(n(2113)),l=n(127);function s(e){return e&&e.__esModule?e:{default:e}}var f=(0,u.immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,a.default.Component),o(t,[{key:"render",value:function(){var e=this.props,t=e.initPeriodList,n=e.showChildList,r=e.dispatch;return a.default.createElement(l.TableWrap,{notPosition:!0},a.default.createElement(l.TableAll,null,a.default.createElement(l.TableTitle,{className:"sfb-table-width",titleList:["项目","本年累计金额","本期金额"]}),a.default.createElement(l.TableBody,null,(t||[]).map(function(e,t){return a.default.createElement(i.default,{sjItem:e,className:"sfb-table-width sfb-tabel-justify",key:t,idx:t,showChildList:n,dispatch:r})}))))}}]),t}())||r;t.default=f},2113:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),u=n(1),i=(o=u)&&o.__esModule?o:{default:o},l=(n(18),n(17)),s=n(127),f=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1689));var c=(0,l.immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default.Component),a(t,[{key:"paddingLeft",value:function(e){switch(e){case 1:return 0;case 2:return 18;case 3:return 54;case 4:return 66;default:return 24*(e-1)}}},{key:"render",value:function(){var e=this,t=this.props,n=t.sjItem,r=t.className,o=t.idx,a=t.showChildList,u=t.dispatch;return function t(n,l,c){if(n.get("payTaxList")&&n.get("payTaxList").size){var d=a.indexOf(n.get("lineIndex"))>-1,p=e.paddingLeft(n.get("level"));return i.default.createElement("div",{key:c},i.default.createElement(s.TableItem,{className:r,line:o+1},i.default.createElement(s.ItemTriangle,{textAlign:"left",isLink:!1,showTriangle:!0,showchilditem:d,onClick:function(e){e.stopPropagation(),u(f.handleShowChildList(n.get("lineIndex")))}},i.default.createElement("span",{style:{paddingLeft:p+"px"}},n.get("lineName"))),i.default.createElement("li",null,i.default.createElement(s.Amount,null,n.get("yearAmount"))),i.default.createElement("li",null,i.default.createElement(s.Amount,null,n.get("currentAmount")))),d&&n.get("payTaxList").map(function(e,n){return t(e,l+1,c+"_"+n)}))}var b=e.paddingLeft(n.get("level"));return i.default.createElement(s.TableItem,{className:r,line:o+1,key:c},i.default.createElement(s.TableOver,{textAlign:"left",isLink:!1},i.default.createElement("span",{style:{paddingLeft:b+"px"}},n.get("lineName"))),i.default.createElement("li",null,i.default.createElement(s.Amount,null,n.get("yearAmount"))),i.default.createElement("li",null,i.default.createElement(s.Amount,null,n.get("currentAmount"))))}(n,0,o)}}]),t}())||r;t.default=c},2114:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,o=l(n(47)),a=l(n(32)),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}();n(46),n(51);var i=l(n(1));n(18);function l(e){return e&&e.__esModule?e:{default:e}}var s=(0,n(17).immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default.Component),u(t,[{key:"render",value:function(){var e=this.props,t=e.sfbRuleModal,n=e.onCancel,r=e.onClick;return i.default.createElement(o.default,{okText:"保存",visible:t,maskClosable:!1,title:"应交税费表取值规则：",onCancel:n,footer:[i.default.createElement(a.default,{key:"cancel",type:"ghost",onClick:r},"关 闭")]},i.default.createElement("ul",{className:"uses-tip lrb-ruler-wrap"},i.default.createElement("li",{className:"uses-tip-dark"},"“增值税”下的“未交增值税”取数222101（应交增值税）、222102（未交增值税），“简易计税”取数222108，“转出金融商品增值税”取数222109，“代扣代交增值税”取数222110")))}}]),t}())||r;t.default=s},2115:function(e,t,n){},2117:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u,n=arguments[1];return((e={},a(e,o.INIT_SJB,function(){return u}),a(e,o.CHANGE_SFB_ISSUDATE,function(){return t.set("issuedate",n.issuedate).set("endissuedate",n.endissuedate)}),a(e,o.CHANGE_SFB_RULE_MODAL,function(){return t.update("sfbRuleModal",function(e){return!e})}),a(e,o.GET_SFB_DATA,function(){return n.issues&&(t=t.set("issues",(0,r.fromJS)(n.issues))),t.set("initPeriodList",(0,r.fromJS)(n.receivedData))}),a(e,o.CHANGE_SFB_CHOOSE_MORE_PERIODS,function(){return t.update("chooseperiods",function(e){return!e})}),a(e,o.HANDLE_YJSFB_SHOW_CHILD_LIST,function(){var e=n.lineIndex,o=t.get("showChildList").toJS(),a=void 0;if(o.includes(e)){var u=o.findIndex(function(t,n){return t==e});o.splice(u,1),a=o}else a=o.concat(e);return console.log(a),t.set("showChildList",(0,r.fromJS)(a))}),e)[n.type]||function(){return t})()};var r=n(18),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1690));function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u=(0,r.fromJS)({issuedate:"",endissuedate:"",chooseperiods:!1,sfbRuleModal:!1,initPeriodList:[],showChildList:[],issues:[]})}}]);