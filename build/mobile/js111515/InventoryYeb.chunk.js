(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[79],{1203:function(t,e,a){"use strict";a.d(e,"g",(function(){return n})),a.d(e,"j",(function(){return i})),a.d(e,"k",(function(){return o})),a.d(e,"b",(function(){return c})),a.d(e,"i",(function(){return s})),a.d(e,"n",(function(){return r})),a.d(e,"o",(function(){return u})),a.d(e,"m",(function(){return l})),a.d(e,"c",(function(){return d})),a.d(e,"d",(function(){return y})),a.d(e,"f",(function(){return b})),a.d(e,"s",(function(){return g})),a.d(e,"t",(function(){return L})),a.d(e,"q",(function(){return m})),a.d(e,"p",(function(){return S})),a.d(e,"l",(function(){return E})),a.d(e,"r",(function(){return k})),a.d(e,"h",(function(){return f})),a.d(e,"e",(function(){return v})),a.d(e,"a",(function(){return p}));var n="INIT_INVENTORY_MXB",i="SET_INVENTORY_MXB_DATE",o="SET_INVENTORY_MXB_INIT_DATA",c="CHANGE_INVENTORY_MXB_CARDLIST",s="SET_INVENTORY_MXB_CATEGORY_LIST",r="SET_INVENTORY_MXB_STOCK_CARDLIST",u="SET_INVENTORY_MXB_STOCK_STORE",l="SET_INVENTORY_MXB_SELECTED_DATA",d="CHANGE_INVENTORY_MXB_STOCK_CATEGORY_LIST",y="CHANGE_INVENTORY_MXB_STOCK_STORE_LIST",b="HANDLE_INVENTORY_MXB_DATE_CHOOSE_VALUE",g="SET_OTHER_TYPE_INVENTORY_MXB_INIT_DATA",L="SET_OTHER_TYPE_INVENTORY_MXB_STORE_LIST",m="SET_INVENTORY_MXB_TYPE_LIST",S="SET_INVENTORY_MXB_TYPE",E="SET_INVENTORY_MXB_OTHER_TYPE_STOCK_STORE_VALUE",k="SET_INVENTPRY_MXB_TYPE_LIST_VALUE",f="SET_INVENTORY_MXB_BALANCE_DIRECTION",v="CHANGE_REVERSE_AMOUNT_TYPE",p="CHANGE_DECIMAL_OF_CONFIG_MXB"},1322:function(t,e,a){"use strict";a.d(e,"i",(function(){return r})),a.d(e,"t",(function(){return u})),a.d(e,"a",(function(){return l})),a.d(e,"f",(function(){return d})),a.d(e,"g",(function(){return y})),a.d(e,"k",(function(){return b})),a.d(e,"l",(function(){return g})),a.d(e,"m",(function(){return L})),a.d(e,"j",(function(){return m})),a.d(e,"s",(function(){return S})),a.d(e,"q",(function(){return E})),a.d(e,"p",(function(){return k})),a.d(e,"o",(function(){return f})),a.d(e,"r",(function(){return v})),a.d(e,"n",(function(){return p})),a.d(e,"c",(function(){return O})),a.d(e,"d",(function(){return C})),a.d(e,"h",(function(){return T})),a.d(e,"b",(function(){return h})),a.d(e,"e",(function(){return N}));a(32),a(31),a(70);var n=a(12),i=a(57),o=a(1203),c=a(2),s=a(14),r=(a(1),function(t,e,a,r,u,l,d,y,b,g,L,m,S,k,f,v,p){return function(O,C){O(_()),"Other"===f?(O({type:o.s,issuedate:t,endissuedate:e,chooseValue:k,stockStoreValue:m||"",stockStoreLabel:S||"",topCategoryUuid:l,subCategoryUuid:d,stockCategoryValue:u,stockCategorylabel:y,uuid:a,name:r,inventoryType:f,typeListValue:v,typeListLabel:p}),O(E(t,e))):(c.a.toast.loading(s.p,0),Object(i.a)("getInventoryMxbStockCard","POST",JSON.stringify({begin:t||"",end:e||"",topCategoryUuid:l,subCategoryUuid:d||"",isType:!1}),(function(s){Object(n.u)(s)&&Object(i.a)("getInventoryMxbStockDetail","POST",JSON.stringify({begin:t||"",end:e||"",topCategoryUuid:l,subCategoryUuid:d,stockCardUuid:a,storeCardUuid:m,isType:!1}),(function(i){Object(n.u)(i)&&(c.a.toast.hide(),O({type:o.k,cardList:s.data.cardList,stockCategoryList:b,issuedate:t,endissuedate:e,uuid:a,name:r,topCategoryUuid:l,subCategoryUuid:d,stockStoreList:L,stockStoreValue:m||"",stockStoreLabel:S||"",baseData:i.data.detail,stockQuantity:g,stockCategoryValue:u,chooseValue:k,stockCategorylabel:y,inventoryType:f}))}))})))}}),u=function(t,e){return function(a){a({type:o.j,issuedate:t,endissuedate:e})}},l=function(t,e){return function(a){a({type:o.b,value:t,name:e})}},d=function(t,e,a){return function(n){n({type:o.c,stockCategoryValue:t,topCategoryUuid:e,subCategoryUuid:a})}},y=function(t,e){return function(a){a({type:o.d,stockStoreValue:t,stockStoreLabel:e})}},b=function(t,e){return function(a,c){var r=c().inventoryMxbState.get("stockQuantity"),u=c().inventoryMxbState.get("stockCategoryValue"),l=c().inventoryMxbState.get("stockCategorylabel");Object(i.a)("getInventoryYebstockCategory","POST",JSON.stringify({begin:t||"",end:e||"",stockQuantity:r,isType:!1}),(function(t){if(Object(n.u)(t)){var e=!1,i=function t(a,n){return a.map((function(a,i){return a.childList&&a.childList.length?("".concat(n).concat(s.B).concat(a.uuid)===u&&(e=!0),{key:"".concat(n).concat(s.B).concat(a.uuid),label:a.name,childList:t(a.childList,"".concat(n).concat(s.B).concat(a.uuid))}):("".concat(n).concat(s.B).concat(a.uuid)===u&&(e=!0),{key:"".concat(n).concat(s.B).concat(a.uuid),label:a.name,childList:[]})}))}(t.data.categoryList,""),r=[{label:"\u5168\u90e8",key:"-:-",childList:[]}].concat(i);if(e){var d=c().inventoryMxbState.get("topCategoryUuid"),y=c().inventoryMxbState.get("subCategoryUuid");a({type:o.i,stockCategoryList:r,stockCategoryValue:u,stockCategorylabel:l,topCategoryUuid:d,subCategoryUuid:y}),a(g(d,y))}else a({type:o.i,stockCategoryList:r,stockCategoryValue:"",stockCategorylabel:"\u5168\u90e8",topCategoryUuid:"",subCategoryUuid:""}),a(g("",""))}}))}},g=function(t,e){return function(a,c){var s=c().inventoryMxbState.get("issuedate"),r=c().inventoryMxbState.get("endissuedate");Object(i.a)("getInventoryMxbStockCard","POST",JSON.stringify({begin:s||"",end:r||"",topCategoryUuid:t,subCategoryUuid:e,isType:!1}),(function(t){if(Object(n.u)(t)){var e=[],i=!1,s=c().inventoryMxbState.get("cardValue"),r=c().inventoryMxbState.get("cardName");t.data.cardList&&t.data.cardList.map((function(t,a){e.push({name:t.sockCardName,uuid:t.stockCardUuid}),t.stockCardUuid===s&&(i=!0)})),i?(a({type:o.n,cardList:e,cardValue:s,cardName:r}),a(L(s))):(a({type:o.n,cardList:e,cardValue:e[0].uuid,cardName:e[0].name}),a(L(e[0].uuid)))}}))}},L=function(t){return function(e,a){var c=a().inventoryMxbState.get("issuedate"),s=a().inventoryMxbState.get("endissuedate"),r=a().inventoryMxbState.get("stockQuantity"),u=a().inventoryMxbState.get("topCategoryUuid"),l=a().inventoryMxbState.get("subCategoryUuid");Object(i.a)("getInventoryYebStockStore","POST",JSON.stringify({begin:c||"",end:s||"",topCategoryUuid:u,subCategoryUuid:l,stockQuantity:r,stockCardUuid:t,isType:!1}),(function(t){if(Object(n.u)(t)){var i=a().inventoryMxbState.get("stockStoreValue"),c=a().inventoryMxbState.get("stockStoreLabel"),s=!1,r=t.data.storeList.length?function t(e){return e.map((function(e,a){return e.childList&&e.childList.length?(i===e.uuid&&(s=!0),{key:"".concat(e.uuid),label:e.name,childList:t(e.childList)}):(i===e.uuid&&(s=!0),{key:"".concat(e.uuid),label:e.name,childList:[]})}))}(t.data.storeList):[],u=r.length?[{label:r[0].label,key:r[0].key,childList:[]}].concat(r[0].childList):[];s?(e({type:o.o,stockStoreList:u,stockStoreValue:i,stockStoreLabel:c}),e(m(i))):u.length>0?(e({type:o.o,stockStoreList:u,stockStoreValue:t.data.storeList.length?t.data.storeList[0].uuid:"",stockStoreLabel:t.data.storeList.length?t.data.storeList[0].name:""}),e(m(t.data.storeList.length?t.data.storeList[0].uuid:""))):(e({type:o.o,stockStoreList:u,stockStoreValue:"",stockStoreLabel:""}),e(m("")))}}))}},m=function(t){return function(e,a){c.a.toast.loading(s.p,0);var r=a().inventoryMxbState.get("issuedate"),u=a().inventoryMxbState.get("endissuedate"),l=a().inventoryMxbState.get("cardValue"),d=a().inventoryMxbState.get("topCategoryUuid"),y=a().inventoryMxbState.get("subCategoryUuid");Object(i.a)("getInventoryMxbStockDetail","POST",JSON.stringify({begin:r||"",end:u||"",topCategoryUuid:d,subCategoryUuid:y,stockCardUuid:l,storeCardUuid:t,isType:!1}),(function(t){Object(n.u)(t)&&(c.a.toast.hide(),e({type:o.m,baseData:t.data.detail}))}))}},S=function(t){return function(e){e({type:o.f,value:t})}},E=function(t,e){return function(a,c){Object(i.a)("getInventoryYebStockStore","POST",JSON.stringify({begin:t||"",end:e||"",isType:!0}),(function(t){if(Object(n.u)(t)){var e=c().inventoryMxbState.get("stockStoreListOtherValue"),i=c().inventoryMxbState.get("stockStoreListOtherLabel"),s=!1,r=function t(a){return a.map((function(a,n){return a.childList&&a.childList.length?(e===a.uuid&&(s=!0),{key:"".concat(a.uuid),label:a.name,childList:t(a.childList)}):(e===a.uuid&&(s=!0),{key:"".concat(a.uuid),label:a.name,childList:[]})}))}(t.data.storeList);if(s){var u=[{label:r[0].label,key:r[0].key,childList:[]}].concat(r[0].childList);a({type:o.t,stockStoreListOther:u,stockStoreListOtherValue:e,stockStoreListOtherLabel:i}),a(k(e))}else if(t.data.storeList.length>0){var l=[{label:r[0].label,key:r[0].key,childList:[]}].concat(r[0].childList);a({type:o.t,stockStoreListOther:l,stockStoreListOtherValue:t.data.storeList[0].uuid,stockStoreListOtherLabel:t.data.storeList[0].name}),a(k(t.data.storeList[0].uuid))}else a({type:o.t,stockStoreListOther:[],stockStoreListOtherValue:"",stockStoreListOtherLabel:""}),a(k(""))}}))}},k=function(t){return function(e,a){var c=a().inventoryMxbState.get("issuedate"),r=a().inventoryMxbState.get("endissuedate");Object(i.a)("getInventoryYebstockCategory","POST",JSON.stringify({begin:c||"",end:r||"",storeCardUuid:t||"",isType:!0}),(function(t){if(Object(n.u)(t)){var i=a().inventoryMxbState.get("stockCategoryValue"),c=a().inventoryMxbState.get("stockCategorylabel"),r=!1,u=function t(e,a){return e.map((function(e,n){return e.childList&&e.childList.length?("".concat(a).concat(s.B).concat(e.uuid)===i&&(r=!0),{key:"".concat(a).concat(s.B).concat(e.uuid),label:e.name,childList:t(e.childList,"".concat(a).concat(s.B).concat(e.uuid))}):("".concat(a).concat(s.B).concat(e.uuid)===i&&(r=!0),{key:"".concat(a).concat(s.B).concat(e.uuid),label:e.name,childList:[]})}))}(t.data.categoryList,""),l=[{label:"\u5168\u90e8",key:"-:-",childList:[]}].concat(u);if(r){var d=a().inventoryMxbState.get("topCategoryUuid"),y=a().inventoryMxbState.get("subCategoryUuid");e({type:o.i,stockCategoryList:l,stockCategoryValue:i,stockCategorylabel:c,topCategoryUuid:d,subCategoryUuid:y}),e(f(d,y))}else e({type:o.i,stockCategoryList:l,stockCategoryValue:"",stockCategorylabel:"\u5168\u90e8",topCategoryUuid:"",subCategoryUuid:""}),e(f("",""))}}))}},f=function(t,e){return function(a,c){var s=c().inventoryMxbState.get("issuedate"),r=c().inventoryMxbState.get("endissuedate"),u=c().inventoryMxbState.get("stockStoreListOtherValue");Object(i.a)("getInventoryMxbStockCard","POST",JSON.stringify({begin:s||"",end:r||"",topCategoryUuid:t||"",subCategoryUuid:e||"",storeCardUuid:u||"",isType:!0}),(function(t){if(Object(n.u)(t)){var e=[],i=!1,s=c().inventoryMxbState.get("cardValue"),r=c().inventoryMxbState.get("cardName");t.data.cardList&&t.data.cardList.map((function(t,a){e.push({name:t.sockCardName,uuid:t.stockCardUuid}),t.stockCardUuid===s&&(i=!0)})),i?(a({type:o.n,cardList:e,cardValue:s,cardName:r}),a(v(s))):0===e.length?(a({type:o.n,cardList:e,cardValue:"",cardName:""}),a(v(""))):(a({type:o.n,cardList:e,cardValue:e[0].uuid,cardName:e[0].name}),a(v(e[0].uuid)))}}))}},v=function(t){return function(e,a){var c=a().inventoryMxbState.get("issuedate"),s=a().inventoryMxbState.get("endissuedate"),r=a().inventoryMxbState.get("stockStoreListOtherValue"),u=a().inventoryMxbState.get("topCategoryUuid"),l=a().inventoryMxbState.get("subCategoryUuid");Object(i.a)("getInventoryYebTypeList","POST",JSON.stringify({begin:c||"",end:s||"",topCategoryUuid:u||"",subCategoryUuid:l||"",storeCardUuid:r||"",stockCardUuid:t||"",isType:!0}),(function(t){if(Object(n.u)(t)){var i=a().inventoryMxbState.get("typeListValue"),c=a().inventoryMxbState.get("typeListLabel"),s=!1,r=function t(e){return e.map((function(e,a){return e.childList&&e.childList.length?(i===e.acId&&(s=!0),{key:"".concat(e.acId),label:e.name,childList:t(e.childList)}):(i===e.acId&&(s=!0),{key:"".concat(e.acId),label:e.name,childList:[]})}))}(t.data.typeList),u=[{key:"",label:"\u5168\u90e8",childList:[]}].concat(r);s?(e({type:o.q,typeList:u,typeListValue:i,typeListLabel:c}),e(p(i))):(e({type:o.q,typeList:u,typeListValue:"",typeListLabel:"\u5168\u90e8"}),e(p("")))}}))}},p=function(t){return function(e,a){c.a.toast.loading(s.p,0);var n=a().inventoryMxbState.get("issuedate"),r=a().inventoryMxbState.get("endissuedate"),u=a().inventoryMxbState.get("stockStoreListOtherValue"),l=a().inventoryMxbState.get("topCategoryUuid"),d=a().inventoryMxbState.get("subCategoryUuid"),y=a().inventoryMxbState.get("cardValue");Object(i.a)("getInventoryMxbStockDetail","POST",JSON.stringify({begin:n||"",end:r||"",topCategoryUuid:l||"",subCategoryUuid:d||"",storeCardUuid:u||"",stockCardUuid:y||"",acId:t||"",isType:!0}),(function(t){c.a.toast.hide(),e({type:o.m,baseData:t.data.detail}),e({type:o.h,value:t.data.detail.detailList.length?t.data.detail.detailList[0].balanceDirection:"debit"}),e({type:o.e,value:!1})}))}},O=function(t){return function(e){e({type:o.p,value:"Inventory"===t?"Other":"Inventory"})}},C=function(t,e){return function(a){a({type:o.l,value:t,label:e})}},T=function(t,e){return function(a){a({type:o.r,value:t,label:e})}},h=function(t){return function(e){e({type:o.h,value:"debit"===t?"credit":"debit"})}},N=function(t){return function(e){e({type:o.e,value:!t})}},_=function(){return function(t){c.a.toast.loading(s.p,0),Object(i.a)("getInventoryYebDecimalScale","GET","",(function(e){c.a.toast.hide(),t({type:o.a,receiveData:e.data.scale})}))}}},1323:function(t,e,a){"use strict";a.d(e,"a",(function(){return r}));a(31),a(131),a(70);var n=a(4),i=a(1),o=a(1203),c=a(14),s=Object(i.fromJS)({issuedate:"",endissuedate:"",baseData:{},listData:[],beginningData:{},stockQuantity:"",cardList:[],cardValue:"",cardName:"",stockCategoryList:[],stockCategoryValue:{key:""},stockCategorylabel:"",topCategoryUuid:"",subCategoryUuid:"",stockStoreList:[],stockStoreValue:"",stockStoreLabel:"",chooseValue:"",inventoryType:"",stockStoreListOther:[],stockStoreListOtherValue:"",stockStoreListOtherLabel:"",typeList:[],typeListValue:"",typeListLabel:"",balanceDeirection:"",showReverseAmount:!1,quantityScale:"",priceScale:""});function r(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:s,a=arguments.length>1?arguments[1]:void 0;return((t={},Object(n.a)(t,o.g,(function(){return s})),Object(n.a)(t,o.k,(function(){var t=[];return a.cardList&&a.cardList.map((function(e,a){t.push({name:e.sockCardName,uuid:e.stockCardUuid})})),e.set("issuedate",a.issuedate).set("endissuedate",a.endissuedate).set("baseData",a.baseData).set("beginningData",a.baseData.detailList.length>0?a.baseData.detailList[0]:{}).set("listData",a.baseData.detailList.splice(1,a.baseData.detailList.length)).set("cardList",t).set("cardValue",a.uuid).set("cardName",a.name).set("stockCategoryList",a.stockCategoryList).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid).set("stockCategoryValue",Object(i.fromJS)(a.stockCategoryValue)).set("stockStoreList",a.stockStoreList).set("stockStoreValue",a.stockStoreList.length>0?a.stockStoreValue:"").set("stockStoreLabel",a.stockStoreList.length>0?a.stockStoreLabel:"").set("stockQuantity",a.stockQuantity).set("chooseValue",a.chooseValue).set("stockCategorylabel",a.stockCategorylabel).set("inventoryType",a.inventoryType)})),Object(n.a)(t,o.s,(function(){return e.set("issuedate",a.issuedate).set("endissuedate",a.endissuedate).set("chooseValue",a.chooseValue).set("stockStoreListOtherValue",a.stockStoreValue).set("stockStoreListOtherLabel",a.stockStoreLabel).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid).set("stockCategoryValue",Object(i.fromJS)(a.stockCategoryValue)).set("stockCategorylabel",a.stockCategorylabel).set("cardValue",a.uuid).set("cardName",a.name).set("inventoryType",a.inventoryType).set("typeListValue",a.typeListValue).set("typeListLabel",a.typeListLabel)})),Object(n.a)(t,o.b,(function(){return e.set("cardValue",a.value).set("cardName",a.name)})),Object(n.a)(t,o.j,(function(){return e.set("issuedate",a.issuedate).set("endissuedate",a.endissuedate)})),Object(n.a)(t,o.n,(function(){return a.cardList.length||(e=e.set("stockCategoryValue","".concat(c.B)).set("stockCategoryList",[])),e.set("cardList",a.cardList).set("cardValue",a.cardValue).set("cardName",a.cardName)})),Object(n.a)(t,o.o,(function(){return e.set("stockStoreList",a.stockStoreList).set("stockStoreValue",a.stockStoreValue).set("stockStoreLabel",a.stockStoreLabel)})),Object(n.a)(t,o.m,(function(){return e.set("baseData",a.baseData).set("beginningData",a.baseData.detailList.length>0?a.baseData.detailList[0]:{}).set("listData",a.baseData.detailList.splice(1,a.baseData.detailList.length))})),Object(n.a)(t,o.c,(function(){return e.set("stockCategoryValue",Object(i.fromJS)(a.stockCategoryValue)).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid)})),Object(n.a)(t,o.d,(function(){return e.set("stockStoreValue",a.stockStoreValue).set("stockStoreLabel",a.stockStoreLabel)})),Object(n.a)(t,o.f,(function(){return e.set("chooseValue",a.value)})),Object(n.a)(t,o.t,(function(){return e.set("stockStoreListOther",a.stockStoreListOther).set("stockStoreListOtherValue",a.stockStoreListOtherValue).set("stockStoreListOtherLabel",a.stockStoreListOtherLabel)})),Object(n.a)(t,o.i,(function(){return e.set("stockCategoryList",a.stockCategoryList).set("stockCategoryValue",Object(i.fromJS)(a.stockCategoryValue)).set("stockCategorylabel",a.stockCategorylabel).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid)})),Object(n.a)(t,o.q,(function(){return e.set("typeList",a.typeList).set("typeListValue",a.typeListValue).set("typeListLabel",a.typeListLabel)})),Object(n.a)(t,o.p,(function(){return e.set("inventoryType",a.value)})),Object(n.a)(t,o.l,(function(){return e.set("stockStoreListOtherValue",a.value).set("stockStoreListOtherLabel",a.label)})),Object(n.a)(t,o.r,(function(){return e.set("typeListValue",a.value).set("typeListLabel",a.label)})),Object(n.a)(t,o.h,(function(){return e.set("balanceDeirection",a.value)})),Object(n.a)(t,o.e,(function(){return e.set("showReverseAmount",a.value)})),Object(n.a)(t,o.a,(function(){return e.set("quantityScale",a.receiveData.quantityScale).set("priceScale",a.receiveData.priceScale)})),t)[a.type]||function(){return e})()}},1887:function(t,e,a){},960:function(t,e,a){"use strict";a.r(e),a.d(e,"reducer",(function(){return R})),a.d(e,"view",(function(){return j}));a(115),a(31),a(56),a(29),a(82);var n,i,o=a(7),c=a(8),s=a(9),r=a(10),u=a(0),l=a.n(u),d=a(47),y=a(1),b=a(12),g=(a(1887),a(2)),L=a(11),m=a(542),S=(a(32),a(62),a(70),a(83),a(24)),E=a(14),k=a(1322),f=a(57),v=a(130),p=function(t,e,a){return function(n){Object(f.a)("getInventoryYebstockCategory","POST",JSON.stringify({begin:t||"",end:e||"",isType:!1,stockQuantity:a||""}),(function(t){Object(b.u)(t)&&n({type:"SET_INVENTORY_YEB_INIT_STOCK_CATEGORY_LIST",categoryList:t.data.categoryList})}))}},O=function(t,e,a,n){return function(i){i({type:"SET_INVENTORY_YEB_STOCK_CATEGORY_UUID",key:t,label:e,topCategoryUuid:a,subCategoryUuid:n})}},C=function(t,e){return function(a){Object(f.a)("getInventoryYebStockStore","POST",JSON.stringify({begin:t||"",end:e||"",isType:!1}),(function(t){Object(b.u)(t)&&(g.a.toast.hide(),a({type:"SET_INVENTORY_YEB_INIT_STOCK_STORE_LIST",list:t.data.storeList}))}))}},T=function(t,e){return function(a){a({type:"SET_INVENTORT_YEB_DATE",issuedate:t,endissuedate:e})}},h=function(t,e){return function(a,n){var i=n().inventoryYebState.get("stockCategoryValue"),o=n().inventoryYebState.get("topCategoryUuid"),c=n().inventoryYebState.get("subCategoryUuid"),s=n().inventoryYebState.get("inventoryType"),r=!1;Object(f.a)("getInventoryYebstockCategory","POST",JSON.stringify({begin:t||"",end:e||"",isType:"Other"===s}),(function(t){if(Object(b.u)(t)){a({type:"SET_INVENTORY_YEB_STOCK_CATEGORY_LIST",categoryList:t.data.categoryList});!function t(e,a){return e.map((function(e,n){e.childList&&e.childList.length?(i==="".concat(a).concat(E.B).concat(e.uuid)&&(r=!0),t(e.childList,"".concat(a).concat(E.B).concat(e.uuid))):i==="".concat(a).concat(E.B).concat(e.uuid)&&(r=!0)}))}(t.data.categoryList,""),a(r?N(o,c):N("",""))}}))}},N=function(t,e){return function(a,n){var i=n().inventoryYebState.get("issuedate"),o=n().inventoryYebState.get("endissuedate"),c=n().inventoryYebState.get("stockStoreValue"),s=n().inventoryYebState.get("inventoryType");Object(f.a)("getInventoryYebStockStore","POST",JSON.stringify({begin:i||"",end:o||"",topCategoryUuid:t,subCategoryUuid:e,isType:"Other"===s}),(function(n){if(Object(b.u)(n)){a({type:"SET_INVENTORY_YEB_STOCK_STORE_LIST",list:n.data.storeList});var i=!1;!function t(e){return e.map((function(e,a){e.childList&&e.childList.length?(c===e.uuid&&(i=!0),t(e.childList)):c===e.uuid&&(i=!0)}))}(n.data.storeList),"Other"===s?n.data.storeList.length>0?a(V(t,e,i?c:n.data.storeList[0].uuid)):a(V(t,e,"")):n.data.storeList.length>0?a(_(t,e,i?c:n.data.storeList[0].uuid)):a(_(t,e,""))}}))}},_=function(t,e,a,n){return function(i,o){g.a.toast.loading(E.p,0);var c=o().inventoryYebState.get("issuedate"),s=o().inventoryYebState.get("endissuedate"),r=o().inventoryYebState.get("inventoryType");Object(f.a)("getInventoryYebData","POST",JSON.stringify({begin:c||"",end:s||"",topCategoryUuid:t,subCategoryUuid:e,storeCardUuid:a,isType:"Other"===r,acId:n||""}),(function(t){Object(b.u)(t)&&(g.a.toast.hide(),i({type:"SET_INVENTORY_YEB_SELECTED_DATA",dataList:t.data.balance.childList}))}))}},V=function(t,e,a){return function(n,i){var o=i().inventoryYebState.get("issuedate"),c=i().inventoryYebState.get("endissuedate"),s=i().inventoryYebState.get("inventoryType"),r=i().inventoryYebState.get("typeListValue"),u=i().inventoryYebState.get("typeListLabel");Object(f.a)("getInventoryYebTypeList","POST",JSON.stringify({begin:o||"",end:c||"",topCategoryUuid:t,subCategoryUuid:e,storeCardUuid:a||"",isType:"Other"===s}),(function(i){if(Object(b.u)(i)){var o=!1,c=function t(e,a){return e.map((function(e,a){return e.childList&&e.childList.length?(r===e.acId&&(o=!0),{key:"".concat(e.acId),label:e.name,childList:t(e.childList)}):(r===e.acId&&(o=!0),{key:"".concat(e.acId),label:e.name,childList:[]})}))}(i.data.typeList);o?(n({type:"SET_INVENTORY_YEB_TYPE_LIST",list:c,value:r,label:u}),n(_(t,e,a,r))):(n({type:"SET_INVENTORY_YEB_TYPE_LIST",list:c,value:"",label:"\u5168\u90e8\u7c7b\u578b"}),n(_(t,e,a,"")))}}))}},I=function(){return function(t){g.a.toast.loading(E.p,0),Object(f.a)("getInventoryYebDecimalScale","GET","",(function(e){g.a.toast.hide(),t({type:"CHANGE_DECIMAL_OF_CONFIG",receiveData:e.data.scale})}))}},Y=Object(S.immutableRenderDecorator)(n=function(t){Object(r.a)(a,t);var e=Object(s.a)(a);function a(){return Object(o.a)(this,a),e.apply(this,arguments)}return Object(c.a)(a,[{key:"render",value:function(){var t=this.props,e=t.data,a=t.unitDecimalCount,n=t.history,i=t.dispatch,o=t.issuedate,c=t.endissuedate,s=t.stockCategoryValue,r=t.topCategoryUuid,u=t.subCategoryUuid,d=t.stockCategorylabel,y=t.stockCategoryList,b=t.stockQuantity,g=t.stockStoreList,m=t.stockStoreValue,S=t.stockStoreLabel,f=t.showChildList,v=t.chooseValue,p=t.inventoryType,O=t.typeListValue,C=t.typeListLabel,T=t.priceScale,h=t.quantityScale,N=s;return function t(e,_){var V={background:{0:"#fff",1:"#D1C0A5",2:"#7E6B5A",3:"#59493f"}[_],width:_/100*10+"rem"};if(e.childList&&e.childList.length>0){var I=f.includes(e.uuid);return N="".concat(N).concat(E.B).concat(e.uuid),e.newCategoryValue=N,l.a.createElement("div",null,l.a.createElement("div",{className:0===_?"ba ba-level":"ba-ass ba"},l.a.createElement("div",null,l.a.createElement("span",{className:"name"},0==_?"":l.a.createElement("span",{className:"ba-flag",style:V}),l.a.createElement("span",{className:"name-name name-click",onClick:function(t){sessionStorage.setItem("previousPage","inventoryYeb"),i(k.i(o,c,null,"\u5168\u90e8",e.newCategoryValue,"",e.uuid,e.name,y,b,g,m,S,v,p,O,C)),n.push("/inventoryMxb")}},e.name)),l.a.createElement("span",{className:"btn"},l.a.createElement(L.l,{type:I?"arrow-up":"arrow-down",onClick:function(){var t;i((t=e.uuid,function(e){e({type:"HANGLE_INVENTORY_YEB_SHOW_CHILD_LIST",uuid:t})}))}}))),l.a.createElement("div",{className:"ba-info"},l.a.createElement("div",null,l.a.createElement("div",{className:"ba-begin"},l.a.createElement("span",{className:"amount-color"},"\u6570\u91cf"),l.a.createElement(L.a,{showZero:!0,decimalPlaces:h,className:"amount-color"},e.beginQuantity)),l.a.createElement("div",{className:"ba-begin"},l.a.createElement("span",{className:"amount-color"},"\u5355\u4ef7"),l.a.createElement(L.a,{showZero:!0,decimalPlaces:T,className:"amount-color"},e.beginPrice)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{decimalPlaces:a},e.beginAmount))),l.a.createElement("div",null,l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{showZero:!0,decimalPlaces:h,className:"amount-color"},e.monthInQuantity)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement("span",null)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{decimalPlaces:a},e.monthInAmount))),l.a.createElement("div",null,l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{showZero:!0,decimalPlaces:h,className:"amount-color"},e.monthOutQuantity)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement("span",null)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{decimalPlaces:a},e.monthOutAmount))),l.a.createElement("div",null,l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{showZero:!0,decimalPlaces:h,className:"amount-color"},e.endQuantity)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{showZero:!0,decimalPlaces:T,className:"amount-color"},e.endPrice)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{decimalPlaces:a},e.endAmount))))),I&&e.childList.map((function(e,a){return t(e,_+1)})))}return l.a.createElement("div",{className:0===_?"ba ba-level":" ba-ass ba"},l.a.createElement("div",null,l.a.createElement("span",{className:"name",onClick:function(t){sessionStorage.setItem("previousPage","inventoryYeb"),i(k.i(o,c,e.uuid,e.name,s,r,u,d,y,b,g,m,S,v,p,O,C)),n.push("/inventoryMxb")}},0==_?"":l.a.createElement("span",{className:"ba-flag",style:V}),e.name)),l.a.createElement("div",{className:"ba-info"},l.a.createElement("div",null,l.a.createElement("div",{className:"ba-begin"},l.a.createElement("span",{className:"amount-color"},"\u6570\u91cf"),l.a.createElement(L.a,{showZero:!0,decimalPlaces:h,className:"amount-color"},e.beginQuantity)),l.a.createElement("div",{className:"ba-begin"},l.a.createElement("span",{className:"amount-color"},"\u5355\u4ef7"),l.a.createElement(L.a,{showZero:!0,decimalPlaces:T,className:"amount-color"},e.beginPrice)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{decimalPlaces:a},e.beginAmount))),l.a.createElement("div",null,l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{showZero:!0,decimalPlaces:h,className:"amount-color"},e.monthInQuantity)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement("span",null)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{showZero:!0,decimalPlaces:a},e.monthInAmount))),l.a.createElement("div",null,l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{showZero:!0,decimalPlaces:h,className:"amount-color"},e.monthOutQuantity)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement("span",null)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{decimalPlaces:a},e.monthOutAmount))),l.a.createElement("div",null,l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{showZero:!0,decimalPlaces:h,className:"amount-color"},e.endQuantity)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{showZero:!0,decimalPlaces:T,className:"amount-color"},e.endPrice)),l.a.createElement("div",{className:"ba-amount"},l.a.createElement(L.a,{decimalPlaces:a},e.endAmount)))))}(e,0)}}]),a}(l.a.Component))||n,U=a(26),j=Object(d.c)((function(t){return t}))(i=function(t){Object(r.a)(a,t);var e=Object(s.a)(a);function a(){return Object(o.a)(this,a),e.apply(this,arguments)}return Object(c.a)(a,[{key:"componentDidMount",value:function(){g.a.setTitle({title:"\u5b58\u8d27\u4f59\u989d\u8868"}),g.a.setIcon({showIcon:!1}),"home"===sessionStorage.getItem("prevPage")&&(sessionStorage.removeItem("prevPage"),this.props.dispatch((function(t){g.a.toast.loading(E.p,0),Object(f.a)("getInventoryYebData","POST",JSON.stringify({begin:"",end:"",isType:!1,needPeriod:"true"}),(function(e){if(Object(b.u)(e)){t({type:"CHANGE_INVENTPORY_YEB_TYPE",value:"Inventory"});var a=t(v.j(e));t({type:"SET_INVENTORY_YEB_INIT_DATA",issuedate:a,dataList:e.data.balance.childList}),t(p(a,a,"")),t(C(a,a)),t(I())}}))})))}},{key:"render",value:function(){var t=this.props,e=t.dispatch,a=t.allState,n=t.inventoryYebState,i=t.history,o=a.get("issues"),c=n.get("issuedate"),s=n.get("endissuedate"),r=o.findIndex((function(t){return t.get("value")===c})),u=o.slice(0,r),d=n.get("dataList"),y=a.getIn(["systemInfo","unitDecimalCount"]),b=(n.get("stockQuabtityList"),n.get("stockQuantity")),g=(n.get("stockQuantityName"),n.get("stockCategoryList")),S=n.get("stockCategoryValue"),k=n.get("stockCategorylabel"),f=n.get("stockStoreList"),p=n.get("stockStoreValue"),C=n.get("stockStoreLabel"),I=n.get("topCategoryUuid"),j=n.get("subCategoryUuid"),B=n.get("showChildList"),M=n.get("chooseValue"),R=n.get("inventoryType"),A=n.get("typeList"),D=n.get("typeListValue"),P=n.get("typeListLabel"),x=n.get("quantityScale"),Q=n.get("priceScale"),w=c,G=s||w;return e(v.i("config","",(function(){return function(t){return t(v.a("sendInventoryYebExcel",{begin:w,end:G,topCategoryUuid:I,subCategoryUuid:j,storeCardUuid:p,isType:"Other"===R,acId:D||""}))}}))),l.a.createElement(L.h,{className:"inventoryYeb"},l.a.createElement(m.b,{start:c,issues:o,end:s,nextperiods:u,chooseValue:M,onBeginOk:function(t){e(T(t,"")),e(h(t,""))},onEndOk:function(t,a){e(T(t,a)),e(h(t,a))},changeChooseValue:function(t){e(function(t){return function(e){e({type:"CHANGE_INVENTORY_YEB_CHOOSE_VALUE",value:t})}}(t))}}),l.a.createElement(L.r,{className:"inventoryYeb-search"},l.a.createElement("div",{className:"select-change-table",onClick:function(){var t;e((t=R,function(e){e({type:"CHANGE_INVENTPORY_YEB_TYPE",value:"Inventory"===t?"Other":"Inventory"})})),e(h(c,s))}},l.a.createElement("span",null,"Inventory"===R?"\u5e93\u5b58":"\u5176\u4ed6\u7c7b\u578b"),l.a.createElement(U.a,{type:"type-change"})),l.a.createElement(L.f,{className:"inventoryYeb-stock-catogory",district:g,title:"\u8bf7\u9009\u62e9\u5b58\u8d27\u7c7b\u522b",parentDisabled:!1,value:S,onChange:function(t){t.key.split(E.B);var a=t.key.split(E.B)[1],n=t.key.split(E.B)[t.key.split(E.B).length-1];a===n?(e(O(t.key,t.label,a,"")),e(N(a,""))):(e(O(t.key,t.label,a,n)),e(N(a,n)))}},l.a.createElement(L.r,{className:"stock-category-label"},l.a.createElement("span",{className:"overElli"},k),l.a.createElement(L.l,{type:"triangle"}))),f.length>0&&l.a.createElement(L.f,{className:"inventoryYeb-stock-store",district:f,parentDisabled:!1,title:"\u8bf7\u9009\u62e9\u4ed3\u5e93",value:p,onChange:function(t){var a,n;e((a=t.key,n=t.label,function(t){t({type:"SET_INVENTORY_YEB_STOCK_STORE_VALUE",value:a,label:n})})),e("Inventory"===R?_(I,j,t.key):V(I,j,t.key))}},l.a.createElement(L.r,{className:"stock-store-label"},l.a.createElement("span",{className:"overElli"},"\u5168\u90e8"===C?"\u5168\u90e8\u4ed3\u5e93":C),l.a.createElement(L.l,{type:"triangle"}))),"Other"==R&&l.a.createElement(L.f,{className:"inventoryYeb-type-list",district:A,parentDisabled:!1,title:"\u8bf7\u9009\u62e9\u7c7b\u578b",value:D,onChange:function(t){var a,n;e((a=t.key,n=t.label,function(t){t({type:"SET_INVENTORY_YEB_TYPE_LIST_VALUE",value:a,label:n})})),e(_(I,j,p,t.key))}},l.a.createElement(L.r,{className:"type-list-label"},l.a.createElement("span",{className:"overElli"},P),l.a.createElement(L.l,{type:"triangle"})))),l.a.createElement(L.r,{className:"ba-title"},l.a.createElement("div",{className:"ba-title-item"},"\u671f\u521d\u4f59\u989d"),l.a.createElement("div",{className:"ba-title-item"},"Other"==R?"\u672c\u671f\u501f\u65b9":"\u672c\u671f\u5165\u5e93"),l.a.createElement("div",{className:"ba-title-item"},"Other"==R?"\u672c\u671f\u8d37\u65b9":"\u672c\u671f\u51fa\u5e93"),l.a.createElement("div",{className:"ba-title-item"},"\u671f\u672b\u4f59\u989d")),l.a.createElement(L.s,{flex:"1",uniqueKey:"inventoryYeb-scroll",savePosition:!0},d.map((function(t,a){return l.a.createElement(Y,{unitDecimalCount:y,key:a,data:t,history:i,dispatch:e,issuedate:c,endissuedate:s,stockCategoryValue:S,topCategoryUuid:I,subCategoryUuid:j,stockCategoryList:g,stockQuantity:b,stockStoreList:f,stockStoreValue:p,stockStoreLabel:C,showChildList:B,chooseValue:M,inventoryType:R,typeListValue:D,typeListLabel:P,stockCategorylabel:k,quantityScale:x,priceScale:Q})}))))}}]),a}(l.a.Component))||i,B=(a(131),a(4)),M=Object(y.fromJS)({issuedate:"",endissuedate:"",dataList:[],stockQuabtityList:[],stockQuantity:"",stockQuantityName:"",stockCategoryList:[],stockCategoryValue:"",stockCategorylabel:"",topCategoryUuid:"",subCategoryUuid:"",stockStoreList:[],stockStoreValue:"",stockStoreLabel:"",showChildList:[],chooseValue:"ISSUE",inventoryType:"Inventory",typeList:[],typeListValue:"",typeListLabel:"\u5168\u90e8\u7c7b\u578b",quantityScale:"",priceScale:""});var R={inventoryYebState:function(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:M,a=arguments.length>1?arguments[1]:void 0;return((t={},Object(B.a)(t,"SET_INVENTORY_YEB_INIT_DATA",(function(){return e.set("issuedate",a.issuedate).set("dataList",a.dataList).set("endissuedate","").set("chooseValue","ISSUE")})),Object(B.a)(t,"SET_INVENTORT_YEB_DATE",(function(){return e.set("issuedate",a.issuedate).set("endissuedate",a.endissuedate)})),Object(B.a)(t,"SET_INVENTORY_YEB_STOCK_QUANTITY_LIST",(function(){var t=[],n=!1,i=e.get("stockQuantity");if(a.list.length>0){for(var o in a.list)a.list[o].quantity===i&&(n=!0),t.push({key:a.list[o].name,value:a.list[o].quantity});return n?e.set("stockQuabtityList",t):e.set("stockQuabtityList",t).set("stockQuantity",t[0].value).set("stockQuantityName",t[0].key)}return e.set("stockQuabtityList",t)})),Object(B.a)(t,"CHANGE_INVENTPRY_YEB_STOCK_QUANTITY",(function(){return e.set("stockQuantity",a.value).set("stockQuantityName",a.label)})),Object(B.a)(t,"SET_INVENTORY_YEB_STOCK_CATEGORY_LIST",(function(){var t=e.get("stockCategoryValue"),n=e.get("stockCategorylabel"),i=!1,o=function e(a,n){return a.map((function(a,o){return a.childList&&a.childList.length?("".concat(n).concat(E.B).concat(a.uuid)===t&&(i=!0),{key:"".concat(n).concat(E.B).concat(a.uuid),label:a.name,childList:e(a.childList,"".concat(n).concat(E.B).concat(a.uuid))}):("".concat(n).concat(E.B).concat(a.uuid)===t&&(i=!0),{key:"".concat(n).concat(E.B).concat(a.uuid),label:a.name,childList:[]})}))}(a.categoryList,""),c=[{label:"\u5168\u90e8\u7c7b\u522b",key:"-:-",childList:[]}].concat(o);return i?e.set("stockCategoryList",c).set("stockCategoryValue",t).set("stockCategorylabel",n):e.set("stockCategoryList",c).set("stockCategoryValue",c[0].key).set("stockCategorylabel",c[0].label)})),Object(B.a)(t,"SET_INVENTORY_YEB_STOCK_CATEGORY_UUID",(function(){return e.set("stockCategoryValue",a.key).set("stockCategorylabel",a.label).set("topCategoryUuid",a.topCategoryUuid).set("subCategoryUuid",a.subCategoryUuid)})),Object(B.a)(t,"SET_INVENTORY_YEB_STOCK_STORE_LIST",(function(){var t=e.get("stockStoreValue"),n=e.get("stockStoreLabel"),i=!1,o=function e(a){return a.map((function(a,n){return a.childList&&a.childList.length?(t===a.uuid&&(i=!0),{key:"".concat(a.uuid),label:a.name,childList:e(a.childList)}):(t===a.uuid&&(i=!0),{key:"".concat(a.uuid),label:a.name,childList:[]})}))}(a.list);if(o.length>0){var c=[{label:o[0].label,key:o[0].key,childList:[]}].concat(o[0].childList);return i?e.set("stockStoreList",c).set("stockStoreValue",t).set("stockStoreLabel",n):e.set("stockStoreList",c).set("stockStoreValue",o[0].key).set("stockStoreLabel",o[0].label)}return e.set("stockStoreList",[])})),Object(B.a)(t,"SET_INVENTORY_YEB_STOCK_STORE_VALUE",(function(){return e.set("stockStoreValue",a.value).set("stockStoreLabel",a.label)})),Object(B.a)(t,"SET_INVENTORY_YEB_SELECTED_DATA",(function(){return e.set("dataList",a.dataList)})),Object(B.a)(t,"HANGLE_INVENTORY_YEB_SHOW_CHILD_LIST",(function(){var t,n=e.get("showChildList");if(n.includes(a.uuid)){var i=n.findIndex((function(t,e){return t===a.uuid}));t=n.splice(i,1)}else t=n.concat(a.uuid);return e.set("showChildList",t)})),Object(B.a)(t,"SET_INVENTORY_YEB_INIT_STOCK_CATEGORY_LIST",(function(){var t=function t(e,a){return e.map((function(e,n){return e.childList&&e.childList.length?{key:"".concat(a).concat(E.B).concat(e.uuid),label:e.name,childList:t(e.childList,"".concat(a).concat(E.B).concat(e.uuid))}:{key:"".concat(a).concat(E.B).concat(e.uuid),label:e.name,childList:[]}}))}(a.categoryList,""),n=[{label:"\u5168\u90e8\u7c7b\u522b",key:"-:-",childList:[]}].concat(t);return e.set("stockCategoryList",n).set("stockCategoryValue",n[0].key).set("stockCategorylabel",n[0].label)})),Object(B.a)(t,"SET_INVENTORY_YEB_INIT_STOCK_STORE_LIST",(function(){var t=function t(e){return e.map((function(e,a){return e.childList&&e.childList.length?{key:"".concat(e.uuid),label:e.name,childList:t(e.childList)}:{key:"".concat(e.uuid),label:e.name,childList:[]}}))}(a.list);if(t.length>0){var n=[{label:t[0].label,key:t[0].key,childList:[]}].concat(t[0].childList);return e.set("stockStoreList",n).set("stockStoreValue",t[0].key).set("stockStoreLabel",t[0].label)}return e.set("stockStoreList",[])})),Object(B.a)(t,"SET_INVENTORY_YEB_INIT_STOCK_QUANTITY_LIST",(function(){var t=[];if(a.list.length>0){for(var n in a.list)t.push({key:a.list[n].name,value:a.list[n].quantity});return e.set("stockQuabtityList",t).set("stockQuantity",t[0].value).set("stockQuantityName",t[0].key)}return e.set("stockQuabtityList",t)})),Object(B.a)(t,"CHANGE_INVENTPORY_YEB_TYPE",(function(){return e.set("inventoryType",a.value)})),Object(B.a)(t,"CHANGE_INVENTORY_YEB_CHOOSE_VALUE",(function(){return e.set("chooseValue",a.value)})),Object(B.a)(t,"SET_INVENTORY_YEB_TYPE_LIST",(function(){return e.set("typeList",[{label:"\u5168\u90e8\u7c7b\u578b",key:"",childList:[]}].concat(a.list)).set("typeListValue",a.value).set("typeListLabel",a.label)})),Object(B.a)(t,"SET_INVENTORY_YEB_TYPE_LIST_VALUE",(function(){return e.set("typeListValue",a.value).set("typeListLabel",a.label)})),Object(B.a)(t,"CHANGE_DECIMAL_OF_CONFIG",(function(){return e.set("quantityScale",a.receiveData.quantityScale).set("priceScale",a.receiveData.priceScale)})),t)[a.type]||function(){return e})()},inventoryMxbState:a(1323).a}}}]);