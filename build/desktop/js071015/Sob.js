(window.webpackJsonp=window.webpackJsonp||[]).push([[40],{1205:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var a=c(n(2698)),o=c(n(495)),l=c(n(499)),r=c(n(2701)),i=c(n(1769));function c(e){return e&&e.__esModule?e:{default:e}}var u={sobConfigState:o.default,sobOptionState:l.default,sobLogState:r.default,sobRoleState:i.default};t.reducer=u,t.view=a.default},1526:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Date,t={},n=""+e.getFullYear(),a=""+(e.getMonth()>8?e.getMonth()+1:"0"+(e.getMonth()+1)),o=""+(e.getDate()>=10?e.getDate():"0"+e.getDate()),l=""+(e.getHours()>=10?e.getHours():"0"+e.getHours()),r=""+(e.getMinutes()>=10?e.getMinutes():"0"+e.getMinutes()),i=""+(e.getSeconds()>=10?e.getSeconds():"0"+e.getSeconds());return t.year=n,t.month=a,t.day=o,t.hours=l,t.minutes=r,t.seconds=i,t.format=""+n+a+o+l+r+i,t.formatDayBegin=""+n+a+o+"000000",t.value=n+"-"+a+"-"+o+" "+l+":"+r+":"+i,t}},1527:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.SWITCH_LOADING_MASK="SWITCH_LOADING_MASK",t.SOB_OPTION_INIT="SOB_OPTION_INIT",t.SOB_OPTION_CHANGE_CONTENT="SOB_OPTION_CHANGE_CONTENT",t.SOB_OPTION_CHANGE_SOB_TEMPLATE="SOB_OPTION_CHANGE_SOB_TEMPLATE",t.SOB_OPTION_CHANGE_TIME="SOB_OPTION_CHANGE_TIME",t.SOB_OPTION_CHANGE_FUN_MODUEL="SOB_OPTION_CHANGE_FUN_MODUEL",t.SOB_OPTION_SAVE="SOB_OPTION_SAVE",t.SOB_OPTION_EDIT="SOB_OPTION_EDIT",t.SOB_OPTION_ROLE_CHECK_STATE="SOB_OPTION_ROLE_CHECK_STATE",t.SOB_OPTION_ROLE_DELETE="SOB_OPTION_ROLE_DELETE",t.GET_LOG_LIST_FETCH="GET_LOG_LIST_FETCH",t.CHANGE_LOG_CONFIG_COMMON_STRING="CHANGE_LOG_CONFIG_COMMON_STRING",t.GET_LOG_LIST_SELECT_LIST_FETCH="GET_LOG_LIST_SELECT_LIST_FETCH",t.CHANGE_SOB_PERMISSION_LIST="CHANGE_SOB_PERMISSION_LIST",t.INIT_SOB_LOG="INIT_SOB_LOG",t.CLEAR_HOME_TAB_PANE="CLEAR_HOME_TAB_PANE"},1591:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changeLogConfigCommonString=t.getLogListSelectListFetch=t.getChangeLogListPaginationFetch=t.getLogListFetch=void 0;var a=u(n(37));n(38);var o=u(n(31)),l=c(n(1527)),r=(n(18),n(22)),i=(c(n(30)),c(n(27)));c(n(60)),c(n(43));function c(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function u(e){return e&&e.__esModule?e:{default:e}}t.getLogListFetch=function(e,t){return function(n){n({type:l.SWITCH_LOADING_MASK});var a=e.begin?e.begin:"",c=e.end?e.end:"",u=e.searchType?e.searchType:"SEARCH_TYPE_ALL",d=e.searchContent?e.searchContent:"",f=e.backSobId?e.backSobId:"",p=e.currentPage?e.currentPage:1;(0,o.default)("operationTrafficList","GET","sobId="+f+"&from="+a+"&to="+c+"&keyword="+d+"&offset="+p+"&line="+i.LOG_PAGE_SIZE+"&searchType="+u,function(e){(0,r.showMessage)(e,"show")&&(n({type:l.GET_LOG_LIST_FETCH,receivedData:e.data,currentPage:p,begin:a,end:c,backSobId:f,pageCount:e.data.length>=i.LOG_PAGE_SIZE?p+1:p}),"init"===t&&(n(s("searchType","SEARCH_TYPE_ALL")),n(s("searchContent","")))),n({type:l.SWITCH_LOADING_MASK})})}},t.getChangeLogListPaginationFetch=function(e,t){return function(n){var c=e.begin?e.begin:"",u=e.end?e.end:"",s=e.searchType?e.searchType:"SEARCH_TYPE_ALL",d=e.searchContent?e.searchContent:"",f=e.backSobId?e.backSobId:"",p=e.currentPage?e.currentPage:1;n({type:l.SWITCH_LOADING_MASK}),(0,o.default)("operationTrafficList","GET","sobId="+f+"&from="+c+"&to="+u+"&keyword="+d+"&offset="+p+"&line="+i.LOG_PAGE_SIZE+"&searchType="+s,function(e){(0,r.showMessage)(e,"show")&&(0===e.data.length&&a.default.info("没有更多操作记录了"),n({type:l.GET_LOG_LIST_FETCH,receivedData:e.data,currentPage:p,begin:c,end:u,backSobId:f,pageCount:p<t?t:e.data.length>=i.LOG_PAGE_SIZE?p+1:t})),n({type:l.SWITCH_LOADING_MASK})})}},t.getLogListSelectListFetch=function(e){return function(t){(0,o.default)("operationUsersList","GET","sobId="+e,function(e){(0,r.showMessage)(e)&&t({type:l.GET_LOG_LIST_SELECT_LIST_FETCH,receivedData:e.data})})}};var s=t.changeLogConfigCommonString=function(e,t){return{type:l.CHANGE_LOG_CONFIG_COMMON_STRING,place:e,value:t}}},1768:function(e,t,n){},2698:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,o=T(n(100)),l=T(n(47)),r=T(n(61)),i=T(n(32)),c=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();n(99),n(46),n(79),n(51);var u=T(n(1)),s=(n(18),n(56)),d=n(31),f=(T(n(1526)),n(127),T(n(2699))),p=S(n(30)),_=T(n(1224)),O=T(n(1226)),b=S(n(60)),m=S(n(43)),E=S(n(1347)),g=S(n(103));function S(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function T(e){return e&&e.__esModule?e:{default:e}}n(1768);var I=(0,s.connect)(function(e){return e})(a=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.state={deleteModalShow:!1,inputValue:"",deleteSobName:"",deleteSobId:"",chooseModal:!1,demo:"ACCOUNTING_DEMO"},e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,u.default.Component),c(t,[{key:"componentDidMount",value:function(){this.props.dispatch(E.getSobList())}},{key:"shouldComponentUpdate",value:function(e,t){return this.props.allState!=e.allState||this.props.sobConfigState!=e.sobConfigState||this.props.homeState!=e.homeState||this.state!==t}},{key:"render",value:function(){var e=this,t=this.props,n=t.dispatch,a=(t.allState,t.sobConfigState),c=t.homeState,s=this.state,S=s.deleteModalShow,T=s.inputValue,I=s.deleteSobName,h=s.deleteSobId,L=s.chooseModal,C=s.demo,y=(c.getIn(["data","userInfo","newEquity"]),c.getIn(["data","userInfo","moduleInfo"])),N=!!y&&!(!y.get("GL")||!0!==y.get("GL")),v=a.get("sobList"),P="TRUE"===c.getIn(["data","userInfo","isAdmin"]),G="TRUE"===c.getIn(["data","userInfo","isFinance"]),M="TRUE"===c.getIn(["data","userInfo","isDdAdmin"]),A="TRUE"===c.getIn(["data","userInfo","isDdPriAdmin"]),w=c.getIn(["data","userInfo","emplID"]),H=c.getIn(["views","URL_POSTFIX"]),k=c.getIn(["views","isPlay"]),D=c.getIn(["data","userInfo"]),R=(D.get("sobInfo"),D.get("corpId"));return u.default.createElement(_.default,{type:"config-four",className:"sob-wrap"},u.default.createElement(O.default,null,u.default.createElement("div",{className:"flex-title-left"}),u.default.createElement("div",{className:"flex-title-right"},["ding50f34631d604e77935c2f4657eb6378f","ding75d2d8a9cfb940bf","dingcb3d1516c40fded835c2f4657eb6378f","ding9849431a8160211e"].indexOf(R)>-1?u.default.createElement(i.default,{type:"ghost",onClick:function(){window.location.href=d.ROOTURL+"/opt/desktop/app/index.html?isOV=true&corpid="+R}},"消息触达"):null,u.default.createElement(i.default,{style:{display:d.ROOTURL.indexOf("dtst.xfannix.com")>-1||d.ROOTURL.indexOf("dpre.xfannix.com")>-1?"":"none"},disabled:!P&&!G||!N,className:"creat-sob-btn title-right",onClick:function(){e.setState({chooseModal:!0})}},"创建测试账套"),u.default.createElement(r.default,{placement:"bottom",title:N?P||G?"":"请联系超级管理员或财务经理新建账套":"总账不可用"},u.default.createElement(i.default,{disabled:!P&&!G&&!M&&!A||!N,className:"add-sob-btn title-right",onClick:function(){n(g.sobOptionInit("",function(){n(b.addPageTabPane("ConfigPanes","SobOption","SobOption","账套新增")),n(b.addHomeTabpane("Config","SobOption","账套新增"))}))}},"创建新账套")),u.default.createElement(i.default,{className:"refresh-btn title-right",onClick:function(){n(m.closeConfigPage("账套设置")),n(E.getSobList())}},"刷新"),d.ROOT.indexOf("fannixddfe1.hz")>-1||d.ROOT.indexOf("fannixddfe0.hz")>-1?u.default.createElement(l.default,{title:"创建测试账套",visible:L,onCancel:function(){return e.setState({chooseModal:!1})},onOk:function(){n(b.createTestSob(history,C)),e.setState({chooseModal:!1})},maskClosable:!1,footer:null,width:"480px"},u.default.createElement("div",{className:"playground-center-wrap"},u.default.createElement("div",{className:"word-content"},u.default.createElement("p",null,"创建测试账套，请注意："),u.default.createElement("p",null,"1、每个公司共用一个体验环境，环境中已经预置了一些模拟的业务数据；",u.default.createElement("br",null),"2、数据每晚定时清空，切勿录入正式数据；",u.default.createElement("br",null),"3、有部分功能在体验环境中不能操作。",u.default.createElement("br",null))),u.default.createElement("div",{className:"help-btn-wrap"},u.default.createElement("div",{className:"help-btn-left"},u.default.createElement("h1",null,"智能版"),u.default.createElement("p",null,"无需会计基础，财务小白也能零门槛输出专业报表"),u.default.createElement("div",{className:"help-btn-click",onClick:function(){n(b.createTestSob(history,"SMART_DEMO")),e.setState({chooseModal:!1})}},"点击进入")),u.default.createElement("div",{className:"help-btn-right"},u.default.createElement("h1",null,"会计版"),u.default.createElement("p",null,"传统总账系统"),u.default.createElement("div",{className:"help-btn-click",onClick:function(){n(b.createTestSob(history,"ACCOUNTING_DEMO")),e.setState({chooseModal:!1})}},"点击进入"))))):"")),u.default.createElement("div",{className:"sob-list"},v.map(function(t,a){return u.default.createElement(f.default,{key:t.get("sobid"),item:t,index:a,dispatch:n,isFinance:G,isAdmin:P,emplID:w,beforeDeleteSob:function(t,n){e.setState({deleteSobId:t,deleteSobName:n,deleteModalShow:!0})},URL_POSTFIX:H,isPlay:k})})),u.default.createElement(l.default,{title:"删除账套",visible:S,onOk:function(){var t=/\s/g;T.replace(t,"")===I.replace(t,"")?n(E.deleteSobItemFetch([h])):p.Alert("账套删除失败，账套名称与勾选账套名称不匹配"),e.setState({deleteModalShow:!1}),e.setState({inputValue:""})},onCancel:function(){e.setState({deleteModalShow:!1}),e.setState({inputValue:""})},okText:"删除",cancelText:"取消"},u.default.createElement("p",{className:"pay-delete-text"},"确认删除吗？删除后数据将不可恢复哦"),u.default.createElement(o.default,{style:{width:300},placeholder:"请输入需要删除的账套名称",value:T,onChange:function(t){return e.setState({inputValue:t.target.value})}})))}}]),t}())||a;t.default=I},2699:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,o=b(n(61)),l=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();n(79);var r=b(n(1)),i=(n(18),n(17)),c=n(31),u=b(n(1526)),s=(O(n(27)),n(127)),d=O(n(60)),f=O(n(43)),p=O(n(1591)),_=O(n(103));function O(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function b(e){return e&&e.__esModule?e:{default:e}}n(1768);var m=(0,i.immutableRenderDecorator)(a=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.default.Component),l(t,[{key:"render",value:function(){var e=this.props,t=e.item,n=e.dispatch,a=e.isAdmin,l=e.emplID,i=e.beforeDeleteSob,O=e.URL_POSTFIX,b=e.isPlay,m=t.get("adminlist"),E=m.find(function(e){return e.get("emplId")===l}),g=a||E,S=a||E;return r.default.createElement("div",null,r.default.createElement("div",{className:"sob-info"},r.default.createElement("p",{className:"company-name"},t.get("sobname")),r.default.createElement("p",{className:"sob-time"},"起始账期：",t.get("firstyear"),"-",t.get("firstmonth")),r.default.createElement("p",{className:"sob-admin"},"总管理员：",m.map(function(e,n){return r.default.createElement("span",{key:n},e.get("name"),n===t.get("adminlist").size-1?"":"、")})),r.default.createElement("p",{className:"sob-fun"},"功能模块："),r.default.createElement("p",{className:"sob-fun-list"},t.getIn(["moduleInfo","nameList"]).toJS().splice(0,8).map(function(e,t){return r.default.createElement("label",{key:t},r.default.createElement("span",{className:"red-circle"}),e)}))),r.default.createElement("div",{className:"sob-btn"},r.default.createElement("div",{className:g?"":"not-limit"},g?r.default.createElement(o.default,{placement:"right",title:"删除"},r.default.createElement(s.XfnIcon,{type:"sob-delete",style:{fontSize:"20px"},onClick:function(){i(t.get("sobid"),t.get("sobname"))}})):r.default.createElement(o.default,{placement:"right",title:"联系账套管理员或超级管理员删除"},r.default.createElement(s.XfnIcon,{type:"sob-delete",style:{fontSize:"20px"}}))),r.default.createElement("div",{className:g?"":"not-limit",onClick:function(){if(g){n(_.sobOptionInit(t.get("sobid"),function(){n(d.addPageTabPane("ConfigPanes","SobOption","SobOption","账套编辑")),n(d.addHomeTabpane("Config","SobOption","账套编辑"))}))}}},r.default.createElement(o.default,{placement:"right",title:"编辑"},r.default.createElement(s.XfnIcon,{type:"sob-edit",style:{fontSize:"20px"}}))),r.default.createElement("div",{className:g&&!b?"":"not-limit"},b?r.default.createElement(o.default,{placement:"right",title:"体验模式下不能进行备份操作"},r.default.createElement(s.XfnIcon,{type:"sob-download",style:{fontSize:"20px"}})):g?r.default.createElement(s.ExportModal,{className:"sob-btn-download",title:"一键备份",tip:"导出内容为：科目、辅助核算、凭证、期初值",hrefUrl:c.ROOT+"/excel/export/all?"+O+"&sobid="+t.get("sobid"),ddCallback:function(e){return n(f.allExportReceiverlist(e,"excelsendall",{sobid:t.get("sobid")}))}},r.default.createElement(o.default,{placement:"right",title:"备份"},r.default.createElement(s.XfnIcon,{type:"sob-download",style:{fontSize:"20px"}}))):r.default.createElement(o.default,{placement:"right",title:"备份"},r.default.createElement(s.XfnIcon,{type:"sob-download",style:{fontSize:"20px"}}))),r.default.createElement("div",{className:S?"":"not-limit"},S?r.default.createElement(o.default,{placement:"right",title:"查看日志"},r.default.createElement(s.XfnIcon,{type:"log",onClick:function(){var e=(0,u.default)();n(p.getLogListFetch({begin:e.formatDayBegin,end:e.format,searchType:"SEARCH_TYPE_ALL",searchContent:"",backSobId:t.get("sobid"),currentPage:1},"init")),n(p.getLogListSelectListFetch(t.get("sobid"))),n(d.addPageTabPane("ConfigPanes","SobLog","SobLog","账套日志")),n(d.addHomeTabpane("Config","SobLog","账套日志"))}})):r.default.createElement(o.default,{placement:"right",title:"近期日志服务调整，暂不提供服务"},r.default.createElement(s.XfnIcon,{type:"log"})))))}}]),t}())||a;t.default=m},2701:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:r,n=arguments[1];return((e={},l(e,o.INIT_SOB_LOG,function(){return r}),l(e,o.GET_LOG_LIST_FETCH,function(){return t.setIn(["log","logList"],(0,a.fromJS)(n.receivedData)).setIn(["log","currentPage"],n.currentPage).setIn(["log","backSobId"],n.backSobId).setIn(["log","pageCount"],n.pageCount>=5?5:n.pageCount).set("beginData",n.begin).set("endData",n.end)}),l(e,o.CHANGE_LOG_CONFIG_COMMON_STRING,function(){return t.set(n.place,n.value)}),l(e,o.GET_LOG_LIST_SELECT_LIST_FETCH,function(){return t.set("operationList",(0,a.fromJS)(n.receivedData))}),e)[n.type]||function(){return t})()};var a=n(18),o=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1527));function l(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var r=(0,a.fromJS)({beginData:"",endData:"",searchType:"SEARCH_TYPE_ALL",searchContent:"",log:{showLog:!1,pageCount:0,currentPage:1,backSobId:"",logList:[]},operationList:[]})}}]);