(window.webpackJsonp=window.webpackJsonp||[]).push([[44],{1035:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var a=o(n(2593));function o(e){return e&&e.__esModule?e:{default:e}}var c={accountConfigState:o(n(1261)).default};t.reducer=c,t.view=a.default},1064:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.taxRateList=[{key:"2%",value:2},{key:"3%",value:3},{key:"4%",value:4},{key:"5%",value:5},{key:"6%",value:6},{key:"9%",value:9},{key:"10%",value:10},{key:"11%",value:11},{key:"12%",value:12},{key:"13%",value:13},{key:"16%",value:16},{key:"17%",value:17}],t.smallTaxRateList=[{key:"2%",value:2},{key:"3%",value:3},{key:"5%",value:5}],t.runningType={LX_SR:"收入",LX_ZC:"支出",LX_JZCB:"结转成本",LX_CBTH:"成本退回",LX_ZZS_YKP:"已开发票",LX_ZZS_WKP:"未开发票",LX_ZZS_YRZ:"已认证发票",LX_ZZS_WRZ:"未认证发票",LX_TSSF_YKP:"已开发票",LX_TSSF_WKP:"未开发票",LX_TGSF_YRZ:"已认证发票",LX_TGSF_WRZ:"未认证发票",LX_YYSR:"营业收入",LX_PP:"预收款",LX_ZZS:"增值税",LX_YYTS:"退售",LX_TSSF:"退售税费",LX_ARHX:"应收核销",LX_PPHX:"预收核销",LX_TSHX:"退售核销",LX_YYZC:"营业支出",LX_AP:"预付款",LX_ADV:"应付款",LX_YYTG:"退购",LX_TGSF:"退购税费",LX_APHX:"应付核销",LX_ADVHX:"预付核销",LX_TGHX:"退购核销",LX_FYZC:"费用支出",LX_JTGZXJ:"计提工资",LX_GZXJZC:"工资支出",LX_DKGJJ:"代扣公积金",LX_DKSHBX:"代扣社保",LX_DKSDS:"代扣所得税",LX_JTSB:"计提社保",LX_SBZC:"社保支出",LX_DJSB:"代缴社保",LX_JTGJJ:"计提公积金",LX_GJJZC:"公积金支出",LX_DJGJJ:"代缴公积金",LX_FLFZC:"福利费支出",LX_JTQTXC:"计提其他薪酬",LX_QTXC:"其他薪酬支出",LX_YJSF:"预交税费",LX_ZZSZC:"增值税支出",LX_YJDK:"预交抵扣",LX_ZCSDS:"转出所得税",LX_SDSZC:"所得税支出",LX_JTSF:"计提税费",LX_QTSFZC:"其他税费支出",LX_YYWSR:"营业外收入",LX_YYWZC:"营业外支出",LX_ZSKX:"暂收款项",LX_ZSHX:"暂收核销",LX_ZFKX:"暂付款项",LX_ZFHX:"暂付核销",LX_ZCGJ:"资产购进",LX_ZCCZ:"资产处置",LX_JZSY:"处置损益",LX_QDJK:"取得借款",LX_CHLX:"偿还利息",LX_CHBJ:"偿还本金",LX_DWTZ:"对外投资",LX_QDSY:"取得收益",LX_SHTZ:"收回投资",LX_ZZ:"增资",LX_LRFP:"利润分配",LX_JZ:"减资",LX_JZSY_SY:"结转收益",LX_JZSY_SS:"结转损失",LX_JZSY_ZCYZ:"资产原值",LX_JZSY_ZJTX:"累计折旧摊销",LX_JZSY_SJGZ:"升级改造",LX_JZSY_QLSR:"清理收入",LX_FPRZ_CG:"采购发票认证",LX_FPRZ_TG:"退购发票认证",LX_KJFP_XS:"销售开票",LX_KJFP_TS:"退售开票",LX_ZCWJZZS:"转出未交税费",LX_ZFLR:"支付利润",LX_TZ_JTGL:"计提股利",LX_TZ_SRGL:"收入股利",LX_TZ_JTLX:"计提利息",LX_TZ_SRLX:"收入利息",LX_JK_JTLX:"计提利息",LX_JK_ZFLX:"支付利息",LX_NBZZ:"内部转账",LX_NBZR:"内部转账-转入",LX_NBZC:"内部转账-转出",LX_GRSFZC:"个人税费支出",LX_XMGGFYFT:"费用分摊",LX_ZJTX:"折旧摊销"}},1084:function(e,t,n){},1261:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.accountConfigActions=t.ActionTypes=void 0,t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:p,n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return((e={},d(e,g.INIT_ACCOUNT_SETTING,p),d(e,g.ACCOUNT_SETTING_POUNDAGE,function(){if("insert"==n.flags)return t.set("poundageData",p.get("poundageData"));var e=n.data,a=t.getIn(["poundageData","flags"]),o=!1,c=!1;return"modify"==n.flags&&(a="modify",e.beProject&&(c=t.getIn(["poundageData","poundageNeedProject"])),e.acCost.contactsManagement&&(o=t.getIn(["poundageData","poundageNeedCurrent"]))),t.setIn(["poundageData","categoryUuid"],e.uuid).setIn(["poundageData","categoryName"],e.name).setIn(["poundageData","beProject"],e.beProject).setIn(["poundageData","contactsManagement"],e.acCost.contactsManagement).setIn(["poundageData","poundageNeedCurrent"],o).setIn(["poundageData","poundageNeedProject"],c).setIn(["poundageData","flags"],a)}),d(e,g.CHANGE_ACCOUNT_SETTING_DATA,function(){return"insert"==n.value&&(t=t.set("data",p.get("data")).setIn(["views","fromPage"],"account")),t.setIn(n.dataType,n.value)}),d(e,g.BEFOR_ADD_ACCONT_FROM_EDIT_RUNNING,function(){return"insert"==n.value&&(t=t.set("data",p.get("data")).setIn(["views","fromPage"],"editRunning")),t.setIn(n.dataType,n.value)}),d(e,g.ACCOUNT_SETTING_MIDIFY,function(){return t.set("data",n.item).setIn(["views","flags"],"modify").setIn(["views","fromPage"],"account")}),e)[n.type]||function(){return t})()};var a,o=n(9),c=n(124),l=(a=c)&&a.__esModule?a:{default:a},u=f(n(25)),r=n(13),i=(f(n(1064)),f(n(10))),s=f(n(185));function f(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function d(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var p=(0,o.fromJS)({views:{flags:"insert",fromPage:"account"},data:{beginAmount:"",openingName:"",name:"",openingBank:"",accountNumber:"",openInfo:!1,type:"general",uuid:"",acFullName:"",acId:"",assCategoryList:[],canUse:!0,needPoundage:!1,poundage:"",poundageRate:""},poundageData:{flags:"insert",categoryUuid:"",categoryName:"请选择处理类别",beProject:!1,contactsManagement:!1,poundageNeedCurrent:!1,poundageNeedProject:!1},regret:{regretList:[]}});var g=t.ActionTypes={ACCOUNT_SETTING_POUNDAGE:"ACCOUNT_SETTING_POUNDAGE",CHANGE_ACCOUNT_SETTING_DATA:"CHANGE_ACCOUNT_SETTING_DATA",BEFOR_ADD_ACCONT_FROM_EDIT_RUNNING:"BEFOR_ADD_ACCONT_FROM_EDIT_RUNNING",ACCOUNT_SETTING_MIDIFY:"ACCOUNT_SETTING_MIDIFY",INIT_ACCOUNT_SETTING:"INIT_ACCOUNT_SETTING"},m=t.accountConfigActions={getCardDetail:function(e,t){return function(n,a){i.toast.loading(u.LOADING_TIP_TEXT,0),(0,l.default)("getRunningDetail","GET","uuid="+e,function(e){i.toast.hide(),(0,r.showMessage)(e)&&n({type:g.ACCOUNT_SETTING_POUNDAGE,data:e.data.result,flags:t})})}},accountSettingMidify:function(e){return{type:g.ACCOUNT_SETTING_MIDIFY,item:e}},changeAccountSettingData:function(e,t){return{type:g.CHANGE_ACCOUNT_SETTING_DATA,dataType:e,value:t}},saveAccountPoundage:function(e){return function(t,n){var a=n().accountConfigState,o=a.getIn(["poundageData","flags"]),c=a.getIn(["poundageData","categoryUuid"]),s=a.getIn(["poundageData","poundageNeedCurrent"]),f=a.getIn(["poundageData","poundageNeedProject"]);i.toast.loading(u.LOADING_TIP_TEXT,0),(0,l.default)(o+"AccountPoundage","POST",JSON.stringify({categoryUuid:c,poundageNeedCurrent:s,poundageNeedProject:f}),function(t){i.toast.hide(),(0,r.showMessage)(t,"show")&&e.goBack()})}},getAccountPoundage:function(){return function(e){(0,l.default)("getAccountPoundage","GET","",function(t){(0,r.showMessage)(t)&&(t.data.canUsed&&t.data.uuid?(e(m.changeAccountSettingData(["poundageData","poundageNeedProject"],t.data.poundageNeedProject)),e(m.changeAccountSettingData(["poundageData","poundageNeedCurrent"],t.data.poundageNeedCurrent)),e(m.getCardDetail(t.data.categoryUuid,"modify"))):e({type:g.ACCOUNT_SETTING_POUNDAGE,flags:"insert"}),!t.data.canUsed&&t.data.uuid&&(i.Alert("处理类别失效，请重新选择"),e(m.changeAccountSettingData(["poundageData","flags"],"modify"))))})}},getRegretList:function(){return function(e){i.toast.loading(u.LOADING_TIP_TEXT,0),(0,l.default)("getAccountRegretList","GET","",function(t){i.toast.hide(),(0,r.showMessage)(t)&&(t.data.accountRegretList.forEach(function(e){e.key=e.name,e.value=e.uuid}),e(m.changeAccountSettingData(["regret","regretList"],(0,o.fromJS)(t.data.accountRegretList))))})}},accountRegret:function(e,t){return function(n){i.toast.loading(u.LOADING_TIP_TEXT,0),(0,l.default)("accountRegret","POST",JSON.stringify(e),function(e){i.toast.hide(),(0,r.showMessage)(e,"show")&&(t.goBack(),n(s.getRunningAccount()))})}}}},1469:function(e,t,n){},2593:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),o=f(n(0)),c=(n(9),n(16)),l=n(125),u=f(n(2594)),r=f(n(2595)),i=f(n(2596)),s=f(n(2597));function f(e){return e&&e.__esModule?e:{default:e}}var d=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),a(t,[{key:"render",value:function(){return o.default.createElement(c.Container,null,o.default.createElement(l.Route,{path:"/config/account/index",component:u.default}),o.default.createElement(l.Route,{path:"/config/account/card/edit",component:r.default}),o.default.createElement(l.Route,{path:"/config/account/poundage",component:i.default}),o.default.createElement(l.Route,{path:"/config/account/regret",component:s.default}))}}]),t}();t.default=d},2594:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,o,c,l=h(n(1250)),u=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}();n(1251);var r=h(n(0)),i=h(n(2)),s=n(31),f=n(9);n(1084),n(1469);var d=n(16),p=y(n(10)),g=n(1261),m=y(n(185));function y(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function h(e){return e&&e.__esModule?e:{default:e}}function _(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}var v=l.default.Item,E=(0,s.connect)(function(e){return e})((c=o=function(e){function t(e){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var n=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this,e));return n.scrollerHeight=0,n.listHeight=50,n.listHtml="",n.state={isDelete:!1,deleteList:[],isChangePoistion:!1,showIdx:-1,currentPage:1},n}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.default.Component),u(t,[{key:"componentDidMount",value:function(){p.setTitle({title:"账户设置"}),p.setIcon({showIcon:!1}),p.setRight({show:!1}),"home"===sessionStorage.getItem("prevPage")&&(sessionStorage.removeItem("prevPage"),this.props.dispatch(m.getRunningAccount()));var e=document.getElementsByClassName("scroll-view")[0],t=document.getElementsByClassName("list-html")[0];this.scrollViewHtml=e,this.scrollerHeight=Number(window.getComputedStyle(e).height.replace("px","")),t&&(this.listHtml=t,this.listHeight=t?Number(window.getComputedStyle(t).height.replace("px","")):50)}},{key:"closeMask",value:function(){document.getElementsByClassName("scroll-view")[0].style.overflowY="auto",this.setState({showIdx:-1})}},{key:"render",value:function(){var e=this,t=this.props,n=t.dispatch,a=t.accountConfigState,o=t.homeState,c=t.allState,u=t.history,i=this.state,s=i.isDelete,y=i.deleteList,h=i.isChangePoistion,E=i.showIdx,C=i.currentPage;console.log("AccountConfig");var S=o.getIn(["permissionInfo","Config"]).getIn(["edit","permission"]),b=(a.getIn(["views","flags"]),c.get("accountList")),I=[],T=0;b.size&&(T=b.getIn([0,"childList"]).size,I=(0,f.fromJS)([].concat(_(b.getIn([0,"childList"])),_(b.getIn([0,"disableList"])))));var w=Math.ceil(I.size/50);return r.default.createElement(d.Container,{className:"account-config"},r.default.createElement(d.ScrollView,{flex:"1",className:"border-top",onScroll:function(t){t.target.scrollTop+100+e.scrollerHeight>=C*e.listHeight*50&&C<w&&e.setState({currentPage:C+1})}},I.slice(0,50*C).map(function(t,a){var o=[],c=a>0?b.getIn([0,"childList",a-1,"uuid"]):"",i=a<T-1?b.getIn([0,"childList",a+1,"uuid"]):"";return c&&o.push(r.default.createElement(v,{key:"3",value:"up"},"上移")),i&&o.push(r.default.createElement(v,{key:"4",value:"down"},"下移")),r.default.createElement("div",{className:0==a?"config-list-item-wrap-style list-html":"config-list-item-wrap-style",key:t.get("uuid"),onClick:function(){if(!h)if(s){var a=y.findIndex(function(e){return e===t.get("uuid")});a>-1?(y.splice(a,1),e.setState({deleteList:y})):(y.push(t.get("uuid")),e.setState({deleteList:y}))}else n(g.accountConfigActions.accountSettingMidify(t)),u.push("/config/account/card/edit")}},r.default.createElement("div",{className:"config-list-item-style"},r.default.createElement("span",{className:"config-list-item-checkbox-style",style:{display:s?"":"none"}},r.default.createElement(d.Checkbox,{className:"checkbox",checked:y.indexOf(t.get("uuid"))>-1})),r.default.createElement("span",{style:{display:h&&t.get("canUse")&&(c||i)?"":"none"}},r.default.createElement(l.default,{visible:E==a,overlay:o,align:{overflow:{adjustY:0,adjustX:0},offset:[1,0]},placement:"bottomLeft",onSelect:function(a){switch(a.props.value){case"up":n(m.swapItem(t.get("uuid"),c));break;case"down":n(m.swapItem(t.get("uuid"),i))}e.closeMask()}},r.default.createElement("span",{style:{marginRight:".04rem"}},r.default.createElement(d.Icon,{onClick:function(){e.setState({showIdx:a}),document.getElementsByClassName("scroll-view")[0].style.overflowY="hidden"},type:"swap-position",color:"#5d81d1",size:"18"})))),r.default.createElement("span",{className:"config-list-item-info-style"},t.get("name")),r.default.createElement("span",{className:"config-list-item-arrow-style"},r.default.createElement(d.Icon,{type:"arrow-right"}))))}),r.default.createElement("div",{className:"choose-type",style:{display:-1==E?"none":"block"},onClick:function(t){t.stopPropagation(),e.closeMask()}})),r.default.createElement(d.ButtonGroup,null,r.default.createElement(d.Button,{disabled:!S,style:{display:s||h?"none":""},onClick:function(){n(g.accountConfigActions.changeAccountSettingData(["views","flags"],"insert")),u.push("/config/account/card/edit")}},r.default.createElement(d.Icon,{type:"add-plus",size:"15"}),r.default.createElement("span",null,"新增")),r.default.createElement(d.Button,{disabled:!S,style:{display:s||h?"none":""},onClick:function(){e.setState({isDelete:!0})}},r.default.createElement(d.Icon,{type:"select",size:"15"}),r.default.createElement("span",null,"选择")),r.default.createElement(d.Button,{disabled:!S,style:{display:s||h?"none":""},onClick:function(){e.setState({isChangePoistion:!0})}},r.default.createElement(d.Icon,{type:"swap",size:"12"}),r.default.createElement("span",null,"调整顺序")),r.default.createElement(d.Button,{disabled:!S,style:{display:s||h?"none":""},onClick:function(){p.actionSheet({title:"更多",cancelButton:"取消",otherButtons:["手续费设置","反悔模式"],onSuccess:function(e){-1==e.buttonIndex||e.buttonIndex>=2||(0===e.buttonIndex?u.push("/config/account/poundage"):1===e.buttonIndex&&u.push("/config/account/regret"))}})}},r.default.createElement(d.Icon,{type:"more",size:"15"}),r.default.createElement("span",null,"更多")),r.default.createElement(d.Button,{disabled:!S,style:{display:s||h?"":"none"},onClick:function(){e.setState({isDelete:!1,isChangePoistion:!1,showIdx:-1})}},r.default.createElement(d.Icon,{type:"cancel",size:"15"}),r.default.createElement("span",null,"取消")),r.default.createElement(d.Button,{disabled:!y.length||!S,style:{display:s?"":"none"},onClick:function(){n(m.deleteAccountSetting(y,function(){return e.setState({deleteList:[]})}))}},r.default.createElement(d.Icon,{type:"delete",size:"15"}),r.default.createElement("span",null,"删除"))))}}]),t}(),o.displayName="AccountConfig",o.propTypes={allState:i.default.instanceOf(f.Map),homeState:i.default.instanceOf(f.Map),accountConfigState:i.default.instanceOf(f.Map),dispatch:i.default.func,history:i.default.object},a=c))||a;t.default=E},2595:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,o,c,l=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),u=h(n(0)),r=h(n(2)),i=n(31),s=n(9);n(1084);var f=n(16),d=y(n(10)),p=n(13),g=n(1261),m=y(n(185));function y(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function h(e){return e&&e.__esModule?e:{default:e}}var _=f.Form.Item,v=(0,i.connect)(function(e){return e})((c=o=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,u.default.Component),l(t,[{key:"componentDidMount",value:function(){"insert"===this.props.accountConfigState.getIn(["views","flags"])?d.setTitle({title:"新增账户"}):d.setTitle({title:"修改账户"}),d.setIcon({showIcon:!1}),d.setRight({show:!1})}},{key:"render",value:function(){var e=this.props,t=e.dispatch,n=e.accountConfigState,a=e.homeState,o=e.allState,c=e.history;console.log("AccountConfigOption");a.getIn(["permissionInfo","Config"]).getIn(["edit","permission"]);var l=n.getIn(["views","flags"]),r=n.getIn(["views","fromPage"]),i="account"!==r;i&&a.getIn(["permissionInfo","LrAccount"]).getIn(["edit","permission"]);var s=n.get("data"),y=o.getIn(["views","isCheckOut"]),h=s.get("type"),v={cash:"现金",general:"一般户",basic:"基本户",Alipay:"支付宝",WeChat:"微信",other:"其它",spare:"备用金"}[h],E=s.get("openInfo"),C=s.get("canUse"),S=s.get("needPoundage"),b=s.get("poundage"),I=s.get("poundageRate"),T="modify"==l&&y&&s.get("beginAmount");return u.default.createElement(f.Container,{className:"account-config"},u.default.createElement(f.ScrollView,{flex:"1",className:"border-top"},u.default.createElement(f.Form,null,u.default.createElement(_,{label:"账户名称",showAsterisk:!0,className:"config-form-item-input-style"},u.default.createElement(f.XfInput,{placeholder:"填写账户名称",value:s.get("name"),onChange:function(e){t(g.accountConfigActions.changeAccountSettingData(["data","name"],e))}})," ",u.default.createElement(f.Icon,{type:"arrow-right",size:"14"})),u.default.createElement(_,{label:"账户类型",showAsterisk:!0},u.default.createElement(f.Single,{disabled:T,district:[{key:"现金",value:"cash"},{key:"一般户",value:"general"},{key:"基本户",value:"basic"},{key:"备用金",value:"spare"},{key:"支付宝",value:"Alipay"},{key:"微信",value:"WeChat"},{key:"其它",value:"other"}],value:h,onOk:function(e){t(g.accountConfigActions.changeAccountSettingData(["data","type"],e.value)),["cash","spare"].includes(e.value)&&(t(g.accountConfigActions.changeAccountSettingData(["data","openInfo"],!1)),"spare"==e.value&&t(g.accountConfigActions.changeAccountSettingData(["data","needPoundage"],!1)))}},u.default.createElement(f.Row,{onClick:function(e){if(T)return e.stopPropagation(),d.Alert("账套已结账且存在期初值，请通过反悔模式进行修改")},className:T?"config-form-item-select-item config-form-item-disabled":"config-form-item-select-item"},v))," ",u.default.createElement(f.Icon,{type:"arrow-right",size:"14"})),u.default.createElement(_,{label:"期初余额",className:"config-form-item-input-style"},u.default.createElement(f.XfInput,{mode:"amount",negativeAllowed:!0,placeholder:y?"已结账，不可更改":"填写期初余额",disabled:y,value:s.get("beginAmount"),onChange:function(e){t(g.accountConfigActions.changeAccountSettingData(["data","beginAmount"],e))}})," ",u.default.createElement(f.Icon,{type:"arrow-right",size:"14"})),u.default.createElement(_,{label:"启用账户手续费",style:{display:"spare"==h?"none":""}},u.default.createElement("span",{className:"noTextSwitchShort"},u.default.createElement(f.Switch,{checked:S,onClick:function(){t(g.accountConfigActions.changeAccountSettingData(["data","needPoundage"],!S))}}))),u.default.createElement(_,{label:"费用比率",className:"poundageRate",style:{display:S?"":"none"}},u.default.createElement("span",{className:"left"}),u.default.createElement(f.XfInput.BorderInputItem,{mode:"amount",value:I,onChange:function(e){if("-"==e||e<0)return d.Alert("费用比率不能为负");t(g.accountConfigActions.changeAccountSettingData(["data","poundageRate"],e))}})," ‰"),u.default.createElement(_,{label:"费用上限",className:"config-form-item-input-style",style:{display:S?"":"none"}},u.default.createElement(f.XfInput,{mode:"amount",placeholder:"请输入手续费金额上限",value:-1==b?"":b,onChange:function(e){if("-"==e)return d.Alert("费用上限不能为负");t(g.accountConfigActions.changeAccountSettingData(["data","poundage"],e))}})," ",u.default.createElement(f.Icon,{type:"arrow-right",size:"14"})),u.default.createElement(_,{label:"账户信息",className:"form-offset-up",style:{display:["cash","spare"].includes(h)?"none":""}},u.default.createElement("div",{className:"noTextSwitchShort"},u.default.createElement(f.Switch,{checked:E,onClick:function(){t(E?g.accountConfigActions.changeAccountSettingData(["data","openInfo"],!1):g.accountConfigActions.changeAccountSettingData(["data","openInfo"],!0))}}))),u.default.createElement(_,{label:"账号",className:"config-form-item-input-style",style:{display:E?"":"none"}},u.default.createElement(f.XfInput,{placeholder:"请输入账户号码",value:s.get("accountNumber"),onChange:function(e){t(g.accountConfigActions.changeAccountSettingData(["data","accountNumber"],e))}})," ",u.default.createElement(f.Icon,{type:"arrow-right",size:"14"})),u.default.createElement(_,{label:"开户名",className:"config-form-item-input-style",style:{display:E?"":"none"}},u.default.createElement(f.XfInput,{placeholder:"请输入账户的开户名称",value:s.get("openingName"),onChange:function(e){t(g.accountConfigActions.changeAccountSettingData(["data","openingName"],e))}})," ",u.default.createElement(f.Icon,{type:"arrow-right",size:"14"})),u.default.createElement(_,{label:"开户行/机构",className:"config-form-item-input-style",style:{display:E?"":"none"}},u.default.createElement(f.XfInput,{placeholder:"请输入开户行或支付机构名称",value:s.get("openingBank"),onChange:function(e){t(g.accountConfigActions.changeAccountSettingData(["data","openingBank"],e))}})," ",u.default.createElement(f.Icon,{type:"arrow-right",size:"14"})),u.default.createElement(_,{label:"启用/停用",style:{display:"insert"==l?"none":""}},u.default.createElement("span",{className:"noTextSwitchShort"},u.default.createElement(f.Switch,{checked:C,onClick:function(){t(g.accountConfigActions.changeAccountSettingData(["data","canUse"],!C))}}))))),u.default.createElement(f.ButtonGroup,null,u.default.createElement(f.Button,{onClick:function(){c.goBack()}},u.default.createElement(f.Icon,{type:"cancel",size:"15"}),u.default.createElement("span",null,"取消")),u.default.createElement(f.Button,{onClick:function(){var e=[{type:"name",value:s.get("name")}];p.configCheck.beforeSaveCheck(e,function(){return t(m.saveAccountSetting(r,c))})}},u.default.createElement(f.Icon,{type:"save",size:"15"}),u.default.createElement("span",null,"保存"))))}}]),t}(),o.displayName="AccountConfigOption",o.propTypes={homeState:r.default.instanceOf(s.Map),accountConfigState:r.default.instanceOf(s.Map),dispatch:r.default.func,history:r.default.object},a=c))||a;t.default=v},2596:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,o,c,l=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),u=g(n(0)),r=(g(n(2)),n(31));n(9);n(1084);var i=n(16),s=p(n(10)),f=(p(n(25)),n(1261)),d=p(n(185));function p(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function g(e){return e&&e.__esModule?e:{default:e}}var m=i.Form.Item,y=(0,r.connect)(function(e){return e})((c=o=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,u.default.Component),l(t,[{key:"componentDidMount",value:function(){s.setTitle({title:"手续费设置"}),s.setIcon({showIcon:!1}),s.setRight({show:!1}),this.props.dispatch(f.accountConfigActions.getAccountPoundage()),this.props.dispatch(d.getRunningSettingInfo())}},{key:"render",value:function(){var e=this.props,t=e.dispatch,n=e.accountConfigState,a=e.homeState,o=e.allState,c=e.history,l=(a.getIn(["permissionInfo","Config"]).getIn(["edit","permission"]),n.get("poundageData")),r=l.get("categoryUuid"),d=l.get("categoryName"),p=l.get("beProject"),g=l.get("poundageNeedProject"),y=l.get("contactsManagement"),h=l.get("poundageNeedCurrent"),_=[];return o.get("oriCategory").toJS().map(function(e){"LB_FYZC"==e.categoryType&&e.childList.map(function(e){"XZ_FINANCE"==e.propertyCostList[0]&&_.push(e)})}),function e(t){t.forEach(function(t){t.key=t.uuid,t.label=t.name,t.childList.length&&e(t.childList)})}(_),u.default.createElement(i.Container,{className:"account-config"},u.default.createElement(i.ScrollView,{flex:"1",className:"border-top"},u.default.createElement(i.Form,null,u.default.createElement(m,{label:"处理类别"},u.default.createElement(i.ChosenPicker,{district:_,value:r,onChange:function(e){t(f.accountConfigActions.getCardDetail(e.uuid))}},u.default.createElement(i.Row,null,u.default.createElement("span",{style:{color:"请选择处理类别"==d?"#ccc":""}},d),u.default.createElement(i.Icon,{type:"arrow-right",size:"14"})))),u.default.createElement(m,{label:"关联项目",style:{display:p?"":"none"}},u.default.createElement("span",{className:"noTextSwitchShort"},u.default.createElement(i.Switch,{checked:g,onClick:function(){t(f.accountConfigActions.changeAccountSettingData(["poundageData","poundageNeedProject"],!g))}}))),u.default.createElement(m,{label:"关联往来",style:{display:y?"":"none"}},u.default.createElement("span",{className:"noTextSwitchShort"},u.default.createElement(i.Switch,{checked:h,onClick:function(){t(f.accountConfigActions.changeAccountSettingData(["poundageData","poundageNeedCurrent"],!h))}}))))),u.default.createElement(i.ButtonGroup,null,u.default.createElement(i.Button,{onClick:function(){c.goBack()}},u.default.createElement(i.Icon,{type:"cancel",size:"15"}),u.default.createElement("span",null,"取消")),u.default.createElement(i.Button,{onClick:function(){if(""==r)return s.toast.info("请选择处理类别");t(f.accountConfigActions.saveAccountPoundage(c))}},u.default.createElement(i.Icon,{type:"save",size:"15"}),u.default.createElement("span",null,"保存"))))}}]),t}(),o.displayName="AccountPoundage",a=c))||a;t.default=y},2597:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,o=function(){function e(e,t){for(var n=0;n<t.length;n++){var a=t[n];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,n,a){return n&&e(t.prototype,n),a&&e(t,a),t}}(),c=f(n(0)),l=(f(n(2)),n(31));n(9);n(1084);var u=n(16),r=s(n(10)),i=(s(n(25)),n(1261));s(n(185));function s(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function f(e){return e&&e.__esModule?e:{default:e}}function d(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}var p=u.Form.Item,g=(0,l.connect)(function(e){return e})(a=function(e){function t(){var e,n,a;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);for(var o=arguments.length,c=Array(o),l=0;l<o;l++)c[l]=arguments[l];return n=a=d(this,(e=t.__proto__||Object.getPrototypeOf(t)).call.apply(e,[this].concat(c))),a.state={name:"",uuid:"",oriType:"",newType:"",modifyJudge:{hasJrData:!1,billAndOpenBalance:!1},showModal:!1},d(a,n)}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,c.default.Component),o(t,[{key:"componentDidMount",value:function(){r.setTitle({title:"反悔模式"}),r.setIcon({showIcon:!1}),r.setRight({show:!1}),this.props.dispatch(i.accountConfigActions.getRegretList())}},{key:"render",value:function(){var e=this,t=this.props,n=t.dispatch,a=t.accountConfigState,o=t.history,l=this.state,s=l.name,f=l.uuid,d=l.oriType,g=l.newType,m=l.modifyJudge,y=l.showModal,h=a.getIn(["regret","regretList"]).toJS(),_={cash:"现金",general:"一般户",basic:"基本户",Alipay:"支付宝",WeChat:"微信",other:"其它",spare:"备用金"},v=[{key:"现金",value:"cash"},{key:"一般户",value:"general"},{key:"基本户",value:"basic"},{key:"备用金",value:"spare"},{key:"支付宝",value:"Alipay"},{key:"微信",value:"WeChat"},{key:"其它",value:"other"}];return v.forEach(function(e,t){e.value==d&&v.splice(t,1)}),c.default.createElement(u.Container,{className:"account-config"},c.default.createElement(u.ScrollView,{flex:"1",className:"border-top"},c.default.createElement(u.Form,null,c.default.createElement(p,{label:"账户"},c.default.createElement(u.Single,{district:h,value:f,onOk:function(t){e.setState({name:t.name,uuid:t.uuid,oriType:t.type,newType:"",modifyJudge:t.modifyJudge})}},c.default.createElement(u.Row,{className:"config-form-item-select-item"},s||"请选择账户"))," ",c.default.createElement(u.Icon,{type:"arrow-right",size:"14"})),c.default.createElement("div",{className:"account-regret-modal-text"},c.default.createElement("div",{className:"text"},"已有数据的账户修改账户类型")),c.default.createElement("div",{style:{display:f?"":"none"}},c.default.createElement("div",{className:"account-regret-item"},c.default.createElement("div",null,"・原账户类型： ",_[d]),c.default.createElement("div",null,c.default.createElement("span",null,"・该账户已有数据："),m.hasJrData?c.default.createElement("div",{className:"text"},"（1）流水数据"):null,m.billAndOpenBalance?c.default.createElement("div",{className:"text"},m.hasJrData+" ? （2）: （1）","已结账且存在期初值"):null)),c.default.createElement("div",{className:"account-regret-modal-text"},c.default.createElement("div",{className:"text"},"以上数据将转移至修改后的账户类型中"))),c.default.createElement(p,{label:"账户类型",style:{display:f?"":"none"}},c.default.createElement(u.Single,{district:v,value:g,onOk:function(t){e.setState({newType:t.value})}},c.default.createElement(u.Row,{className:g?"":"gray"},_[g]?_[g]:"账户类型"))," ",c.default.createElement(u.Icon,{type:"arrow-right",size:"14"})))),c.default.createElement(u.PopUp,{title:"信息确认",visible:y,footerVisible:!0,onCancel:function(){e.setState({showModal:!1})},onOk:function(){n(i.accountConfigActions.accountRegret({uuid:f,newType:g},o))}},c.default.createElement("div",{className:""},"「"+s+"」原账户类型「"+_[d]+"」将修改为「"+_[g]+"」.调整数据如下：",c.default.createElement("div",{className:"gray"},m.hasJrData?c.default.createElement("div",{className:"text"},"・流水数据"):null,m.billAndOpenBalance?c.default.createElement("div",{className:"text"},"・已结账且存在期初值"):null))),c.default.createElement(u.ButtonGroup,null,c.default.createElement(u.Button,{onClick:function(){o.goBack()}},c.default.createElement(u.Icon,{type:"cancel",size:"15"}),c.default.createElement("span",null,"取消")),c.default.createElement(u.Button,{onClick:function(){return f?g?void e.setState({showModal:!0}):r.Alert("请选择账户类型"):r.Alert("请选择账户")}},c.default.createElement(u.Icon,{type:"confirm",size:"15"}),c.default.createElement("span",null,"信息确认"))))}}]),t}())||a;t.default=g}}]);