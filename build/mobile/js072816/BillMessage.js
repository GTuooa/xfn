(window.webpackJsonp=window.webpackJsonp||[]).push([[73],{1006:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var l=o(a(2454)),n=o(a(1626)),r=o(a(187)),s=o(a(1627));function o(e){return e&&e.__esModule?e:{default:e}}var i={tcgmState:n.default,tcxqState:s.default,feeState:r.default};t.reducer=i,t.view=l.default},2454:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var l,n,r=function(){function e(e,t){for(var a=0;a<t.length;a++){var l=t[a];l.enumerable=l.enumerable||!1,l.configurable=!0,"value"in l&&(l.writable=!0),Object.defineProperty(e,l.key,l)}}return function(t,a,l){return a&&e(t.prototype,a),l&&e(t,l),t}}(),s=a(0),o=(n=s)&&n.__esModule?n:{default:n},i=a(31),u=a(16),c=(a(9),m(a(10))),d=m(a(1233));function m(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}a(1454);var f=(0,i.connect)(function(e){return e})(l=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){c.setTitle({title:"发票信息填写"})}},{key:"render",value:function(){var e=this.props,t=e.dispatch,a=e.tcxqState,l=e.history,n=a.get("views"),r=(n.get("billMessageStatus"),n.get("avtiveItemId")),s=n.get("invoice"),i=n.get("invoiceStatus"),m=n.get("invoiceFormatStatus"),f=0;return r&&r.map(function(e,t){f+=e.get("payAmount")}),o.default.createElement(u.Container,null,o.default.createElement(u.ScrollView,{flex:"1"},o.default.createElement("ul",{className:"order-billMessage"},o.default.createElement("li",{className:"order-billMessage-item"},o.default.createElement("span",{className:"order-billMessage-item-lable"},"发票金额："),o.default.createElement("span",{className:"order-billMessage-item-right",style:{color:"#e40000",fontWeight:"bold"}},"¥",f)),o.default.createElement("li",{className:"order-billMessage-item"},o.default.createElement("span",{className:"order-billMessage-item-lable"},"发票类型："),o.default.createElement("span",{className:"order-billMessage-item-right"},"增值税普通发票(电子发票)")),o.default.createElement("li",{className:"order-billMessage-item"},o.default.createElement("span",{className:"order-billMessage-item-lable"},"发票抬头："),o.default.createElement(u.TextInput,{className:"order-billMessage-input",placeholder:"请输入完整的公司名称，如：杭州小番网络科技有限公司",value:s.get("invoiceTitle"),onChange:function(e){return t(d.changeInvoiceTitleOrder(e))}})),o.default.createElement("li",{className:"order-billMessage-prompt",style:{display:i.get("invoiceTitleStatus")?"none":""}},"发票抬头不能为空!"),o.default.createElement("li",{className:"order-billMessage-item"},o.default.createElement("span",{className:"order-billMessage-item-lable"},"税  号："),o.default.createElement(u.TextInput,{className:"order-billMessage-input",placeholder:"请输入纳税人识别号",value:s.get("dutyId"),onChange:function(e){return t(d.changeDutyIdOrder(e))}})),o.default.createElement("li",{className:"order-billMessage-prompt",style:{display:i.get("dutyIdStatus")&&m.get("dutyIdStatus")?"none":""}},i.get("dutyIdStatus")?"格式错误!":"不能为空!"),o.default.createElement("li",{className:"order-billMessage-item"},o.default.createElement("span",{className:"order-billMessage-item-lable"},"联系电话："),o.default.createElement(u.TextInput,{className:"order-billMessage-input",placeholder:"请输入电话号码",value:s.get("telephone"),onChange:function(e){return t(d.changeTelephoneOrder(e))}})),o.default.createElement("li",{className:"order-billMessage-prompt",style:{display:i.get("telephoneStatus")&&m.get("telephoneStatus")?"none":""}},i.get("telephoneStatus")?"格式错误!":"不能为空!"),o.default.createElement("li",{className:"order-billMessage-item"},o.default.createElement("span",{className:"order-billMessage-item-lable"},"电子邮箱："),o.default.createElement(u.TextInput,{className:"order-billMessage-input",placeholder:"请输入发票接收邮箱地址",value:s.get("email"),onChange:function(e){return t(d.changeEmailOrder(e))}})),o.default.createElement("li",{className:"order-billMessage-prompt",style:{display:m.get("emailStatus")?"none":""}},"格式错误!"),o.default.createElement("li",{className:"order-billMessage-item"},o.default.createElement("span",{className:"order-billMessage-item-lable"},"备注信息："),o.default.createElement(u.TextInput,{className:"order-billMessage-input",placeholder:"选填",value:s.get("remark"),onChange:function(e){return t(d.changeRemarkOrder(e))}})))),o.default.createElement(u.ButtonGroup,{type:"ghost",height:50},o.default.createElement(u.Button,{onClick:function(){l.goBack()}},o.default.createElement(u.Icon,{type:"cancel"}),"取消"),o.default.createElement(u.Button,{onClick:function(){if(s.get("remark").length<=40){var e=[];r.map(function(t){e.push(t.get("orderNo"))});var a=[];s.map(function(e,t){""==e&&a.push(t)}),a.length<1||1==a.length&&"remark"==a[0]||""==s.get("email")?/[0-9A-Z]{15}|[0-9A-Z]{18}|[0-9A-Z]{20}/.test(s.get("dutyId"))?/(^(\d{3,4}-)?\d{7,8})$|(1[3|4|5|7|8][0-9]{9})/.test(s.get("telephone"))?/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(s.get("email"))?c.Confirm({message:"提交发票信息成功，我们将于7～15个工作日发送至您的发票接收邮箱或通过钉钉消息发送给您，请注意查收。若有疑问请联系客服电话：0571-28121680。",title:"提示",buttonLabels:["取消","确定"],onSuccess:function(a){1===a.buttonIndex&&t(d.createInvoiceToserver(e,s,l))},onFail:function(e){return alert(e)}}):t(d.showEmailOrder()):t(d.showTelephoneOrder()):t(d.showDutyIdOrder()):t(d.showInvoiceStatus())}else c.toast.info("备注最长为40个字符")}},o.default.createElement(u.Icon,{type:"save"}),"确定")))}}]),t}())||l;t.default=f}}]);