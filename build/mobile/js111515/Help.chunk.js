(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[68],{1007:function(e,n,t){"use strict";t.r(n),t.d(n,"reducer",(function(){return b})),t.d(n,"view",(function(){return h}));t(32),t(33),t(56);var a,c=t(7),l=t(8),o=t(9),s=t(10),r=t(0),i=t.n(r),u=t(47),m=t(2),p=t(17),f=t(11),d=t(38),h=(t(1882),Object(u.c)((function(e){return e}))(a=function(e){Object(s.a)(t,e);var n=Object(o.a)(t);function t(){return Object(c.a)(this,t),n.apply(this,arguments)}return Object(l.a)(t,[{key:"componentDidMount",value:function(){this.props.dispatch(d.b.setDdConfig())}},{key:"render",value:function(){m.a.setTitle({title:"\u5e2e\u52a9\u4e2d\u5fc3"}),m.a.setIcon({showIcon:!1}),m.a.setRight({show:!1});var e=this.props,n=e.history,t=e.homeState,a=(t.getIn(["data","userInfo","packInfoList"]),t.getIn(["data","userInfo"]).get("sobInfo")),c=!!a&&a.get("moduleInfo").indexOf("RUNNING")>-1;return i.a.createElement(f.h,null,i.a.createElement(f.s,{flex:"1",className:"help-center-wrap"},i.a.createElement("img",{className:"help-center-img",src:"https://www.xfannix.com/utils/img/icons/customservice.png"}),i.a.createElement("div",{className:"help-center-text"},i.a.createElement("span",null,"\u5c0f\u756a\u5ba2\u670d\u9489\u9489\u53f7"),i.a.createElement("span",{className:"help-center-text-sub"},"\u957f\u6309\u8bc6\u522b\u4e8c\u7ef4\u7801\uff0c\u6dfb\u52a0\u5ba2\u670d\u5728\u7ebf\u89e3\u7b54")),i.a.createElement("div",{className:"help-center-tel"},i.a.createElement("span",null,"\u5ba2\u670d\u7535\u8bdd"),i.a.createElement("span",null,i.a.createElement("span",{className:"help-center-tel-number",onClick:function(){m.a.showCallMenu({phoneNumber:"0571-28121680",code:"+86",showDingCall:!0,onSuccess:function(){},onFail:function(){}})}},"0571-28121680"),"\u8f6c1")),i.a.createElement("div",{className:"help-center-button"},i.a.createElement("span",{onClick:function(){m.a.openLink({url:"https://page.dingtalk.com/wow/dingtalk/act/serviceconversation?wh_biz=tm&showmenu=false&goodsCode=FW_GOODS-1000302451&corpId=".concat(sessionStorage.getItem("corpId"),"&token=bd61e615e7c3757fd2af47e530dc6a1f")})}},"\u901a\u8fc7\u670d\u52a1\u7fa4\u8054\u7cfb\u5ba2\u670d")),i.a.createElement("div",{className:"help-center-button"},i.a.createElement("a",{href:c?p.e:p.d},"\u81ea\u52a9\u67e5\u8be2\u5e2e\u52a9\u6587\u6863")),i.a.createElement("div",{className:"help-center-version"},"f".concat(p.f,"@2020-11-15 15:31:56")),i.a.createElement("div",{className:"help-center-version",style:{display:p.c.indexOf("xfannixapp1948.eapps.dingtalkcloud.com")>-1?"":"none"},onClick:function(){m.a.Confirm({title:"\u63d0\u793a",message:"\u70b9\u51fb\u201c\u786e\u8ba4\u201d\u53ef\u5207\u6362\u81f3\u5907\u7528\u901a\u9053\u3002\u8bf7\u6ce8\u610f\uff1a\u7ebf\u8def\u5207\u6362\u5c06\u91cd\u65b0\u767b\u5f55\u3002",buttonLabels:["\u53d6\u6d88","\u786e\u8ba4"],onSuccess:function(e){if(1===e.buttonIndex){var n=window.location.href,t=n.indexOf("?"),a=-1==n.indexOf("#/")?n.length:n.indexOf("#/"),c=n.slice(t+1,a);window.location.href="".concat(p.b,"/index.html?").concat(c,"&urlbackup=true")}}})}},"\u5207\u6362\u81f3\u5907\u7528\u670d\u52a1\u5668")),i.a.createElement(f.r,null,i.a.createElement(f.d,null,i.a.createElement(f.c,{onClick:function(){return n.goBack()}},i.a.createElement(f.l,{type:"cancel"}),i.a.createElement("span",null,"\u8fd4\u56de")))))}}]),t}(i.a.Component))||a),b={}},1882:function(e,n,t){}}]);