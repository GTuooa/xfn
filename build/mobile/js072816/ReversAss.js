(window.webpackJsonp=window.webpackJsonp||[]).push([[50],{1029:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var a=n(s(2518));function n(e){return e&&e.__esModule?e:{default:e}}var r={assconfigState:n(s(1458)).default};t.reducer=r,t.view=a.default},1211:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changeAssTypeName=t.changeAssTypeConfirmModalVisible=t.changeAssConfigNewName=t.changeAssConfigOldName=t.changeAssConfigShowType=t.reversAssFetch=t.showReversConfirmModal=t.changeReversNewAssId=t.checkReversAssIdFetch=t.changeReversAssCategory=t.changeAssDisableState=t.hideAllAssCheckBox=t.showAllAssCheckBox=t.beforeInsertAss=t.beforeModifyAss=t.changeTabIndexAcAssconfig=t.changeTabIndexAssConfig=t.changeAssCategory=t.changeAssName=t.changeAssId=t.setAssrelateAMB=t.getAssrelateAMB=t.getAssGetAMB=void 0;var a,n=s(13),r=u(s(1226)),o=s(24),l=(a=o)&&a.__esModule?a:{default:a},i=u(s(10)),c=u(s(25));function u(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}t.getAssGetAMB=function(){return function(e){i.toast.loading(c.LOADING_TIP_TEXT,0),(0,l.default)("assgetAMB","GET","",function(t){(0,n.showMessage)(t)&&(i.toast.hide(),e({type:r.AFTER_ASSGETAMB_GET,receivedData:t.data}))})}},t.getAssrelateAMB=function(e,t){return function(s){i.Confirm({message:"确定开通辅助核算类别["+e.get(0)+"]为默认阿米巴？",title:"提示",buttonLabels:["取消","确定"],onSuccess:function(s){1===s.buttonIndex&&(i.toast.loading(c.LOADING_TIP_TEXT,0),(0,l.default)("assrelateAMB","POST",JSON.stringify({assCategoryList:e}),function(e){(0,n.showMessage)(e,"show")&&t.goBack()}))},onFail:function(e){return alert(e)}})}},t.setAssrelateAMB=function(e){return{type:r.SET_ASSRELATE_AMB,asscategory:e}},t.changeAssId=function(e){return{type:r.CHANGE_ASS_ID,assid:e}},t.changeAssName=function(e){return{type:r.CHANGE_ASS_NAME,assname:e}},t.changeAssCategory=function(e){return{type:r.CHANGE_ASS_CATEGORY,asscategory:e}},t.changeTabIndexAssConfig=function(e){return{type:r.CHANGE_TAB_INDEX_ASSCONFIG,idx:e}},t.changeTabIndexAcAssconfig=function(e){return{type:r.CHANGE_TAB_INDEX_AC_ASSCONFIG,idx:e}},t.beforeModifyAss=function(e,t){return{type:r.BEFORE_MODIFY_ASS,ass:e,idx:t}},t.beforeInsertAss=function(e){return{type:r.BEFORE_INSERT_ASS,tab:e}},t.showAllAssCheckBox=function(){return{type:r.SHOW_ALL_ASS_CHECKBOX}},t.hideAllAssCheckBox=function(){return{type:r.HIDE_ALL_ASS_CHECKBOX}},t.changeAssDisableState=function(){return{type:r.CHANGE_ASS_DISABLE_STATE}},t.changeReversAssCategory=function(e){return{type:r.CHANGE_REVERS_ASS_CATEGORY,assCategory:e}},t.checkReversAssIdFetch=function(e,t,s){return function(a){i.toast.loading(c.LOADING_TIP_TEXT,0),(0,l.default)("assCheck","POST",JSON.stringify({assCategory:e,assId:t,assName:s}),function(e){if((0,n.showMessage)(e)){if(i.toast.hide(),!e.data.message.length)return(0,n.showMessage)("","","",t+"不需要使用反悔模式");a({type:r.CHECK_REVERS_ASS_ID_CHECK,assId:t,assName:s,assMessage:e.data.message})}})}},t.changeReversNewAssId=function(e){return{type:r.CHANGE_REVERS_NEW_ASS_ID,newAssId:e}};var f=t.showReversConfirmModal=function(e){return{type:r.SHOW_REVERS_CONFIR_MODAL,bool:e}};t.reversAssFetch=function(e,t){return function(s){i.toast.loading(c.LOADING_TIP_TEXT,0),(0,l.default)("assRegret","POST",JSON.stringify({assCategory:e.get("assCategory"),oldAssId:e.get("oldAssId"),assId:e.get("assId"),assName:e.get("assName")}),function(e){(0,n.showMessage)(e)&&(i.toast.hide(),s(f(!1)),t.goBack())})}},t.changeAssConfigShowType=function(){return function(e){e({type:r.CHANGE_ASS_CONFIG_SHOW_TYPE})}},t.changeAssConfigOldName=function(e){return function(t){t({type:r.SET_ASS_CONFIG_OLD_NAME,value:e})}},t.changeAssConfigNewName=function(e){return function(t){t({type:r.SET_ASS_CONFIG_NEW_NAME,value:e})}},t.changeAssTypeConfirmModalVisible=function(e){return function(t){t({type:r.CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE,visible:e})}},t.changeAssTypeName=function(e,t,s){var a=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"false";return function(o){i.toast.loading(c.LOADING_TIP_TEXT,0),(0,l.default)("changeAssName","POST",JSON.stringify({oldName:e,newName:t,confirmModifyAnyWay:a}),function(e){(0,n.showMessage)(e)&&(e.data.countMoreThenRestrict?o({type:r.CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE,visible:!0}):(o({type:r.CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE,visible:!1}),o({type:r.CHANGE_ASS_CONFIG_SHOW_TYPE}),o({type:r.SET_ASS_CONFIG_OLD_NAME,value:""}),o({type:r.SET_ASS_CONFIG_NEW_NAME,value:""}),i.toast.hide(),o(f(!1)),s.goBack()))})}}},1226:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_ASSCONFIG="INIT_ASSCONFIG",t.CHANGE_TAB_INDEX_ASSCONFIG="CHANGE_TAB_INDEX_ASSCONFIG",t.CHANGE_TAB_INDEX_AC_ASSCONFIG="CHANGE_TAB_INDEX_AC_ASSCONFIG",t.CHANGE_ASS_ID="CHANGE_ASS_ID",t.CHANGE_ASS_NAME="CHANGE_ASS_NAME",t.CHANGE_ASS_CATEGORY="CHANGE_ASS_CATEGORY",t.BEFORE_MODIFY_ASS="BEFORE_MODIFY_ASS",t.BEFORE_INSERT_ASS="BEFORE_INSERT_ASS",t.MODIFY_ASS_FETCH="MODIFY_ASS_FETCH",t.INSERT_ASS_FETCH="INSERT_ASS_FETCH",t.SHOW_ALL_ASS_CHECKBOX="SHOW_ALL_ASS_CHECKBOX",t.HIDE_ALL_ASS_CHECKBOX="HIDE_ALL_ASS_CHECKBOX",t.AFTER_ASSGETAMB_GET="AFTER_ASSGETAMB_GET",t.SET_ASSRELATE_AMB="SET_ASSRELATE_AMB",t.CHANGE_ASS_DISABLE_STATE="CHANGE_ASS_DISABLE_STATE",t.CHANGE_REVERS_ASS_CATEGORY="CHANGE_REVERS_ASS_CATEGORY",t.CHECK_REVERS_ASS_ID_CHECK="CHECK_REVERS_ASS_ID_CHECK",t.CHANGE_REVERS_NEW_ASS_ID="CHANGE_REVERS_NEW_ASS_ID",t.SHOW_REVERS_CONFIR_MODAL="SHOW_REVERS_CONFIR_MODAL",t.CHANGE_ASS_CONFIG_SHOW_TYPE="CHANGE_ASS_CONFIG_SHOW_TYPE",t.SET_ASS_CONFIG_OLD_NAME="SET_ASS_CONFIG_OLD_NAME",t.SET_ASS_CONFIG_NEW_NAME="SET_ASS_CONFIG_NEW_NAME",t.CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE="CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE"},1458:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,s=arguments[1];return((e={},r(e,n.INIT_ASSCONFIG,function(){return o}),r(e,n.CHANGE_TAB_INDEX_ASSCONFIG,function(){return t.set("tabSelectedIndex",s.idx)}),r(e,n.CHANGE_TAB_INDEX_AC_ASSCONFIG,function(){return t.set("assTabSelectedIndex",s.idx)}),r(e,n.CHANGE_ASS_ID,function(){return/^[A-Za-z0-9]*$/g.test(s.assid)?t.setIn(["ass","assid"],s.assid):t}),r(e,n.CHANGE_ASS_NAME,function(){return t.setIn(["ass","assname"],s.assname)}),r(e,n.CHANGE_ASS_CATEGORY,function(){return t.setIn(["ass","asscategory"],s.asscategory)}),r(e,n.BEFORE_MODIFY_ASS,function(){return t.set("assConfigMode","modify").set("ass",s.ass).setIn(["ass","oldassid"],s.ass.get("assid")).setIn(["ass","disable"],s.ass.get("disableTime")?"TRUE":"FALSE").set("modifyIdx",s.idx)}),r(e,n.BEFORE_INSERT_ASS,function(){return t.set("assConfigMode","insert").set("ass",o.get("ass")).setIn(["ass","asscategory"],s.tab)}),r(e,n.MODIFY_ASS_FETCH,function(){return t.set("FzModelDisplay",!1)}),r(e,n.INSERT_ASS_FETCH,function(){return t.set("activeAssCategory",t.getIn(["ass","asscategory"])).set("ass",o.get("ass"))}),r(e,n.SHOW_ALL_ASS_CHECKBOX,function(){return t.set("toolBarDisplayIndex",2).set("allAssCheckBoxDisplay",!0)}),r(e,n.HIDE_ALL_ASS_CHECKBOX,function(){return t.set("toolBarDisplayIndex",1).set("allAssCheckBoxDisplay",!1)}),r(e,n.AFTER_ASSGETAMB_GET,function(){return t.set("amAassCategoryList",(0,a.fromJS)(s.receivedData.assCategroyList)).set("ambCount",s.receivedData.count)}),r(e,n.SET_ASSRELATE_AMB,function(){return t.set("amAassCategoryList",(0,a.fromJS)([s.asscategory]))}),r(e,n.CHANGE_ASS_DISABLE_STATE,function(){return t.updateIn(["ass","disable"],function(e){return"TRUE"===e?"FALSE":"TRUE"})}),r(e,n.CHANGE_REVERS_ASS_CATEGORY,function(){return t.set("reversAss",o.get("reversAss")).setIn(["reversAss","assCategory"],s.assCategory)}),r(e,n.CHECK_REVERS_ASS_ID_CHECK,function(){return t.setIn(["reversAss","oldAssId"],s.assId).setIn(["reversAss","assName"],s.assName).setIn(["reversAss","assId"],"").set("assMessage",s.assMessage)}),r(e,n.CHANGE_REVERS_NEW_ASS_ID,function(){return t.setIn(["reversAss","assId"],s.newAssId)}),r(e,n.SHOW_REVERS_CONFIR_MODAL,function(){return t.set("showReversModal",s.bool)}),r(e,n.CHANGE_ASS_CONFIG_SHOW_TYPE,function(){return t.update("ifAssConfig",function(e){return!e})}),r(e,n.SET_ASS_CONFIG_OLD_NAME,function(){return t.set("oldName",s.value)}),r(e,n.SET_ASS_CONFIG_NEW_NAME,function(){return t.set("newName",s.value)}),r(e,n.CHANGE_ASS_TYPE_CHANGE_COMFIRM_MODAL_VISIBLE,function(){return t.set("showAssTypeChangeConfirmModal",s.visible)}),e)[s.type]||function(){return t})()};var a=s(9),n=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}(s(1226));function r(e,t,s){return t in e?Object.defineProperty(e,t,{value:s,enumerable:!0,configurable:!0,writable:!0}):e[t]=s,e}var o=(0,a.fromJS)({toolBarDisplayIndex:1,tabSelectedIndex:0,assTabSelectedIndex:0,allAssCheckBoxDisplay:!1,assConfigMode:"insert",modifyIdx:-1,ass:{assid:"",assname:"",asscategory:""},ambCount:"1",amAassCategoryList:[],showReversModal:!1,assMessage:[],reversAss:{assCategory:"",oldAssId:"",assName:"",assId:""},ifAssConfig:!0,oldName:"",newName:"",showAssTypeChangeConfirmModal:!1})},1467:function(e,t,s){},2518:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,n=function(){function e(e,t){for(var s=0;s<t.length;s++){var a=t[s];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,s,a){return s&&e(t.prototype,s),a&&e(t,a),t}}(),r=d(s(0)),o=s(9),l=s(31),i=E(s(1211));s(1467);var c=s(16),u=E(s(25)),f=d(s(2520)),_=d(s(2521)),A=s(13);function E(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}function d(e){return e&&e.__esModule?e:{default:e}}var S=c.Form.Item,m=(0,l.connect)(function(e){return e})(a=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.state={showInfo:!1},e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.default.Component),n(t,[{key:"render",value:function(){var e=this,t=this.props,s=t.dispatch,a=t.assconfigState,n=t.history,l=t.allState,E=(t.homeState,this.state.showInfo),d=a.get("reversAss"),m=a.get("assMessage"),C=a.get("showReversModal"),p=l.get("assTags"),g=a.get("tabSelectedIndex"),N=(p.get(g),p.map(function(e){return{key:e,value:e}})),y=l.get("acasslist").findKey(function(e){return e.get("asscategory")==d.get("assCategory")}),I=l.getIn(["acasslist",y]),h=I?I.get("asslist").map(function(e){return e.set("asscategory",d.get("assCategory"))}):(0,o.fromJS)([]),v=h.map(function(e,t){return{key:e.get("assid")+" "+e.get("assname"),value:""+e.get("assid")+u.TREE_JOIN_STR+e.get("assname")}}),O=a.get("ifAssConfig"),T=a.get("oldName"),M=a.get("newName"),b=a.get("showAssTypeChangeConfirmModal"),R=["客户","供应商","职员","项目","部门"],G=[];p.toJS().forEach(function(e,t){R.indexOf(e)<0&&G.push(e)});var w=G.map(function(e){return{key:e,value:e}});return r.default.createElement(c.Container,{className:"ass-reverse"},r.default.createElement(f.default,{reversAss:d,dispatch:s,assMessage:m,showReversModal:C,history:n,oldName:T,newName:M,ifAssConfig:O}),r.default.createElement(_.default,{showAssTypeChangeConfirmModal:b,dispatch:s,oldName:T,newName:M,history:n}),r.default.createElement(c.Row,{className:"ac-config-title"},r.default.createElement("div",{className:O?"select":"",onClick:function(){s(i.changeAssConfigShowType())}},"修改核算对象编码"),r.default.createElement("div",{className:O?"":"select",onClick:function(){s(i.changeAssConfigShowType())}},"修改辅助类别名称")),r.default.createElement(c.ScrollView,{flex:"1",uniqueKey:"as-reverse-scroll",savePosition:!0},O?r.default.createElement(c.Form,null,r.default.createElement(S,{label:"辅助类别：",className:"form-offset-up"},r.default.createElement(c.SinglePicker,{className:"info-select",district:N,onOk:function(e){return s(i.changeReversAssCategory(e.value))}},r.default.createElement("span",{className:"info-select-text"},d.get("assCategory"),r.default.createElement(c.Icon,{type:"arrow-right",className:"ac-reverse-icon"})))),r.default.createElement(S,{label:"核算对象：",className:"form-offset-up form-offset-margin"},d.get("assCategory")?r.default.createElement(c.SinglePicker,{className:"info-select",district:v,onOk:function(e){var t=e.value.split(u.TREE_JOIN_STR);s(i.checkReversAssIdFetch(d.get("assCategory"),t[0],t[1]))}},r.default.createElement("span",{className:"info-select-text"},d.get("assName")," ",r.default.createElement(c.Icon,{type:"arrow-right",className:"ac-reverse-icon"}))):""),r.default.createElement("div",{className:"ass-reverse-info-tit",style:{display:d.get("oldAssId")?"":"none"}},r.default.createElement("span",null,"信息填写")),r.default.createElement(S,{label:"原编码：",className:"form-offset-up form-offset-margin",style:{display:d.get("oldAssId")?"":"none"}},r.default.createElement("span",null,d.get("oldAssId"))),r.default.createElement(S,{label:"新编码：",className:"form-offset-up form-offset-margin",style:{display:d.get("oldAssId")?"":"none"}},r.default.createElement(c.TextInput,{className:"ac-kmset-item-input",type:"text",placeholder:"填写编码 (限16位数字字母)",value:d.get("assId"),onChange:function(t){if(/^[A-Za-z0-9]*$/g.test(t)){if(t.length>u.CODE_LENGTH)return(0,A.showMessage)("","","","辅助核算编码位数不能超过"+u.ALL_NAME_LENGTH+"位");s(i.changeReversNewAssId(t)),h.some(function(e){return e.get("assid")===t})?e.setState({showInfo:!0}):e.setState({showInfo:!1})}}}),r.default.createElement(c.Icon,{type:"arrow-right",className:"ac-reverse-icon"})),r.default.createElement("div",{className:"ass-reverse-info-tip",style:{display:E?"":"none"}},r.default.createElement("span",{className:"reverse-item-icon"},"辅助类别下该编码已存在")),r.default.createElement("div",{className:"ass-reverse-show",style:{display:d.get("oldAssId")?"":"none"}},r.default.createElement("div",null,"该核算对象已使用的内容"),r.default.createElement("ul",{className:"ass-tip"},m.map(function(e){return r.default.createElement("li",{className:"ass-tip-item"},"vc"===e?"有相关的凭证":e)}))),r.default.createElement("div",{className:"ass-reverse-bottom",style:{display:d.get("oldAssId")?"":"none"}},"将统一修改以上内容的核算对象编码")):r.default.createElement(c.Form,null,r.default.createElement(S,{label:"辅助类别：",className:"form-offset-up"},r.default.createElement(c.SinglePicker,{className:"info-select",placeholder:"请选择辅助类别",extra:"请选择辅助类别",district:w,onOk:function(e){return s(i.changeAssConfigOldName(e.value))}},r.default.createElement("span",{className:"info-select-text"},T,r.default.createElement(c.Icon,{type:"arrow-right",className:"ac-reverse-icon"})))),r.default.createElement(S,{label:"修改后名称：",className:"form-offset-up form-offset-margin"},r.default.createElement(c.TextInput,{className:"ac-kmset-item-input",type:"text",placeholder:"请输入",value:M,onChange:function(e){if(A.configCheck.hasChiness(e))return(0,A.showMessage)("","","","名称包含中文及中文标点字符，长度不能超过"+u.AC_CHINESE_NAME_LENGTH+"位；不包含中文及中文标点字符，长度不能超过"+u.AC_NAME_LENGTH+"位");s(i.changeAssConfigNewName(e))}})))),O?r.default.createElement(c.ButtonGroup,{type:"ghost",height:50},r.default.createElement(c.Button,{onClick:function(){return n.goBack()}},r.default.createElement(c.Icon,{type:"cancel"}),r.default.createElement("span",null,"取消")),r.default.createElement(c.Button,{disabled:!d.get("oldAssId"),onClick:function(){return d.get("assId")?E?(0,A.showMessage)("","","","新编码已存在，不可修改"):void s(i.showReversConfirmModal(!0)):(0,A.showMessage)("","","","未填写新编码")}},r.default.createElement(c.Icon,{type:"save"}),r.default.createElement("span",null,"信息确认"))):r.default.createElement(c.ButtonGroup,{type:"ghost",height:50},r.default.createElement(c.Button,{onClick:function(){return n.goBack()}},r.default.createElement(c.Icon,{type:"cancel"}),r.default.createElement("span",null,"取消")),r.default.createElement(c.Button,{disabled:""===M||""===T,onClick:function(){if(G.includes(M)||R.includes(M))return(0,A.showMessage)("","","","已存在同名的辅助类别");s(i.showReversConfirmModal(!0))}},r.default.createElement(c.Icon,{type:"save"}),r.default.createElement("span",null,"信息确认"))))}}]),t}())||a;t.default=m},2520:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,n,r=function(){function e(e,t){for(var s=0;s<t.length;s++){var a=t[s];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,s,a){return s&&e(t.prototype,s),a&&e(t,a),t}}(),o=s(0),l=(n=o)&&n.__esModule?n:{default:n},i=(s(9),s(31),function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}(s(1211)));s(1467);var c=s(16);var u=(0,s(22).immutableRenderDecorator)(a=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.default.Component),r(t,[{key:"render",value:function(){var e=this.props,t=e.reversAss,s=e.dispatch,a=e.assMessage,n=e.showReversModal,r=e.history,o=e.oldName,u=e.newName,f=e.ifAssConfig;return l.default.createElement(c.PopUp,{title:"信息确认",onCancel:function(){return s(i.showReversConfirmModal(!1))},visible:n,footerVisible:!1,footer:[l.default.createElement("span",{onClick:function(){return s(i.showReversConfirmModal(!1))}},"取消"),l.default.createElement("span",{onClick:function(){s(f?i.reversAssFetch(t,r):i.changeAssTypeName(o,u,r))}},"确定")]},f?l.default.createElement("div",{className:"ass-reverse-confirm"},l.default.createElement("div",{className:"ass-reverse-confirm-title"},"修改后核算对象修改为："),l.default.createElement("ul",{className:"ass-tip"},l.default.createElement("li",{className:"ass-tip-item"},"辅助类别：",t.get("assCategory")),l.default.createElement("li",{className:"ass-tip-item"},"编码：",t.get("assId")),l.default.createElement("li",{className:"ass-tip-item"},"名称：",t.get("assName"))),l.default.createElement("div",{className:"ass-reverse-confirm-title ass-reverse-confirm-title2"},"已使用的内容将统一修改编码："),l.default.createElement("ul",{className:"ass-tip"},a.map(function(e){return l.default.createElement("li",{className:"ass-tip-item"},"vc"===e?"所有相关凭证":e)}))):l.default.createElement("div",{className:"ass-reverse-confirm"},l.default.createElement("div",{className:"ass-reverse-confirm-title"},"辅助类别名称修改为："),l.default.createElement("ul",{className:"ass-tip"},l.default.createElement("li",{className:"ass-tip-item"},"原名称：",o),l.default.createElement("li",{className:"ass-tip-item"},"新名称：",u))))}}]),t}())||a;t.default=u},2521:function(e,t,s){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var a,n,r=function(){function e(e,t){for(var s=0;s<t.length;s++){var a=t[s];a.enumerable=a.enumerable||!1,a.configurable=!0,"value"in a&&(a.writable=!0),Object.defineProperty(e,a.key,a)}}return function(t,s,a){return s&&e(t.prototype,s),a&&e(t,a),t}}(),o=s(0),l=(n=o)&&n.__esModule?n:{default:n},i=(s(9),s(31),function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t.default=e,t}(s(1211)));s(1467);var c=s(16);var u=(0,s(22).immutableRenderDecorator)(a=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.default.Component),r(t,[{key:"render",value:function(){var e=this.props,t=e.showAssTypeChangeConfirmModal,s=e.dispatch,a=e.oldName,n=e.newName,r=e.history;return l.default.createElement(c.PopUp,{title:"信息确认",visible:t,footerVisible:!1,onCancel:function(){return s(i.changeAssTypeConfirmModalVisible(!1))},footer:[l.default.createElement("span",{onClick:function(){return s(i.showReversConfirmModal(!1))}},"取消"),l.default.createElement("span",{onClick:function(){s(i.changeAssTypeName(a,n,r,"true"))}},"确定")]},l.default.createElement("div",null,"该类别下的辅助核算对象超过1000，修改需要等待一段时间，是否确定修改"))}}]),t}())||a;t.default=u}}]);