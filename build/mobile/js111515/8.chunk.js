(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[8],{1039:function(t,e,a){"use strict";a.d(e,"a",(function(){return d})),a.d(e,"b",(function(){return g}));var n=a(4),i=a(1),c=a(57),s=a(14),r=a(12),u=a(2),o=Object(i.fromJS)({data:{categoryType:""},preData:{preAmount:0,receiveAmount:0},cxlsData:{selectedIndex:"0",idx:0},lsmxbData:{selectedIndex:"0",idx:0},zhmxbData:{selectedIndex:"0",idx:0},wlmxbData:{selectedIndex:"0",idx:0}});function d(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return((t={},Object(n.a)(t,L.GET_YLLS_SINGLE_ACCOUNT,(function(){var t=sessionStorage.getItem("ylPage");return e.set("data",Object(i.fromJS)(a.receivedData)).setIn(["".concat(t,"Data"),"selectedIndex"],a.selectedIndex).setIn(["".concat(t,"Data"),"idx"],a.idx)})),Object(n.a)(t,L.GET_YLLS_PREAMOUNT,(function(){return e.setIn(["preData","preAmount"],a.data.preAmount).setIn(["preData","receiveAmount"],a.data.amount)})),Object(n.a)(t,L.GET_YLLS_UNTREATEDAMOUNT,(function(){var t=0,n=0;return({accumulationAmount:function(){t=a.receivedData[a.amountType]+e.getIn(["data","acPayment","personAccumulationAmount"]),e=e.setIn(["data","accumulationAmount"],t)},socialSecurityAmount:function(){n=a.receivedData[a.amountType]+e.getIn(["data","acPayment","personSocialSecurityAmount"]),e=e.setIn(["data","socialSecurityAmount"],n)}}[a.amountType]||function(){return null})(),e})),t)[a.type]||function(){return e})()}var g={getYllsSingleAccount:function(t,e,a,n,i){return function(s){u.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(c.a)("getRunningBusiness","GET","uuid=".concat(a),(function(a){u.a.toast.hide(),Object(r.u)(a)&&(s({type:L.GET_YLLS_SINGLE_ACCOUNT,receivedData:a.data.result,selectedIndex:e,idx:n}),i&&t.push("/ylls"))}))}},getXczcAccumulationAmount:function(){return function(t,e){var a=e().yllsState,n=a.getIn(["data","categoryUuid"]),i=a.getIn(["data","runningDate"]);u.a.toast.loading(s.p,0),Object(c.a)("getPaymentInfo","POST",JSON.stringify({categoryUuid:n,runningDate:i,acType:"AC_GJJ",accumulationAcId:"",accumulationAssId1:"",accumulationCategory1:"",accumulationAssId2:"",accumulationCategory2:""}),(function(e){u.a.toast.hide(),Object(r.u)(e)&&t({type:L.GET_YLLS_UNTREATEDAMOUNT,receivedData:e.data.result,amountType:"accumulationAmount"})}))}},getXczcSocialSecurityAmount:function(){return function(t,e){var a=e().yllsState,n=a.getIn(["data","categoryUuid"]),i=a.getIn(["data","runningDate"]);Object(c.a)("getPaymentInfo","POST",JSON.stringify({categoryUuid:n,runningDate:i,acType:"AC_SB",socialSecurityAcId:"",socialSecurityAssId1:"",socialSecurityCategory1:"",socialSecurityAssId2:"",socialSecurityCategory2:""}),(function(e){Object(r.u)(e)&&t({type:L.GET_YLLS_UNTREATEDAMOUNT,receivedData:e.data.result,amountType:"socialSecurityAmount"})}))}}},L={GET_YLLS_SINGLE_ACCOUNT:"GET_YLLS_SINGLE_ACCOUNT",GET_YLLS_PREAMOUNT:"GET_YLLS_PREAMOUNT",GET_YLLS_UNTREATEDAMOUNT:"GET_YLLS_UNTREATEDAMOUNT"}},1049:function(t,e,a){"use strict";a.d(e,"b",(function(){return C})),a.d(e,"a",(function(){return T}));a(32),a(223),a(55),a(61),a(31),a(219),a(116),a(70),a(29),a(82),a(76);var n=a(51),i=a(4),c=a(1),s=a(57),r=a(17),u=a(14),o=a(12),d=a(2),g=a(1041),L=a(552),S=a(130),f={LB_YYSR:"acBusinessIncome",LB_YYZC:"acBusinessExpense",LB_YYWSR:"acBusinessOutIncome",LB_YYWZC:"acBusinessOutExpense",LB_JK:"acLoan",LB_TZ:"acInvest",LB_ZB:"acCapital",LB_CQZC:"acAssets",LB_FYZC:"acCost",LB_ZSKX:"acTemporaryReceipt",LB_ZFKX:"acTemporaryPay",LB_XCZC:"acPayment",LB_SFZC:"acTax"},l=Object(c.fromJS)({views:{accountUuid:"",accountName:"\u5168\u90e8",currentPage:1,pageCount:1,year:"",month:"",issues:[{value:"2018-01",key:""}],isLoading:!1,currentRouter:"CXLS",fromRouter:"",selectedIndex:"CXLS",isAccount:!1},period:{closedmonth:"",closedyear:"",firstmonth:"",firstyear:"",lastmonth:"",lastyear:""},dataList:[],ylDataList:[],accountList:[],data:{amount:"",runningAbstract:"",runningDate:"",cardUuid:"",accountUuid:""},categoryList:{assTypeList:[],AC_AR:[],AC_PP:[],AC_ADV:[],AC_AP:[]},hsgl:{activeTab:0,categoryList:[{key:"\u6536\u4ed8\u7ba1\u7406"}],contactsCardList:[{key:"\u5168\u90e8\u5f80\u6765\u5355\u4f4d",value:"".concat(u.B).concat(u.B,"\u5168\u90e8\u5f80\u6765\u5355\u4f4d")}],stockCardList:[{key:"\u5168\u90e8\u5b58\u8d27",value:"".concat(u.B).concat(u.B,"\u5168\u90e8\u5b58\u8d27")}],contactsCard:{uuid:"",code:"",name:"\u5168\u90e8\u5f80\u6765\u5355\u4f4d"},stockCard:{uuid:"",code:"",name:"\u5168\u90e8\u5b58\u8d27"},cardNameList:[],isCheck:!1,billMakeOutType:"",billAuthType:"",runningState:"",dataList:[]},projectCardList:[]});function C(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:l,a=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return((t={},Object(i.a)(t,I.INIT_CXLS,(function(){return l})),Object(i.a)(t,I.GETPERIOD_AND_BUSINESSLIST,(function(){var t=a.receivedData.periodDtoJson,n=(Number(t.firstyear),Number(t.lastyear),Number(t.firstmonth),Number(t.lastmonth),Number(t.openedyear)),i=Number(t.openedmonth),s=i<10?"0"+i:i,r=[];return a.receivedData.result.childList.forEach((function(t,e){r.push({idx:e,uuid:t.uuid})})),e.set("period",Object(c.fromJS)(a.period)).setIn(["views","year"],n).setIn(["views","month"],s).setIn(["views","issues"],Object(c.fromJS)(a.issues)).setIn(["views","pageCount"],a.receivedData.pageCount).setIn(["views","currentRouter"],"CXLS").set("dataList",Object(c.fromJS)(a.receivedData.result.childList)).set("ylDataList",Object(c.fromJS)(r))})),Object(i.a)(t,I.GET_BUSINESSLIST,(function(){if(a.shouldConcat){var t=e.get("dataList").toJS().concat(a.receivedData.result.childList),n=[];t.forEach((function(t,e){n.push({idx:e,uuid:t.uuid})})),e=e.set("dataList",Object(c.fromJS)(t)).set("ylDataList",Object(c.fromJS)(n))}else{var i=[];a.receivedData.result.childList.forEach((function(t,e){i.push({idx:e,uuid:t.uuid})})),e=e.set("dataList",Object(c.fromJS)(a.receivedData.result.childList)).set("ylDataList",Object(c.fromJS)(i))}return e.setIn(["views","currentPage"],a.currentPage).setIn(["views","pageCount"],a.receivedData.pageCount)})),Object(i.a)(t,I.CXACCOUNT_SELECT_LSALL,(function(){switch(a.selectedIndex){case"CXLS":e=e.update("dataList",(function(t){return t.map((function(t){return t.set("selected",a.value)}))}));break;case"CX_HSGL":e=e.updateIn(["hsgl","dataList"],(function(t){return t.map((function(t){return t.set("selected",a.value)}))}))}return e})),Object(i.a)(t,I.CXACCOUNT_SELECT_LS,(function(){return e.updateIn(["dataList",a.idx,"selected"],(function(t){return!t}))})),Object(i.a)(t,I.GET_CXLS_RUNNING_ACCOUNT,(function(){var t=[];return a.receivedData.resultList[0]&&a.receivedData.resultList[0].childList.forEach((function(e){t.push({key:e.name,value:"".concat(e.uuid).concat(u.B).concat(e.name)})})),e.set("accountList",Object(c.fromJS)(t))})),Object(i.a)(t,I.CHANGE_CXLS_DATA,(function(){return e.setIn(a.dataType,a.value)})),Object(i.a)(t,I.GET_CXLS_SINGLE,(function(){var t=a.receivedData.categoryType,n=f[t];switch(a.toRouter){case"SFGL":var i=a.receivedData.usedCard,s=a.receivedData.runningDate?a.receivedData.runningDate:"",r=Math.abs(a.receivedData.notHandleAmount),u=a.receivedData.runningAbstract?a.receivedData.runningAbstract:"";e=e.setIn(["data","amount"],r).setIn(["data","notHandleAmount"],r).setIn(["data","runningAbstract"],u).setIn(["data","uuidList"],Object(c.fromJS)([{uuid:a.uuid,assType:a.receivedData.assType}])).setIn(["data","runningDate"],s).setIn(["data","contactsCardRange"],Object(c.fromJS)(i)).setIn(["data","cardUuid"],i.uuid).setIn(["data","amountTitle"],a.amountTitle);break;case"JZCB":var o=[],d=[],g=[],L=a.receivedData.childList;L.length>1?L.forEach((function(t){var e=t.acBusinessIncome.stockCardList[0];t.canBeCarryover&&!t.beCarryover&&(g.push(t.uuid),o.push(e),d.push({uuid:e.uuid,amount:""}),e.amount=t.amount)})):(g.push(a.receivedData.uuid),o=a.receivedData[n].stockCardList,d.push({uuid:o[0].uuid,amount:""})),e=e.setIn(["data","runningAbstract"],a.receivedData.runningAbstract).setIn(["data","categoryUuid"],a.receivedData.categoryUuid).setIn(["data","uuidList"],Object(c.fromJS)(g)).setIn(["data","runningDate"],a.receivedData.runningDate).setIn(["data","runningState"],a.receivedData.runningState).setIn(["data","stockCardList"],Object(c.fromJS)(o)).setIn(["data","cardList"],Object(c.fromJS)(d));break;case"KJFP":var S="BILL_MAKE_OUT_TYPE_XS";"STATE_YYSR_TS"==a.receivedData.runningState&&(S="BILL_MAKE_OUT_TYPE_TS"),e=e.setIn(["data","runningAbstract"],a.receivedData.runningAbstract).setIn(["data","categoryUuid"],a.receivedData.categoryUuid).setIn(["data","uuidList"],Object(c.fromJS)([a.receivedData.uuid])).setIn(["data","runningDate"],a.receivedData.runningDate).setIn(["data","billMakeOutType"],S);break;case"FPRZ":var l="BILL_AUTH_TYPE_CG";"STATE_YYZC_TG"==a.receivedData.runningState&&(l="BILL_AUTH_TYPE_TG"),e=e.setIn(["data","runningAbstract"],a.receivedData.runningAbstract).setIn(["data","categoryUuid"],a.receivedData.categoryUuid).setIn(["data","uuidList"],Object(c.fromJS)([a.receivedData.uuid])).setIn(["data","runningDate"],a.receivedData.runningDate).setIn(["data","billAuthType"],l).setIn(["data","authBusinessUuid"],"");break;case"JZSY":var C=Number(a.receivedData.amount)-Number(a.receivedData.tax);e=e.setIn(["data","runningAbstract"],"\u5904\u7f6e\u635f\u76ca").setIn(["data","categoryUuid"],a.receivedData.categoryUuid).setIn(["data","categoryName"],a.receivedData.categoryName).setIn(["data","businessList"],Object(c.fromJS)([a.receivedData])).setIn(["data","businessList",0,"beSelect"],!0).setIn(["data","runningDate"],a.receivedData.runningDate).setIn(["data","amount"],C).setIn(["data","acAssets","originalAssetsAmount"],"").setIn(["data","acAssets","depreciationAmount"],"").setIn(["data","beProject"],a.receivedData.beProject).setIn(["data","usedProject"],a.receivedData.beProject).setIn(["data","projectRange"],a.receivedData.projectRange).setIn(["data","projectCard"],Object(c.fromJS)([{amount:""}]));break;default:console.log("\u83b7\u53d6\u5355\u6761\u6570\u636e\u5931\u8d25")}return e.setIn(["views","currentRouter"],a.toRouter).setIn(["views","fromRouter"],a.fromRouter)})),Object(i.a)(t,I.CXLS_CXHSGL_ALLBATCH,(function(){var t=e.getIn(["hsgl","dataList"]);switch(a.fromRouter){case"CX_SFGL":var n=e.getIn(["hsgl","contactsCard"]),i=new o.a(new Date).valueOf(),s=[],r=0,u="\u6536\u6b3e\u91d1\u989d";t.forEach((function(t){if(t.get("selected")){s.push({uuid:t.get("uuid"),assType:t.get("assType")});var e=t.get("flowType"),a=t.get("direction"),n=Number(t.get("notHandleAmount")),i=t.get("runningState");"STATE_YYSR_TS"!==i&&"STATE_YYZC_TG"!==i||(n=-Math.abs(n)),"FLOW_INADVANCE"==e?"credit"==a?r+=n:r-=n:"credit"==a?r-=n:r+=n}})),r<0&&(u="\u4ed8\u6b3e\u91d1\u989d"),e=e.setIn(["data","amount"],Math.abs(r)).setIn(["data","runningAbstract"],"").setIn(["data","uuidList"],Object(c.fromJS)(s)).setIn(["data","runningDate"],i).setIn(["data","contactsCardRange"],n).setIn(["data","cardUuid"],n.get("uuid")).setIn(["data","amountTitle"],u).setIn(["views","currentRouter"],"SFGL").setIn(["views","selectedIndex"],"CX_SFGL");break;case"CX_JZCB":var d=[],g=0;t.forEach((function(t){t.get("selected")&&(d.push(t.get("uuid")),g+=Number(t.get("amount")))}));var L=e.getIn(["hsgl","stockCard"]).set("amount",g),S=[{uuid:L.get("uuid"),amount:""}];e=e.setIn(["data","runningAbstract"],"").setIn(["data","categoryUuid"],"").setIn(["data","uuidList"],Object(c.fromJS)(d)).setIn(["data","runningState"],e.getIn(["hsgl","runningState"])).setIn(["data","stockCardList"],Object(c.fromJS)([L])).setIn(["data","cardList"],Object(c.fromJS)(S)).setIn(["views","currentRouter"],"JZCB").setIn(["views","selectedIndex"],"CX_JZCB");break;case"CX_KJFP":var f=[];t.forEach((function(t){t.get("selected")&&f.push(t.get("uuid"))})),e=e.setIn(["data","runningAbstract"],"").setIn(["data","categoryUuid"],"").setIn(["data","uuidList"],Object(c.fromJS)(f)).setIn(["data","billMakeOutType"],e.getIn(["hsgl","billMakeOutType"])).setIn(["views","currentRouter"],"KJFP").setIn(["views","selectedIndex"],"CX_KJFP");break;case"CX_FPRZ":var l=[];t.forEach((function(t){t.get("selected")&&l.push(t.get("uuid"))})),e=e.setIn(["data","runningAbstract"],"").setIn(["data","categoryUuid"],"").setIn(["data","uuidList"],Object(c.fromJS)(l)).setIn(["data","billAuthType"],e.getIn(["hsgl","billAuthType"])).setIn(["data","authBusinessUuid"],"").setIn(["views","currentRouter"],"FPRZ").setIn(["views","selectedIndex"],"CX_FPRZ");break;default:console.log("\u4e00\u952e\u6570\u636e\u5931\u8d25")}return e.setIn(["views","fromRouter"],"CX_HSGL")})),Object(i.a)(t,I.GET_CXLS_HSGL_CARDLIST,(function(){var t=[],n=[],i="stockCardList"==a.cardType?"\u5168\u90e8\u5b58\u8d27":"\u5168\u90e8\u5f80\u6765\u5355\u4f4d";return a.data.forEach((function(e){t.push({key:"".concat(e.code," ").concat(e.name),value:"".concat(e.uuid).concat(u.B).concat(e.code).concat(u.B).concat(e.name)}),n.push("".concat(e.code," ").concat(e.name))})),t.unshift({key:i,value:"".concat(u.B).concat(u.B).concat(i)}),n.unshift(i),e.setIn(["hsgl",a.cardType],Object(c.fromJS)(t)).setIn(["hsgl","cardNameList"],Object(c.fromJS)(n))})),Object(i.a)(t,I.CHANGE_CXLS_CARD,(function(){var t=a.value.split(u.B),n={};return n.uuid=t[0],n.code=t[1],n.name=t[2],e.setIn(["hsgl",a.dataType],Object(c.fromJS)(n))})),Object(i.a)(t,I.CXHSGL_TO_YLDATA,(function(){var t=[];return e.getIn(["hsgl","dataList"]).forEach((function(e,n){switch(a.fromRouter){case"CX_SFGL":e.get("beOpened")||t.push({idx:n,uuid:e.get("uuid")});break;case"CX_JZCB":t.push({idx:n,uuid:e.get("parentUuid")?e.get("parentUuid"):e.get("uuid")});break;case"CX_KJFP":case"CX_FPRZ":t.push({idx:n,uuid:e.get("parentUuid")});break;default:console.log("\u751f\u6210\u9884\u89c8\u6d41\u6c34\u6570\u636e\u5931\u8d25")}})),e.set("ylDataList",Object(c.fromJS)(t))})),Object(i.a)(t,I.CXLS_SFGL_CATEGORYLIST,(function(){var t=e.getIn(["categoryList","assTypeList"]).toJS(),n=[];return t.push({assType:a.assType,uuid:a.uuid}),a.data.forEach((function(t){n.push({key:"".concat(t.name),value:"".concat(t.uuid).concat(u.B).concat(t.name)})})),e.setIn(["categoryList",a.assType],Object(c.fromJS)(n)).setIn(["categoryList","assTypeList"],Object(c.fromJS)(t))})),Object(i.a)(t,I.CHANGE_CXLS_SFGL_CATEGORY,(function(){var t=a.value.split(u.B),n=(e.getIn(["data","uuidList"]),e.getIn(["categoryList","assTypeList",a.idx,"uuid"]));return e.setIn(["categoryList","assTypeList",a.idx,"name"],t[1]).setIn(["categoryList","assTypeList",a.idx,"categoryUuid"],t[0]).updateIn(["data","uuidList"],(function(e){return e.map((function(e){return e.get("uuid")==n&&(e=e.set("categoryUuid",t[0]).set("beOpened",!0)),e}))}))})),Object(i.a)(t,I.CXLS_GET_PROJECT_CARDLIST,(function(){var t=[];return a.receivedData.forEach((function(e,a){t.push({key:"".concat(e.code," ").concat(e.name),value:"".concat(e.uuid).concat(u.B).concat(e.code).concat(u.B).concat(e.name)})})),e.set("projectCardList",Object(c.fromJS)(t))})),t)[a.type]||function(){return e})()}var T={getPeriodAndBusinessList:function(){return function(t){d.a.toast.loading(u.p,0),Object(s.a)("getRunningBusinessList","POST",JSON.stringify({accountUuid:"",currentPage:1,getPeriod:"true",month:"",pageSize:20,year:""}),(function(e){if(Object(o.u)(e)){d.a.toast.hide();var a=e.data.periodDtoJson?t(S.d(e.data.periodDtoJson)):[];t({type:I.GETPERIOD_AND_BUSINESSLIST,receivedData:e.data,issues:a})}}))}},getBusinessList:function(t,e,a){return function(n,i){var c=i().cxAccountState.get("views"),r=c.get("year"),g=c.get("month"),L=c.get("isAccount"),S=c.get("accountUuid");!e&&d.a.toast.loading(u.p,0),Object(s.a)("getRunningBusinessList","POST",JSON.stringify({isAccount:L,accountUuid:S,currentPage:t,getPeriod:"true",month:g,pageSize:20,year:r}),(function(i){!e&&d.a.toast.hide(),Object(o.u)(i)&&(e&&a.setState({isLoading:!1}),L&&i.data.result.msg.length&&d.a.toast.info(i.data.result.msg),n({type:I.GET_BUSINESSLIST,receivedData:i.data,currentPage:t,shouldConcat:e}))}))}},selectLsAll:function(t,e){return{type:I.CXACCOUNT_SELECT_LSALL,selectedIndex:t,value:e}},selectLs:function(t,e){return{type:I.CXACCOUNT_SELECT_LS,selectedIndex:t,idx:e}},deleteLs:function(t,e){return function(a){d.a.Confirm({message:"\u786e\u5b9a\u5220\u9664\u5417",title:"\u63d0\u793a",buttonLabels:["\u53d6\u6d88","\u786e\u5b9a"],onSuccess:function(n){if(1===n.buttonIndex){var i=t.filter((function(t){return t.get("selected")})).map((function(t){return t.get("uuid")}));d.a.toast.loading(u.p,0),Object(s.a)("deleteRunningbusiness","POST",JSON.stringify({deleteList:i}),(function(t){if(Object(o.u)(t)){if(t.data.errorList.length){var n=t.data.errorList.reduce((function(t,e){return t+","+e}));d.a.Alert(n)}a(T.recapture(e))}}))}},onFail:function(t){return alert(t)}})}},recapture:function(t){return function(e){switch(t){case"CXLS":e(T.getBusinessList(1,!1));break;case"CX_SFGL":e(T.getManageList());break;case"CX_KJFP":e(T.getKjfpList());break;case"CX_FPRZ":e(T.getFprzList());break;case"CX_JZCB":e(T.getFirstStockCardList()),e(T.getJzcbList());break;default:console.log("\u91cd\u65b0\u83b7\u53d6\u6570\u636e\u5931\u8d25")}}},getRunningAccount:function(){return function(t){Object(s.a)("getRunningAccount","GET","",(function(e){Object(o.u)(e)&&t({type:I.GET_CXLS_RUNNING_ACCOUNT,receivedData:e.data})}))}},getCxlsSingle:function(t,e,a,n){return function(i){d.a.toast.loading(u.p,0),Object(s.a)("getRunningBusiness","GET","uuid=".concat(t),(function(c){d.a.toast.hide(),Object(o.u)(c)&&i({type:I.GET_CXLS_SINGLE,receivedData:c.data.result,fromRouter:e,toRouter:a,amountTitle:n,uuid:t})}))}},changeCxlsData:function(t,e){return{type:I.CHANGE_CXLS_DATA,dataType:t,value:e}},saveSfgl:function(){return function(t,e){var a=e().cxAccountState,i=a.get("data").toJS(),r=i.amount,g=i.notHandleAmount,L=a.getIn(["categoryList","assTypeList"]);return""==i.accountUuid?d.a.toast.info("\u8bf7\u9009\u62e9\u8d26\u6237"):""==i.runningAbstract?d.a.toast.info("\u8bf7\u586b\u5199\u6458\u8981"):i.runningAbstract.length>u.y?d.a.toast.info("\u6458\u8981\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc7".concat(u.y,"\u4e2a\u5b57\u7b26")):r<=0?d.a.toast.info("\u8bf7\u586b\u5199\u91d1\u989d"):r>g?d.a.toast.info("\u6536\u4ed8\u6b3e\u91d1\u989d\u5927\u4e8e\u5b9e\u9645\u53d1\u751f\u91d1\u989d"):L.size&&L.some((function(t){return!t.get("categoryUuid")}))?d.a.toast.info("\u8bf7\u9009\u62e9\u6240\u6709\u7684\u671f\u521d\u7c7b\u522b"):(d.a.toast.loading(u.p,0),void Object(s.a)("insertRunningpayment","POST",JSON.stringify(Object(n.a)({},i)),(function(e){if(d.a.toast.hide(),Object(o.u)(e)){d.a.toast.success("\u4fdd\u5b58\u6210\u529f",2);var n=a.getIn(["views","fromRouter"]);t(T.changeCxlsData(["views","currentRouter"],n)),t(T.changeCxlsData(["categoryList","assTypeList"],Object(c.fromJS)([]))),"CXLS"==n&&t(T.getBusinessList(1,!1))}})))}},saveJzcb:function(){return function(t,e){var a=e().cxAccountState,i=a.get("data").toJS(),c=i.cardList,r=i.uuidList,g=[],L=[];return c.forEach((function(t,e){t.amount>0&&(g.push(t),L.push(r[e]))})),""==i.runningAbstract?d.a.toast.info("\u8bf7\u586b\u5199\u6458\u8981"):i.runningAbstract.length>u.y?d.a.toast.info("\u6458\u8981\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc7".concat(u.y,"\u4e2a\u5b57\u7b26")):0==L.length?d.a.toast.info("\u8bf7\u586b\u5199\u6210\u672c\u91d1\u989d"):(d.a.toast.loading(u.p,0),void Object(s.a)("insertCarryoverItem","POST",JSON.stringify(Object(n.a)({},i,{cardList:g,uuidList:L})),(function(e){if(d.a.toast.hide(),Object(o.u)(e)){var n=a.getIn(["views","fromRouter"]);t(T.changeCxlsData(["views","currentRouter"],n)),"CXLS"==n&&t(T.getBusinessList(1,!1))}})))}},saveKjfp:function(){return function(t,e){var a=e().cxAccountState,i=a.get("data").toJS();return""==i.runningAbstract?d.a.toast.info("\u8bf7\u586b\u5199\u6458\u8981"):i.runningAbstract.length>u.y?d.a.toast.info("\u6458\u8981\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc7".concat(u.y,"\u4e2a\u5b57\u7b26")):(d.a.toast.loading(u.p,0),void Object(s.a)("insertBusinessMakeoutItem","POST",JSON.stringify(Object(n.a)({},i)),(function(e){if(d.a.toast.hide(),Object(o.u)(e)){var n=a.getIn(["views","fromRouter"]);t(T.changeCxlsData(["views","currentRouter"],n)),"CXLS"==n&&t(T.getBusinessList(1,!1))}})))}},saveFprz:function(){return function(t,e){var a=e().cxAccountState,i=a.get("data").toJS();return""==i.runningAbstract?d.a.toast.info("\u8bf7\u586b\u5199\u6458\u8981"):i.runningAbstract.length>u.y?d.a.toast.info("\u6458\u8981\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc7".concat(u.y,"\u4e2a\u5b57\u7b26")):(d.a.toast.loading(u.p,0),void Object(s.a)("insertBusinessAuthItem","POST",JSON.stringify(Object(n.a)({},i)),(function(e){if(d.a.toast.hide(),Object(o.u)(e)){var n=a.getIn(["views","fromRouter"]);t(T.changeCxlsData(["views","currentRouter"],n)),"CXLS"==n&&t(T.getBusinessList(1,!1))}})))}},saveJzsy:function(){return function(t,e){var a=e().cxAccountState,i=a.get("data").toJS(),c=i.usedProject,r=i.projectCard;if(c&&!r.every((function(t){return t.uuid})))return d.a.toast.info("\u6709\u672a\u9009\u62e9\u7684\u9879\u76ee\u5361\u7247");if(""==i.runningAbstract)return d.a.toast.info("\u8bf7\u586b\u5199\u6458\u8981");if(i.runningAbstract.length>u.y)return d.a.toast.info("\u6458\u8981\u957f\u5ea6\u4e0d\u80fd\u8d85\u8fc7".concat(u.y,"\u4e2a\u5b57\u7b26"));var o=i.acAssets.originalAssetsAmount,g=i.acAssets.depreciationAmount;return o<=0?d.a.toast.info("\u8bf7\u586b\u5199\u8d44\u4ea7\u539f\u503c"):g<=0?d.a.toast.info("\u8bf7\u586b\u5199\u7d2f\u8ba1\u6298\u65e7"):Number(g)>Number(o)?d.a.toast.info("\u6298\u65e7\u989d\u4e0d\u80fd\u5927\u4e8e\u539f\u503c"):(d.a.toast.loading(u.p,0),void Object(s.a)("insertJzsy","POST",JSON.stringify(Object(n.a)({},i,{enclosureList:[]})),(function(e){if(d.a.toast.hide(),0!==e.code)d.a.toast.fail("".concat(e.code," ").concat(e.message));else{var n=a.getIn(["views","fromRouter"]);t(T.changeCxlsData(["views","currentRouter"],n)),"CXLS"==n&&t(T.getBusinessList(1,!1))}})))}},insertRunningBusinessVc:function(t){return function(e,a){d.a.toast.loading(u.p,0),Object(s.a)("insertRunningBusinessVc","POST",JSON.stringify({uuidList:[t]}),(function(t){if(d.a.toast.hide(),Object(o.u)(t)){if(t.data.result.length){var n=t.data.result.reduce((function(t,e){return t+","+e}));return void d.a.Alert(n)}var i=a().cxAccountState.getIn(["views","selectedIndex"]);e(T.recapture(i))}}))}},deleteRunningBusinessVc:function(t,e,a){return function(n,i){d.a.toast.loading(u.p,0),Object(s.a)("deletevc","POST",JSON.stringify({year:t,month:e,vcindexlist:a}),(function(t){if(d.a.toast.hide(),Object(o.u)(t)){var e=i().cxAccountState.getIn(["views","selectedIndex"]);n(T.recapture(e))}}))}},getBusinessManagerCardList:function(){return function(t){Object(s.a)("getBusinessManagerCardList","POST",JSON.stringify({}),(function(e){Object(o.u)(e)&&(t({type:I.GET_CXLS_HSGL_CARDLIST,data:e.data.cardList,cardType:"contactsCardList"}),t(T.changeCxlsData(["hsgl","categoryList"],Object(c.fromJS)(e.data.categoryList))))}))}},changeCxlsCard:function(t,e){return{type:I.CHANGE_CXLS_CARD,dataType:t,value:e}},getManageList:function(){return function(t,e){var a=e().cxAccountState.get("hsgl"),n=a.getIn(["contactsCard","uuid"]),i=a.get("isCheck");d.a.toast.loading(u.p,0),Object(s.a)("getManageList","POST",JSON.stringify({cardUuid:n,isCheck:""!=n&&i}),(function(e){d.a.toast.hide(),Object(o.u)(e)&&t(T.changeCxlsData(["hsgl","dataList"],Object(c.fromJS)(e.data.result.childList)))}))}},getKjfpList:function(){return function(t,e){var a=e().cxAccountState.get("hsgl").get("billMakeOutType");d.a.toast.loading(u.p,0),Object(s.a)("getBusinessMakeoutList","POST",JSON.stringify({billMakeOutType:a,categoryUuid:"",runningDate:"",searchContent:"",searchType:""}),(function(e){d.a.toast.hide(),Object(o.u)(e)&&t(T.changeCxlsData(["hsgl","dataList"],Object(c.fromJS)(e.data.result)))}))}},getFprzList:function(){return function(t,e){var a=e().cxAccountState.get("hsgl").get("billAuthType");d.a.toast.loading(u.p,0),Object(s.a)("getBusinessAuthList","POST",JSON.stringify({billAuthType:a,categoryUuid:"",runningDate:"",searchContent:"",searchType:""}),(function(e){d.a.toast.hide(),Object(o.u)(e)&&t(T.changeCxlsData(["hsgl","dataList"],Object(c.fromJS)(e.data.result)))}))}},getFirstStockCardList:function(){return function(t,e){var a=e().homeState.getIn(["data","userInfo","sobInfo","sobId"]);Object(s.a)("getRunningStockMemberList","POST",JSON.stringify({sobId:a,property:"",listByCategory:"true",categoryUuid:"",subordinateUuid:""}),(function(e){Object(o.u)(e)&&t({type:I.GET_CXLS_HSGL_CARDLIST,data:e.data.resultList,cardType:"stockCardList"})}))}},getJzcbList:function(){return function(t,e){var a=e().cxAccountState.get("hsgl"),n=a.getIn(["stockCard","uuid"]),i=a.get("runningState");d.a.toast.loading(u.p,0),Object(s.a)("getCarryoverList","POST",JSON.stringify({runningDate:"",runningState:i,cardUuid:n,categoryUuid:"",searchContent:"",searchType:""}),(function(e){d.a.toast.hide(),Object(o.u)(e)&&t(T.changeCxlsData(["hsgl","dataList"],Object(c.fromJS)(e.data.result)))}))}},getVcFetch:function(t,e){return function(a){d.a.toast.loading(u.p,0),Object(r.g)("getvc","POST",JSON.stringify({vcindex:t.get("vcIndex"),year:t.get("year"),month:t.get("month")}),(function(t){d.a.toast.hide(),Object(o.u)(t)&&(e.push("/lrpz"),a(Object(g.j)(t.data)),sessionStorage.setItem("from-cxls",!0),a(L.d(!0)))}))}},cxhsglAllBatch:function(t){return{type:I.CXLS_CXHSGL_ALLBATCH,fromRouter:t}},hsglToYlData:function(t){return{type:I.CXHSGL_TO_YLDATA,fromRouter:t}},getSfglCategoryList:function(t,e){return function(a){Object(s.a)("getManagerCategoryList","POST",JSON.stringify({assType:t}),(function(n){Object(o.u)(n)&&a({type:I.CXLS_SFGL_CATEGORYLIST,data:n.data,assType:t,uuid:e})}))}},changeSfglCategory:function(t,e){return{type:I.CHANGE_CXLS_SFGL_CATEGORY,idx:e,value:t}},getProjectCardList:function(t){return function(e,a){var n=a().homeState.getIn(["data","userInfo","sobInfo","sobId"]);d.a.toast.loading(u.p,0),Object(s.a)("getProjectCardList","POST",JSON.stringify({sobId:n,categoryList:t,needCommonCard:!1}),(function(t){d.a.toast.hide(),Object(o.u)(t)&&e({type:I.CXLS_GET_PROJECT_CARDLIST,receivedData:t.data.result})}))}}},I={GETPERIOD_AND_BUSINESSLIST:"GETPERIOD_AND_BUSINESSLIST",CXACCOUNT_SELECT_LSALL:"CXACCOUNT_SELECT_LSALL",CXACCOUNT_SELECT_LS:"CXACCOUNT_SELECT_LS",GET_BUSINESSLIST:"GET_BUSINESSLIST",GET_CXLS_RUNNING_ACCOUNT:"GET_CXLS_RUNNING_ACCOUNT",CHANGE_CXLS_DATA:"CHANGE_CXLS_DATA",GET_CXLS_SINGLE:"GET_CXLS_SINGLE",GET_CXLS_HSGL_CARDLIST:"GET_CXLS_HSGL_CARDLIST",CHANGE_CXLS_CARD:"CHANGE_CXLS_CARD",CXLS_CXHSGL_ALLBATCH:"CXLS_CXHSGL_ALLBATCH",CXHSGL_TO_YLDATA:"CXHSGL_TO_YLDATA",INIT_CXLS:"INIT_CXLS",CXLS_SFGL_CATEGORYLIST:"CXLS_SFGL_CATEGORYLIST",CHANGE_CXLS_SFGL_CATEGORY:"CHANGE_CXLS_SFGL_CATEGORY",CXLS_GET_PROJECT_CARDLIST:"CXLS_GET_PROJECT_CARDLIST"}}}]);