(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{1050:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var o,r=n(2634),a=(o=r)&&o.__esModule?o:{default:o};t.reducer={},t.view=a.default},2634:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var o,r,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var o=t[n];o.enumerable=o.enumerable||!1,o.configurable=!0,"value"in o&&(o.writable=!0),Object.defineProperty(e,o.key,o)}}return function(t,n,o){return n&&e(t.prototype,n),o&&e(t,o),t}}(),c=n(0),u=(r=c)&&r.__esModule?r:{default:r},i=n(31),l=(n(9),n(16)),f=(n(13),function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(10))),s=n(1058);var p=(0,i.connect)(function(e){return e})(o=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,u.default.Component),a(t,[{key:"componentDidMount",value:function(){f.setTitle({title:"选择分类"}),f.setIcon({showIcon:!1}),f.setRight({show:!1})}},{key:"render",value:function(){var e=this.props,t=e.dispatch,n=e.homeAccountState,o=e.history,r=n.getIn(["inventory","psiData"]).get("categoryTypeList");return u.default.createElement(l.Container,{className:"iuManage-config iuManage-lrls"},u.default.createElement("div",{className:"iuManage-padding border-top"},"所属分类"),u.default.createElement(l.ScrollView,{flex:"1"},u.default.createElement("div",null,r.map(function(e,n){var o=e.get("checked");return u.default.createElement(l.Row,{key:n,className:"iuManage-item",onClick:function(){t(s.homeAccountActions.changeLrlsData(["inventory","psiData","categoryTypeList",n,"checked"],!o)),o||t(s.homeAccountActions.getInventorySettingCardTypeList(e.get("ctgyUuid"),n))}},u.default.createElement("div",{className:"overElli"},e.get("categoryName")),u.default.createElement(l.Checkbox,{checked:o}))}))),u.default.createElement(l.ButtonGroup,null,u.default.createElement(l.Button,{onClick:function(){o.goBack()}},u.default.createElement(l.Icon,{type:"choose"}),u.default.createElement("span",null,"确定"))))}}]),t}())||o;t.default=p}}]);