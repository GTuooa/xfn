(window.webpackJsonp=window.webpackJsonp||[]).push([[23],{1622:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.getDecimalScale=e.changeReverseAmount=e.changeInventoryMxbBalanceDirection=e.changeTypeListValue=e.changeOtherTypeStockStoreValue=e.changeInventoryYebType=e.getOtherTypeMxbData=e.getOtherTypeStockTypeList=e.getOtherTypeStockCardDetail=e.getOtherTypeStockCategory=e.getOtherTypeStockStore=e.handleInventoryMxbDateChooseValue=e.getInventoryMxbSelectedData=e.getInventoryStockStore=e.getInventoryMxbStockDetailCard=e.getInventoryMxbStockCategory=e.changeStockStoreList=e.changeStockCategoryValue=e.changeCardList=e.setInventoryMxbDate=e.getInventoryMxbDataFromYeb=void 0;var o,i=a(13),r=a(182),s=(o=r)&&o.__esModule?o:{default:o},n=T(a(1623)),u=T(a(10)),_=T(a(25));a(9);function T(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e.default=t,e}e.getInventoryMxbDataFromYeb=function(t,e,a,o,r,T,c,d,S,E,y,g,N,O,C,I,b){return function(V,R){V(L()),"Other"===C?(V({type:n.SET_OTHER_TYPE_INVENTORY_MXB_INIT_DATA,issuedate:t,endissuedate:e,chooseValue:O,stockStoreValue:g||"",stockStoreLabel:N||"",topCategoryUuid:T,subCategoryUuid:c,stockCategoryValue:r,stockCategorylabel:d,uuid:a,name:o,inventoryType:C,typeListValue:I,typeListLabel:b}),V(l(t,e))):(u.toast.loading(_.LOADING_TIP_TEXT,0),(0,s.default)("getInventoryMxbStockCard","POST",JSON.stringify({begin:t||"",end:e||"",topCategoryUuid:T,subCategoryUuid:c||"",isType:!1}),function(_){(0,i.showMessage)(_)&&(0,s.default)("getInventoryMxbStockDetail","POST",JSON.stringify({begin:t||"",end:e||"",topCategoryUuid:T,subCategoryUuid:c,stockCardUuid:a,storeCardUuid:g,isType:!1}),function(s){(0,i.showMessage)(s)&&(u.toast.hide(),V({type:n.SET_INVENTORY_MXB_INIT_DATA,cardList:_.data.cardList,stockCategoryList:S,issuedate:t,endissuedate:e,uuid:a,name:o,topCategoryUuid:T,subCategoryUuid:c,stockStoreList:y,stockStoreValue:g||"",stockStoreLabel:N||"",baseData:s.data.detail,stockQuantity:E,stockCategoryValue:r,chooseValue:O,stockCategorylabel:d,inventoryType:C}))})}))}},e.setInventoryMxbDate=function(t,e){return function(a){a({type:n.SET_INVENTORY_MXB_DATE,issuedate:t,endissuedate:e})}},e.changeCardList=function(t,e){return function(a){a({type:n.CHANGE_INVENTORY_MXB_CARDLIST,value:t,name:e})}},e.changeStockCategoryValue=function(t,e,a){return function(o){o({type:n.CHANGE_INVENTORY_MXB_STOCK_CATEGORY_LIST,stockCategoryValue:t,topCategoryUuid:e,subCategoryUuid:a})}},e.changeStockStoreList=function(t,e){return function(a){a({type:n.CHANGE_INVENTORY_MXB_STOCK_STORE_LIST,stockStoreValue:t,stockStoreLabel:e})}},e.getInventoryMxbStockCategory=function(t,e){return function(a,o){var r=o().inventoryMxbState.get("stockQuantity"),u=o().inventoryMxbState.get("stockCategoryValue"),T=o().inventoryMxbState.get("stockCategorylabel");(0,s.default)("getInventoryYebstockCategory","POST",JSON.stringify({begin:t||"",end:e||"",stockQuantity:r,isType:!1}),function(t){if((0,i.showMessage)(t)){var e=!1,r=function t(a,o){return a.map(function(a,i){return a.childList&&a.childList.length?(""+o+_.TREE_JOIN_STR+a.uuid===u&&(e=!0),{key:""+o+_.TREE_JOIN_STR+a.uuid,label:a.name,childList:t(a.childList,""+o+_.TREE_JOIN_STR+a.uuid)}):(""+o+_.TREE_JOIN_STR+a.uuid===u&&(e=!0),{key:""+o+_.TREE_JOIN_STR+a.uuid,label:a.name,childList:[]})})}(t.data.categoryList,""),s=[{label:"全部",key:"-:-",childList:[]}].concat(r);if(e){var d=o().inventoryMxbState.get("topCategoryUuid"),S=o().inventoryMxbState.get("subCategoryUuid");a({type:n.SET_INVENTORY_MXB_CATEGORY_LIST,stockCategoryList:s,stockCategoryValue:u,stockCategorylabel:T,topCategoryUuid:d,subCategoryUuid:S}),a(c(d,S))}else a({type:n.SET_INVENTORY_MXB_CATEGORY_LIST,stockCategoryList:s,stockCategoryValue:"",stockCategorylabel:"全部",topCategoryUuid:"",subCategoryUuid:""}),a(c("",""))}})}};var c=e.getInventoryMxbStockDetailCard=function(t,e){return function(a,o){var r=o().inventoryMxbState.get("issuedate"),u=o().inventoryMxbState.get("endissuedate");(0,s.default)("getInventoryMxbStockCard","POST",JSON.stringify({begin:r||"",end:u||"",topCategoryUuid:t,subCategoryUuid:e,isType:!1}),function(t){if((0,i.showMessage)(t)){var e=[],r=!1,s=o().inventoryMxbState.get("cardValue"),u=o().inventoryMxbState.get("cardName");t.data.cardList&&t.data.cardList.map(function(t,a){e.push({name:t.sockCardName,uuid:t.stockCardUuid}),t.stockCardUuid===s&&(r=!0)}),r?(a({type:n.SET_INVENTORY_MXB_STOCK_CARDLIST,cardList:e,cardValue:s,cardName:u}),a(d(s))):(a({type:n.SET_INVENTORY_MXB_STOCK_CARDLIST,cardList:e,cardValue:e[0].uuid,cardName:e[0].name}),a(d(e[0].uuid)))}})}},d=e.getInventoryStockStore=function(t){return function(e,a){var o=a().inventoryMxbState.get("issuedate"),r=a().inventoryMxbState.get("endissuedate"),u=a().inventoryMxbState.get("stockQuantity"),_=a().inventoryMxbState.get("topCategoryUuid"),T=a().inventoryMxbState.get("subCategoryUuid");(0,s.default)("getInventoryYebStockStore","POST",JSON.stringify({begin:o||"",end:r||"",topCategoryUuid:_,subCategoryUuid:T,stockQuantity:u,stockCardUuid:t,isType:!1}),function(t){if((0,i.showMessage)(t)){var o=a().inventoryMxbState.get("stockStoreValue"),r=a().inventoryMxbState.get("stockStoreLabel"),s=!1,u=t.data.storeList.length?function t(e){return e.map(function(e,a){return e.childList&&e.childList.length?(o===e.uuid&&(s=!0),{key:""+e.uuid,label:e.name,childList:t(e.childList)}):(o===e.uuid&&(s=!0),{key:""+e.uuid,label:e.name,childList:[]})})}(t.data.storeList):[],_=u.length?[{label:u[0].label,key:u[0].key,childList:[]}].concat(u[0].childList):[];s?(e({type:n.SET_INVENTORY_MXB_STOCK_STORE,stockStoreList:_,stockStoreValue:o,stockStoreLabel:r}),e(S(o))):_.length>0?(e({type:n.SET_INVENTORY_MXB_STOCK_STORE,stockStoreList:_,stockStoreValue:t.data.storeList.length?t.data.storeList[0].uuid:"",stockStoreLabel:t.data.storeList.length?t.data.storeList[0].name:""}),e(S(t.data.storeList.length?t.data.storeList[0].uuid:""))):(e({type:n.SET_INVENTORY_MXB_STOCK_STORE,stockStoreList:_,stockStoreValue:"",stockStoreLabel:""}),e(S("")))}})}},S=e.getInventoryMxbSelectedData=function(t){return function(e,a){u.toast.loading(_.LOADING_TIP_TEXT,0);var o=a().inventoryMxbState.get("issuedate"),r=a().inventoryMxbState.get("endissuedate"),T=a().inventoryMxbState.get("cardValue"),c=a().inventoryMxbState.get("topCategoryUuid"),d=a().inventoryMxbState.get("subCategoryUuid");(0,s.default)("getInventoryMxbStockDetail","POST",JSON.stringify({begin:o||"",end:r||"",topCategoryUuid:c,subCategoryUuid:d,stockCardUuid:T,storeCardUuid:t,isType:!1}),function(t){(0,i.showMessage)(t)&&(u.toast.hide(),e({type:n.SET_INVENTORY_MXB_SELECTED_DATA,baseData:t.data.detail}))})}},l=(e.handleInventoryMxbDateChooseValue=function(t){return function(e){e({type:n.HANDLE_INVENTORY_MXB_DATE_CHOOSE_VALUE,value:t})}},e.getOtherTypeStockStore=function(t,e){return function(a,o){(0,s.default)("getInventoryYebStockStore","POST",JSON.stringify({begin:t||"",end:e||"",isType:!0}),function(t){if((0,i.showMessage)(t)){var e=o().inventoryMxbState.get("stockStoreListOtherValue"),r=o().inventoryMxbState.get("stockStoreListOtherLabel"),s=!1,u=function t(a){return a.map(function(a,o){return a.childList&&a.childList.length?(e===a.uuid&&(s=!0),{key:""+a.uuid,label:a.name,childList:t(a.childList)}):(e===a.uuid&&(s=!0),{key:""+a.uuid,label:a.name,childList:[]})})}(t.data.storeList);if(s){var _=[{label:u[0].label,key:u[0].key,childList:[]}].concat(u[0].childList);a({type:n.SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST,stockStoreListOther:_,stockStoreListOtherValue:e,stockStoreListOtherLabel:r}),a(E(e))}else if(t.data.storeList.length>0){var T=[{label:u[0].label,key:u[0].key,childList:[]}].concat(u[0].childList);a({type:n.SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST,stockStoreListOther:T,stockStoreListOtherValue:t.data.storeList[0].uuid,stockStoreListOtherLabel:t.data.storeList[0].name}),a(E(t.data.storeList[0].uuid))}else a({type:n.SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST,stockStoreListOther:[],stockStoreListOtherValue:"",stockStoreListOtherLabel:""}),a(E(""))}})}}),E=e.getOtherTypeStockCategory=function(t){return function(e,a){var o=a().inventoryMxbState.get("issuedate"),r=a().inventoryMxbState.get("endissuedate");(0,s.default)("getInventoryYebstockCategory","POST",JSON.stringify({begin:o||"",end:r||"",storeCardUuid:t||"",isType:!0}),function(t){if((0,i.showMessage)(t)){var o=a().inventoryMxbState.get("stockCategoryValue"),r=a().inventoryMxbState.get("stockCategorylabel"),s=!1,u=function t(e,a){return e.map(function(e,i){return e.childList&&e.childList.length?(""+a+_.TREE_JOIN_STR+e.uuid===o&&(s=!0),{key:""+a+_.TREE_JOIN_STR+e.uuid,label:e.name,childList:t(e.childList,""+a+_.TREE_JOIN_STR+e.uuid)}):(""+a+_.TREE_JOIN_STR+e.uuid===o&&(s=!0),{key:""+a+_.TREE_JOIN_STR+e.uuid,label:e.name,childList:[]})})}(t.data.categoryList,""),T=[{label:"全部",key:"-:-",childList:[]}].concat(u);if(s){var c=a().inventoryMxbState.get("topCategoryUuid"),d=a().inventoryMxbState.get("subCategoryUuid");e({type:n.SET_INVENTORY_MXB_CATEGORY_LIST,stockCategoryList:T,stockCategoryValue:o,stockCategorylabel:r,topCategoryUuid:c,subCategoryUuid:d}),e(y(c,d))}else e({type:n.SET_INVENTORY_MXB_CATEGORY_LIST,stockCategoryList:T,stockCategoryValue:"",stockCategorylabel:"全部",topCategoryUuid:"",subCategoryUuid:""}),e(y("",""))}})}},y=e.getOtherTypeStockCardDetail=function(t,e){return function(a,o){var r=o().inventoryMxbState.get("issuedate"),u=o().inventoryMxbState.get("endissuedate"),_=o().inventoryMxbState.get("stockStoreListOtherValue");(0,s.default)("getInventoryMxbStockCard","POST",JSON.stringify({begin:r||"",end:u||"",topCategoryUuid:t||"",subCategoryUuid:e||"",storeCardUuid:_||"",isType:!0}),function(t){if((0,i.showMessage)(t)){var e=[],r=!1,s=o().inventoryMxbState.get("cardValue"),u=o().inventoryMxbState.get("cardName");t.data.cardList&&t.data.cardList.map(function(t,a){e.push({name:t.sockCardName,uuid:t.stockCardUuid}),t.stockCardUuid===s&&(r=!0)}),r?(a({type:n.SET_INVENTORY_MXB_STOCK_CARDLIST,cardList:e,cardValue:s,cardName:u}),a(g(s))):0===e.length?(a({type:n.SET_INVENTORY_MXB_STOCK_CARDLIST,cardList:e,cardValue:"",cardName:""}),a(g(""))):(a({type:n.SET_INVENTORY_MXB_STOCK_CARDLIST,cardList:e,cardValue:e[0].uuid,cardName:e[0].name}),a(g(e[0].uuid)))}})}},g=e.getOtherTypeStockTypeList=function(t){return function(e,a){var o=a().inventoryMxbState.get("issuedate"),r=a().inventoryMxbState.get("endissuedate"),u=a().inventoryMxbState.get("stockStoreListOtherValue"),_=a().inventoryMxbState.get("topCategoryUuid"),T=a().inventoryMxbState.get("subCategoryUuid");(0,s.default)("getInventoryYebTypeList","POST",JSON.stringify({begin:o||"",end:r||"",topCategoryUuid:_||"",subCategoryUuid:T||"",storeCardUuid:u||"",stockCardUuid:t||"",isType:!0}),function(t){if((0,i.showMessage)(t)){var o=a().inventoryMxbState.get("typeListValue"),r=a().inventoryMxbState.get("typeListLabel"),s=!1,u=function t(e){return e.map(function(e,a){return e.childList&&e.childList.length?(o===e.acId&&(s=!0),{key:""+e.acId,label:e.name,childList:t(e.childList)}):(o===e.acId&&(s=!0),{key:""+e.acId,label:e.name,childList:[]})})}(t.data.typeList),_=[{key:"",label:"全部",childList:[]}].concat(u);s?(e({type:n.SET_INVENTORY_MXB_TYPE_LIST,typeList:_,typeListValue:o,typeListLabel:r}),e(N(o))):(e({type:n.SET_INVENTORY_MXB_TYPE_LIST,typeList:_,typeListValue:"",typeListLabel:"全部"}),e(N("")))}})}},N=e.getOtherTypeMxbData=function(t){return function(e,a){u.toast.loading(_.LOADING_TIP_TEXT,0);var o=a().inventoryMxbState.get("issuedate"),i=a().inventoryMxbState.get("endissuedate"),r=a().inventoryMxbState.get("stockStoreListOtherValue"),T=a().inventoryMxbState.get("topCategoryUuid"),c=a().inventoryMxbState.get("subCategoryUuid"),d=a().inventoryMxbState.get("cardValue");(0,s.default)("getInventoryMxbStockDetail","POST",JSON.stringify({begin:o||"",end:i||"",topCategoryUuid:T||"",subCategoryUuid:c||"",storeCardUuid:r||"",stockCardUuid:d||"",acId:t||"",isType:!0}),function(t){u.toast.hide(),e({type:n.SET_INVENTORY_MXB_SELECTED_DATA,baseData:t.data.detail}),e({type:n.SET_INVENTORY_MXB_BALANCE_DIRECTION,value:t.data.detail.detailList.length?t.data.detail.detailList[0].balanceDirection:"debit"}),e({type:n.CHANGE_REVERSE_AMOUNT_TYPE,value:!1})})}},L=(e.changeInventoryYebType=function(t){return function(e){e({type:n.SET_INVENTORY_MXB_TYPE,value:"Inventory"===t?"Other":"Inventory"})}},e.changeOtherTypeStockStoreValue=function(t,e){return function(a){a({type:n.SET_INVENTORY_MXB_OTHER_TYPE_STOCK_STORE_VALUE,value:t,label:e})}},e.changeTypeListValue=function(t,e){return function(a){a({type:n.SET_INVENTPRY_MXB_TYPE_LIST_VALUE,value:t,label:e})}},e.changeInventoryMxbBalanceDirection=function(t){return function(e){e({type:n.SET_INVENTORY_MXB_BALANCE_DIRECTION,value:"debit"===t?"credit":"debit"})}},e.changeReverseAmount=function(t){return function(e){e({type:n.CHANGE_REVERSE_AMOUNT_TYPE,value:!t})}},e.getDecimalScale=function(){return function(t){u.toast.loading(_.LOADING_TIP_TEXT,0),(0,s.default)("getInventoryYebDecimalScale","GET","",function(e){u.toast.hide(),t({type:n.CHANGE_DECIMAL_OF_CONFIG_MXB,receiveData:e.data.scale})})}})},1623:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});e.INIT_INVENTORY_MXB="INIT_INVENTORY_MXB",e.SET_INVENTORY_MXB_DATE="SET_INVENTORY_MXB_DATE",e.SET_INVENTORY_MXB_INIT_DATA="SET_INVENTORY_MXB_INIT_DATA",e.CHANGE_INVENTORY_MXB_CARDLIST="CHANGE_INVENTORY_MXB_CARDLIST",e.SET_INVENTORY_MXB_CATEGORY_LIST="SET_INVENTORY_MXB_CATEGORY_LIST",e.SET_INVENTORY_MXB_STOCK_CARDLIST="SET_INVENTORY_MXB_STOCK_CARDLIST",e.SET_INVENTORY_MXB_STOCK_STORE="SET_INVENTORY_MXB_STOCK_STORE",e.SET_INVENTORY_MXB_SELECTED_DATA="SET_INVENTORY_MXB_SELECTED_DATA",e.CHANGE_INVENTORY_MXB_STOCK_CATEGORY_LIST="CHANGE_INVENTORY_MXB_STOCK_CATEGORY_LIST",e.CHANGE_INVENTORY_MXB_STOCK_STORE_LIST="CHANGE_INVENTORY_MXB_STOCK_STORE_LIST",e.HANDLE_INVENTORY_MXB_DATE_CHOOSE_VALUE="HANDLE_INVENTORY_MXB_DATE_CHOOSE_VALUE",e.SET_OTHER_TYPE_INVENTORY_MXB_INIT_DATA="SET_OTHER_TYPE_INVENTORY_MXB_INIT_DATA",e.SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST="SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST",e.SET_INVENTORY_MXB_TYPE_LIST="SET_INVENTORY_MXB_TYPE_LIST",e.SET_INVENTORY_MXB_TYPE="SET_INVENTORY_MXB_TYPE",e.SET_INVENTORY_MXB_OTHER_TYPE_STOCK_STORE_VALUE="SET_INVENTORY_MXB_OTHER_TYPE_STOCK_STORE_VALUE",e.SET_INVENTPRY_MXB_TYPE_LIST_VALUE="SET_INVENTPRY_MXB_TYPE_LIST_VALUE",e.SET_INVENTORY_MXB_BALANCE_DIRECTION="SET_INVENTORY_MXB_BALANCE_DIRECTION",e.CHANGE_INVENTORY_MXB_BALANCE_DIRECTION="CHANGE_INVENTORY_MXB_BALANCE_DIRECTION",e.CHANGE_REVERSE_AMOUNT_TYPE="CHANGE_REVERSE_AMOUNT_TYPE",e.CHANGE_DECIMAL_OF_CONFIG_MXB="CHANGE_DECIMAL_OF_CONFIG_MXB"},1624:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:u,a=arguments[1];return((t={},n(t,i.INIT_INVENTORY_MXB,function(){return u}),n(t,i.SET_INVENTORY_MXB_INIT_DATA,function(){var t=[];return a.cardList&&a.cardList.map(function(e,a){t.push({name:e.sockCardName,uuid:e.stockCardUuid})}),e.set("issuedate",a.issuedate).set("endissuedate",a.endissuedate).set("baseData",a.baseData).set("beginningData",a.baseData.detailList.length>0?a.baseData.detailList[0]:{}).set("listData",a.baseData.detailList.splice(1,a.baseData.detailList.length)).set("cardList",t).set("cardValue",a.uuid).set("cardName",a.name).set("stockCategoryList",a.stockCategoryList).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid).set("stockCategoryValue",(0,o.fromJS)(a.stockCategoryValue)).set("stockStoreList",a.stockStoreList).set("stockStoreValue",a.stockStoreList.length>0?a.stockStoreValue:"").set("stockStoreLabel",a.stockStoreList.length>0?a.stockStoreLabel:"").set("stockQuantity",a.stockQuantity).set("chooseValue",a.chooseValue).set("stockCategorylabel",a.stockCategorylabel).set("inventoryType",a.inventoryType)}),n(t,i.SET_OTHER_TYPE_INVENTORY_MXB_INIT_DATA,function(){return e.set("issuedate",a.issuedate).set("endissuedate",a.endissuedate).set("chooseValue",a.chooseValue).set("stockStoreListOtherValue",a.stockStoreValue).set("stockStoreListOtherLabel",a.stockStoreLabel).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid).set("stockCategoryValue",(0,o.fromJS)(a.stockCategoryValue)).set("stockCategorylabel",a.stockCategorylabel).set("cardValue",a.uuid).set("cardName",a.name).set("inventoryType",a.inventoryType).set("typeListValue",a.typeListValue).set("typeListLabel",a.typeListLabel)}),n(t,i.CHANGE_INVENTORY_MXB_CARDLIST,function(){return e.set("cardValue",a.value).set("cardName",a.name)}),n(t,i.SET_INVENTORY_MXB_DATE,function(){return e.set("issuedate",a.issuedate).set("endissuedate",a.endissuedate)}),n(t,i.SET_INVENTORY_MXB_STOCK_CARDLIST,function(){return a.cardList.length||(e=e.set("stockCategoryValue",""+r.TREE_JOIN_STR).set("stockCategoryList",[])),e.set("cardList",a.cardList).set("cardValue",a.cardValue).set("cardName",a.cardName)}),n(t,i.SET_INVENTORY_MXB_STOCK_STORE,function(){return e.set("stockStoreList",a.stockStoreList).set("stockStoreValue",a.stockStoreValue).set("stockStoreLabel",a.stockStoreLabel)}),n(t,i.SET_INVENTORY_MXB_SELECTED_DATA,function(){return e.set("baseData",a.baseData).set("beginningData",a.baseData.detailList.length>0?a.baseData.detailList[0]:{}).set("listData",a.baseData.detailList.splice(1,a.baseData.detailList.length))}),n(t,i.CHANGE_INVENTORY_MXB_STOCK_CATEGORY_LIST,function(){return e.set("stockCategoryValue",(0,o.fromJS)(a.stockCategoryValue)).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid)}),n(t,i.CHANGE_INVENTORY_MXB_STOCK_STORE_LIST,function(){return e.set("stockStoreValue",a.stockStoreValue).set("stockStoreLabel",a.stockStoreLabel)}),n(t,i.HANDLE_INVENTORY_MXB_DATE_CHOOSE_VALUE,function(){return e.set("chooseValue",a.value)}),n(t,i.SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST,function(){return e.set("stockStoreListOther",a.stockStoreListOther).set("stockStoreListOtherValue",a.stockStoreListOtherValue).set("stockStoreListOtherLabel",a.stockStoreListOtherLabel)}),n(t,i.SET_INVENTORY_MXB_CATEGORY_LIST,function(){return e.set("stockCategoryList",a.stockCategoryList).set("stockCategoryValue",(0,o.fromJS)(a.stockCategoryValue)).set("stockCategorylabel",a.stockCategorylabel).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid)}),n(t,i.SET_INVENTORY_MXB_TYPE_LIST,function(){return e.set("typeList",a.typeList).set("typeListValue",a.typeListValue).set("typeListLabel",a.typeListLabel)}),n(t,i.SET_INVENTORY_MXB_TYPE,function(){return e.set("inventoryType",a.value)}),n(t,i.SET_INVENTORY_MXB_OTHER_TYPE_STOCK_STORE_VALUE,function(){return e.set("stockStoreListOtherValue",a.value).set("stockStoreListOtherLabel",a.label)}),n(t,i.SET_INVENTPRY_MXB_TYPE_LIST_VALUE,function(){return e.set("typeListValue",a.value).set("typeListLabel",a.label)}),n(t,i.SET_INVENTORY_MXB_BALANCE_DIRECTION,function(){return e.set("balanceDeirection",a.value)}),n(t,i.CHANGE_REVERSE_AMOUNT_TYPE,function(){return e.set("showReverseAmount",a.value)}),n(t,i.CHANGE_DECIMAL_OF_CONFIG_MXB,function(){return e.set("quantityScale",a.receiveData.quantityScale).set("priceScale",a.receiveData.priceScale)}),t)[a.type]||function(){return e})()};var o=a(9),i=s(a(1623)),r=s(a(25));function s(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var a in t)Object.prototype.hasOwnProperty.call(t,a)&&(e[a]=t[a]);return e.default=t,e}function n(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}var u=(0,o.fromJS)({issuedate:"",endissuedate:"",baseData:{},listData:[],beginningData:{},stockQuantity:"",cardList:[],cardValue:"",cardName:"",stockCategoryList:[],stockCategoryValue:{key:""},stockCategorylabel:"",topCategoryUuid:"",subCategoryUuid:"",stockStoreList:[],stockStoreValue:"",stockStoreLabel:"",chooseValue:"",inventoryType:"",stockStoreListOther:[],stockStoreListOtherValue:"",stockStoreListOtherLabel:"",typeList:[],typeListValue:"",typeListLabel:"",balanceDeirection:"",showReverseAmount:!1,quantityScale:"",priceScale:""})}}]);