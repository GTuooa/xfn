(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[49],{992:function(e,t,a){"use strict";a.r(t),a.d(t,"reducer",(function(){return f})),a.d(t,"view",(function(){return p}));a(31);var l,s=a(7),n=a(8),r=a(9),i=a(10),c=a(0),o=a.n(c),m=a(47),u=a(11),g=(a(1),a(2)),d=a(1100),p=(a(1324),Object(m.c)((function(e){return e}))(l=function(e){Object(i.a)(a,e);var t=Object(r.a)(a);function a(){return Object(s.a)(this,a),t.apply(this,arguments)}return Object(n.a)(a,[{key:"componentDidMount",value:function(){g.a.setTitle({title:"\u53d1\u7968\u4fe1\u606f\u586b\u5199"})}},{key:"render",value:function(){var e=this.props,t=e.dispatch,a=e.tcxqState,l=e.history,s=a.get("views"),n=(s.get("billMessageStatus"),s.get("avtiveItemId")),r=s.get("invoice"),i=s.get("invoiceStatus"),c=s.get("invoiceFormatStatus"),m=0;return n&&n.map((function(e,t){m+=e.get("payAmount")})),o.a.createElement(u.h,null,o.a.createElement(u.s,{flex:"1"},o.a.createElement("ul",{className:"order-billMessage"},o.a.createElement("li",{className:"order-billMessage-item"},o.a.createElement("span",{className:"order-billMessage-item-lable"},"\u53d1\u7968\u91d1\u989d\uff1a"),o.a.createElement("span",{className:"order-billMessage-item-right",style:{color:"#e40000",fontWeight:"bold"}},"\xa5",m)),o.a.createElement("li",{className:"order-billMessage-item"},o.a.createElement("span",{className:"order-billMessage-item-lable"},"\u53d1\u7968\u7c7b\u578b\uff1a"),o.a.createElement("span",{className:"order-billMessage-item-right"},"\u589e\u503c\u7a0e\u666e\u901a\u53d1\u7968(\u7535\u5b50\u53d1\u7968)")),o.a.createElement("li",{className:"order-billMessage-item"},o.a.createElement("span",{className:"order-billMessage-item-lable"},"\u53d1\u7968\u62ac\u5934\uff1a"),o.a.createElement(u.z,{className:"order-billMessage-input",placeholder:"\u8bf7\u8f93\u5165\u5b8c\u6574\u7684\u516c\u53f8\u540d\u79f0\uff0c\u5982\uff1a\u676d\u5dde\u5c0f\u756a\u7f51\u7edc\u79d1\u6280\u6709\u9650\u516c\u53f8",value:r.get("invoiceTitle"),onChange:function(e){return t(d.f(e))}})),o.a.createElement("li",{className:"order-billMessage-prompt",style:{display:i.get("invoiceTitleStatus")?"none":""}},"\u53d1\u7968\u62ac\u5934\u4e0d\u80fd\u4e3a\u7a7a!"),o.a.createElement("li",{className:"order-billMessage-item"},o.a.createElement("span",{className:"order-billMessage-item-lable"},"\u7a0e\xa0\xa0\u53f7\uff1a"),o.a.createElement(u.z,{className:"order-billMessage-input",placeholder:"\u8bf7\u8f93\u5165\u7eb3\u7a0e\u4eba\u8bc6\u522b\u53f7",value:r.get("dutyId"),onChange:function(e){return t(d.d(e))}})),o.a.createElement("li",{className:"order-billMessage-prompt",style:{display:i.get("dutyIdStatus")&&c.get("dutyIdStatus")?"none":""}},i.get("dutyIdStatus")?"\u683c\u5f0f\u9519\u8bef!":"\u4e0d\u80fd\u4e3a\u7a7a!"),o.a.createElement("li",{className:"order-billMessage-item"},o.a.createElement("span",{className:"order-billMessage-item-lable"},"\u8054\u7cfb\u7535\u8bdd\uff1a"),o.a.createElement(u.z,{className:"order-billMessage-input",placeholder:"\u8bf7\u8f93\u5165\u7535\u8bdd\u53f7\u7801",value:r.get("telephone"),onChange:function(e){return t(d.h(e))}})),o.a.createElement("li",{className:"order-billMessage-prompt",style:{display:i.get("telephoneStatus")&&c.get("telephoneStatus")?"none":""}},i.get("telephoneStatus")?"\u683c\u5f0f\u9519\u8bef!":"\u4e0d\u80fd\u4e3a\u7a7a!"),o.a.createElement("li",{className:"order-billMessage-item"},o.a.createElement("span",{className:"order-billMessage-item-lable"},"\u7535\u5b50\u90ae\u7bb1\uff1a"),o.a.createElement(u.z,{className:"order-billMessage-input",placeholder:"\u8bf7\u8f93\u5165\u53d1\u7968\u63a5\u6536\u90ae\u7bb1\u5730\u5740",value:r.get("email"),onChange:function(e){return t(d.e(e))}})),o.a.createElement("li",{className:"order-billMessage-prompt",style:{display:c.get("emailStatus")?"none":""}},"\u683c\u5f0f\u9519\u8bef!"),o.a.createElement("li",{className:"order-billMessage-item"},o.a.createElement("span",{className:"order-billMessage-item-lable"},"\u5907\u6ce8\u4fe1\u606f\uff1a"),o.a.createElement(u.z,{className:"order-billMessage-input",placeholder:"\u9009\u586b",value:r.get("remark"),onChange:function(e){return t(d.g(e))}})))),o.a.createElement(u.d,{type:"ghost",height:50},o.a.createElement(u.c,{onClick:function(){l.goBack()}},o.a.createElement(u.l,{type:"cancel"}),"\u53d6\u6d88"),o.a.createElement(u.c,{onClick:function(){if(r.get("remark").length<=40){var e=[];n.map((function(t){e.push(t.get("orderNo"))}));var a=[];r.map((function(e,t){""==e&&a.push(t)})),a.length<1||1==a.length&&"remark"==a[0]||""==r.get("email")?/[0-9A-Z]{15}|[0-9A-Z]{18}|[0-9A-Z]{20}/.test(r.get("dutyId"))?/(^(\d{3,4}-)?\d{7,8})$|(1[3|4|5|7|8][0-9]{9})/.test(r.get("telephone"))?/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(r.get("email"))?g.a.Confirm({message:"\u63d0\u4ea4\u53d1\u7968\u4fe1\u606f\u6210\u529f\uff0c\u6211\u4eec\u5c06\u4e8e7\uff5e15\u4e2a\u5de5\u4f5c\u65e5\u53d1\u9001\u81f3\u60a8\u7684\u53d1\u7968\u63a5\u6536\u90ae\u7bb1\u6216\u901a\u8fc7\u9489\u9489\u6d88\u606f\u53d1\u9001\u7ed9\u60a8\uff0c\u8bf7\u6ce8\u610f\u67e5\u6536\u3002\u82e5\u6709\u7591\u95ee\u8bf7\u8054\u7cfb\u5ba2\u670d\u7535\u8bdd\uff1a0571-28121680\u3002",title:"\u63d0\u793a",buttonLabels:["\u53d6\u6d88","\u786e\u5b9a"],onSuccess:function(a){1===a.buttonIndex&&t(d.i(e,r,l))},onFail:function(e){return alert(e)}}):t(d.o()):t(d.r()):t(d.n()):t(d.p())}else g.a.toast.info("\u5907\u6ce8\u6700\u957f\u4e3a40\u4e2a\u5b57\u7b26")}},o.a.createElement(u.l,{type:"save"}),"\u786e\u5b9a")))}}]),a}(o.a.Component))||l),b=a(1451),h=a(226),E=a(1452),f={tcgmState:b.a,tcxqState:E.a,feeState:h.a}}}]);