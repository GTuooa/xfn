(window.webpackJsonp=window.webpackJsonp||[]).push([[104],{1585:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_AMBSYB="INIT_AMBSYB",t.CHANGE_CHAR_DIDMOUNT="CHANGE_CHAR_DIDMOUNT",t.SWITCH_CHAR_STATUS="SWITCH_CHAR_STATUS",t.SET_AMB_ASSID="SET_AMB_ASSID",t.SET_AMB_ASSCATEGORY="SET_AMB_ASSCATEGORY",t.GET_AMB_INCOMESTATEMENT_FETCH="GET_AMB_INCOMESTATEMENT_FETCH",t.CHANGE_AMB_BEGIN_DATE="CHANGE_AMB_BEGIN_DATE",t.SET_SYXMB_CARD_LIST="SET_SYXMB_CARD_LIST",t.SET_CARD_NAME="SET_CARD_NAME",t.HANDLE_CHECKBOX_SHOW="HANDLE_CHECKBOX_SHOW",t.CHANGE_NEED_CATEGORY="CHANGE_NEED_CATEGORY"},2292:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,r=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),o=y(a(0)),i=a(31),s=a(9),l=h(a(10)),u=a(123),c=a(16),f=a(13);a(2293);var d=y(a(2295)),m=y(a(2296)),g=y(a(2297)),p=h(a(2298)),b=h(a(181));function h(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function y(e){return e&&e.__esModule?e:{default:e}}function A(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var C=(0,i.connect)(function(e){return e})(n=function(e){function t(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t);var e=function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).call(this));return e.state={isCross:!1},e}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,o.default.Component),r(t,[{key:"componentDidMount",value:function(){l.setTitle({title:"阿米巴损益表"}),l.setIcon({showIcon:!1}),l.setRight({show:!1}),this.props.dispatch(p.getSyxmbCardList("","","true"))}},{key:"componentWillUnmount",value:function(){this.props.dispatch(p.changeCharDidmount(!1)),this.props.dispatch(p.switchCharStatus("损益"))}}]),r(t,[{key:"render",value:function(){var e,t=this,a=this.props,n=a.allState,r=a.dispatch,i=a.syxmbState,l=(this.state.isCross,i.get("issuedate")),h=n.get("issues"),y=i.get("endissuedate"),C=h.findIndex(function(e){return e.get("value")===l}),E=l.substr(0,4),S=l.substr(5,2),v=n.getIn(["period","periodStartMonth"]),w=h.slice(0,C).filter(function(e){return Number(S)<Number(v)?0===e.get("value").indexOf(E)&&Number(e.get("key").substr(6,2))<Number(v):0===e.get("value").indexOf(E)||0===e.get("value").indexOf(E-1+2)&&Number(e.get("key").substr(6,2))<Number(v)}),M=i.get("view"),T=M.get("status"),N=M.get("assId"),B=M.get("didMount"),O=i.get("cardList"),x=i.get("initCardList"),L=i.get("cardUuid"),F=i.get("beCategory"),D=i.get("needCategory"),_=i.get("showCheck"),I=i.get("cardName"),R=M.get("assCategory"),j=R?i.get("assList").find(function(e){return e.get("asscategory")===R}).get("asslist"):(0,s.fromJS)([]),k=i.get("gainAndLoss"),G=i.get("trendMap"),U={"收入":function(){return G.get("incomeForMonth").slice(-6)},"支出":function(){return G.get("payForMonth").slice(-6)},"损益":function(){return G.get("ginAndLossForMonth").slice(-6)}}[T](),P=i.get("detailDrawing"),H={"收入":function(){return P.get("incomeForMonth")},"支出":function(){return P.get("payForMonth")},"损益":function(){return P.get("ginAndLossForMonth")?P.get("ginAndLossForMonth"):(0,s.fromJS)([])}}[T](),J=j.toJS();J.unshift({assid:"",assname:"全部"});(0,s.fromJS)(J).map(function(e){return{key:e.get("assid")+" "+e.get("assname"),value:e.get("assid")}}),i.get("assList").map(function(e){return{key:e.get("asscategory"),value:e.get("asscategory")}});var Y={"收入":function(){return"支出"},"支出":function(){return"损益"},"损益":function(){return"收入"}}[T](),q=k.get("income"),Q=k.get("pay"),X=(k.get("ginAndLoss"),q>=Q),K=N?j.find(function(e){return e.get("assid")===N}).get("disableTime"):"",z=""+l.substr(0,4)+l.substr(5,2),V=y?""+y.substr(0,4)+y.substr(5,2):z;return r(b.navigationSetMenu("config","",function(){return function(e){return e(b.allExportDo("excelAMBSYBIncome",{begin:z,end:V,cardUuid:L,beCategory:F,needCategory:D}))}})),o.default.createElement(c.Container,{className:"jz ass-config"},o.default.createElement(u.TopMonthPicker,{issuedate:l,source:h,callback:function(e){r(p.getSyxmbCardList(e,y,"false")),r(p.changeNeedCategory(!1)),t.props.dispatch(p.switchCharStatus("损益"))},onOk:function(e){r(p.getSyxmbCardList(e.value,y,"false")),r(p.changeNeedCategory(!1)),t.props.dispatch(p.switchCharStatus("损益"))},showSwitch:!0,endissuedate:y,nextperiods:w,onBeginOk:function(e){r(p.getSyxmbCardList(e.value,"","false")),r(p.changeNeedCategory(!1)),t.props.dispatch(p.switchCharStatus("损益"))},onEndOk:function(e){r(p.getSyxmbCardList(l,e.value,"false")),r(p.changeNeedCategory(!1)),t.props.dispatch(p.switchCharStatus("损益"))},changeEndToBegin:function(){r(p.getSyxmbCardList(l,"","false")),r(p.changeNeedCategory(!1))}}),o.default.createElement(c.Row,{className:"select-row"},o.default.createElement(c.ChosenPicker,{className:"card-list",district:O.toJS(),parentDisabled:!1,value:L,onChange:function(e){var a=void 0;!function t(n){return n.map(function(n){n.uuid===e.key&&(a=n),n.categoryList.length>0&&t(n.categoryList),n.cardList.length>0&&t(n.cardList)})}(x),r(p.setCardName(e.label)),r(p.getAMBIncomeStatementFetch(l,y,a.uuid,a.beCategory,D)),t.props.dispatch(p.switchCharStatus("损益")),"全部"===e.label?x.some(function(e){return e.uuid&&e.beCategory})?r(p.handleCheckBoxShow(!0)):r(p.handleCheckBoxShow(!1)):a.categoryList.length>0?r(p.handleCheckBoxShow(!0)):r(p.handleCheckBoxShow(!1))}},o.default.createElement(c.Row,{className:"lrbselect"},o.default.createElement("span",{className:["lrbselect-assmane",K?"lrb-item-disable":""].join(" ")},I),o.default.createElement(c.Icon,{className:"lrbselect-icon",type:"triangle",size:"11"}))),_&&o.default.createElement("div",{className:"check-needCategory",onClick:function(e){r(p.changeNeedCategory(!D)),r(p.getAMBIncomeStatementFetch(l,y,L,F,!D))}},o.default.createElement(c.Checkbox,{checked:D})," 仅显示类别")),o.default.createElement(c.ScrollView,{className:"content",flex:"1"},o.default.createElement("div",{className:"ambysb-charts-wrap"},o.default.createElement("div",{className:"ambysb-title"},o.default.createElement("span",{className:"ambysb-title-text"},"收支损益关系图",o.default.createElement("span",{className:"amb-piechar-wrap-unit"},"(单位：万元)"))),B?o.default.createElement("div",{className:"amb-piechar-wrap"},o.default.createElement(g.default,{gainAndLoss:k})):"",o.default.createElement("div",{className:"amb-piechar-legend"},o.default.createElement("span",{className:"amb-piechar-amount-left"},o.default.createElement("span",{className:"amb-piechar-name-income"},(""===q?"0.00":(0,f.formatMoney)(q/1e4,2,""))+" 收入"),o.default.createElement("span",{className:"amb-piechar-income"})),o.default.createElement("span",{className:"amb-piechar-amount-right"},o.default.createElement("span",{className:"amb-piechar-pay"}),o.default.createElement("span",{className:"amb-piechar-name-pay"},"支出 "+(""===Q?"0.00":(0,f.formatMoney)(Q/1e4,2,"")))))),o.default.createElement("div",{className:"ambysb-charts-wrap"},o.default.createElement("div",{className:"ambysb-title",onClick:function(){return r(p.switchCharStatus(Y))}},o.default.createElement("span",{className:"ambysb-title-text"},T+"走势图",o.default.createElement("span",{className:"amb-piechar-wrap-unit"},"(单位：万元)")),o.default.createElement("span",{className:"ambysb-title-switch"},o.default.createElement(c.Icon,{type:"cutover"}),"切换类型")),B?o.default.createElement(d.default,{incomeBigger:X,status:T,lineData:U}):""),o.default.createElement("div",{className:"ambysb-charts-wrap"},o.default.createElement("div",{className:"ambysb-title",onClick:function(){return r(p.switchCharStatus(Y))}},o.default.createElement("span",{className:"ambysb-title-text"},T+"比较图",o.default.createElement("span",{className:"amb-piechar-wrap-unit"},"(单位：万元)")),o.default.createElement("span",{className:"ambysb-title-switch"},o.default.createElement(c.Icon,{type:"cutover"}),"切换类型")),B?"损益"===T&&!1===F?o.default.createElement("div",{className:"ambysb-ambbarchar-tip"},o.default.createElement("div",{className:"ambysb-ambbarchar-tip-img"},o.default.createElement("img",{src:"data:image/png;base64,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"})),o.default.createElement("div",{className:"ambysb-ambbarchar-tip-content"},"损益由收入与支出作差得出，无明细科目构成哦")):o.default.createElement(m.default,(A(e={incomeBigger:X,status:T,dispatch:r},"status",T),A(e,"assId",N),A(e,"barData",H),e)):"")))}}]),t}())||n;t.default=C},2293:function(e,t,a){},2295:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,r,o,i=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),s=c(a(0)),l=a(22),u=c(a(1264));a(13);function c(e){return e&&e.__esModule?e:{default:e}}var f=(0,l.immutableRenderDecorator)((o=r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,s.default.Component),i(t,[{key:"render",value:function(){var e=this.props,t=e.lineData,a=e.status,n=e.incomeBigger,r=t.map(function(e){return Number(e.get("name").substr(4,2))+"月"}).toJS(),o=t.map(function(e){return(e.get("amount")/1e4).toFixed(2)-0}).toJS(),i="",l="",c="",f="";({"收入":function(){return i="#ffa364",l="#fff3ed",c="#ffc8a3",f="#fff7f1"},"支出":function(){return i="#71a4e1",l="#f4f9ff",c="#b8d3ff",f="#eff7ff"},"损益":function(){return n?(i="#ffd092",l="#fff6e9",c="#ffe0b6",f="#fffaf3"):(i="#A1CFFF",l="#F8FBFF",c="#D3E5FF",f="#F6FAFF")}})[a]();var d={color:[i],tooltip:{trigger:"axis"},grid:{show:!0,bottom:"30px",top:"30px",backgroundColor:f,borderWidth:0},xAxis:{type:"category",boundaryGap:!1,data:r,axisLine:{lineStyle:{color:"#333"}},axisLabel:{textStyle:{fontSize:"14"}}},yAxis:{type:"value",axisLabel:{formatter:"{value}"},axisLine:{lineStyle:{color:"#fff"}},splitLine:{show:!0,lineStyle:{type:"dashed",color:c}}},series:[{name:"金额",type:"line",symbolSize:8,showSymbol:!0,label:{normal:{position:"right"}},areaStyle:{normal:{color:{type:"linear",x:0,y:0,x2:0,y2:1,colorStops:[{offset:0,color:i},{offset:1,color:l}],globalCoord:!1}}},data:o,markPoint:{show:!1,symbolSize:15,label:{normal:{textStyle:{color:"#2f4554",fontSize:18,fontWeight:"bold"},position:"top"}},data:[{type:"max",name:"最大值"},{type:"min",name:"最小值"}]}}]};return s.default.createElement(u.default,{option:d,className:"amb-linechar"})}}]),t}(),r.propTypes={},n=o))||n;t.default=f},2296:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,r,o,i=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),s=c(a(0)),l=a(22),u=c(a(1264));a(13);function c(e){return e&&e.__esModule?e:{default:e}}var f=(0,l.immutableRenderDecorator)((o=r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,s.default.Component),i(t,[{key:"render",value:function(){var e=this.props,t=e.barData,a=e.style,n=e.status,r=(e.assId,e.incomeBigger),o="",i="",l="",c="",f="";({"收入":function(){return o="#ffa364",i="#fff3ed",l="#ffc8a3",c="#fff7f1",f="#ff9f5e"},"支出":function(){return o="#71a4e1",i="#f4f9ff",l="#b8d3ff",c="#eff7ff",f="#75a9ff"},"损益":function(){return r?(o="#ffd092",i="#fff6e9",l="#ffe0b6",c="#fffaf3",f="#FFBC63"):(o="#A1CFFF",i="#F8FBFF",l="#D3E5FF",c="#F6FAFF",f="#A1CFFF")}})[n]();var d={normal:{position:"right"}},m=t.map(function(e){return e.get("name")}).toJS().reverse(),g=t.reduce(function(e,t){return e+Number(t.get("amount"))},0).toFixed(2),p=[];t.map(function(e){e.get("amount")<0?p.push({value:(e.get("amount")/1e4).toFixed(2)-0,label:d,itemStyle:{normal:{color:{type:"linear",x:0,y:0,x2:1,y2:0,colorStops:[{offset:0,color:o},{offset:1,color:i}],globalCoord:!1}}}}):p.push((e.get("amount")/1e4).toFixed(2)-0)}),p.reverse();var b={color:["#ff7b43"],tooltip:{trigger:"axis",axisPointer:{type:"shadow"},formatter:function(e){var a=t.getIn([t.size-1-e[0].dataIndex,"amount"]),n=(n=a/g*100)&&0!=g?n.toFixed(2):"-";return"<span>\n\t\t\t\t\t\t"+e[0].name+"\n\t\t\t\t\t\t<br/>\n\t\t\t\t\t\t● 金额："+(a/1e4).toFixed(2)+"\n\t\t\t\t\t\t<br/>\n\t\t\t\t\t\t● 占比："+n+"%\n\t\t\t\t\t</span>"}},grid:{show:!0,top:25,bottom:40,backgroundColor:c,borderWidth:0},xAxis:{type:"value",position:"botton",axisLabel:{textStyle:{fontSize:"14"}},splitLine:{lineStyle:{type:"dashed",color:l}}},yAxis:{type:"category",axisLine:{show:!1},axisTick:{show:!1},splitLine:{show:!1},data:m,axisLabel:{inside:!0,textStyle:{color:"#000",position:"insideLeft",fontSize:"14"}},z:10},series:[{name:"金额",type:"bar",itemStyle:{normal:{color:{type:"linear",x:0,y:0,x2:1,y2:0,colorStops:[{offset:0,color:i},{offset:1,color:o}],globalCoord:!1}}},barWidth:"40%",data:p,markLine:{symbol:"",lineStyle:{normal:{color:f,width:2}},label:{normal:{show:!1}},data:[{xAxis:0}]}}]};return s.default.createElement("div",{style:a},s.default.createElement(u.default,{option:b,className:"amb-Barchar"}))}}]),t}(),r.propTypes={},n=o))||n;t.default=f},2297:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,r,o,i=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),s=d(a(0)),l=a(22),u=d(a(1264)),c=a(13),f=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(a(25));function d(e){return e&&e.__esModule?e:{default:e}}var m=(0,l.immutableRenderDecorator)((o=r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,s.default.Component),i(t,[{key:"render",value:function(){var e=this.props.gainAndLoss,t=e.get("income")>0?(e.get("income")/1e4).toFixed(2)-0:0,a=e.get("pay")>0?(e.get("pay")/1e4).toFixed(2)-0:0,n=(e.get("ginAndLoss")/1e4).toFixed(2)-0,r=(0,c.formatMoney)(t,2,""),o=(0,c.formatMoney)(a,2,""),i=(0,c.formatMoney)(n,2,""),l="收入 "+r,d="支出 "+o,m=i+f.ENTER_TRANSFERRED+"损益",g=[],p=[],b={normal:{color:"transparent"}};if(t>a){var h=n<=a;g=[{value:a,name:"",itemStyle:b},{value:n,name:m,label:{normal:{position:"center",textStyle:{fontSize:17,fontWeight:"bold"}}},itemStyle:{normal:{color:"#ffbe92",borderWidth:1,borderColor:"#ffbe92"}}},{value:a,name:"",itemStyle:b}],p=[{value:a,name:d,itemStyle:{normal:{color:"#5ca7f2"}}},{value:n,name:""+(h?"":l),itemStyle:{normal:{color:"#ffa364",borderWidth:1,borderColor:"#ffbe92"}},label:{normal:{show:!1}}},{value:a,name:""+(h?l:""),itemStyle:{normal:{color:"#ffa364"}},label:{normal:{show:!1}}}]}else if(t<a){var y=-n>t;g=[{value:t,name:"",itemStyle:b},{value:-n,name:m,label:{normal:{position:"center",textStyle:{fontSize:17}}},itemStyle:{normal:{color:"#8dc1f6",borderWidth:1,borderColor:"#8dc1f6"}}},{value:t,name:"",itemStyle:b}],p=[{value:t,name:""+(y?"":d),itemStyle:{normal:{color:"#5ca7f2"}},label:{normal:{show:!1}}},{value:-n,name:""+(y?d:""),itemStyle:{normal:{color:"#5ca7f2",borderColor:"#8dc1f6"}},label:{normal:{show:!1}}},{value:t,name:l,itemStyle:{normal:{color:"#ffa364"}}}]}else t==a&&(g=[{value:n,name:"损益"+i,label:{normal:{position:"center",textStyle:{fontSize:17}}},itemStyle:b}],p=[{value:a,name:d,itemStyle:{normal:{color:"#5ca7f2"}}},{value:t,name:l,itemStyle:{normal:{color:"#ffa364"}}}]);var A={series:[{name:"收入",type:"pie",silent:!0,minAngle:1,radius:["10%","55%"],center:["50%","60%"],label:{normal:{textStyle:{color:"#666"}}},labelLine:{normal:{show:!1}},data:g},{minAngle:1,label:{normal:{show:!1}},silent:!0,name:"比例",type:"pie",radius:["55%","70%"],center:["50%","60%"],data:p}]};return s.default.createElement(u.default,{className:"amb-piechar",option:A})}}]),t}(),r.propTypes={},n=o))||n;t.default=m},2298:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.changeNeedCategory=t.handleCheckBoxShow=t.setCardName=t.changeAmbBeginDate=t.seAmbAsscategory=t.setAmbAssId=t.changeCharDidmount=t.switchCharStatus=t.getAMBIncomeStatementFetch=t.getPeriodAndAMBIncomeStatementFetch=t.getSyxmbCardList=void 0;var n,r=a(13),o=a(24),i=(n=o)&&n.__esModule?n:{default:n},s=f(a(181)),l=f(a(1585)),u=f(a(10)),c=f(a(25));function f(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}t.getSyxmbCardList=function(e,t,a){return function(n,o){var s=o().syxmbState.get("cardUuid"),u=o().syxmbState.get("beCategory"),c=o().syxmbState.get("needCategory");(0,i.default)("getSYXMBCardList","GET","begin="+(e?""+e.substr(0,4)+e.substr(5,2):"")+"&end="+(t?""+t.substr(0,4)+t.substr(5,2):""+e.substr(0,4)+e.substr(5,2)),function(o){if((0,r.showMessage)(o)){var i=void 0;!function e(t){return t.map(function(t){t.uuid===s&&(i=t),t.categoryList.length>0&&e(t.categoryList),t.cardList.length>0&&e(t.cardList)})}(o.data.jrJvCardList),"true"===a?(n({type:l.SET_CARD_NAME,name:"全部"}),n({type:l.SET_SYXMB_CARD_LIST,cardlist:o.data.jrJvCardList,cardUuid:""}),n(d(e,t,"",!0,c,a))):i?(n({type:l.SET_SYXMB_CARD_LIST,cardlist:o.data.jrJvCardList,cardUuid:s,haveCategory:i.categoryList.length>0}),n(d(e,t,s,u,c,a))):(n({type:l.SET_CARD_NAME,name:"全部"}),n({type:l.SET_SYXMB_CARD_LIST,cardlist:o.data.jrJvCardList,cardUuid:""}),n(d(e,t,"",!0,c,a)))}})}},t.getPeriodAndAMBIncomeStatementFetch=function(e,t,a,n,r){return function(r){r(d(e,t,a,n,"true"))}};var d=t.getAMBIncomeStatementFetch=function(e,t,a,n,o,f){return function(d){u.toast.loading(c.LOADING_TIP_TEXT,0),(0,i.default)("getSyxmbIncomeStatement","POST",JSON.stringify({begin:e?""+e.substr(0,4)+e.substr(5,2):"",end:t?""+t.substr(0,4)+t.substr(5,2):e?""+e.substr(0,4)+e.substr(5,2):"",cardUuid:a||"",beCategory:n?"true":"false",needCategory:o?"true":"false",getPeriod:f}),function(o){if(23001===o.code)u.toast.hide(),u.Alert(o.message,"收到");else if((0,r.showMessage)(o)){if(u.toast.hide(),"true"===f){var i=d(s.reportGetIssuedateAndFreshPeriod(o)),c=e||i;d({type:l.GET_AMB_INCOMESTATEMENT_FETCH,receivedData:o.data.ambIncomeStatementJson,issuedate:c,cardUuid:a,beCategory:n})}else d({type:l.GET_AMB_INCOMESTATEMENT_FETCH,receivedData:o.data,issuedate:e,endissuedate:t,cardUuid:a,beCategory:n});d(m(!0))}})}},m=(t.switchCharStatus=function(e){return{type:l.SWITCH_CHAR_STATUS,nextStatus:e}},t.changeCharDidmount=function(e){return{type:l.CHANGE_CHAR_DIDMOUNT,bool:e}});t.setAmbAssId=function(e){return{type:l.SET_AMB_ASSID,assId:e}},t.seAmbAsscategory=function(e){return{type:l.SET_AMB_ASSCATEGORY,assCategory:e}},t.changeAmbBeginDate=function(e,t){return{type:l.CHANGE_AMB_BEGIN_DATE,begin:e,bool:t}},t.setCardName=function(e){return function(t){t({type:l.SET_CARD_NAME,name:e})}},t.handleCheckBoxShow=function(e){return function(t){t({type:l.HANDLE_CHECKBOX_SHOW,bool:e})}},t.changeNeedCategory=function(e){return function(t){t({type:l.CHANGE_NEED_CATEGORY,bool:e})}}},2299:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:i,a=arguments[1];return((e={},o(e,r.INIT_AMBSYB,function(){return i}),o(e,r.CHANGE_CHAR_DIDMOUNT,function(){return t.setIn(["view","didMount"],a.bool)}),o(e,r.SWITCH_CHAR_STATUS,function(){return t.setIn(["view","status"],a.nextStatus)}),o(e,r.SET_AMB_ASSID,function(){return t.setIn(["view","assId"],a.assId)}),o(e,r.SET_AMB_ASSCATEGORY,function(){return t.setIn(["view","assCategory"],a.assCategory)}),o(e,r.SET_SYXMB_CARD_LIST,function(){var e=[{uuid:"",name:"全部",beCategory:!0,cardList:[],categoryList:[]}].concat(a.cardlist),r=!1;a.cardlist.map(function(e){e.beCategory&&(r=!0)}),""===a.cardUuid?(t=t.set("beCategory",!0),t=r?t.set("showCheck",!0):t.set("showCheck",!1)):t=a.haveCategory?t.set("showCheck",!0):t.set("showCheck",!1);var o=function e(t){return t.map(function(t,a){return t.categoryList&&t.categoryList.length?{key:""+t.uuid,label:t.name,childList:e(t.categoryList)}:t.cardList&&t.cardList.length?{key:""+t.uuid,label:t.name,childList:e(t.cardList)}:{key:""+t.uuid,label:t.name,childList:[]}})}(e);return t.set("cardList",(0,n.fromJS)(o)).set("cardUuid",a.cardUuid).set("initCardList",e)}),o(e,r.GET_AMB_INCOMESTATEMENT_FETCH,function(){return t=t.set("gainAndLoss",(0,n.fromJS)(a.receivedData.gainAndLoss)).set("trendMap",(0,n.fromJS)(a.receivedData.trendMap)).set("detailDrawing",(0,n.fromJS)(a.receivedData.detailDrawing)).set("issuedate",a.issuedate).set("endissuedate",a.endissuedate).set("cardUuid",a.cardUuid).set("beCategory",a.beCategory)}),o(e,r.CHANGE_AMB_BEGIN_DATE,function(){return t=a.bool?t.set("endissuedate",a.begin):t.set("issuedate",a.begin)}),o(e,r.SET_CARD_NAME,function(){return t.set("cardName",a.name)}),o(e,r.HANDLE_CHECKBOX_SHOW,function(){return t.set("showCheck",a.bool)}),o(e,r.CHANGE_NEED_CATEGORY,function(){return t.set("needCategory",a.bool)}),e)[a.type]||function(){return t})()};var n=a(9),r=function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}(a(1585));function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var i=(0,n.fromJS)({view:{status:"损益",assId:"",assCategory:"",didMount:!1},issuedate:"",endissuedate:"",cardName:"全部",cardUuid:"",cardList:[],initCardList:[],beCategory:!0,needCategory:!1,showCheck:!0,assList:[],gainAndLoss:{income:0,pay:0,ginAndLoss:0},trendMap:{incomeForMonth:[],payForMonth:[],ginAndLossForMonth:[]},detailDrawing:{incomeForMonth:[],payForMonth:[],ginAndLossForMonth:[]}})},975:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var n=r(a(2292));function r(e){return e&&e.__esModule?e:{default:e}}var o={syxmbState:r(a(2299)).default};t.reducer=o,t.view=n.default}}]);