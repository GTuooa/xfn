(window.webpackJsonp=window.webpackJsonp||[]).push([[60],{1019:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var r,c=a(2498),n=(r=c)&&r.__esModule?r:{default:r};t.reducer={},t.view=n.default},1391:function(e,t,a){},2498:function(module,exports,__webpack_require__){"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var _createClass=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),_dec,_class,_react=__webpack_require__(0),_react2=_interopRequireDefault(_react),_immutable=__webpack_require__(9),_reactRedux=__webpack_require__(31),_acconfig=__webpack_require__(1212),acconfigActions=_interopRequireWildcard(_acconfig),_components=__webpack_require__(16),_Limit=__webpack_require__(25),Limit=_interopRequireWildcard(_Limit),_thirdParty=__webpack_require__(10),thirdParty=_interopRequireWildcard(_thirdParty),_AcShow=__webpack_require__(2499),_AcShow2=_interopRequireDefault(_AcShow),_InfoAffirms=__webpack_require__(2500),_InfoAffirms2=_interopRequireDefault(_InfoAffirms);__webpack_require__(1391);var _utils=__webpack_require__(13);function _interopRequireWildcard(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function _interopRequireDefault(e){return e&&e.__esModule?e:{default:e}}function _classCallCheck(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}function _possibleConstructorReturn(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}function _inherits(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}var Label=_components.Form.Label,Control=_components.Form.Control,Item=_components.Form.Item,ReversAcEdit=(_dec=(0,_reactRedux.connect)(function(e){return e}),_dec(_class=function(_React$Component){function ReversAcEdit(){return _classCallCheck(this,ReversAcEdit),_possibleConstructorReturn(this,(ReversAcEdit.__proto__||Object.getPrototypeOf(ReversAcEdit)).apply(this,arguments))}return _inherits(ReversAcEdit,_React$Component),_createClass(ReversAcEdit,[{key:"componentDidMount",value:function(){thirdParty.setTitle({title:"反悔模式"}),thirdParty.setRight({show:!1})}},{key:"render",value:function render(){var _props=this.props,allState=_props.allState,acconfigState=_props.acconfigState,dispatch=_props.dispatch,history=_props.history,reverseTitleName=acconfigState.get("reverseTitleName"),reverseTitleIndex=acconfigState.get("reverseTitleIndex"),type=acconfigState.get("type"),reverseAc=acconfigState.get("reverseAc"),revenseAcid=reverseAc.get("acid"),revenseAcname=reverseAc.get("acname"),acid=reverseAc.get("acid"),isSelect=acconfigState.get("isSelect"),NewAcReverseId=acconfigState.get("NewAcReverseId"),NewAcReverseName=acconfigState.get("NewAcReverseName"),idNewAcReverseId=acconfigState.get("idNewAcReverseId"),canChangeClassId=acconfigState.get("canChangeClassId"),showInfoAffirmStatus=acconfigState.get("showInfoAffirmStatus"),category=reverseAc.get("category"),upAcName=reverseAc.get("upAcName"),direction=reverseAc.get("direction"),upperId=reverseAc.get("upperId"),acunitOpen=reverseAc.get("acunitOpen"),cardNum=reverseAc.get("cardNum"),hasChildren=reverseAc.get("hasChildren"),categoryList=reverseAc.get("categoryList"),acCount=reverseAc.get("acCount"),openingbalance=reverseAc.get("openingbalance");return _react2.default.createElement(_components.Container,{className:"ac-reverse"},_react2.default.createElement(_InfoAffirms2.default,{allState:allState,acconfigState:acconfigState,dispatch:dispatch,showInfoAffirmStatus:showInfoAffirmStatus,history:history}),_react2.default.createElement(_components.Row,{className:"ac-config-title"},reverseTitleName.map(function(e,t){return _react2.default.createElement("div",{key:t,className:reverseTitleIndex===t?"select":"",onClick:function(){dispatch(acconfigActions.changeReverseTit(t))}},e)})),_react2.default.createElement(_components.ScrollView,{flex:"1",uniqueKey:"ac-reverse-scroll",savePosition:!0},_react2.default.createElement("ul",{className:"form-tip ac-kmset-tip"},_react2.default.createElement("li",{className:"form-tip-item"},"class"===type?"已有数据的科目新增子级科目":"已有数据的科目修改科目编码")),_react2.default.createElement("div",{className:"ac-kmset-item",onClick:function(){history.push("/reverse/reversselect")}},_react2.default.createElement("label",null,"科目选择："),_react2.default.createElement("span",null,_react2.default.createElement("span",{className:"ac-kmset-acid"},revenseAcid?revenseAcid+" "+revenseAcname:""),_react2.default.createElement(_components.Icon,{type:"arrow-right",className:"ac-reverse-icon"}))),"class"===type?_react2.default.createElement("div",{className:"ac-kmset"},_react2.default.createElement("div",{className:"ac-kmset-info",style:{display:isSelect&&"class"===type?"":"none"}},_react2.default.createElement("div",{className:"ac-kmset-info-tit"},_react2.default.createElement("span",null,"信息填写")),_react2.default.createElement(_components.Form,null,_react2.default.createElement(Item,{label:"新增下级科目编码：",className:"form-offset-up"},_react2.default.createElement("span",{className:"ac-kmset-newId"},_react2.default.createElement("span",null,revenseAcid),_react2.default.createElement("span",{className:"ac-kmset-item-input-wrap"},_react2.default.createElement(_components.AmountInput,{className:"ac-kmset-item-input",type:"text",value:NewAcReverseId,onChange:function(e){return dispatch(acconfigActions.createNewAcId(e,revenseAcid))}}))),_react2.default.createElement(_components.Icon,{type:"arrow-right",className:"ac-reverse-icon"})),_react2.default.createElement(Item,{label:"新增下级科目名称：",className:"form-offset-up form-offset-margin form-offset-border"},_react2.default.createElement(_components.TextInput,{textAlign:"right",className:"ac-kmset-item-input",type:"text",placeholder:"包含中文最长"+Limit.AC_CHINESE_NAME_LENGTH+"个字符，否则最长"+Limit.AC_NAME_LENGTH+"个",value:NewAcReverseName,onChange:function(e){dispatch(acconfigActions.createNewAcName(e))}}),_react2.default.createElement(_components.Icon,{type:"arrow-right",className:"ac-reverse-icon"}))),_react2.default.createElement(_AcShow2.default,{categoryList:categoryList,openingbalance:openingbalance,acunitOpen:acunitOpen,cardNum:cardNum,acCount:acCount,hasChildren:hasChildren}),_react2.default.createElement("ul",{className:"form-tip"},_react2.default.createElement("li",{className:"form-tip-item"},"以上内容将转移至新增下级科目中；"),_react2.default.createElement("li",{className:"form-tip-item"},"子科目将自动继承上级科目的余额方向、类别；")))):_react2.default.createElement("div",{className:"ac-kmset"},_react2.default.createElement("div",{className:"ac-kmset-info",style:{display:isSelect&&"id"===type?"":"none"}},_react2.default.createElement("div",{className:"ac-kmset-info-tit"},_react2.default.createElement("span",null,"信息填写")),_react2.default.createElement(_components.Form,null,_react2.default.createElement(Item,{label:"科目编码修改为：",className:"form-offset-up"},_react2.default.createElement("span",{className:"ac-kmset-newId"},_react2.default.createElement("span",{className:"ac-kmset-changeId"},upperId),_react2.default.createElement("span",{className:"ac-kmset-item-input-wrap"},_react2.default.createElement(_components.AmountInput,{className:"ac-kmset-item-input",type:"text",value:idNewAcReverseId,onChange:function onChange(value){var id=value,re=eval("/^[0-9]*$/g");4===revenseAcid.length?re.test(id)&&id.length<4&&(dispatch(acconfigActions.changeIdNewAcReverseId(id)),3===id.length&&dispatch(acconfigActions.getAcIdReverseAble(revenseAcid,upperId+""+id))):re.test(id)&&id.length<3&&(dispatch(acconfigActions.changeIdNewAcReverseId(id)),2===id.length&&dispatch(acconfigActions.getAcIdReverseAble(revenseAcid,upperId+""+id)))}}))),_react2.default.createElement(_components.Icon,{type:"arrow-right",className:"ac-reverse-icon"})),_react2.default.createElement(Item,{label:"上级科目：",className:"form-offset-up  form-offset-margin"},_react2.default.createElement("span",{className:"ac-kmset-item-color"},upAcName?upperId+"_"+upAcName:"无")),_react2.default.createElement(Item,{label:"科目类别：",className:"form-offset-up  form-offset-margin"},_react2.default.createElement("span",{className:"ac-kmset-item-color"},category)),_react2.default.createElement(Item,{label:"余额方向：",className:"form-offset-up form-offset-margin"},_react2.default.createElement("span",{className:"ac-kmset-item-color"},isSelect?"credit"==direction?"贷":"借":"")),_react2.default.createElement(Item,{label:"数量核算：",className:"form-offset-up form-offset-margin  form-offset-border"},_react2.default.createElement("span",{className:"ac-kmset-item-color"},isSelect?"0"==acunitOpen?"无":"有":""))),_react2.default.createElement(_AcShow2.default,{categoryList:categoryList,openingbalance:openingbalance,acunitOpen:acunitOpen,cardNum:cardNum,acCount:acCount,hasChildren:hasChildren}),_react2.default.createElement("ul",{className:"form-tip"},_react2.default.createElement("li",{className:"form-tip-item"},"以上内容将转移至新增科目中，原科目将被删除"))))),_react2.default.createElement(_components.Row,null,_react2.default.createElement(_components.ButtonGroup,{type:"ghost"},_react2.default.createElement(_components.Button,{onClick:function(){return dispatch(acconfigActions.cancelReverse(history))}},_react2.default.createElement(_components.Icon,{type:"cancel"}),"取消"),_react2.default.createElement(_components.Button,{style:{display:isSelect&&"class"===type?"":"none"},onClick:function(){if(NewAcReverseId.length<2)return thirdParty.toast.info("科目编码的长度应为"+(NewAcReverseId.length+2));if(""===NewAcReverseName)return thirdParty.toast.info("科目名称不能为空");var e=Limit.AC_CHINESE_NAME_LENGTH;if(/[\u4e00-\u9fa5]/g.test(NewAcReverseName)||/[\u3002\uff1b\uff0c\uff1a\u201c\u201d\uff08\uff09\u3001\uff1f\u300a\u300b]/g.test(NewAcReverseName)||(e=Limit.AC_NAME_LENGTH),NewAcReverseName.length>e)return thirdParty.Alert("科目名称包含中文及中文标点字符，长度不能超过"+Limit.AC_CHINESE_NAME_LENGTH+"位；否则，长度不能超过"+Limit.AC_NAME_LENGTH+"位");dispatch(acconfigActions.showInfoAffirm(!0))}},_react2.default.createElement(_components.Icon,{type:"confirm"}),"信息确认"),_react2.default.createElement(_components.Button,{style:{display:isSelect&&"id"===type&&"true"===canChangeClassId?"":"none"},onClick:function(){dispatch(acconfigActions.showInfoAffirm(!0))}},_react2.default.createElement(_components.Icon,{type:"confirm"}),"信息确认"))))}}]),ReversAcEdit}(_react2.default.Component))||_class);exports.default=ReversAcEdit},2499:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,c,n=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),o=a(0),i=(c=o)&&c.__esModule?c:{default:c},l=a(22),s=a(13);var u=(0,l.immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default.Component),n(t,[{key:"render",value:function(){var e=this.props,t=e.categoryList,a=e.openingbalance,r=(e.acunitOpen,e.cardNum),c=e.acCount,n=e.hasChildren;return i.default.createElement("dl",{className:"greycontainer",style:{marginTop:".1rem"}},i.default.createElement("dt",{className:"greycontainer-title"},"该科目已使用的内容："),t.size>0?i.default.createElement("dd",{className:"greycontainer-item"},"辅助核算：",t.reduce(function(e,t){return e+"、"+t})):"",a>0?i.default.createElement("dd",{className:"greycontainer-item"},"期初值：",(0,s.formatMoney)(a,2,"")):"",r>0?i.default.createElement("dd",{className:"greycontainer-item"},"关联资产卡片：有"):"","1"===n?i.default.createElement("dd",{className:"greycontainer-item"},"下级科目：有"):"",c>0?i.default.createElement("dd",{className:"greycontainer-item"},"有相关的凭证"):"")}}]),t}())||r;t.default=u},2500:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,c,n=function(){function e(e,t){for(var a=0;a<t.length;a++){var r=t[a];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,a,r){return a&&e(t.prototype,a),r&&e(t,r),t}}(),o=a(0),i=(c=o)&&c.__esModule?c:{default:c},l=(a(9),a(31),function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(a(1212)));a(1391);var s=a(16),u=a(13);var f=(0,a(22).immutableRenderDecorator)(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default.Component),n(t,[{key:"render",value:function(){var e=this.props,t=(e.allState,e.acconfigState),a=e.dispatch,r=e.showInfoAffirmStatus,c=e.history,n=t.get("type"),o=t.get("NewAcReverseId"),f=t.get("NewAcReverseName"),m=t.get("idNewAcReverseId"),d=t.get("reverseAc"),p=d.get("acid"),_=d.get("acname"),g=d.get("category"),y=d.get("upAcName"),v=d.get("direction"),h=d.get("upperId"),N=d.get("acunitOpen"),E=d.get("cardNum"),A=d.get("hasChildren"),b=d.get("acCount"),w=d.get("openingbalance"),I=d.get("categoryList");return i.default.createElement(s.PopUp,{title:"信息确认",onCancel:function(){return a(l.showInfoAffirm(!1))},visible:r,footerVisible:!1,footer:[i.default.createElement("span",{onClick:function(){return a(l.showInfoAffirm(!1))}},"取消"),i.default.createElement("span",{onClick:function(){"class"===n?a(l.getReportAcRegretUse(p,p+""+o,f,c)):"id"===n&&a(l.getReportAcRegretIdUse(p,h+""+m,c))}},"确定")]},i.default.createElement("dl",{className:"greycontainer"},i.default.createElement("dt",{className:"greycontainer-title"},"修改后科目修改为："),i.default.createElement("dd",{className:"greycontainer-item"},"科目：","class"===n?p+""+o+"_"+f:h+""+m+"_"+_),i.default.createElement("dd",{className:"greycontainer-item"},"上级科目：","class"===n?p+"_"+_:y?h+"_"+y:"无"),i.default.createElement("dd",{className:"greycontainer-item"},"科目类型：",g),i.default.createElement("dd",{className:"greycontainer-item"},"期初值：",(0,u.formatMoney)(w,2,"")),i.default.createElement("dd",{className:"greycontainer-item"},"余额方向：","credit"==v?"贷":"借"),i.default.createElement("dd",{className:"greycontainer-item"},"数量核算：","0"==N?"无":"有"),i.default.createElement("dd",{className:"greycontainer-item"},"下级科目：","1"===A?"有":"无"),i.default.createElement("dd",{className:"greycontainer-item"},"辅助核算：",I.size?I.reduce(function(e,t){return e+"、"+t}):"无"),i.default.createElement("dd",{className:"greycontainer-item"},"关联资产卡片：",0==E?"无":"有"),i.default.createElement("dd",{className:"greycontainer-item"},b>0?"有相关的凭证":"没有相关的凭证")))}}]),t}())||r;t.default=f}}]);