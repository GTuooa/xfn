(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[119],{1481:function(e,t,n){},944:function(e,t,n){"use strict";n.r(t),n.d(t,"reducer",(function(){return w})),n.d(t,"view",(function(){return j}));n(32),n(55),n(115),n(33),n(31),n(56);var a,s,i=n(7),r=n(8),o=n(9),c=n(10),u=n(0),l=n.n(u),d=n(47),f=n(1),g=n(11),m=n(2),b=(n(34),n(41),n(29),n(48),n(23)),p=n(24),h=n(12),I=n(17),L=n(130),O=n(14),x=function(e,t){return function(n,a){var s=a().homeState.getIn(["data","userInfo"]).get("sobInfo"),i=s.get("newJr"),r=!!s&&(s.get("moduleInfo").indexOf("RUNNING")>-1&&i),o="".concat(e.substr(0,4)).concat(r?"-":"").concat(e.substr(5,2)),c=t?"".concat(t.substr(0,4)).concat(r?"-":"").concat(t.substr(5,2)):o;m.a.toast.loading(O.p,0),Object(I.g)(r?"getJrYjsfbData":"getYjsfbData","POST",JSON.stringify({begin:o,end:c}),(function(a){Object(h.u)(a)&&(m.a.toast.hide(),n(E(a.data.dataList,e,t)))}))}},E=function(e,t,n,a){return function(s){s({type:"GET_SFB_DATA",receivedData:e,issues:a}),s({type:"CHANGE_YJSFB_ISSUDATE",issuedate:t,endissuedate:n})}},N=Object(p.immutableRenderDecorator)(a=function(e){Object(c.a)(n,e);var t=Object(o.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,[{key:"marginLeft",value:function(e){switch(e){case 1:case 2:case 3:return 0;case 4:return 24;default:return 18*(e-3)}}},{key:"render",value:function(){var e=this,t=this.props,n=t.lr,a=(t.key,t.dispatch),s=t.showChildList,i=(t.showedProfitLineBlockIdxList,Object(b.a)(t,["lr","key","dispatch","showChildList","showedProfitLineBlockIdxList"]));return function t(n,r,o){if(n.get("payTaxList")&&n.get("payTaxList").size){var c=s.indexOf(n.get("lineIndex"))>-1,u=e.marginLeft(n.get("level"));return l.a.createElement("div",{key:o},l.a.createElement("dd",Object.assign({},i,{className:["sjb-line"].join(" "),style:{fontWeight:1===n.get("level")||2===n.get("level")?"bold":"",background:1===n.get("level")?"#FEF4E3":""},onClick:function(){var e;a((e=n.get("lineIndex"),function(t){t({type:"HANDLE_YJSFB_SHOW_CHILD_LIST",lineIndex:e})}))}}),l.a.createElement("span",{className:"linename"},l.a.createElement("span",{className:"linenametext",style:{marginLeft:"".concat(u,"px")}},n.get("lineName").replace(/\u3001/g,".").replace(/\uff1a/g,":").replace(/\uff08/g,"(").replace(/\uff09/g,")")),l.a.createElement(g.l,{className:"sjb-item-icon",type:c?"arrow-up":"arrow-down"})),l.a.createElement(g.a,{className:"sumAmount",showZero:"true"},n.get("yearAmount")),l.a.createElement(g.a,{className:"amount",showZero:"true"},n.get("currentAmount"))),c&&n.get("payTaxList").map((function(e,n){return t(e,r+1,o+1)})))}var d=e.marginLeft(n.get("level"));return l.a.createElement("dd",Object.assign({},i,{key:o,className:["sjb-line"].join(" "),style:{fontWeight:1===n.get("level")||2===n.get("level")?"bold":"",background:1===n.get("level")?"#FEF4E3":""}}),l.a.createElement("span",{className:"linename"},l.a.createElement("span",{className:"linenametext",style:{marginLeft:"".concat(d,"px")}},n.get("lineName").replace(/\u3001/g,".").replace(/\uff1a/g,":").replace(/\uff08/g,"(").replace(/\uff09/g,")"))),l.a.createElement(g.a,{className:"sumAmount",showZero:"true"},n.get("yearAmount")),l.a.createElement(g.a,{className:"amount",showZero:"true"},n.get("currentAmount")))}(n,0,1)}}]),n}(l.a.Component))||a,v=n(542),j=(n(1481),Object(h.h)(3,23),Object(d.c)((function(e){return e}))(s=function(e){Object(c.a)(n,e);var t=Object(o.a)(n);function n(){return Object(i.a)(this,n),t.apply(this,arguments)}return Object(r.a)(n,[{key:"componentDidMount",value:function(){var e;m.a.setTitle({title:"\u5e94\u4ea4\u7a0e\u8d39\u8868"}),m.a.setIcon({showIcon:!1}),m.a.setRight({show:!1}),this.props.dispatch((function(t,n){m.a.toast.loading(O.p,0);var a=n().homeState.getIn(["data","userInfo"]).get("sobInfo"),s=a.get("newJr"),i=!!a&&a.get("moduleInfo").indexOf("RUNNING")>-1&&s;Object(I.g)(i?"getJrYjsfbData":"getYjsfbData","POST",JSON.stringify({begin:"",end:"",getPeriod:"true",needPeriod:"true"}),(function(n){if(Object(h.u)(n)){m.a.toast.hide();var a=t(i?L.j(n):L.e(n)),s=e||a,r=n.data.periodDtoJson?t(L.d(n.data.periodDtoJson)):"";t(E(n.data.dataList,s,"",r))}}))}))}},{key:"render",value:function(){var e=this.props,t=e.yjsfbState,n=e.allState,a=e.dispatch,s=e.homeState.getIn(["data","userInfo"]).get("sobInfo"),i=s.get("newJr"),r=!!s&&(s.get("moduleInfo").indexOf("RUNNING")>-1&&i),o=r?t.get("issues"):n.get("issues"),c=t.get("showedProfitLineBlockIdxList"),u=t.get("initPeriodList"),d=t.get("issuedate"),f=t.get("endissuedate"),m=o.findIndex((function(e){return e.get("value")===d})),b=d.substr(0,4),p=d.substr(5,2),h=n.getIn(["period","periodStartMonth"]),I=o.slice(0,m).filter((function(e){return Number(p)<Number(h)?0===e.get("value").indexOf(b)&&Number(e.get("key").substr(6,2))<Number(h):0===e.get("value").indexOf(b)||0===e.get("value").indexOf(b-1+2)&&Number(e.get("key").substr(6,2))<Number(h)})),O="".concat(d.substr(0,4)).concat(d.substr(5,2)),E=f?"".concat(f.substr(0,4)).concat(f.substr(5,2)):O,j=d?"".concat(d.substr(0,4),"-").concat(d.substr(5,2)):"",S=f?"".concat(f.substr(0,4),"-").concat(f.substr(5,2)):j,k=t.get("showChildList");return a(L.i("config","",(function(){return function(e){return e(L.a(r?"taxPayJrTableExcel":"taxPayTableExcel",{start:O,begin:r?j:O,end:r?S:E}))}}))),l.a.createElement(g.h,null,l.a.createElement(v.f,{issuedate:d,source:o,callback:function(e){return a(x(e,f))},onOk:function(e){return a(x(e.value,f))},showSwitch:!0,endissuedate:f,nextperiods:I,onBeginOk:function(e){a(x(e.value,""))},onEndOk:function(e){a(x(d,e.value))},changeEndToBegin:function(){return a(x(d,""))}}),l.a.createElement(g.r,{className:"sjb-line title",onClick:function(){return a({type:"TOGGLE_PROFIT_SFB_LINE_DISPLAY",blockIdx:e});var e}},l.a.createElement("span",{className:"linename"},"\u9879\u76ee"),l.a.createElement("span",{className:"sumAmount"},"\u672c\u5e74\u7d2f\u8ba1"),l.a.createElement("span",{className:"amount"},"\u672c\u671f\u91d1\u989d")),l.a.createElement(g.s,{flex:"1"},l.a.createElement("dl",{className:"sjb-line-list"},u.map((function(e,t){return l.a.createElement(N,{lr:e,key:t,showedProfitLineBlockIdxList:c,dispatch:a,showChildList:k})})))))}}]),n}(l.a.Component))||s),S=(n(62),n(131),n(83),n(4)),k=Object(f.fromJS)({issuedate:"",endissuedate:"",showedProfitLineBlockIdxList:[],initPeriodList:[],showChildList:[],issues:[]});var w={yjsfbState:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:k,n=arguments.length>1?arguments[1]:void 0;return((e={},Object(S.a)(e,"INIT_YJSFB",(function(){return k})),Object(S.a)(e,"CHANGE_YJSFB_ISSUDATE",(function(){return t.set("issuedate",n.issuedate).set("endissuedate",n.endissuedate)})),Object(S.a)(e,"TOGGLE_PROFIT_SFB_LINE_DISPLAY",(function(){var e=t.get("showedProfitLineBlockIdxList");return n.blockIdx?e.indexOf(n.blockIdx)>-1?t.update("showedProfitLineBlockIdxList",(function(e){return e.map((function(e){return e===n.blockIdx?-1:e})).filter((function(e){return-1!==e}))})):t.update("showedProfitLineBlockIdxList",(function(e){return e.push(n.blockIdx)})):t.update("showedProfitLineBlockIdxList",(function(e){return e.size?e.clear():k.get("showedProfitLineBlockIdxList")}))})),Object(S.a)(e,"GET_SFB_DATA",(function(){return n.issues&&(t=t.set("issues",Object(f.fromJS)(n.issues))),t.set("initPeriodList",Object(f.fromJS)(n.receivedData))})),Object(S.a)(e,"CHANGE_YJSFB_BEGIN_DATE",(function(){return t=n.bool?t.set("endissuedate",n.begin):t.set("issuedate",n.begin)})),Object(S.a)(e,"HANDLE_YJSFB_SHOW_CHILD_LIST",(function(){var e,a=n.lineIndex,s=t.get("showChildList").toJS();if(s.includes(a)){var i=s.findIndex((function(e,t){return e==a}));s.splice(i,1),e=s}else e=s.concat(a);return t.set("showChildList",Object(f.fromJS)(e))})),e)[n.type]||function(){return t})()}}}}]);