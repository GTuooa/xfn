(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[91],{1827:function(e,t,n){},932:function(e,t,n){"use strict";n.r(t),n.d(t,"reducer",(function(){return I})),n.d(t,"view",(function(){return P}));var a,i,c,r,s,o,l,m=n(7),u=n(8),h=n(9),d=n(10),f=n(0),b=n.n(f),p=n(1),v=n(47),O=n(11),N=n(2),E=(n(130),n(1153)),S=(n(32),n(55),n(31),n(24)),g=n(12),M=(n(62),n(83),Object(S.immutableRenderDecorator)(a=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){var e=this.props,t=e.item,n=e.index,a=(e.className,e.checkedList,e.dispatch),i=(e.showChildList,e.cannotChecked),c=e.haveSwitchList,r=e.cannotTestList;return function e(t,s,o,l){var m={background:{0:"#fff",1:"#D1C0A5",2:"#7E6B5A",3:"#59493f"}[s],width:s/10+"rem",marginLeft:".05rem"},u=t.lineindex?t.lineindex:t.acId,h=t.showChild;return t.childProfit&&t.childProfit.length>0?b.a.createElement("div",null,b.a.createElement("div",{className:"measure-item-title",style:{fontWeight:0===s?"bold":""}},b.a.createElement("div",{className:"measure-item-title-checkbox",onClick:function(){i.includes(t.linename)||a(E.i(u,t.checked))}},!i.includes(t.linename)&&b.a.createElement(O.e,{checked:t.checked})),b.a.createElement("div",{className:"measure-item-title-title",onClick:function(){i.includes(t.linename)||a(E.i(u,t.checked))}},0==s?"":b.a.createElement("span",{className:"ba-flag",style:m}),b.a.createElement("span",{style:{paddingLeft:".05rem"}},t.linename)),b.a.createElement("div",{className:"measure-item-title-arror",onClick:function(){a(h?E.f(u,!1):E.i(u,!1)),a(E.j(u,"".concat(t.linename)))}},b.a.createElement(O.l,{type:h?"arrow-up":"arrow-down",style:{marginTop:"0.07rem",marginRight:".1rem"}}))),b.a.createElement("div",{className:"measure-item-contant",style:{fontWeight:0===s?"bold":""}},b.a.createElement("div",{className:"measure-item-contant-amount",onClick:function(){i.includes(t.linename)||a(E.i(u,t.checked))}},b.a.createElement(O.a,{showZero:!0},t.monthaccumulation)),b.a.createElement("div",{className:"measure-item-contant-precent",onClick:function(){i.includes(t.linename)||a(E.i(u,t.checked))}},"".concat(Object(g.l)(100*t.shareOfMonth,2,!0),"%")),b.a.createElement("div",{className:"measure-item-contant-switch"},c.includes(t.linename)&&b.a.createElement(O.x,{className:"noTextSwitchShort",checkedChildren:"\u5360\u6bd4",unCheckedChildren:"\u91d1\u989d",checked:t.testAmount,onChange:function(){a(E.c(t.linename))}})),r.includes(t.linename)?b.a.createElement("div",{className:"measure-item-contant-input"}):b.a.createElement("div",{className:"measure-item-contant-input"},b.a.createElement("div",{className:"input-border",style:{display:t.testAmount?"":"none"}},b.a.createElement(O.A,{value:t.testShareOfMonth,disabled:h||!t.checked,onChange:function(e){/^\d*\.?\d{0,2}$/g.test(e)&&Number(e)<100&&a(E.e(e,u))}}),b.a.createElement("span",null,"%")),b.a.createElement("div",{className:"input-border",style:{display:t.testAmount?"none":""}},b.a.createElement(O.A,{value:t.testMonthaccumulation,disabled:h||!t.checked,onChange:function(e){/^\d*\.?\d{0,2}$/g.test(e)&&Number(e)<1e7&&a(E.d(e,u))}})))),h&&t.childProfit.map((function(a,i){return e(a,s+1,n+1,t.testAmount)}))):b.a.createElement("div",null,b.a.createElement("div",{className:"measure-item-title",style:{fontWeight:0===s?"bold":""}},b.a.createElement("div",{className:"measure-item-title-checkbox",onClick:function(){i.includes(t.linename)||a(E.i(u,t.checked))}},!i.includes(t.linename)&&b.a.createElement(O.e,{checked:t.checked})),b.a.createElement("div",{className:"measure-item-title-title",onClick:function(){i.includes(t.linename)||a(E.i(u,t.checked))}},0==s?"":b.a.createElement("span",{className:"ba-flag",style:m}),b.a.createElement("span",{style:{paddingLeft:".05rem"}},t.linename)),b.a.createElement("div",{className:"measure-item-title-arror"})),b.a.createElement("div",{className:"measure-item-contant",style:{fontWeight:0===s?"bold":""}},b.a.createElement("div",{className:"measure-item-contant-amount",onClick:function(){i.includes(t.linename)||a(E.i(u,t.checked))}},b.a.createElement(O.a,{showZero:!0},t.monthaccumulation)),b.a.createElement("div",{className:"measure-item-contant-precent",onClick:function(){i.includes(t.linename)||a(E.i(u,t.checked))}},"".concat(Object(g.l)(100*t.shareOfMonth,2,!0),"%")),b.a.createElement("div",{className:"measure-item-contant-switch"},c.includes(t.linename)&&b.a.createElement(O.x,{className:"noTextSwitchShort",checkedChildren:"\u5360\u6bd4",unCheckedChildren:"\u91d1\u989d",checked:t.testAmount,onChange:function(){a(E.c(t.linename))}})),r.includes(t.linename)?b.a.createElement("div",{className:"measure-item-contant-input"}):b.a.createElement("div",{className:"measure-item-contant-input"},b.a.createElement("div",{className:"input-border",style:{display:t.testAmount?"":"none"}},b.a.createElement(O.A,{value:t.testShareOfMonth,disabled:!t.checked,onChange:function(e){/^\d*\.?\d{0,2}$/g.test(e)&&Number(e)<100&&a(E.e(e,u))}}),b.a.createElement("span",null,"%")),b.a.createElement("div",{className:"input-border",style:{display:t.testAmount?"none":""}},b.a.createElement(O.A,{value:t.testMonthaccumulation,disabled:!t.checked,onChange:function(e){/^\d*\.?\d{0,2}$/g.test(e)&&Number(e)<1e7&&a(E.d(e,u))}})))))}(t,0,0,t.testAmount)}}]),n}(b.a.Component))||a),L=Object(S.immutableRenderDecorator)(i=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"componentDidMount",value:function(){N.a.setTitle({title:"\u6d4b\u7b97\u4e00\u4e0b"}),N.a.setIcon({showIcon:!1}),N.a.setRight({show:!1})}},{key:"render",value:function(){var e=this.props,t=(e.className,e.incomeTotal),n=e.dispatch,a=e.profit,i=void 0===a?{}:a,c=e.detailList,r=e.amountInput,s=e.checkedList,o=e.showChildList,l=e.cannotChecked,m=e.haveSwitchList,u=e.history,h=e.cannotTestList,d=e.testProfit;return b.a.createElement(O.h,{className:"measure"},b.a.createElement("div",{className:"top-test-switch"},b.a.createElement("div",{className:"income"},b.a.createElement("div",null,"\u82e5".concat(d?"\u8425\u4e1a\u6536\u5165":"\u8425\u4e1a\u5229\u6da6","\u4e3a")),b.a.createElement("div",{style:{width:"1.5rem",margin:"-4px auto 0"}},b.a.createElement("span",{style:{fontSize:"0.15rem",fontWeight:"normal",color:"rgb(34,34,34)"}},"\xa5"),b.a.createElement(O.A,{className:"amountInput",value:"".concat(r),onChange:function(e){/^(\-|\+)?\d*\.?\d{0,2}$/g.test(e)&&("-"===e?n(E.a("-")):Number(e)>-1e7&&Number(e)<1e7&&n(E.a(e)))}}))),b.a.createElement("div",{className:"center",onClick:function(){n(E.b())}},b.a.createElement("div",null,d?"\u6d4b\u5229\u6da6":"\u6d4b\u76c8\u4e8f"),b.a.createElement("div",{style:{height:"5px",width:".4rem",marginTop:"-0.26rem",paddingLeft:".12rem"}},b.a.createElement(O.l,{type:"turn-left",style:{fontSize:".5rem"}})),b.a.createElement("div",{style:{height:".11rem",color:"rgb(153,153,153)",marginTop:".25rem"}},"|")),b.a.createElement("div",{className:"profit"},b.a.createElement("div",null,"\u5219".concat(d?"\u8425\u4e1a\u5229\u6da6":"\u8425\u4e1a\u6536\u5165","\u4e3a")),b.a.createElement("div",{style:{margin:"0 auto "}},b.a.createElement("span",{style:{fontSize:"0.15rem",fontWeight:"normal",color:"rgb(153,153,153)"}},"\xa5")," \uff1f"))),b.a.createElement(O.r,{className:"sheet-line title"},b.a.createElement("div",{className:"shareOfMonth"},"\u672c\u671f\u91d1\u989d"),b.a.createElement("div",{className:"shareDifference"},"\u8425\u6536\u5360\u6bd4"),b.a.createElement("div",{className:"amountOrProportion"},"\u91d1\u989d/\u5360\u6bd4"),b.a.createElement("div",{className:"itemTobetested"},"\u9884\u8bbe\u6570\u636e")),b.a.createElement(O.s,{flex:"1"},b.a.createElement("div",{className:"banner"},b.a.createElement("div",{className:"banner-title"},"\u8425\u4e1a\u6536\u5165"),b.a.createElement("div",{className:"banner-amount"},b.a.createElement("div",null,b.a.createElement(O.a,null,t.monthaccumulation)),b.a.createElement("div",null,"".concat(Object(g.l)(100*t.shareOfMonth,2,!0),"%")),b.a.createElement("div",null),b.a.createElement("div",null))),b.a.createElement("div",{className:"measure-item"},c.length>0&&c.map((function(e,t){return b.a.createElement(M,{key:"".concat(t,"_").concat(e.linename),item:e,index:t,checkedList:s,dispatch:n,showChildList:o,cannotChecked:l,haveSwitchList:m,cannotTestList:h})}))),b.a.createElement("div",{className:"banner"},b.a.createElement("div",{className:"banner-title"},"\u8425\u4e1a\u5229\u6da6"),b.a.createElement("div",{className:"banner-amount"},b.a.createElement("div",null,b.a.createElement(O.a,null,i.monthaccumulation)),b.a.createElement("div",null,"".concat(Object(g.l)(100*i.shareOfMonth,2,!0),"%")),b.a.createElement("div",null),b.a.createElement("div",null)))),b.a.createElement(O.d,null,b.a.createElement(O.c,{onClick:function(){if(!0===d)Number(r)<0?N.a.toast.info("\u8bf7\u8f93\u5165\u6709\u6548\u7684\u8425\u4e1a\u6536\u5165\u91d1\u989d",1):(n(E.m()),n(E.l(!0)));else if(Number(r)>0){var e=c.filter((function(e){return!0===e.testAmount})),t=0;e.map((function(e){t+=Number(e.testShareOfMonth)})),t>100?N.a.toast.info("\u652f\u51fa\u5360\u6536\u5165\u6bd4\u5927\u4e8e1\uff0c\u4e0e\u8425\u4e1a\u5229\u6da6\u91d1\u989d\u77db\u76fe\uff0c\u8bf7\u91cd\u65b0\u8bbe\u7f6e",1):(n(E.m()),n(E.l(!0)))}else n(E.m()),n(E.l(!0))}},b.a.createElement(O.l,{type:"test",size:"15"}),"\u6d4b\u7b97"),b.a.createElement(O.c,{onClick:function(){u.goBack()}},b.a.createElement(O.l,{type:"cancel",size:"15"}),"\u53d6\u6d88")))}}]),n}(b.a.Component))||i,k=(n(133),n(61),n(1053),n(76),n(1132)),C=n.n(k),j=Object(S.immutableRenderDecorator)(c=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"getColor",value:function(e,t){if("\u8425\u4e1a\u6536\u5165"===e.substr(-4,4))return"rgb(255,131,72)";if("\u8425\u4e1a\u6210\u672c"===e.substr(-4,4))return"rgb(92,167,242)";if("\u8425\u4e1a\u7a0e\u91d1"===e.substr(-4,4))return"rgb(2,129,255)";if("\u8425\u4e1a\u8d39\u7528"===e)return"rgb(2,93,255)";if("\u8425\u4e1a\u5229\u6da6"===e){if(t>0)return"rgb(255,181,73)";if(0===t)return"#FFF";if(t<0)return"rgb(17,195,224)"}}},{key:"render",value:function(){var e=this,t=this.props,n=t.resultList,a=t.ProfitAndLossResult,i=t.profitResult,c=(t.incomeTotal,t.profit,{linename:"\u8425\u4e1a\u6536\u5165",monthaccumulation:a});n.forEach((function(e){e.childProfit&&e.childProfit.length>0&&(e.childProfit=e.childProfit.filter((function(e){return!0===e.checked})))}));var r={linename:"\u8425\u4e1a\u5229\u6da6",testShareOfMonth:0===i?0:i/a*100,testMonthaccumulation:i},s={normal:{color:"transparent"}},o={linename:"\u8425\u4e1a\u8d39\u7528",testShareOfMonth:"0",testMonthaccumulation:0};n.map((function(e){!0===e.testAmount?e.testMonthaccumulation="".concat(a*Number(e.testShareOfMonth)/100):e.testShareOfMonth="".concat(Number(e.testMonthaccumulation)/a*100)}));var l=[],m=[];n.map((function(e,t){["\u7ba1\u7406\u8d39\u7528","\u9500\u552e\u8d39\u7528","\u8d22\u52a1\u8d39\u7528"].includes(e.linename)?m.push(e):l.push(e)})),m.map((function(e){var t=Number(o.testMonthaccumulation)+Number(e.testMonthaccumulation);o.testMonthaccumulation=Number(t);var n=Number(o.testShareOfMonth)+Number(e.testShareOfMonth);o.testShareOfMonth=Number(n)}));var u=[c].concat(l).concat([o]),h=[],d=[];u.map((function(t){var n={value:"0"===t.testMonthaccumulation?0:t.testMonthaccumulation?Number(t.testMonthaccumulation).toFixed():t.monthaccumulation,name:"".concat(t.linename.substr(-4,4),"    ").concat("\u8425\u4e1a\u6536\u5165"===t.linename.substr(-4,4)?"100.00%":0===t.testShareOfMonth?0:Number(t.testShareOfMonth)===1/0||Number(t.testShareOfMonth)===-1/0||isNaN(Number(t.testShareOfMonth))?"\u65e0\u6548\u503c":t.testShareOfMonth?Number(t.testShareOfMonth).toFixed(2)+"%":Object(g.l)(100*t.shareOfMonth,2,!0)+"%"),itemStyle:{normal:{color:e.getColor(t.linename,Number(t.testShareOfMonth))}}};h.push(n),d.push("".concat(t.linename.substr(-4,4),"    ").concat("\u8425\u4e1a\u6536\u5165"===t.linename.substr(-4,4)?"100.00%":0===t.testShareOfMonth?"0":Number(t.testShareOfMonth)===1/0||Number(t.testShareOfMonth)===-1/0||isNaN(Number(t.testShareOfMonth))?"\u65e0\u6548\u503c":t.testShareOfMonth?Number(t.testShareOfMonth).toFixed(2)+"%":Object(g.l)(100*t.shareOfMonth,2,!0)+"%"))})),d.push("".concat(r.linename,"    ").concat(0===r.testShareOfMonth?"0":Number(r.testShareOfMonth)===1/0||Number(r.testShareOfMonth)===-1/0||isNaN(Number(r.testShareOfMonth))?"\u65e0\u6548\u503c":r.testShareOfMonth.toFixed(2)+"%"));var f=a;n.map((function(e){f+=Number(e.testMonthaccumulation)}));var p={title:{text:"\u6d4b\u7b97\u635f\u76ca\u56fe",textStyle:{color:"rgb(34,34,34)",fontSize:"14px"},left:"55%",top:"10px"},legend:{orient:"vertical",left:"55%",data:d,icon:"circle",top:"middle",selectedMode:!1},series:[{name:"\u5229\u6da6",type:"pie",silent:!0,minAngle:1,center:["25%","50%"],radius:["0%","45%"],label:{normal:{show:!1}},labelLine:{normal:{show:!1}},data:[{value:(Math.abs(f)-Math.abs(i))/2,name:" ",itemStyle:s},{value:Math.abs(i),name:"".concat(r.linename,"    ").concat(0===r.testShareOfMonth?"0":Number(r.testShareOfMonth)===1/0||Number(r.testShareOfMonth)===-1/0||isNaN(Number(r.testShareOfMonth))?"\u65e0\u6548\u503c":r.testShareOfMonth.toFixed()+"%"),itemStyle:{normal:{color:0===i?"#FFF":i>0?"rgb(255,181,73)":"rgb(17,195,224)"}}},{value:(Math.abs(f)-Math.abs(i))/2,name:" ",itemStyle:s}]},{minAngle:1,label:{normal:{show:!1}},silent:!0,name:"\u6bd4\u4f8b",type:"pie",center:["25%","50%"],radius:["45%","75%"],data:h.reverse()}]};return b.a.createElement(C.a,{className:"measure-pie-char",option:p})}}]),n}(b.a.Component))||c,y=(n(1230),Object(S.immutableRenderDecorator)(r=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){var e=this.props,t=e.data,n=e.index,a=e.resultListShowChildList,i=e.dispatch;return function e(t,n,c){var r=a.includes("".concat(t.linename));return t.childProfit&&t.childProfit.length>0?b.a.createElement("div",null,b.a.createElement("div",{className:"measure-result-list-item",style:{fontWeight:0==n?"bold":""}},b.a.createElement("div",{className:"linename"},b.a.createElement("span",{style:{paddingLeft:"".concat(14*n,"px")}},t.linename)),b.a.createElement("div",{className:"icon",onClick:function(){i(E.k("".concat(t.linename)))}},b.a.createElement(O.l,{type:r?"arrow-up":"arrow-down"})),b.a.createElement("div",{className:"amount"},"".concat("\u8425\u4e1a\u6536\u5165"===t.linename.substr(-4,4)?0===t.monthaccumulation?"0.00":t.monthaccumulation.toFixed(2):0===Number(t.testMonthaccumulation)?"0.00":Number(t.testMonthaccumulation).toFixed(2))),b.a.createElement("div",{className:"precent"},"".concat("\u8425\u4e1a\u6536\u5165"===t.linename.substr(-4,4)?0===t.shareOfMonth?"0.00%":Object(g.l)(100*t.shareOfMonth,2,!0)+"%":Number(t.testShareOfMonth)===1/0||Number(t.testShareOfMonth)===-1/0||isNaN(t.testShareOfMonth)?"\u65e0\u6548\u503c":Number(t.testShareOfMonth).toFixed(2)+"%","\n                                "))),r&&t.childProfit.map((function(t,a){return e(t,n+1,c+1)}))):b.a.createElement("div",{className:"measure-result-list-item",style:{fontWeight:0==n?"bold":""}},b.a.createElement("div",{className:"linename"},b.a.createElement("span",{style:{paddingLeft:"".concat(14*n,"px")}},t.linename)),b.a.createElement("div",{className:"icon"}),b.a.createElement("div",{className:"amount"},"".concat("\u8425\u4e1a\u6536\u5165"===t.linename.substr(-4,4)?0===t.monthaccumulation?"0.00":t.monthaccumulation.toFixed(2):0===Number(t.testMonthaccumulation)?"0.00":Number(t.testMonthaccumulation).toFixed(2))),b.a.createElement("div",{className:"precent"},"".concat("\u8425\u4e1a\u6536\u5165"===t.linename.substr(-4,4)?0===t.shareOfMonth?"0.00%":Object(g.l)(100*t.shareOfMonth,2,!0)+"%":Number(t.testShareOfMonth)===1/0||Number(t.testShareOfMonth)===-1/0||isNaN(t.testShareOfMonth)?"\u65e0\u6548\u503c":Number(t.testShareOfMonth).toFixed(2)+"%","\n                            ")))}(t,0,n)}}]),n}(b.a.Component))||r),w=Object(S.immutableRenderDecorator)(s=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"render",value:function(){var e=this.props,t=e.resultList,n=e.ProfitAndLossResult,a=e.profitResult,i=(e.incomeTotal,e.profit),c=void 0===i?{}:i,r=e.dispatch,s=e.resultListShowChildList,o=(e.testProfit,{linename:"\u8425\u4e1a\u6536\u5165",monthaccumulation:n,shareOfMonth:1,childProfit:[]});c.childProfit=[];var l={linename:"\u8425\u4e1a\u5229\u6da6",testShareOfMonth:0===a?0:a/n*100,testMonthaccumulation:"".concat(a),childProfit:[]},m={linename:"\u51cf\uff1a\u8425\u4e1a\u8d39\u7528",testShareOfMonth:0,testMonthaccumulation:"0",childProfit:[]};t.map((function(e){!0===e.testAmount?e.testMonthaccumulation="".concat(n*Number(e.testShareOfMonth)/100):e.testShareOfMonth="".concat(Number(e.testMonthaccumulation)/n*100),e.childProfit.length>0&&e.childProfit.map((function(e){!0===e.testAmount?e.testMonthaccumulation="".concat(n*Number(e.testShareOfMonth)/100):e.testShareOfMonth="".concat(Number(e.testMonthaccumulation)/n*100)}))}));var u=[];t.map((function(e,t){if(["\u7ba1\u7406\u8d39\u7528","\u9500\u552e\u8d39\u7528","\u8d22\u52a1\u8d39\u7528"].includes(e.linename)){m.childProfit.push(e);var n=Number(m.testShareOfMonth)+Number(e.testShareOfMonth);m.testShareOfMonth=Number(n),m.testMonthaccumulation=Number(e.testMonthaccumulation)+Number(m.testMonthaccumulation)}else u.push(e)}));var h=[o].concat(u).concat([m]).concat([l]);return b.a.createElement("div",{className:"measure-result-list"},h.length>0&&h.map((function(e,t){return b.a.createElement(y,{className:"measure-result-list",data:e,key:t,dispatch:r,index:t,resultListShowChildList:s})})))}}]),n}(b.a.Component))||s,x=Object(S.immutableRenderDecorator)(o=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"componentDidMount",value:function(){N.a.setTitle({title:"\u6d4b\u7b97\u7ed3\u679c"}),N.a.setIcon({showIcon:!1}),N.a.setRight({show:!1})}},{key:"render",value:function(){var e=this.props,t=e.dispatch,n=e.testProfit,a=e.profitResult,i=e.ProfitAndLossResult,c=e.resultList,r=e.incomeTotal,s=e.profit,o=e.resultListShowChildList,l="";return 0===a?l="profit0":a>0?l="profit":a<0&&(l="loss"),b.a.createElement(O.h,{className:"measure"},b.a.createElement("div",{className:"result-banner"},b.a.createElement("div",{className:"result-banner-left ".concat(0===a?"breakeven":"income")},b.a.createElement("div",{style:{marginLeft:".25rem",marginTop:".2rem",fontSize:".13rem"}},"\u82e5\u8425\u4e1a\u6536\u5165\u4e3a"),b.a.createElement("div",{style:{marginLeft:".25rem",fontSize:".16rem",fontWeight:"bold"}},"\xa5 ",i.toFixed(2))),b.a.createElement("div",{className:"result-banner-right ".concat(l)},b.a.createElement("div",{style:{marginLeft:".25rem",marginTop:".2rem",fontSize:".13rem"}},"\u5219\u8425\u4e1a\u5229\u6da6\u4e3a"),b.a.createElement("div",{style:{marginLeft:".25rem",fontSize:".16rem",fontWeight:"bold"}},"\xa5 ",a.toFixed(2)))),b.a.createElement(O.s,{flex:"1"},b.a.createElement(j,{resultList:c,profitResult:a,ProfitAndLossResult:i,incomeTotal:r,profit:s}),b.a.createElement(w,{resultList:c,testProfit:n,profitResult:a,ProfitAndLossResult:i,incomeTotal:r,profit:s,dispatch:t,resultListShowChildList:o})),b.a.createElement(O.d,null,b.a.createElement(O.c,{onClick:function(){t(E.l(!1)),t(E.g())}},b.a.createElement(O.l,{type:"adjustment",size:"15"}),"\u4fee\u6539")))}}]),n}(b.a.Component))||o,P=(n(1827),n(1113),Object(v.c)((function(e){return e}))(l=function(e){Object(d.a)(n,e);var t=Object(h.a)(n);function n(){return Object(m.a)(this,n),t.apply(this,arguments)}return Object(u.a)(n,[{key:"componentDidMount",value:function(){N.a.setTitle({title:"\u6d4b\u7b97\u4e00\u4e0b"}),N.a.setIcon({showIcon:!1}),N.a.setRight({show:!1}),sessionStorage.setItem("prevPage","measure");var e=this.props.lrbState.get("issuedate"),t=this.props.lrbState.get("endissuedate");this.props.dispatch(E.h(e,t))}},{key:"render",value:function(){var e=this.props,t=e.measureState,n=(e.allState,e.dispatch),a=e.history,i=t.get("showResult"),c=t.get("incomeTotal"),r=t.get("profit"),s=t.get("detailList").toJS(),o=t.get("amountInput"),l=t.get("checkedList"),m=t.get("showChildList"),u=t.get("cannotChecked"),h=t.get("haveSwitchList"),d=t.get("testProfit"),f=t.get("cannotTestList"),p=t.get("profitResult"),v=t.get("ProfitAndLossResult"),N=t.get("resultList"),E=t.get("resultListShowChildList");return b.a.createElement(O.h,null,!i&&b.a.createElement(L,{dispatch:n,incomeTotal:c,profit:r,detailList:s,amountInput:o,checkedList:l,showChildList:m,cannotChecked:u,haveSwitchList:h,cannotTestList:f,testProfit:d,history:a}),i&&b.a.createElement(x,{dispatch:n,testProfit:d,profitResult:p,ProfitAndLossResult:v,resultList:N,incomeTotal:c,profit:r,resultListShowChildList:E}))}}]),n}(b.a.Component))||l),R=(n(115),n(131),n(4)),A=n(1340),T=Object(p.fromJS)({issuedate:"",endissuedate:"",showResult:!1,incomeTotal:[],profit:[],detailList:[],amountInput:"0",checkedList:[],showChildList:[],testProfit:!1,cannotChecked:["\u51cf\uff1a\u8425\u4e1a\u8d39\u7528"],haveSwitchList:["\u51cf\uff1a\u8425\u4e1a\u6210\u672c","\u51cf\uff1a\u8425\u4e1a\u7a0e\u91d1","\u9500\u552e\u8d39\u7528","\u7ba1\u7406\u8d39\u7528","\u8d22\u52a1\u8d39\u7528"],cannotTestList:["\u51cf\uff1a\u8425\u4e1a\u8d39\u7528"],profitResult:0,ProfitAndLossResult:0,resultList:[],resultListShowChildList:[],resultShowChild:[]});var I={measureState:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:T,n=arguments.length>1?arguments[1]:void 0;return((e={},Object(R.a)(e,A.g,(function(){return T})),Object(R.a)(e,A.i,(function(){return t.set("issuedate",n.issuedate).set("endissuedate",n.endissuedate)})),Object(R.a)(e,A.h,(function(){return t.set("incomeTotal",n.incomeTotal).set("profit",n.profit).set("detailList",Object(p.fromJS)(n.detailList)).set("checkedList",Object(p.fromJS)(n.checkedList)).set("showChildList",Object(p.fromJS)(n.showChildList)).set("resultShowChild",Object(p.fromJS)([]))})),Object(R.a)(e,A.a,(function(){return t.set("amountInput",n.value)})),Object(R.a)(e,A.f,(function(){var e,a=n.uniqueId,i=t.get("showChildList").toJS();if(i.includes(a)){var c=i.findIndex((function(e,t){return e==a}));i.splice(c,1),e=i}else e=i.concat(a);return t.set("showChildList",Object(p.fromJS)(e))})),Object(R.a)(e,A.d,(function(){var e,a=n.uniqueId,i=t.get("checkedList").toJS();if(i.includes(a)){var c=i.findIndex((function(e,t){return e==a}));i.splice(c,1),e=i}else e=i.concat(a);return t.set("checkedList",Object(p.fromJS)(e))})),Object(R.a)(e,A.b,(function(){return t.update("testProfit",(function(e){return!e}))})),Object(R.a)(e,A.m,(function(){return t.set("detailList",Object(p.fromJS)(n.detailList))})),Object(R.a)(e,A.l,(function(){var e=t.get("resultShowChild").toJS();return(e.includes("\u9500\u552e\u8d39\u7528")||e.includes("\u7ba1\u7406\u8d39\u7528")||e.includes("\u8d22\u52a1\u8d39\u7528"))&&e.push("\u8425\u4e1a\u8d39\u7528"),t.set("showResult",n.bool).set("resultListShowChildList",Object(p.fromJS)(e))})),Object(R.a)(e,A.j,(function(){return t.set("profitResult",n.profitResult).set("ProfitAndLossResult",n.ProfitAndLossResult).set("resultList",n.resultList)})),Object(R.a)(e,A.e,(function(){var e,a=n.id,i=t.get("resultListShowChildList").toJS();if(i.includes(a)){var c=i.findIndex((function(e,t){return e===a}));i.splice(c,1),e=i}else e=i.concat(a);return t.set("resultListShowChildList",Object(p.fromJS)(e))})),Object(R.a)(e,A.c,(function(){return t.set("resultListShowChildList",Object(p.fromJS)([]))})),Object(R.a)(e,A.k,(function(){var e,a=n.resultShowChildItem,i=t.get("resultShowChild").toJS();if(i.includes(a)){var c=i.findIndex((function(e,t){return e===a}));i.splice(c,1),e=i}else e=i.concat(a);return t.set("resultShowChild",Object(p.fromJS)(e))})),e)[n.type]||function(){return t})()},lrbState:n(1343).a}}}]);