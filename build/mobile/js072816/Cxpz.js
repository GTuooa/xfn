(window.webpackJsonp=window.webpackJsonp||[]).push([[119],{1214:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,n=arguments[1];return((e={},u(e,a.INIT_LRPZ,function(){return o.set("year",t.get("year")).set("month",t.get("month")).set("vcdate",t.get("vcdate")).set("vcindex",t.get("vcindex"))}),u(e,a.SET_CKPZ_IS_SHOW,function(){return t.setIn(["flags","showckpz"],n.bool)}),u(e,a.CHANGE_SELECT_COMPONENT_DISPLAY,function(){return t.updateIn(["flags","selectComponentDisplay"],function(e){return!e})}),u(e,a.SELECT_JV,function(){return t.setIn(["flags","jvSelectedIdx"],n.idx)}),u(e,a.INSERT_JV,function(){var e=s(t),r=e.getIn(["flags","debitTotal"])-e.getIn(["flags","creditTotal"]);return s(t.update("jvlist",function(e){return e.insert(n.idx+1,e.get(n.idx).update("jvdirection",function(e){return r>0?"credit":"debit"}).set("jvamount",Math.abs(r).toFixed(2)-0||"").set("acid","").set("acname","").set("acfullname","").set("asslist",[]).set("acunitOpen","0").set("jvcount","").set("price","").set("jvunit","").set("fcStatus","0").set("fcNumber","").set("exchange","").set("standardAmount",""))}))}),u(e,a.DELETE_JV,function(){return s(t.get("jvlist").size>1?t.deleteIn(["jvlist",n.idx]):t)}),u(e,a.DELETE_JV_ALL,function(){return s(t.update("jvlist",function(e){return e.clear()}))}),u(e,a.CHANGE_VC_ID,function(){return t.set("vcindex",Number(n.vcindex))}),u(e,a.CHANGE_JV_ABSTRACT,function(){return t.setIn(["jvlist",n.idx,"jvabstract"],n.jvabstract)}),u(e,a.CHANGE_JV_ACID_AND_ACNAME_AND_ASSCATEGORYLIST,function(){var e=n.asscategorylist.map(function(e){return(0,r.fromJS)({assid:"",assname:"",asscategory:e})});return t.updateIn(["jvlist",n.idx],function(t){return t.set("acid",n.acid).set("acfullname",n.acfullname).set("acname",n.acname).set("asslist",e)})}),u(e,a.CHANGE_JV_AMOUNT,function(){return(/^[-\d]\d*\.?\d{0,2}$/g.test(n.jvamount)||""===n.jvamount)&&(t=s(t=t.setIn(["jvlist",n.idx,"jvamount"],n.jvamount))),t}),u(e,a.CHANGE_JV_DIRECTION,function(){return s(t.updateIn(["jvlist",n.idx,"jvdirection"],function(e){return"credit"==e?"debit":"credit"}))}),u(e,a.CHANGE_JV_ASSID_AND_ASSNAME,function(){return t.updateIn(["jvlist",n.idx,"asslist"],function(e){return e.map(function(e){return e.get("asscategory")==n.asscategory?e.set("assid",n.assid).set("assname",n.assname):e})})}),u(e,a.PUSH_VOUCHER_TO_LRPZ_REDUCER,function(){if(!n.voucher)return t;var e=(0,r.fromJS)(n.voucher);return s(t.merge(e).set("oldvcindex",e.get("vcindex")).set("oldyear",e.get("year")).set("oldmonth",e.get("month")).set("oldvcdate",e.get("vcdate")))}),u(e,a.GET_LAST_VC_ID_FETCH,function(){return t.set("month",n.vcdate.getMonth()).set("year",n.vcdate.getYear()).set("vcdate",n.vcdate.toString()).set("vcindex",n.receivedData.data)}),u(e,a.MODIFY_VCDATE,function(){t.get("oldvcdate");var e=n.date;return t.set("vcdate",e.toString())}),u(e,a.ENTER_JVITEM_FETCH,function(){n.data;return"modify"===sessionStorage.getItem("lrpzHandleMode")&&(t=t.setIn(["flags","showckpz"],!0)),"insert"===sessionStorage.getItem("lrpzHandleMode")&&(t=t.set("createdtime",n.createdtime).set("createdby",n.createdby)),n.refresh&&(t=s(t.set("jvlist",o.get("jvlist")).set("vcindex",n.NewVcIndex))),t.set("vckey",0).set(["flags","locked",""])}),u(e,a.REVIEWED_JVLIST,function(){return t.set("reviewedby",n.reviewedby)}),u(e,a.CANCEL_REVIEWED_JVLIST,function(){return t.set("reviewedby","")}),u(e,a.DRAFT_SAVE_FETCH,function(){return t.set("vckey",n.receivedData)}),u(e,a.GET_DRAFT_ITEM_FETCH,function(){return s((t=n.judgeLocked?o.set("vcindex",n.receivedData+1).set("vcdate",n.vcDate.toString()).set("year",n.vcDate.getYear()).set("month",n.vcDate.getMonth()):o.set("vcindex",n.getDraftItem.vcindex).set("vcdate",n.getDraftItem.vcdate).set("year",n.getDraftItem.year).set("month",n.getDraftItem.month)).set("jvlist",(0,r.fromJS)(n.getDraftItem.jvlist)).set("vckey",n.getDraftItem.vckey).set("enclosureCountUser",n.getDraftItem.enclosureCountUser).setIn(["flags","locked"],n.getDraftItem.locked).setIn(["flags","showckpz"],!0))}),u(e,a.LRPZ_LOCE_DRAFT,function(){return t.setIn(["flags","locked"],"1")}),u(e,a.LRPZ_UN_LOCE_DRAFT,function(){return t.setIn(["flags","locked"],"0")}),u(e,a.GET_AMOUNT_DATA,function(){return(t=t.setIn(["jvlist",n.idx,"jvunit"],n.receivedData.acunit).setIn(["jvlist",n.idx,"acunitOpen"],n.receivedData.acunitOpen).setIn(["jvlist",n.idx,"jvcount"],"")).getIn(["jvlist",n.idx,"jvdirection"])||(t=t.setIn(["jvlist",n.idx,"jvdirection"],n.receivedData.direction)),t=0==n.receivedData.price?t.setIn(["jvlist",n.idx,"price"],""):t.setIn(["jvlist",n.idx,"price"],n.receivedData.price)}),u(e,a.CHANGE_JV_COUNT,function(){new RegExp("^[-\\d]\\d*\\.?\\d{0,"+Number(n.unitDecimalCount)+"}$","g");return Number(n.jvCount)>1e6||Number(n.jvCount)<-1e6?alert("数量不能超过"+i.LRPZ_COUNT_LENGTH+"位"):t.setIn(["jvlist",n.idx,"jvcount"],n.jvCount)}),u(e,a.CHANGE_JV_PRICE,function(){return/^[-\d]\d*\.?\d{0,2}$/g.test(n.jvPrice)||""===n.jvPrice?(Number(n.jvPrice)<0&&(alert("单价不允许为负数"),n.jvPrice=-Number(n.jvPrice)),Number(n.jvPrice)>1e9||Number(n.jvPrice)<-1e9?alert("单价不能超过"+i.LRPZ_PRICE_LENGTH+"位"):t.setIn(["jvlist",n.idx,"price"],n.jvPrice)):t}),u(e,a.AUTO_CALCULATE,function(){var e=t.getIn(["jvlist",n.idx,"price"]),r=t.getIn(["jvlist",n.idx,"jvcount"]),a=t.getIn(["jvlist",n.idx,"jvamount"]);if("count"==n.value||"price"==n.value)if(Number(r)&&Number(e))Number(a)<0&&r?r=-Math.abs(r):Number(a)>0&&r&&(r=Math.abs(r)),r=Number(r)%1==0?Math.floor(r):parseFloat(Number(r).toFixed(2)),e=Number(e)%1==0?Math.floor(e):parseFloat(Number(e).toFixed(2)),t=t.setIn(["jvlist",n.idx,"price"],e).setIn(["jvlist",n.idx,"jvcount"],r).setIn(["jvlist",n.idx,"jvamount"],(r*e).toFixed(2));else if(""==e&&r&&a)e=a/r,e=Number(e)%1==0?Math.floor(e):parseFloat(Number(e).toFixed(2)),t=t.setIn(["jvlist",n.idx,"price"],e);else if(""==r&&e&&a)r=parseFloat((a/e).toFixed(n.unitDecimalCount)),Number(r)%1==0&&(r=Math.floor(r)),t=t.setIn(["jvlist",n.idx,"jvcount"],r);else{if(0==r||!a)return t;e=a/r,e=Number(e)%1==0?Math.floor(e):parseFloat(Number(e).toFixed(2)),t=t.setIn(["jvlist",n.idx,"price"],e)}else if("amount"==n.value){if(!r||!a)return t;Number(a)<0&&r?r=-Math.abs(r):Number(a)>0&&r&&(r=Math.abs(r)),e=a/r,e=Number(e)%1==0?Math.floor(e):parseFloat(Number(e).toFixed(2)),t=t.setIn(["jvlist",n.idx,"price"],e).setIn(["jvlist",n.idx,"jvcount"],r)}return s(t)}),u(e,a.CLEAR_AC_UNIT_OPEN,function(){return t.setIn(["jvlist",n.idx,"acunitOpen"],"0")}),u(e,a.GET_FJ_DATA,function(){if(!n.receivedData)return t;var e=(0,r.fromJS)(n.receivedData);return s(t.merge(e).set("oldvcindex",e.get("vcindex")).set("oldyear",e.get("year")).set("oldmonth",e.get("month")).set("oldvcdate",e.get("vcdate")))}),u(e,a.CHANGE_ENCLOSURE_LIST,function(){var e=[];return t.get("enclosureList").map(function(t){e.push(t)}),n.imgArr.forEach(function(t){e.push(t)}),e=e.slice(0,9),t=t.set("enclosureList",(0,r.fromJS)(e)).set("enclosureCountUser",e.length)}),u(e,a.DELETE_UPLOAD_IMG_URL,function(){return t.get("enclosureList").map(function(e,r){r==n.index&&(t=t.deleteIn(["enclosureList",r]))}),t=t.set("enclosureCountUser",t.get("enclosureList").size)}),u(e,a.GET_UPLOAD,function(){return t=t.set("enclosureList",(0,r.fromJS)(n.receivedData))}),u(e,a.CHANGE_VC_ENCLOSURE_COUNT_USER,function(){return t.set("enclosureCountUser",n.value)}),u(e,a.GET_LABEL_FETCH,function(){var e=[];return n.receivedData.data.forEach(function(t,n){e.push({key:t,value:n})}),t=t.set("label",e)}),u(e,a.CHANGE_TAG_NAME,function(){return t.get("enclosureList").map(function(e,r){r==n.index&&(t=t.setIn(["enclosureList",r,"label"],n.value))}),t}),u(e,a.GET_FC_LIST_DATA_FETCH,function(){var e=(0,r.fromJS)(n.receivedData),a=[];e.map(function(e,t){return a.push(e.get("fcNumber"))});var i=e.filter(function(e){return"1"==e.get("standard")}),c=i.getIn([0,"fcNumber"]),u=i.getIn([0,"exchange"]);return"modify"!=n.idx&&(t=t.setIn(["jvlist",n.idx,"fcStatus"],"1").setIn(["jvlist",n.idx,"fcNumber"],c).setIn(["jvlist",n.idx,"exchange"],u).setIn(["jvlist",n.idx,"jvdirection"],"debit")),t.setIn(["flags","currencyList"],e).setIn(["flags","currencyListArr"],a)}),u(e,a.CLEAR_FC_LIST_DATA,function(){return t.setIn(["jvlist",n.idx,"fcStatus"],"0").setIn(["jvlist",n.idx,"fcNumber"],"").setIn(["jvlist",n.idx,"exchange"],"").setIn(["jvlist",n.idx,"standardAmount"],"")}),u(e,a.CHANGE_JV_NUMBER,function(){return t.setIn(["jvlist",n.idx,"fcNumber"],n.fcNumber).setIn(["jvlist",n.idx,"exchange"],n.exchange)}),u(e,a.CHANGE_JV_EXCHANGE,function(){return/^\d*\.?\d{0,4}$/g.test(n.value)||""===n.value?t.setIn(["jvlist",n.idx,"exchange"],n.value):t}),u(e,a.CHANGE_JV_STANDARDAMOUNT,function(){return/^[-\d]\d*\.?\d{0,2}$/g.test(n.value)||""===n.value?t.setIn(["jvlist",n.idx,"standardAmount"],n.value):t}),u(e,a.AUTO_CALCULATE_ALL,function(){var e=t.getIn(["jvlist",n.idx,"price"]),r=t.getIn(["jvlist",n.idx,"jvcount"]),a=t.getIn(["jvlist",n.idx,"standardAmount"]),i=t.getIn(["jvlist",n.idx,"exchange"]),c=t.getIn(["jvlist",n.idx,"jvamount"]);return e&&r&&a&&i?"count"==n.value?(r=l(r,c),a=l(a,c),c=(r*e).toFixed(2),i=c/a):"price"==n.value?(c=(r*e).toFixed(2),i=c/a):"standardAmount"==n.value?(r=l(r,c),a=l(a,c),c=(a*i).toFixed(2),e=c/r):"exchange"==n.value?(c=(a*i).toFixed(2),e=c/r):"amount"==n.value&&(r=l(r,c),a=l(a,c),c&&(e=Number(c)/r,i=Number(c)/a)):"count"==n.value||"price"==n.value?(Number(r)&&e?(r=l(r,c),c=(Number(r)*e).toFixed(2)):""==e&&r&&c?e=c/r:0!=r&&c?e=c/r:t=t,Number(a)&&(i=c/a)):"standardAmount"==n.value||"exchange"==n.value?(Number(a)&&i?(a=l(a,c),c=(Number(a)*i).toFixed(2)):""==i&&a&&c?(i=(i=c/a)%1==0?Math.floor(i):parseFloat(i.toFixed(4)),t=t.setIn(["jvlist",n.idx,"exchange"],i)):a&&c&&(i=c/a),Number(r)&&(e=c/r)):"amount"==n.value&&(r=l(r,c),a=l(a,c),c&&(!a&&r?e=Number(c)/r:a&&!r?i=Number(c)/a:a&&r&&(e=Number(c)/r,i=Number(c)/a))),r=Number(r)%1==0?Math.floor(r):parseFloat(Number(r).toFixed(n.unitDecimalCount)),a=Number(a)%1==0?Math.floor(a):parseFloat(Number(a).toFixed(2)),e=Number(e)%1==0?Math.floor(e):parseFloat(Number(e).toFixed(2)),i=Number(i)%1==0?Math.floor(i):parseFloat(Number(i).toFixed(4)),s(t=t.setIn(["jvlist",n.idx,"standardAmount"],0===a?"":a).setIn(["jvlist",n.idx,"exchange"],i).setIn(["jvlist",n.idx,"price"],e).setIn(["jvlist",n.idx,"jvcount"],r).setIn(["jvlist",n.idx,"jvamount"],c))}),u(e,a.SET_LRPX_VCLIST,function(){return t.set("vcList",n.vcList)}),e)[n.type]||function(){return t})()};var r=n(9),a=(c(n(10)),n(13),c(n(1223))),i=c(n(25));function c(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function u(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var o=(0,r.fromJS)({flags:{selectComponentDisplay:!1,jvSelectedIdx:0,debitTotal:"0.00",creditTotal:"0.00",showckpz:!1,vcindexList:[],vcIdx:0,locked:"",currencyList:[],currencyListArr:[]},oldvcindex:"",oldyear:"",oldmonth:"",oldvcdate:"",vcindex:"",year:"",month:"",vcdate:"",createdtime:"",modifiedtime:"",createdby:"",exchange:"",closeby:"",reviewedby:"",enclosureCountUser:"",jvlist:[{jvdirection:"debit",jvabstract:"",acid:"",acname:"",acfullname:"",jvamount:"",asslist:[],acunitOpen:"0",jvcount:"",price:"",jvunit:"",fcStatus:"0",fcNumber:"",exchange:"",standardAmount:""}],vckey:0,enclosureList:[],label:[],needDeleteUrl:[],vcList:[]});function s(e){var t=0,n=0;return e.get("jvlist").map(function(e){"credit"===e.get("jvdirection")?t+=Number(e.get("jvamount")):"debit"===e.get("jvdirection")&&(n+=Number(e.get("jvamount")))}),e=(e=e.setIn(["flags","creditTotal"],t?t.toFixed(2).toString():"0.00")).setIn(["flags","debitTotal"],n?n.toFixed(2).toString():"0.00")}function l(e,t){return Number(t)<0&&e?-Math.abs(e):Number(t)>0&&e?Math.abs(e):e}},1359:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.INIT_CXPZ="INIT_CXPZ",t.CHANGE_FJGL_ISSUEDATE="CHANGE_FJGL_ISSUEDATE",t.GET_FJGL_DATA="GET_FJGL_DATA",t.SELECT_FJ_VC_ITEM="SELECT_FJ_VC_ITEM",t.SELECT_FJ_ITEM="SELECT_FJ_ITEM",t.GET_DELETE_DATA="GET_DELETE_DATA",t.OPEN_LABEL_MODAL="OPEN_LABEL_MODAL",t.CHANGE_CURRENT_LABEL="CHANGE_CURRENT_LABEL",t.CHANGE_LABEL_VALUE="CHANGE_LABEL_VALUE",t.GET_DOWNLOAD_DATA="GET_DOWNLOAD_DATA",t.CHANGE_ALL_FJ_CHECKBOX_DISPLAY="CHANGE_ALL_FJ_CHECKBOX_DISPLAY",t.CANCEL_CHANGE_FJ_CHECKBOX_DISPALY="CANCEL_CHANGE_FJ_CHECKBOX_DISPALY"},1400:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u,n=arguments[1];return((e={},c(e,i.INIT_CXPZ,function(){return u}),c(e,i.CHANGE_FJGL_ISSUEDATE,function(){return t.set("issuedate",n.issuedate)}),c(e,i.GET_FJGL_DATA,function(){n.receivedData;var e=[];n.receivedData.labelArray.forEach(function(t,n){e.push({key:t,value:t})});var r=[{key:"全部",value:"全部"}].concat(e);return t=t.update("vclist",function(e){return e.clear().merge((0,a.fromJS)(n.receivedData.jsonArray))}).set("totalSize",n.receivedData.totalSize).set("useSizeByCorp",n.receivedData.useSizeByCorp).set("useSizeBySob",n.receivedData.useSizeBySob).set("label",(0,a.fromJS)(r)).set("fjLabel",(0,a.fromJS)(e))}),c(e,i.SELECT_FJ_VC_ITEM,function(){var e=!t.getIn(["vclist",n.idx,"checkboxDisplay"]),r=t.getIn(["vclist",n.idx]).toJS();return r.checkboxDisplay=e,r.enclosureList.forEach(function(t){t.checkboxFjDisplay=e}),t=t.updateIn(["vclist",n.idx],function(e){return(0,a.fromJS)(r)})}),c(e,i.SELECT_FJ_ITEM,function(){return(t=t.updateIn(["vclist",n.idx,"enclosureList",n.fjIdx,"checkboxFjDisplay"],function(e){return!e})).setIn(["vclist",n.idx,"checkboxDisplay"],t.getIn(["vclist",n.idx,"enclosureList"]).every(function(e){return e.get("checkboxFjDisplay")}))}),c(e,i.GET_DELETE_DATA,function(){var e=[];t.get("vclist").map(function(t){t.get("enclosureList").map(function(t){return e.push(t)})});var n=[];return t.get("vclist").forEach(function(e){e.get("enclosureList").forEach(function(t){1!=t.get("checkboxFjDisplay")||n.push(e.get("vcindex"))})}),t.set("needDeleteUrl",(0,a.fromJS)(e).filter(function(e){return 1==e.get("checkboxFjDisplay")})).set("vcIndexArray",Array.from(new Set(n)))}),c(e,i.OPEN_LABEL_MODAL,function(){return t=t.set("vcIdx",n.idx).set("fjIdx",n.fjIdx)}),c(e,i.CHANGE_CURRENT_LABEL,function(){var e=t.get("vcIdx"),r=t.get("fjIdx");return t=t.setIn(["vclist",e,"enclosureList",r,"label"],n.currentLabel).set("currentLabel",n.currentLabel)}),c(e,i.CHANGE_LABEL_VALUE,function(){return t=t.set("labelValue",n.labelValue)}),c(e,i.GET_DOWNLOAD_DATA,function(){var e=[];t.get("vclist").map(function(t){t.get("enclosureList").map(function(t){return e.push(t)})});var n=[];return(0,a.fromJS)(e).filter(function(e){return 1==e.get("checkboxFjDisplay")}).map(function(e){return n.push({url:e.get("enclosurepath"),fileName:e.get("fileName")})}),t.set("needDownLoad",(0,a.fromJS)(n))}),c(e,i.CHANGE_ALL_FJ_CHECKBOX_DISPLAY,function(){return t.set("toolBarDisplayIndex",2).set("allCheckboxDisplay",!0)}),c(e,i.CANCEL_CHANGE_FJ_CHECKBOX_DISPALY,function(){return t.set("toolBarDisplayIndex",1).update("vclist",function(e){return e.map(function(e){return e.set("selected",!1)})}).set("allCheckboxDisplay",!1)}),e)[n.type]||function(){return t})()};var r,a=n(9),i=((r=a)&&r.__esModule,function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1359)));function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u=(0,a.fromJS)({allCheckboxDisplay:!1,toolBarDisplayIndex:1,lastvoucherid:"",issuedate:"",currentPage:"1",pageCount:"1",modifyvc:!1,vclist:[],totalSize:1,useSizeBySob:0,useSizeByCorp:0,needDeleteUrl:[],vcIndexArray:[],needDownLoad:[],previewSrc:"",label:[],labelValue:"全部",fjLabel:[],currentLabel:"",vcIdx:"",fjIdx:"",updatePath:""})},1817:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=m(n(0)),c=n(31),u=p(n(1072)),o=(p(n(1230)),p(n(184))),s=p(n(181)),l=(p(n(1076)),p(n(10))),d=n(123),f=n(16),v=m(n(1818));function p(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}function m(e){return e&&e.__esModule?e:{default:e}}n(1819);var E=(0,c.connect)(function(e){return e})(r=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,i.default.Component),a(t,[{key:"componentDidMount",value:function(){if(l.setTitle({title:"查询凭证"}),l.setIcon({showIcon:!1}),"home"===sessionStorage.getItem("prevPage")&&(sessionStorage.removeItem("prevPage"),this.props.dispatch(u.changeData("searchContentType","PROPERTY_ZONGHE")),this.props.dispatch(u.changeData("condition","")),this.props.dispatch(u.getPeriodAndVcListFetch())),"cxpz"===sessionStorage.getItem("prevPage")){sessionStorage.removeItem("prevPage");var e=this.props,t=e.dispatch,n=e.cxpzState;t(u.pagingVc(n.get("issuedate")))}}},{key:"render",value:function(){var e=this.props,t=e.dispatch,n=e.cxpzState,r=e.allState,a=e.history,c=e.homeState.getIn(["permissionInfo","Pz"]),p=c.getIn(["edit","permission"]),m=c.getIn(["arrange","permission"]),E=n.get("allCheckboxDisplay"),g=n.get("toolBarDisplayIndex"),_=n.get("vclist"),b=n.get("issuedate"),I=n.get("currentPage"),x=n.get("pageCount"),y=n.get("vclist").some(function(e){return e.get("selected")}),C=r.get("issues"),h=(C.getIn([0,"value"]),C.getIn([C.size-1,"value"]),n.get("maxVcIndex"),n.get("vclistLength"),r.get("period"),r.getIn(["period","openedyear"])),N=r.getIn(["period","openedmonth"]),A=!!_.getIn([0,"closedby"]),j=_.filter(function(e){return e.get("selected")}).map(function(e){return e.get("vcindex")}),D=function(e,t,n){return function(r){return r(s.allExportDo("cxpzpdfexport",{year:b.substr(0,4),month:b.substr(5,2),vcIndexList:j,needA4:e,needCreatedby:t,needAss:n}))}};t(y?s.navigationSetMenu("PDF-vc",D):s.navigationSetMenu("excel-vc",D,function(){return function(e){return e(s.allExportDo("excelsend",{year:b.substr(0,4),month:b.substr(5,2),exportModel:"vc",action:"QUERY_VC-BATCH_EXPORT_EXCEL"}))}}));var L=this.props.homeState.getIn(["data","userInfo","sobInfo","moduleInfo"]),T=!!L&&L.indexOf("ENCLOSURE_GL")>-1,S=!!L&&L.indexOf("RUNNING_GL")>-1,O=n.get("searchContentType"),P=n.get("condition");return i.default.createElement(f.Container,{className:"cxpz"},i.default.createElement(d.TopMonthPicker,{issuedate:b,source:C,callback:function(e){return t(u.pagingVc(e))},onOk:function(e){return t(u.pagingVc(e.value))}}),i.default.createElement("div",{className:"cxpz-flex cxpz-margin-bottom"},i.default.createElement(f.Single,{className:"left",district:[{key:"综合",value:"PROPERTY_ZONGHE"},{key:"摘要",value:"PROPERTY_ABSTRACT"},{key:"科目",value:"PROPERTY_AC"},{key:"金额",value:"PROPERTY_AMOUNT"},{key:"制单人",value:"PROPERTY_MAKER"}],value:O,canSearch:!1,onOk:function(e){t(u.changeData("searchContentType",e.value))}},i.default.createElement("div",{className:"cxpz-flex"},i.default.createElement("div",null,{PROPERTY_ZONGHE:"综合",PROPERTY_ABSTRACT:"摘要",PROPERTY_AC:"科目",PROPERTY_AMOUNT:"金额",PROPERTY_MAKER:"制单人"}[O]),i.default.createElement(f.Icon,{type:"triangle"}))),i.default.createElement("div",{className:"search-right"},i.default.createElement(f.SearchBar,{placeholder:"搜索凭证",value:P,showCancelButton:!1,onChange:function(e){t(u.changeData("condition",e))},onSubmit:function(e){t(u.pagingVc(b))},onClear:function(){t(u.changeData("condition","")),t(u.pagingVc(b))}}))),i.default.createElement(f.ScrollView,{flex:"1",uniqueKey:"cxpz-scroll",savePosition:!0},i.default.createElement("div",{className:"cxpz-scroll-content"},_.map(function(e,n){return i.default.createElement(v.default,{allCheckboxDisplay:E,idx:n,key:n,vcitem:e,dispatch:t,history:a,vclist:_,intelligentStatus:S})})),i.default.createElement(d.ScrollLoad,{classContent:"cxpz-scroll-content",callback:function(e){t(u.pagingVc(b,I,!0,e))},isGetAll:I>=x,itemSize:_.size})),i.default.createElement(f.Row,null,i.default.createElement(f.ButtonGroup,{type:"ghost",style:{display:1===g?"":"none"}},i.default.createElement(f.Button,{disabled:!p,onClick:function(){var e="",n=new Date,r=n.getFullYear(),i=n.getMonth()+1,c=b.substr(0,4),u=b.substr(5,2);if(h)if(A){var s=new Date(h,N,0);e=s<n?s:Number(h)==Number(r)&&Number(N)==Number(i)?n:new Date(h,Number(N)-1,1)}else{e=new Date(c,u,0);var l=new Date(c,u,0);e=l<n?l:Number(c)==Number(r)&&Number(u)==Number(i)?n:new Date(c,Number(u)-1,1)}else e=new Date;t(o.initLrpz()),t(o.getLastVcIdFetch(e)),a.push("/lrpz"),sessionStorage.setItem("router-from","cxpz"),sessionStorage.setItem("lrpzHandleMode","insert"),t(o.setCkpzIsShow(!1))}},i.default.createElement(f.Icon,{type:"add-plus"}),i.default.createElement("span",null,"新增")),i.default.createElement(f.Button,{disabled:!m||A||0===_.size,style:{display:S?"none":""},onClick:function(){l.actionSheet({title:"选择整理方式",cancelButton:"取消",otherButtons:["按凭证号顺次前移补齐断号","按凭证日期重新顺次编号"],onSuccess:function(e){-1!=e.buttonIndex&&t(u.getSortVcFetch(b,e.buttonIndex+1))}})}},i.default.createElement(f.Icon,{type:"settle"}),i.default.createElement("span",null,"整理")),i.default.createElement(f.Button,{style:{display:T?"":"none"},onClick:function(){t(u.setFjglData()),a.push("/fjgl")}},i.default.createElement(f.Icon,{type:"fujian"}),i.default.createElement("span",null,"附件")),i.default.createElement(f.Button,{disabled:0===_.size,onClick:function(){return t(u.changeVcCheckBoxDisplay())}},i.default.createElement(f.Icon,{type:"select"}),i.default.createElement("span",null,"选择"))),i.default.createElement(f.ButtonGroup,{type:"ghost",style:{display:2===g?"":"none"}},i.default.createElement(f.Button,{onClick:function(){return t(u.selectVcAll())}},i.default.createElement(f.Icon,{type:"choose"}),i.default.createElement("span",null,"全选")),i.default.createElement(f.Button,{onClick:function(){return t(u.cancelChangeVcCheckBoxDisplay())}},i.default.createElement(f.Icon,{type:"cancel"}),i.default.createElement("span",null,"取消")),i.default.createElement(f.Button,{disabled:!y||A||!p||_.some(function(e){return e.get("selected")&&e.get("reviewedby")}),onClick:function(){return t(u.deleteVcFetch(n))}},i.default.createElement(f.Icon,{type:"delete"}),i.default.createElement("span",null,"删除")),i.default.createElement(f.Button,{disabled:!_.some(function(e){return e.get("selected")&&!e.get("reviewedby")})||!p,onClick:function(){t(u.reviewedJvlist(b))}},i.default.createElement(f.Icon,{type:"shenhe"}),i.default.createElement("span",null,"审核")),i.default.createElement(f.Button,{disabled:!_.some(function(e){return e.get("selected")&&e.get("reviewedby")})||!p,onClick:function(){t(u.cancelReviewedJvlist(b))}},i.default.createElement(f.Icon,{type:"chexiao"}),i.default.createElement("span",null,"反审核")))))}}]),t}())||r;t.default=E},1818:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var r,a=function(){function e(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}return function(t,n,r){return n&&e(t.prototype,n),r&&e(t,r),t}}(),i=n(0),c=(r=i)&&r.__esModule?r:{default:r},u=l(n(1072)),o=l(n(184)),s=(l(n(1076)),n(16));function l(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}var d=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,c.default.Component),a(t,[{key:"render",value:function(){var e=this.props,t=e.allCheckboxDisplay,n=e.idx,r=e.vcitem,a=e.dispatch,i=e.history,l=e.vclist,d=e.intelligentStatus,f=r.get("closedby"),v=r.get("reviewedby");return c.default.createElement("div",{className:"vc",onClick:function(){t?a(u.selectVc(n)):(sessionStorage.setItem("lrpzHandleMode","modify"),i.push("/lrpz"),sessionStorage.setItem("router-from","cxpz"),a(o.getFjFetch(r,l)))}},c.default.createElement(s.Icon,{style:{display:f?"":"none"},className:"cxpz-shenhe-icon ",color:"#DE4646",type:"the-invosing",size:"50"}),c.default.createElement(s.Icon,{style:{display:f?"none":v?"":"none"},className:"cxpz-shenhe-icon",color:"#ff943e",type:"yishenhe",size:"45"}),c.default.createElement("div",{className:"vc-info"},c.default.createElement("span",null,c.default.createElement(s.Checkbox,{style:{paddingRight:"10px",display:t?"inline-block":"none"},checked:r.get("selected")}),c.default.createElement("span",{className:"text-underline"},"记 ",r.get("vcindex")," 号"),c.default.createElement(s.Icon,{style:{display:r.get("enclosurecount")?"":"none",marginLeft:"10px"},color:"#858E99",type:"fujian"})),c.default.createElement("span",{className:"vc-info-date"},r.get("vcdate").replace(/-/g,"/"))),c.default.createElement("div",{className:"vc-jv-list"},r.get("jvlist").map(function(e,t){return c.default.createElement("div",{className:"vc-jv",key:t},c.default.createElement("div",{className:"vc-jv-info"},c.default.createElement("span",{className:"vc-jv-direction"},["debit"===e.get("jvdirection")?"借":"贷","：",e.get("acfullname")].join("")),c.default.createElement(s.Amount,{className:"vc-jv-amount",showZero:!0},e.get("jvamount"))),e.get("asslist").size?c.default.createElement("div",{className:"vc-jv-ass"},e.get("asslist").map(function(e,t){return c.default.createElement("div",{key:t,className:"vc-jv-ass-showtext "+(0===t?"vc-jv-ass-showtext-tip":"")},e.get("asscategory")+"_"+e.get("assid")+" "+e.get("assname"))})):"",c.default.createElement("div",{className:"vc-jv-abstract"},c.default.createElement("span",null,"摘要："),c.default.createElement("span",null,e.get("jvabstract"))))})),c.default.createElement("div",{className:"vc-info vc-info-bottom"},c.default.createElement("span",null,"制单人: "+(r.get("createdby")?r.get("createdby"):"")),c.default.createElement("span",null,r.get("reviewedby")&&!d?"审核人: "+r.get("reviewedby"):"")))}}]),t}();t.default=d},1819:function(e,t,n){},1821:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u,n=arguments[1];return((e={},c(e,i.INIT_CXPZ,function(){return u}),c(e,i.GET_VC_LIST_FETCH,function(){var e=n.receivedData.data.length,r=Math.ceil(e/20);return t.set("issuedate",n.issuedate).update("vclist",function(e){return e.clear().merge((0,a.fromJS)(n.receivedData.data))}).set("currentPage",r).set("pageCount",r)}),c(e,i.DELETE_VC_FETCH,function(){return t.update("vclist",function(e){return e.filter(function(e){return!e.get("selected")})})}),c(e,i.SORT_AND_CHANGE_VC_ID,function(){return t.update("vclist",function(e){return e.sort(function(e,t){return parseInt(e.get("vcindex"))<parseInt(t.get("vcindex"))?0:1}).map(function(e,t){return e.set("vcindex",t.toString())})})}),c(e,i.CHANGE_ALL_VC_CHECKBOX_DISPLAY,function(){return t.set("toolBarDisplayIndex",2).set("allCheckboxDisplay",!0)}),c(e,i.CANCEL_CHANGE_VC_CHECKBOX_DISPALY,function(){return t.set("toolBarDisplayIndex",1).update("vclist",function(e){return e.map(function(e){return e.set("selected",!1)})}).set("allCheckboxDisplay",!1)}),c(e,i.SELECT_VC_ALL,function(){return t.get("vclist").every(function(e){return e.get("selected")})?t.update("vclist",function(e){return e.map(function(e){return e.set("selected",!1)})}):t.update("vclist",function(e){return e.map(function(e){return e.set("selected",!0)})})}),c(e,i.SELECT_VC,function(){return t.updateIn(["vclist",n.idx,"selected"],function(e){return!e})}),c(e,i.REVERSE_VC_LIST,function(){return t.update("vclist",function(e){return e.reverse()})}),c(e,i.AFTER_PAGING_VC,function(){return t=0!==n.currentPage?t.update("vclist",function(e){return t.get("vclist").concat((0,a.fromJS)(n.receivedData.data.vcList))}).set("currentPage",n.receivedData.data.currentPage).set("pageCount",n.receivedData.data.pageCount):t.update("vclist",function(e){return e.clear().merge((0,a.fromJS)(n.receivedData.data.vcList))}).set("currentPage",n.receivedData.data.currentPage).set("pageCount",n.receivedData.data.pageCount).set("issuedate",n.issuedate)}),c(e,i.CXPZ_CHANGE_DATA,function(){return t.set(n.dataType,n.value)}),e)[n.type]||function(){return t})()};var r,a=n(9),i=((r=a)&&r.__esModule,n(13),function(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var n in e)Object.prototype.hasOwnProperty.call(e,n)&&(t[n]=e[n]);return t.default=e,t}(n(1077)));function c(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}var u=(0,a.fromJS)({allCheckboxDisplay:!1,toolBarDisplayIndex:1,lastvoucherid:"",issuedate:"",currentPage:"1",pageCount:"1",searchContentType:"PROPERTY_ZONGHE",condition:"",modifyvc:!1,vclist:[]})},959:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var r=u(n(1817)),a=u(n(1821)),i=u(n(1400)),c=u(n(1214));function u(e){return e&&e.__esModule?e:{default:e}}var o={cxpzState:a.default,fjglState:i.default,lrpzState:c.default};t.reducer=o,t.view=r.default}}]);