(window.webpackJsonp=window.webpackJsonp||[]).push([[27],{1052:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.view=t.reducer=void 0;var n=i(a(2636)),o=i(a(2640)),l=i(a(1624));function i(e){return e&&e.__esModule?e:{default:e}}var r={inventoryYebState:o.default,inventoryMxbState:l.default};t.reducer=r,t.view=n.default},1638:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getDecimalScale=t.setTypeListValue=t.changeInventoryChooseValue=t.changeInventoryYebType=t.handleInventoryYebDateSelectValue=t.handleInventoryYebShowChildList=t.getInventoryYebTypeList=t.getInventoryYebSelectedList=t.getInventoryYebSeclectedStockStore=t.getInventoryYebSelectedStockCategory=t.setInventoryYebDate=t.setStockStoreValue=t.getInventoryYebStockStore=t.setStockCategoryUuid=t.getInventoryYebstockCategory=t.setStockQuantityValue=t.getInventoryYebInitData=void 0;var n,o=a(13),l=a(182),i=(n=l)&&n.__esModule?n:{default:n},r=d(a(1639)),u=d(a(25)),s=d(a(10)),c=d(a(181));function d(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}t.getInventoryYebInitData=function(){return function(e){s.toast.loading(u.LOADING_TIP_TEXT,0),(0,i.default)("getInventoryYebData","POST",JSON.stringify({begin:"",end:"",isType:!1,needPeriod:"true"}),function(t){if((0,o.showMessage)(t)){e({type:r.CHANGE_INVENTPORY_YEB_TYPE,value:"Inventory"});var a=e(c.reportGetIssuedateAndFreshPeriod(t));e({type:r.SET_INVENTORY_YEB_INIT_DATA,issuedate:a,dataList:t.data.balance.childList}),e(E(a,a,"")),e(_(a,a)),e(m())}})}},t.setStockQuantityValue=function(e,t){return function(a){a({type:r.CHANGE_INVENTPRY_YEB_STOCK_QUANTITY,label:e,value:t})}};var E=t.getInventoryYebstockCategory=function(e,t,a){return function(n){(0,i.default)("getInventoryYebstockCategory","POST",JSON.stringify({begin:e||"",end:t||"",isType:!1,stockQuantity:a||""}),function(e){(0,o.showMessage)(e)&&n({type:r.SET_INVENTORY_YEB_INIT_STOCK_CATEGORY_LIST,categoryList:e.data.categoryList})})}},_=(t.setStockCategoryUuid=function(e,t,a,n){return function(o){o({type:r.SET_INVENTORY_YEB_STOCK_CATEGORY_UUID,key:e,label:t,topCategoryUuid:a,subCategoryUuid:n})}},t.getInventoryYebStockStore=function(e,t){return function(a){(0,i.default)("getInventoryYebStockStore","POST",JSON.stringify({begin:e||"",end:t||"",isType:!1}),function(e){(0,o.showMessage)(e)&&(s.toast.hide(),a({type:r.SET_INVENTORY_YEB_INIT_STOCK_STORE_LIST,list:e.data.storeList}))})}}),y=(t.setStockStoreValue=function(e,t){return function(a){a({type:r.SET_INVENTORY_YEB_STOCK_STORE_VALUE,value:e,label:t})}},t.setInventoryYebDate=function(e,t){return function(a){a({type:r.SET_INVENTORT_YEB_DATE,issuedate:e,endissuedate:t})}},t.getInventoryYebSelectedStockCategory=function(e,t){return function(a,n){var l=n().inventoryYebState.get("stockCategoryValue"),s=n().inventoryYebState.get("topCategoryUuid"),c=n().inventoryYebState.get("subCategoryUuid"),d=n().inventoryYebState.get("inventoryType"),E=!1;(0,i.default)("getInventoryYebstockCategory","POST",JSON.stringify({begin:e||"",end:t||"",isType:"Other"===d}),function(e){if((0,o.showMessage)(e)){a({type:r.SET_INVENTORY_YEB_STOCK_CATEGORY_LIST,categoryList:e.data.categoryList});!function e(t,a){return t.map(function(t,n){t.childList&&t.childList.length?(l===""+a+u.TREE_JOIN_STR+t.uuid&&(E=!0),e(t.childList,""+a+u.TREE_JOIN_STR+t.uuid)):l===""+a+u.TREE_JOIN_STR+t.uuid&&(E=!0)})}(e.data.categoryList,""),a(E?y(s,c):y("",""))}})}},t.getInventoryYebSeclectedStockStore=function(e,t){return function(a,n){var l=n().inventoryYebState.get("issuedate"),u=n().inventoryYebState.get("endissuedate"),s=n().inventoryYebState.get("stockStoreValue"),c=n().inventoryYebState.get("inventoryType");(0,i.default)("getInventoryYebStockStore","POST",JSON.stringify({begin:l||"",end:u||"",topCategoryUuid:e,subCategoryUuid:t,isType:"Other"===c}),function(n){if((0,o.showMessage)(n)){a({type:r.SET_INVENTORY_YEB_STOCK_STORE_LIST,list:n.data.storeList});var l=!1;!function e(t){return t.map(function(t,a){t.childList&&t.childList.length?(s===t.uuid&&(l=!0),e(t.childList)):s===t.uuid&&(l=!0)})}(n.data.storeList),"Other"===c?n.data.storeList.length>0?a(f(e,t,l?s:n.data.storeList[0].uuid)):a(f(e,t,"")):n.data.storeList.length>0?a(T(e,t,l?s:n.data.storeList[0].uuid)):a(T(e,t,""))}})}}),T=t.getInventoryYebSelectedList=function(e,t,a,n){return function(l,c){s.toast.loading(u.LOADING_TIP_TEXT,0);var d=c().inventoryYebState.get("issuedate"),E=c().inventoryYebState.get("endissuedate"),_=c().inventoryYebState.get("inventoryType");(0,i.default)("getInventoryYebData","POST",JSON.stringify({begin:d||"",end:E||"",topCategoryUuid:e,subCategoryUuid:t,storeCardUuid:a,isType:"Other"===_,acId:n||""}),function(e){(0,o.showMessage)(e)&&(s.toast.hide(),l({type:r.SET_INVENTORY_YEB_SELECTED_DATA,dataList:e.data.balance.childList}))})}},f=t.getInventoryYebTypeList=function(e,t,a){return function(n,l){var u=l().inventoryYebState.get("issuedate"),s=l().inventoryYebState.get("endissuedate"),c=l().inventoryYebState.get("inventoryType"),d=l().inventoryYebState.get("typeListValue"),E=l().inventoryYebState.get("typeListLabel");(0,i.default)("getInventoryYebTypeList","POST",JSON.stringify({begin:u||"",end:s||"",topCategoryUuid:e,subCategoryUuid:t,storeCardUuid:a||"",isType:"Other"===c}),function(l){if((0,o.showMessage)(l)){var i=!1,u=function e(t,a){return t.map(function(t,a){return t.childList&&t.childList.length?(d===t.acId&&(i=!0),{key:""+t.acId,label:t.name,childList:e(t.childList)}):(d===t.acId&&(i=!0),{key:""+t.acId,label:t.name,childList:[]})})}(l.data.typeList);i?(n({type:r.SET_INVENTORY_YEB_TYPE_LIST,list:u,value:d,label:E}),n(T(e,t,a,d))):(n({type:r.SET_INVENTORY_YEB_TYPE_LIST,list:u,value:"",label:"全部类型"}),n(T(e,t,a,"")))}})}},m=(t.handleInventoryYebShowChildList=function(e){return function(t){t({type:r.HANGLE_INVENTORY_YEB_SHOW_CHILD_LIST,uuid:e})}},t.handleInventoryYebDateSelectValue=function(e){return function(t){t({type:r.HANDLE_INVENTORY_YEB_DATE_SELECT_VALUE,value:e})}},t.changeInventoryYebType=function(e){return function(t){t({type:r.CHANGE_INVENTPORY_YEB_TYPE,value:"Inventory"===e?"Other":"Inventory"})}},t.changeInventoryChooseValue=function(e){return function(t){t({type:r.CHANGE_INVENTORY_YEB_CHOOSE_VALUE,value:e})}},t.setTypeListValue=function(e,t){return function(a){a({type:r.SET_INVENTORY_YEB_TYPE_LIST_VALUE,value:e,label:t})}},t.getDecimalScale=function(){return function(e){s.toast.loading(u.LOADING_TIP_TEXT,0),(0,i.default)("getInventoryYebDecimalScale","GET","",function(t){s.toast.hide(),e({type:r.CHANGE_DECIMAL_OF_CONFIG,receiveData:t.data.scale})})}})},1639:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});t.SET_INVENTORY_YEB_INIT_DATA="SET_INVENTORY_YEB_INIT_DATA",t.SET_INVENTORY_YEB_STOCK_QUANTITY_LIST="SET_INVENTORY_YEB_STOCK_QUANTITY_LIST",t.CHANGE_INVENTPRY_YEB_STOCK_QUANTITY="CHANGE_INVENTPRY_YEB_STOCK_QUANTITY",t.SET_INVENTORY_YEB_STOCK_CATEGORY_LIST="SET_INVENTORY_YEB_STOCK_CATEGORY_LIST",t.SET_INVENTORY_YEB_STOCK_CATEGORY_UUID="SET_INVENTORY_YEB_STOCK_CATEGORY_UUID",t.SET_INVENTORY_YEB_STOCK_STORE_LIST="SET_INVENTORY_YEB_STOCK_STORE_LIST",t.SET_INVENTORY_YEB_STOCK_STORE_VALUE="SET_INVENTORY_YEB_STOCK_STORE_VALUE",t.SET_INVENTORT_YEB_DATE="SET_INVENTORT_YEB_DATE",t.SET_INVENTORY_YEB_SELECTED_DATA="SET_INVENTORY_YEB_SELECTED_DATA",t.HANGLE_INVENTORY_YEB_SHOW_CHILD_LIST="HANGLE_INVENTORY_YEB_SHOW_CHILD_LIST",t.HANDLE_INVENTORY_YEB_DATE_SELECT_VALUE="HANDLE_INVENTORY_YEB_DATE_SELECT_VALUE",t.SET_INVENTORY_YEB_INIT_STOCK_STORE_LIST="SET_INVENTORY_YEB_INIT_STOCK_STORE_LIST",t.SET_INVENTORY_YEB_INIT_STOCK_CATEGORY_LIST="SET_INVENTORY_YEB_INIT_STOCK_CATEGORY_LIST",t.SET_INVENTORY_YEB_INIT_STOCK_QUANTITY_LIST="SET_INVENTORY_YEB_INIT_STOCK_QUANTITY_LIST",t.CHANGE_INVENTPORY_YEB_TYPE="CHANGE_INVENTPORY_YEB_TYPE",t.CHANGE_INVENTORY_YEB_CHOOSE_VALUE="CHANGE_INVENTORY_YEB_CHOOSE_VALUE",t.SET_INVENTORY_YEB_TYPE_LIST="SET_INVENTORY_YEB_TYPE_LIST",t.SET_INVENTORY_YEB_TYPE_LIST_VALUE="SET_INVENTORY_YEB_TYPE_LIST_VALUE",t.CHANGE_DECIMAL_OF_CONFIG="CHANGE_DECIMAL_OF_CONFIG"},2636:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,o=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),l=f(a(0)),i=(f(a(2)),a(31));a(9),a(13);a(2637);var r=T(a(10)),u=a(16),s=a(123),c=f(a(2639)),d=T(a(1638)),E=T(a(25)),_=T(a(181)),y=f(a(79));function T(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function f(e){return e&&e.__esModule?e:{default:e}}var m=(0,i.connect)(function(e){return e})(n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,l.default.Component),o(t,[{key:"componentDidMount",value:function(){r.setTitle({title:"存货余额表"}),r.setIcon({showIcon:!1}),"home"===sessionStorage.getItem("prevPage")&&(sessionStorage.removeItem("prevPage"),this.props.dispatch(d.getInventoryYebInitData()))}},{key:"render",value:function(){var e=this.props,t=e.dispatch,a=e.allState,n=e.inventoryYebState,o=e.history,i=a.get("issues"),r=n.get("issuedate"),T=n.get("endissuedate"),f=i.findIndex(function(e){return e.get("value")===r}),m=i.slice(0,f),S=n.get("dataList"),N=a.getIn(["systemInfo","unitDecimalCount"]),b=(n.get("stockQuabtityList"),n.get("stockQuantity")),I=(n.get("stockQuantityName"),n.get("stockCategoryList")),g=n.get("stockCategoryValue"),Y=n.get("stockCategorylabel"),v=n.get("stockStoreList"),O=n.get("stockStoreValue"),p=n.get("stockStoreLabel"),L=n.get("topCategoryUuid"),h=n.get("subCategoryUuid"),C=n.get("showChildList"),k=n.get("chooseValue"),V=n.get("inventoryType"),R=n.get("typeList"),A=n.get("typeListValue"),P=n.get("typeListLabel"),B=n.get("quantityScale"),w=n.get("priceScale"),D=r,U=T||D;return t(_.navigationSetMenu("config","",function(){return function(e){return e(_.allExportDo("sendInventoryYebExcel",{begin:D,end:U,topCategoryUuid:L,subCategoryUuid:h,storeCardUuid:O,isType:"Other"===V,acId:A||""}))}})),l.default.createElement(u.Container,{className:"inventoryYeb"},l.default.createElement(s.MutiPeriodMoreSelect,{start:r,issues:i,end:T,nextperiods:m,chooseValue:k,onBeginOk:function(e){t(d.setInventoryYebDate(e,"")),t(d.getInventoryYebSelectedStockCategory(e,""))},onEndOk:function(e,a){t(d.setInventoryYebDate(e,a)),t(d.getInventoryYebSelectedStockCategory(e,a))},changeChooseValue:function(e){t(d.changeInventoryChooseValue(e))}}),l.default.createElement(u.Row,{className:"inventoryYeb-search"},l.default.createElement("div",{className:"select-change-table",onClick:function(){t(d.changeInventoryYebType(V)),t(d.getInventoryYebSelectedStockCategory(r,T))}},l.default.createElement("span",null,"Inventory"===V?"库存":"其他类型"),l.default.createElement(y.default,{type:"type-change"})),l.default.createElement(u.ChosenPicker,{className:"inventoryYeb-stock-catogory",district:I,title:"请选择存货类别",parentDisabled:!1,value:g,onChange:function(e){e.key.split(E.TREE_JOIN_STR);var a=e.key.split(E.TREE_JOIN_STR)[1],n=e.key.split(E.TREE_JOIN_STR)[e.key.split(E.TREE_JOIN_STR).length-1];a===n?(t(d.setStockCategoryUuid(e.key,e.label,a,"")),t(d.getInventoryYebSeclectedStockStore(a,""))):(t(d.setStockCategoryUuid(e.key,e.label,a,n)),t(d.getInventoryYebSeclectedStockStore(a,n)))}},l.default.createElement(u.Row,{className:"stock-category-label"},l.default.createElement("span",{className:"overElli"},Y),l.default.createElement(u.Icon,{type:"triangle"}))),v.length>0&&l.default.createElement(u.ChosenPicker,{className:"inventoryYeb-stock-store",district:v,parentDisabled:!1,title:"请选择仓库",value:O,onChange:function(e){t(d.setStockStoreValue(e.key,e.label)),t("Inventory"===V?d.getInventoryYebSelectedList(L,h,e.key):d.getInventoryYebTypeList(L,h,e.key))}},l.default.createElement(u.Row,{className:"stock-store-label"},l.default.createElement("span",{className:"overElli"},"全部"===p?"全部仓库":p),l.default.createElement(u.Icon,{type:"triangle"}))),"Other"==V&&l.default.createElement(u.ChosenPicker,{className:"inventoryYeb-type-list",district:R,parentDisabled:!1,title:"请选择类型",value:A,onChange:function(e){t(d.setTypeListValue(e.key,e.label)),t(d.getInventoryYebSelectedList(L,h,O,e.key))}},l.default.createElement(u.Row,{className:"type-list-label"},l.default.createElement("span",{className:"overElli"},P),l.default.createElement(u.Icon,{type:"triangle"})))),l.default.createElement(u.Row,{className:"ba-title"},l.default.createElement("div",{className:"ba-title-item"},"期初余额"),l.default.createElement("div",{className:"ba-title-item"},"Other"==V?"本期借方":"本期入库"),l.default.createElement("div",{className:"ba-title-item"},"Other"==V?"本期贷方":"本期出库"),l.default.createElement("div",{className:"ba-title-item"},"期末余额")),l.default.createElement(u.ScrollView,{flex:"1",uniqueKey:"inventoryYeb-scroll",savePosition:!0},S.map(function(e,a){return l.default.createElement(c.default,{unitDecimalCount:N,key:a,data:e,history:o,dispatch:t,issuedate:r,endissuedate:T,stockCategoryValue:g,topCategoryUuid:L,subCategoryUuid:h,stockCategoryList:I,stockQuantity:b,stockStoreList:v,stockStoreValue:O,stockStoreLabel:p,showChildList:C,chooseValue:k,inventoryType:V,typeListValue:A,typeListLabel:P,stockCategorylabel:Y,quantityScale:B,priceScale:w})})))}}]),t}())||n;t.default=m},2637:function(e,t,a){},2639:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=void 0;var n,o,l=function(){function e(e,t){for(var a=0;a<t.length;a++){var n=t[a];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,n.key,n)}}return function(t,a,n){return a&&e(t.prototype,a),n&&e(t,n),t}}(),i=a(0),r=(o=i)&&o.__esModule?o:{default:o},u=(a(9),a(22)),s=a(16),c=_(a(25)),d=_(a(1622)),E=_(a(1638));function _(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}var y=(0,u.immutableRenderDecorator)(n=function(e){function t(){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,t),function(e,t){if(!e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!t||"object"!=typeof t&&"function"!=typeof t?e:t}(this,(t.__proto__||Object.getPrototypeOf(t)).apply(this,arguments))}return function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function, not "+typeof t);e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,enumerable:!1,writable:!0,configurable:!0}}),t&&(Object.setPrototypeOf?Object.setPrototypeOf(e,t):e.__proto__=t)}(t,r.default.Component),l(t,[{key:"render",value:function(){var e=this.props,t=e.data,a=e.unitDecimalCount,n=e.history,o=e.dispatch,l=e.issuedate,i=e.endissuedate,u=e.stockCategoryValue,_=e.topCategoryUuid,y=e.subCategoryUuid,T=e.stockCategorylabel,f=e.stockCategoryList,m=e.stockQuantity,S=e.stockStoreList,N=e.stockStoreValue,b=e.stockStoreLabel,I=e.showChildList,g=e.chooseValue,Y=e.inventoryType,v=e.typeListValue,O=e.typeListLabel,p=e.priceScale,L=e.quantityScale,h=u;return function e(t,C){var k={background:{0:"#fff",1:"#D1C0A5",2:"#7E6B5A",3:"#59493f"}[C],width:C/100*10+"rem"};if(t.childList&&t.childList.length>0){var V=I.includes(t.uuid);return h=""+h+c.TREE_JOIN_STR+t.uuid,t.newCategoryValue=h,r.default.createElement("div",null,r.default.createElement("div",{className:0===C?"ba ba-level":"ba-ass ba"},r.default.createElement("div",null,r.default.createElement("span",{className:"name"},0==C?"":r.default.createElement("span",{className:"ba-flag",style:k}),r.default.createElement("span",{className:"name-name name-click",onClick:function(e){sessionStorage.setItem("previousPage","inventoryYeb"),o(d.getInventoryMxbDataFromYeb(l,i,null,"全部",t.newCategoryValue,"",t.uuid,t.name,f,m,S,N,b,g,Y,v,O)),n.push("/inventoryMxb")}},t.name)),r.default.createElement("span",{className:"btn"},r.default.createElement(s.Icon,{type:V?"arrow-up":"arrow-down",onClick:function(){o(E.handleInventoryYebShowChildList(t.uuid))}}))),r.default.createElement("div",{className:"ba-info"},r.default.createElement("div",null,r.default.createElement("div",{className:"ba-begin"},r.default.createElement("span",{className:"amount-color"},"数量"),r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:L,className:"amount-color"},t.beginQuantity)),r.default.createElement("div",{className:"ba-begin"},r.default.createElement("span",{className:"amount-color"},"单价"),r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:p,className:"amount-color"},t.beginPrice)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{decimalPlaces:a},t.beginAmount))),r.default.createElement("div",null,r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:L,className:"amount-color"},t.monthInQuantity)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement("span",null)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{decimalPlaces:a},t.monthInAmount))),r.default.createElement("div",null,r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:L,className:"amount-color"},t.monthOutQuantity)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement("span",null)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{decimalPlaces:a},t.monthOutAmount))),r.default.createElement("div",null,r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:L,className:"amount-color"},t.endQuantity)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:p,className:"amount-color"},t.endPrice)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{decimalPlaces:a},t.endAmount))))),V&&t.childList.map(function(t,a){return e(t,C+1)}))}return r.default.createElement("div",{className:0===C?"ba ba-level":" ba-ass ba"},r.default.createElement("div",null,r.default.createElement("span",{className:"name",onClick:function(e){sessionStorage.setItem("previousPage","inventoryYeb"),o(d.getInventoryMxbDataFromYeb(l,i,t.uuid,t.name,u,_,y,T,f,m,S,N,b,g,Y,v,O)),n.push("/inventoryMxb")}},0==C?"":r.default.createElement("span",{className:"ba-flag",style:k}),t.name)),r.default.createElement("div",{className:"ba-info"},r.default.createElement("div",null,r.default.createElement("div",{className:"ba-begin"},r.default.createElement("span",{className:"amount-color"},"数量"),r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:L,className:"amount-color"},t.beginQuantity)),r.default.createElement("div",{className:"ba-begin"},r.default.createElement("span",{className:"amount-color"},"单价"),r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:p,className:"amount-color"},t.beginPrice)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{decimalPlaces:a},t.beginAmount))),r.default.createElement("div",null,r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:L,className:"amount-color"},t.monthInQuantity)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement("span",null)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:a},t.monthInAmount))),r.default.createElement("div",null,r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:L,className:"amount-color"},t.monthOutQuantity)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement("span",null)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{decimalPlaces:a},t.monthOutAmount))),r.default.createElement("div",null,r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:L,className:"amount-color"},t.endQuantity)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{showZero:!0,decimalPlaces:p,className:"amount-color"},t.endPrice)),r.default.createElement("div",{className:"ba-amount"},r.default.createElement(s.Amount,{decimalPlaces:a},t.endAmount)))))}(t,0)}}]),t}())||n;t.default=y},2640:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u,a=arguments[1];return((e={},r(e,o.SET_INVENTORY_YEB_INIT_DATA,function(){return t.set("issuedate",a.issuedate).set("dataList",a.dataList).set("endissuedate","").set("chooseValue","ISSUE")}),r(e,o.SET_INVENTORT_YEB_DATE,function(){return t.set("issuedate",a.issuedate).set("endissuedate",a.endissuedate)}),r(e,o.SET_INVENTORY_YEB_STOCK_QUANTITY_LIST,function(){var e=[],n=!1,o=t.get("stockQuantity");if(a.list.length>0){for(var l in a.list)a.list[l].quantity===o&&(n=!0),e.push({key:a.list[l].name,value:a.list[l].quantity});return n?t.set("stockQuabtityList",e):t.set("stockQuabtityList",e).set("stockQuantity",e[0].value).set("stockQuantityName",e[0].key)}return t.set("stockQuabtityList",e)}),r(e,o.CHANGE_INVENTPRY_YEB_STOCK_QUANTITY,function(){return t.set("stockQuantity",a.value).set("stockQuantityName",a.label)}),r(e,o.SET_INVENTORY_YEB_STOCK_CATEGORY_LIST,function(){var e=t.get("stockCategoryValue"),n=t.get("stockCategorylabel"),o=!1,i=function t(a,n){return a.map(function(a,i){return a.childList&&a.childList.length?(""+n+l.TREE_JOIN_STR+a.uuid===e&&(o=!0),{key:""+n+l.TREE_JOIN_STR+a.uuid,label:a.name,childList:t(a.childList,""+n+l.TREE_JOIN_STR+a.uuid)}):(""+n+l.TREE_JOIN_STR+a.uuid===e&&(o=!0),{key:""+n+l.TREE_JOIN_STR+a.uuid,label:a.name,childList:[]})})}(a.categoryList,""),r=[{label:"全部类别",key:"-:-",childList:[]}].concat(i);return o?t.set("stockCategoryList",r).set("stockCategoryValue",e).set("stockCategorylabel",n):t.set("stockCategoryList",r).set("stockCategoryValue",r[0].key).set("stockCategorylabel",r[0].label)}),r(e,o.SET_INVENTORY_YEB_STOCK_CATEGORY_UUID,function(){return t.set("stockCategoryValue",a.key).set("stockCategorylabel",a.label).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid)}),r(e,o.SET_INVENTORY_YEB_STOCK_STORE_LIST,function(){var e=t.get("stockStoreValue"),n=t.get("stockStoreLabel"),o=!1,l=function t(a){return a.map(function(a,n){return a.childList&&a.childList.length?(e===a.uuid&&(o=!0),{key:""+a.uuid,label:a.name,childList:t(a.childList)}):(e===a.uuid&&(o=!0),{key:""+a.uuid,label:a.name,childList:[]})})}(a.list);if(l.length>0){var i=[{label:l[0].label,key:l[0].key,childList:[]}].concat(l[0].childList);return o?t.set("stockStoreList",i).set("stockStoreValue",e).set("stockStoreLabel",n):t.set("stockStoreList",i).set("stockStoreValue",l[0].key).set("stockStoreLabel",l[0].label)}return t.set("stockStoreList",[])}),r(e,o.SET_INVENTORY_YEB_STOCK_STORE_VALUE,function(){return t.set("stockStoreValue",a.value).set("stockStoreLabel",a.label)}),r(e,o.SET_INVENTORY_YEB_SELECTED_DATA,function(){return t.set("dataList",a.dataList)}),r(e,o.HANGLE_INVENTORY_YEB_SHOW_CHILD_LIST,function(){var e=t.get("showChildList"),n=void 0;if(e.includes(a.uuid)){var o=e.findIndex(function(e,t){return e===a.uuid});n=e.splice(o,1)}else n=e.concat(a.uuid);return t.set("showChildList",n)}),r(e,o.SET_INVENTORY_YEB_INIT_STOCK_CATEGORY_LIST,function(){var e=function e(t,a){return t.map(function(t,n){return t.childList&&t.childList.length?{key:""+a+l.TREE_JOIN_STR+t.uuid,label:t.name,childList:e(t.childList,""+a+l.TREE_JOIN_STR+t.uuid)}:{key:""+a+l.TREE_JOIN_STR+t.uuid,label:t.name,childList:[]}})}(a.categoryList,""),n=[{label:"全部类别",key:"-:-",childList:[]}].concat(e);return t.set("stockCategoryList",n).set("stockCategoryValue",n[0].key).set("stockCategorylabel",n[0].label)}),r(e,o.SET_INVENTORY_YEB_INIT_STOCK_STORE_LIST,function(){var e=function e(t){return t.map(function(t,a){return t.childList&&t.childList.length?{key:""+t.uuid,label:t.name,childList:e(t.childList)}:{key:""+t.uuid,label:t.name,childList:[]}})}(a.list);if(e.length>0){var n=[{label:e[0].label,key:e[0].key,childList:[]}].concat(e[0].childList);return t.set("stockStoreList",n).set("stockStoreValue",e[0].key).set("stockStoreLabel",e[0].label)}return t.set("stockStoreList",[])}),r(e,o.SET_INVENTORY_YEB_INIT_STOCK_QUANTITY_LIST,function(){var e=[];if(a.list.length>0){for(var n in a.list)e.push({key:a.list[n].name,value:a.list[n].quantity});return t.set("stockQuabtityList",e).set("stockQuantity",e[0].value).set("stockQuantityName",e[0].key)}return t.set("stockQuabtityList",e)}),r(e,o.CHANGE_INVENTPORY_YEB_TYPE,function(){return t.set("inventoryType",a.value)}),r(e,o.CHANGE_INVENTORY_YEB_CHOOSE_VALUE,function(){return t.set("chooseValue",a.value)}),r(e,o.SET_INVENTORY_YEB_TYPE_LIST,function(){return t.set("typeList",[{label:"全部类型",key:"",childList:[]}].concat(a.list)).set("typeListValue",a.value).set("typeListLabel",a.label)}),r(e,o.SET_INVENTORY_YEB_TYPE_LIST_VALUE,function(){return t.set("typeListValue",a.value).set("typeListLabel",a.label)}),r(e,o.CHANGE_DECIMAL_OF_CONFIG,function(){return t.set("quantityScale",a.receiveData.quantityScale).set("priceScale",a.receiveData.priceScale)}),e)[a.type]||function(){return t})()};var n=a(9),o=i(a(1639)),l=i(a(25));function i(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}var u=(0,n.fromJS)({issuedate:"",endissuedate:"",dataList:[],stockQuabtityList:[],stockQuantity:"",stockQuantityName:"",stockCategoryList:[],stockCategoryValue:"",stockCategorylabel:"",topCategoryUuid:"",subCategoryUuid:"",stockStoreList:[],stockStoreValue:"",stockStoreLabel:"",showChildList:[],chooseValue:"ISSUE",inventoryType:"Inventory",typeList:[],typeListValue:"",typeListLabel:"全部类型",quantityScale:"",priceScale:""})}}]);