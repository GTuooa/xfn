(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[118],{1027:function(e,t,n){var a=n(63),r=n(546),o=n(46),c=n(221),i=n(545),s=n(1032),u=function(e,t){this.stopped=e,this.result=t};(e.exports=function(e,t,n,l,d){var g,f,m,p,h,v,y,b=c(t,n,l?2:1);if(d)g=e;else{if("function"!=typeof(f=i(e)))throw TypeError("Target is not iterable");if(r(f)){for(m=0,p=o(e.length);p>m;m++)if((h=l?b(a(y=e[m])[0],y[1]):b(e[m]))&&h instanceof u)return h;return new u(!1)}g=f.call(e)}for(v=g.next;!(y=v.call(g)).done;)if("object"==typeof(h=s(g,b,y.value,l))&&h&&h instanceof u)return h;return new u(!1)}).stop=function(e){return new u(!0,e)}},1028:function(e,t,n){var a=n(169),r=n(64),o=n(67),c=n(71).f,i=n(168),s=n(1043),u=i("meta"),l=0,d=Object.isExtensible||function(){return!0},g=function(e){c(e,u,{value:{objectID:"O"+ ++l,weakData:{}}})},f=e.exports={REQUIRED:!1,fastKey:function(e,t){if(!r(e))return"symbol"==typeof e?e:("string"==typeof e?"S":"P")+e;if(!o(e,u)){if(!d(e))return"F";if(!t)return"E";g(e)}return e[u].objectID},getWeakData:function(e,t){if(!o(e,u)){if(!d(e))return!0;if(!t)return!1;g(e)}return e[u].weakData},onFreeze:function(e){return s&&f.REQUIRED&&d(e)&&!o(e,u)&&g(e),e}};a[u]=!0},1029:function(e,t,n){"use strict";var a=n(550).charAt,r=n(132),o=n(543),c=r.set,i=r.getterFor("String Iterator");o(String,"String",(function(e){c(this,{type:"String Iterator",string:String(e),index:0})}),(function(){var e,t=i(this),n=t.string,r=t.index;return r>=n.length?{value:void 0,done:!0}:(e=a(n,r),t.index+=e.length,{value:e,done:!1})}))},1030:function(e,t,n){var a=n(45),r=n(551),o=n(166),c=n(72),i=n(44),s=i("iterator"),u=i("toStringTag"),l=o.values;for(var d in r){var g=a[d],f=g&&g.prototype;if(f){if(f[s]!==l)try{c(f,s,l)}catch(p){f[s]=l}if(f[u]||c(f,u,d),r[d])for(var m in o)if(f[m]!==o[m])try{c(f,m,o[m])}catch(p){f[m]=o[m]}}}},1032:function(e,t,n){var a=n(63);e.exports=function(e,t,n,r){try{return r?t(a(n)[0],n[1]):t(n)}catch(c){var o=e.return;throw void 0!==o&&a(o.call(e)),c}}},1033:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e};t.routerReducer=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=t.type,c=t.payload;if(n===r)return a({},e,{locationBeforeTransitions:c});return e};var r=t.LOCATION_CHANGE="@@router/LOCATION_CHANGE",o={locationBeforeTransitions:null}},1034:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=t.CALL_HISTORY_METHOD="@@router/CALL_HISTORY_METHOD";function r(e){return function(){for(var t=arguments.length,n=Array(t),r=0;r<t;r++)n[r]=arguments[r];return{type:a,payload:{method:e,args:n}}}}var o=t.push=r("push"),c=t.replace=r("replace"),i=t.go=r("go"),s=t.goBack=r("goBack"),u=t.goForward=r("goForward");t.routerActions={push:o,replace:c,go:i,goBack:s,goForward:u}},1035:function(e,t,n){"use strict";var a=n(1042),r=n(1044);e.exports=a("Set",(function(e){return function(){return e(this,arguments.length?arguments[0]:void 0)}}),r)},1042:function(e,t,n){"use strict";var a=n(39),r=n(45),o=n(547),c=n(89),i=n(1028),s=n(1027),u=n(222),l=n(64),d=n(37),g=n(544),f=n(167),m=n(554);e.exports=function(e,t,n){var p=-1!==e.indexOf("Map"),h=-1!==e.indexOf("Weak"),v=p?"set":"add",y=r[e],b=y&&y.prototype,E=y,O={},C=function(e){var t=b[e];c(b,e,"add"==e?function(e){return t.call(this,0===e?0:e),this}:"delete"==e?function(e){return!(h&&!l(e))&&t.call(this,0===e?0:e)}:"get"==e?function(e){return h&&!l(e)?void 0:t.call(this,0===e?0:e)}:"has"==e?function(e){return!(h&&!l(e))&&t.call(this,0===e?0:e)}:function(e,n){return t.call(this,0===e?0:e,n),this})};if(o(e,"function"!=typeof y||!(h||b.forEach&&!d((function(){(new y).entries().next()})))))E=n.getConstructor(t,e,p,v),i.REQUIRED=!0;else if(o(e,!0)){var A=new E,I=A[v](h?{}:-0,1)!=A,T=d((function(){A.has(1)})),x=g((function(e){new y(e)})),L=!h&&d((function(){for(var e=new y,t=5;t--;)e[v](t,t);return!e.has(-0)}));x||((E=t((function(t,n){u(t,E,e);var a=m(new y,t,E);return void 0!=n&&s(n,a[v],a,p),a}))).prototype=b,b.constructor=E),(T||L)&&(C("delete"),C("has"),p&&C("get")),(L||I)&&C(v),h&&b.clear&&delete b.clear}return O[e]=E,a({global:!0,forced:E!=y},O),f(E,e),h||n.setStrong(E,e,p),E}},1043:function(e,t,n){var a=n(37);e.exports=!a((function(){return Object.isExtensible(Object.preventExtensions({}))}))},1044:function(e,t,n){"use strict";var a=n(71).f,r=n(170),o=n(548),c=n(221),i=n(222),s=n(1027),u=n(543),l=n(549),d=n(66),g=n(1028).fastKey,f=n(132),m=f.set,p=f.getterFor;e.exports={getConstructor:function(e,t,n,u){var l=e((function(e,a){i(e,l,t),m(e,{type:t,index:r(null),first:void 0,last:void 0,size:0}),d||(e.size=0),void 0!=a&&s(a,e[u],e,n)})),f=p(t),h=function(e,t,n){var a,r,o=f(e),c=v(e,t);return c?c.value=n:(o.last=c={index:r=g(t,!0),key:t,value:n,previous:a=o.last,next:void 0,removed:!1},o.first||(o.first=c),a&&(a.next=c),d?o.size++:e.size++,"F"!==r&&(o.index[r]=c)),e},v=function(e,t){var n,a=f(e),r=g(t);if("F"!==r)return a.index[r];for(n=a.first;n;n=n.next)if(n.key==t)return n};return o(l.prototype,{clear:function(){for(var e=f(this),t=e.index,n=e.first;n;)n.removed=!0,n.previous&&(n.previous=n.previous.next=void 0),delete t[n.index],n=n.next;e.first=e.last=void 0,d?e.size=0:this.size=0},delete:function(e){var t=f(this),n=v(this,e);if(n){var a=n.next,r=n.previous;delete t.index[n.index],n.removed=!0,r&&(r.next=a),a&&(a.previous=r),t.first==n&&(t.first=a),t.last==n&&(t.last=r),d?t.size--:this.size--}return!!n},forEach:function(e){for(var t,n=f(this),a=c(e,arguments.length>1?arguments[1]:void 0,3);t=t?t.next:n.first;)for(a(t.value,t.key,this);t&&t.removed;)t=t.previous},has:function(e){return!!v(this,e)}}),o(l.prototype,n?{get:function(e){var t=v(this,e);return t&&t.value},set:function(e,t){return h(this,0===e?0:e,t)}}:{add:function(e){return h(this,e=0===e?0:e,e)}}),d&&a(l.prototype,"size",{get:function(){return f(this).size}}),l},setStrong:function(e,t,n){var a=t+" Iterator",r=p(t),o=p(a);u(e,t,(function(e,t){m(this,{type:a,target:e,state:r(e),kind:t,last:void 0})}),(function(){for(var e=o(this),t=e.kind,n=e.last;n&&n.removed;)n=n.previous;return e.target&&(e.last=n=n?n.next:e.state.first)?"keys"==t?{value:n.key,done:!1}:"values"==t?{value:n.value,done:!1}:{value:[n.key,n.value],done:!1}:(e.target=void 0,{value:void 0,done:!0})}),n?"entries":"values",!n,!0),l(t)}}},1051:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var a=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var a in n)Object.prototype.hasOwnProperty.call(n,a)&&(e[a]=n[a])}return e};t.default=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},c=n.selectLocationState,i=void 0===c?o:c,s=n.adjustUrlOnReplay,u=void 0===s||s;if("undefined"===typeof i(t.getState()))throw new Error("Expected the routing state to be available either as `state.routing` or as the custom expression you can specify as `selectLocationState` in the `syncHistoryWithStore()` options. Ensure you have added the `routerReducer` to your store's reducers via `combineReducers` or whatever method you use to isolate your reducers.");var l=void 0,d=void 0,g=void 0,f=void 0,m=void 0,p=function(e){return i(t.getState()).locationBeforeTransitions||(e?l:void 0)};if(l=p(),u){var h=function(){var t=p(!0);m!==t&&l!==t&&(d=!0,m=t,e.transitionTo(a({},t,{action:"PUSH"})),d=!1)};g=t.subscribe(h),h()}var v=function(e){d||(m=e,!l&&(l=e,p())||t.dispatch({type:r.LOCATION_CHANGE,payload:e}))};f=e.listen(v),e.getCurrentLocation&&v(e.getCurrentLocation());return a({},e,{listen:function(n){var a=p(!0),r=!1,o=t.subscribe((function(){var e=p(!0);e!==a&&(a=e,r||n(a))}));return e.getCurrentLocation||n(a),function(){r=!0,o()}},unsubscribe:function(){u&&g(),f()}})};var r=n(1033),o=function(e){return e.routing}},1052:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.default=function(e){return function(){return function(t){return function(n){if(n.type!==a.CALL_HISTORY_METHOD)return t(n);var r=n.payload,o=r.method,c=r.args;e[o].apply(e,function(e){if(Array.isArray(e)){for(var t=0,n=Array(e.length);t<e.length;t++)n[t]=e[t];return n}return Array.from(e)}(c))}}}};var a=n(1034)},1062:function(e,t,n){n(39)({target:"String",proto:!0},{repeat:n(553)})},1063:function(e,t,n){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.routerMiddleware=t.routerActions=t.goForward=t.goBack=t.go=t.replace=t.push=t.CALL_HISTORY_METHOD=t.routerReducer=t.LOCATION_CHANGE=t.syncHistoryWithStore=void 0;var a=n(1033);Object.defineProperty(t,"LOCATION_CHANGE",{enumerable:!0,get:function(){return a.LOCATION_CHANGE}}),Object.defineProperty(t,"routerReducer",{enumerable:!0,get:function(){return a.routerReducer}});var r=n(1034);Object.defineProperty(t,"CALL_HISTORY_METHOD",{enumerable:!0,get:function(){return r.CALL_HISTORY_METHOD}}),Object.defineProperty(t,"push",{enumerable:!0,get:function(){return r.push}}),Object.defineProperty(t,"replace",{enumerable:!0,get:function(){return r.replace}}),Object.defineProperty(t,"go",{enumerable:!0,get:function(){return r.go}}),Object.defineProperty(t,"goBack",{enumerable:!0,get:function(){return r.goBack}}),Object.defineProperty(t,"goForward",{enumerable:!0,get:function(){return r.goForward}}),Object.defineProperty(t,"routerActions",{enumerable:!0,get:function(){return r.routerActions}});var o=i(n(1051)),c=i(n(1052));function i(e){return e&&e.__esModule?e:{default:e}}t.syncHistoryWithStore=o.default,t.routerMiddleware=c.default},1836:function(e,t,n){},937:function(e,t,n){"use strict";n.r(t),n.d(t,"reducer",(function(){return _})),n.d(t,"view",(function(){return B}));n(115),n(33),n(31),n(56),n(29),n(82);var a,r,o=n(4),c=n(7),i=n(8),s=n(9),u=n(10),l=n(0),d=n.n(l),g=n(1),f=n(47),m=(n(1049),n(2)),p=n(542),h=n(11),v=(n(32),n(61),n(70),n(76),n(57)),y=n(12),b=n(14),E=n(130),O=function(e){var t=[],n=function(e,t){return e.forEach((function(e){e.get("childList")&&e.get("childList").size?t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name"),children:a(e.get("childList"))}):t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name"),children:[]})}))},a=function(e){var t=[];return n(e,t),t},r=e.data.result[0];if(e.data.result.length>0&&"\u5168\u90e8"===r.name){t.push({value:"".concat(r.uuid).concat(b.B).concat(r.name).concat(b.B).concat(r.propertyCost),label:r.name,children:[{value:"".concat(b.B,"\u5168\u90e8").concat(b.B).concat(r.propertyCost),label:"\u5168\u90e8"}]});var o=e.data.result[0].childList;Object(g.fromJS)(o).forEach((function(e){if(e.get("childList").size){var n=a(e.get("childList")),r=[{value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name"),children:n}];t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name"),children:r})}else t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name"),children:[{value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name")}]})}))}else Object(g.fromJS)(e.data.result).forEach((function(e){if(e.get("childList").size){var n=a(e.get("childList")),r=[{value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name"),children:n}];t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name"),children:r})}else t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name"),children:[{value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("propertyCost")),label:e.get("name")}]})}));return t},C=function(e,t){return function(n,a){m.a.toast.loading(b.p,0),Object(v.a)("getProjectBalanceList","POST",JSON.stringify({year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",endYear:t?t.substr(0,4):"",endMonth:t?t.substr(5,2):"",getPeriod:"true",subordinateUuid:"",runningCategoryUuid:"",categoryUuid:"",currentPage:1,propertyCost:""}),(function(a){if(m.a.toast.hide(),Object(y.u)(a)){var r=n(E.e(a)),o=e||r,c=a.data.result,i=c.balanceAmount,s=c.expenseAmount,u=c.incomeAmount,l=c.pages,d=c.realBalanceAmount,f=c.realExpenseAmount,p=c.realIncomeAmount;Object(v.a)("getProjectDetailCategoryList","POST",JSON.stringify({year:o.substr(0,4),month:o.substr(5,2),endYear:t?t.substr(0,4):"",endMonth:t?t.substr(5,2):"",getPeriod:"true"}),(function(e){if(Object(y.u)(e)){var t=function(e){var t=[],n=function(e,t){return e.forEach((function(e){e.get("childList")&&e.get("childList").size?t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name"),children:a(e.get("childList"))}):t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name"),children:[]})}))},a=function(e){var t=[];return n(e,t),t},r=e.data.categoryList[0];if(e.data.categoryList.length>0&&"\u635f\u76ca\u9879\u76ee"===r.name){t.push({value:"".concat(r.uuid).concat(b.B).concat(r.name).concat(b.B).concat(r.top),label:r.name,children:[{value:"".concat(r.uuid).concat(b.B).concat(r.name).concat(b.B).concat(r.top),label:"\u635f\u76ca\u9879\u76ee"}]});var o=e.data.categoryList[0].childList;Object(g.fromJS)(o).forEach((function(e){if(e.get("childList").size){var n=a(e.get("childList")),r=[{value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name"),children:n}];t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name"),children:r})}else t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name"),children:[{value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name")}]})}))}else Object(g.fromJS)(e.data.categoryList).forEach((function(e){if(e.get("childList").size){var n=a(e.get("childList")),r=[{value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name"),children:n}];t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name"),children:r})}else t.push({value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name"),children:[{value:"".concat(e.get("uuid")).concat(b.B).concat(e.get("name")).concat(b.B).concat(e.get("top")),label:e.get("name")}]})}));return t}(e);n(I(["flags","projectCategoryList"],Object(g.fromJS)(t)))}})),Object(v.a)("getProjectCategoryList","POST",JSON.stringify({year:o.substr(0,4),month:o.substr(5,2),endYear:t?t.substr(0,4):"",endMonth:t?t.substr(5,2):"",categoryUuid:"",subordinateUuid:""}),(function(e){if(Object(y.u)(e)){var t=O(e);n(I(["flags","categoryList"],Object(g.fromJS)(t)))}}));var h=n(E.d(a.data.periodDtoJson));n({type:"GET_XM_BALANCE_LIST",receivedData:a.data.result.childList,period:a.data.periodDtoJson,issuedate:o,getPeriod:"true",balanceAmount:i,expenseAmount:s,incomeAmount:u,pages:l,issues:h,realBalanceAmount:d,realExpenseAmount:f,realIncomeAmount:p,currentPage:1,changeDate:!0,endissuedate:t})}}))}},A=function(e,t){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,a=arguments.length>3?arguments[3]:void 0,r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"",o=arguments.length>5&&void 0!==arguments[5]?arguments[5]:"",c=arguments.length>6&&void 0!==arguments[6]?arguments[6]:"",i=arguments.length>7?arguments[7]:void 0,s=arguments.length>8?arguments[8]:void 0,u=arguments.length>9?arguments[9]:void 0;return function(l,d){!s&&m.a.toast.loading("\u52a0\u8f7d\u4e2d...",0),Object(v.a)("getProjectBalanceList","POST",JSON.stringify({year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",endYear:t?t.substr(0,4):"",endMonth:t?t.substr(5,2):"",getPeriod:"true",subordinateUuid:"true"==a?"":r,runningCategoryUuid:o,categoryUuid:"true"==a?r:"",pageNum:n,propertyCost:c}),(function(d){if(m.a.toast.hide(),Object(y.u)(d)){s&&u.setState({isLoading:!1});var g=d.data.result,f=g.balanceAmount,p=g.expenseAmount,h=g.incomeAmount,v=g.pages,b=g.realBalanceAmount,O=g.realExpenseAmount,C=g.realIncomeAmount,A=l(E.d(d.data.periodDtoJson));l({type:"GET_XM_BALANCE_LIST",receivedData:d.data.result.childList,period:d.data.periodDtoJson,issues:A,issuedate:e,endissuedate:t,getPeriod:"",balanceAmount:f,expenseAmount:p,incomeAmount:h,pages:v,realBalanceAmount:b,realExpenseAmount:O,realIncomeAmount:C,currentPage:n,isTop:a,categoryUuid:r,runningCategoryUuid:o,propertyCost:c,shouldConcat:i})}}))}},I=function(e,t){return function(n){n({type:"CHANGE_XMYE_COMMON_STRING",placeArr:e,value:t})}},T=function(e,t){return function(n){n({type:"XMYE_MENU_DATA",value:t,dataType:e})}},x=n(1315),L=(n(1023),n(24)),j=(n(1039),Object(L.immutableRenderDecorator)(a=function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(){return Object(c.a)(this,n),t.apply(this,arguments)}return Object(i.a)(n,[{key:"render",value:function(){var e=this.props,t=e.ba,n=e.style,a=e.dispatch,r=e.className,o=e.leve,c=e.haveChild,i=e.showChild,s=e.history,u=e.issuedate,l=e.endissuedate,g=e.isTop,f=e.xmType,m=e.runningType,p=e.categoryUuid,v=e.runningCategoryUuid,y=e.propertyCost,b={background:{1:"#fff",2:"#D1C0A5",3:"#7E6B5A",4:"#59493f"}[o],minWidth:(o-1)/100*10+"rem"};return d.a.createElement("div",{className:"ba "+r,style:n},d.a.createElement("div",null,d.a.createElement("span",{className:"name",onClick:function(e){sessionStorage.setItem("fromPage","xmyeb"),a(x.a("",["flags","categoryName"],m)),a(c?x.c(u,l,1,"DETAIL_AMOUNT_TYPE_HAPPEN",t.get("uuid"),"","false",v,y,"",s,!0):x.c(u,l,1,"DETAIL_AMOUNT_TYPE_HAPPEN",p,t.get("uuid"),g,v,y,"".concat(t.get("code")," ").concat(t.get("name")),s,!0)),a(x.a("",["flags","xmType"],f))}},1==o?"":d.a.createElement("span",{className:"ba-flag",style:b}),d.a.createElement("span",{className:"name-name"},t.get("code")?"".concat(t.get("code"),"_").concat(t.get("name")):t.get("name"))),d.a.createElement("span",{className:"btn",onClick:function(){return a(function(e,t){return{type:"ACCOUNTCONF_XM_BALANCE_TRIANGLE_SWITCH",showChild:e,uuid:t}}(i,t.get("uuid")))}},d.a.createElement(h.l,{type:"arrow-down",style:{visibility:c?"visible":"hidden",transform:i?"rotate(180deg)":""}}))),d.a.createElement("div",{className:"double-ba-info"},d.a.createElement("span",{className:"double-item-list"},d.a.createElement(h.a,{showZero:!0},t.get("incomeAmount")),d.a.createElement(h.a,{showZero:!0},t.get("realIncomeAmount"))),d.a.createElement("span",{className:"double-item-list"},d.a.createElement(h.a,{showZero:!0},t.get("expenseAmount")),d.a.createElement(h.a,{showZero:!0},t.get("realExpenseAmount"))),d.a.createElement("span",{className:"double-item-list"},d.a.createElement(h.a,{showZero:!0},t.get("balanceAmount")),d.a.createElement(h.a,{showZero:!0},t.get("realBalanceAmount")))))}}]),n}(d.a.Component))||a),N=(n(116),n(131),function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(e){var a;Object(c.a)(this,n),a=t.call(this,e);var r=[];return a.props.data.getIn([a.props.leftIdx,"children"]).map((function(e,t){r.push(e.get("value"))})),a.state={showList:r},a}return Object(i.a)(n,[{key:"componentWillReceiveProps",value:function(e){if(!Object(g.is)(e.leftIdx,this.props.leftIdx)){var t=[];e.data.getIn([e.leftIdx,"children"]).map((function(e,n){t.push(e.get("value"))})),this.setState({showList:t})}}},{key:"render",value:function(){var e=this,t=this.props,n=t.data,a=t.onChange,r=t.leftIdx,o=t.leftClick,c=this.state.showList,i=n.getIn([r,"value"]),s=n.getIn([r,"children"]);return d.a.createElement(h.h,{className:"xmye-category"},d.a.createElement(h.s,{flex:"1",className:"wlye-category-menu-scroll"},d.a.createElement("div",{className:"xmye-category-menu"},d.a.createElement("div",{className:"menu-left"},n.map((function(e,t){return d.a.createElement(h.r,{key:e.get("value"),className:"menu-left-item overElli ".concat(i==e.get("value")?"menu-left-item-selected":""),onClick:function(){return o(t)}},e.get("label"))}))),d.a.createElement("div",{className:"menu-right"},function t(n,r){return n&&n.map((function(n,o){if(n.get("children")&&n.get("children").size){var s=c.some((function(e){return e===n.get("value")}));return d.a.createElement("div",{key:n.get("value")},d.a.createElement(h.r,{className:"menu-right-item",style:{paddingLeft:"".concat(r,"rem")},onClick:function(){return a([i,n.get("value")])}},d.a.createElement("div",{className:"overElli"},n.get("label")),d.a.createElement(h.l,{style:s?{transform:"rotate(180deg)"}:"",type:"arrow-down",onClick:function(t){t.stopPropagation();var a=c;if(s){var r=a.findIndex((function(e){return e===n.get("value")}))-1;r>-1?a=a.splice(r,1):a.shift()}else a.push(n.get("value"));e.setState({showList:a})}})),s?t(n.get("children"),r+.05):"")}return d.a.createElement(h.r,{key:n.get("value"),className:"menu-right-item overElli",style:{paddingLeft:"".concat(r,"rem")},onClick:function(){return a([i,n.get("value")])}},n.get("label"))}))}(s,.1)))))}}]),n}(d.a.Component)),B=(n(1836),Object(f.c)((function(e){return e}))(r=function(e){Object(u.a)(n,e);var t=Object(s.a)(n);function n(e){return Object(c.a)(this,n),t.call(this,e)}return Object(i.a)(n,[{key:"componentDidMount",value:function(){m.a.setTitle({title:"\u9879\u76ee\u4f59\u989d\u8868"}),m.a.setIcon({showIcon:!1}),m.a.setRight({show:!1}),"xmyeb"!==sessionStorage.getItem("fromPage")?("home"===sessionStorage.getItem("prevPage")&&(sessionStorage.removeItem("prevPage"),this.props.dispatch(C())),this.props.dispatch(T("menuType",""))):sessionStorage.removeItem("fromPage")}},{key:"componentWillReceiveProps",value:function(e){var t=this;Object(g.is)(e.xmyebState.getIn(["flags","menuType"]),this.props.xmyebState.getIn(["flags","menuType"]))||("LB_CATEGORY"===e.xmyebState.getIn(["flags","menuType"])||"RLB_CATEGORY"===e.xmyebState.getIn(["flags","menuType"])?m.a.setRight({show:!0,control:!0,text:"\u53d6\u6d88",onSuccess:function(e){return t.props.dispatch(T("menuType",""))},onFail:function(e){alert(e)}}):m.a.setRight({show:!1}))}},{key:"render",value:function(){var e=this.props,t=e.dispatch,n=e.history,a=e.xmyebState,r=a.getIn(["flags","projectCategoryList"]),c=a.getIn(["flags","categoryList"]),i=(a.getIn(["flags","wlRelationship"]),a.getIn(["flags","issuedate"])),s=a.get("issues"),u=a.getIn(["flags","runningShowChild"]),l=a.getIn(["flags","endissuedate"]),f=s.findIndex((function(e){return e.get("value")===i})),E=s.slice(0,f),L=a.get("balanceTemp"),B=a.get("currentPage"),S=a.get("pageCount"),_=a.getIn(["flags","isTop"]),w=a.getIn(["flags","menuType"]),P=a.getIn(["flags","menuLeftIdx"]),k=a.getIn(["flags","lbMenuLeftIdx"]),M=a.getIn(["flags","runningType"]),R=a.getIn(["flags","xmType"]),U=a.getIn(["flags","categoryUuid"]),D=a.getIn(["flags","runningCategoryUuid"]),H=a.getIn(["flags","propertyCost"]),J=null;({LB_CATEGORY:function(){J=d.a.createElement(N,{data:r,leftIdx:P,leftClick:function(e){return t(T("menuLeftIdx",e))},onChange:function(e){var n=e[1].split(b.B);t(I(["flags","xmType"],n[1])),t(I(["flags","runningType"],"\u5168\u90e8")),t(A(i,l,1,n[2],n[0],"")),t(function(e,t,n,a){return function(r){Object(v.a)("getProjectCategoryList","POST",JSON.stringify({year:e?e.substr(0,4):"",month:e?e.substr(5,2):"",endYear:t?t.substr(0,4):"",endMonth:t?t.substr(5,2):"",subordinateUuid:"true"==a?"":n,categoryUuid:"true"==a?n:""}),(function(e){if(Object(y.u)(e)){var t=O(e);r(I(["flags","categoryList"],Object(g.fromJS)(t)))}}))}}(i,l,n[0],n[2])),t(T("menuType",""))}})},RLB_CATEGORY:function(){J=d.a.createElement(N,{data:c,leftIdx:k,leftClick:function(e){return t(T("lbMenuLeftIdx",e))},onChange:function(e){var n=e[1].split(b.B);t(I(["flags","runningType"],n[1])),t(A(i,l,1,_,U,n[0],n[2])),t(T("menuType","")),t(x.a("",["flags","categoryName"],n[1]))}})}}[w]||function(){return m.a.setTitle({title:"\u9879\u76ee\u4f59\u989d\u8868"}),null})();return J||d.a.createElement(h.h,{className:"xmyeb"},d.a.createElement(p.f,{issuedate:i,source:s,callback:function(e){t(C(e))},onOk:function(e){t(C(e.value))},showSwitch:!0,endissuedate:l,nextperiods:E,onBeginOk:function(e){t(C(e.value))},onEndOk:function(e){t(C(i,e.value))},changeEndToBegin:function(){return t(A(i))}}),d.a.createElement("div",{className:"xmye-top-select"},d.a.createElement("div",{className:"xmye-with-account"},d.a.createElement(h.r,{className:"lrls-row"},d.a.createElement(h.r,{className:"lrls-type",onClick:function(){r.size&&t(T("menuType","LB_CATEGORY"))}},d.a.createElement("span",null,r.size?R:"\u5168\u90e8"),d.a.createElement(h.l,{type:"triangle"})))),d.a.createElement("div",{className:"xmye-with-account"},d.a.createElement(h.r,{className:"lrls-row"},d.a.createElement(h.r,{className:"lrls-type xmye-type",onClick:function(){c.size&&t(T("menuType","RLB_CATEGORY"))}},d.a.createElement("span",null,c.size?M:"\u5168\u90e8"),d.a.createElement(h.l,{type:"triangle"}))))),d.a.createElement(h.r,{className:"ba-title-double"},d.a.createElement("div",{className:"ba-title-item"},d.a.createElement("span",{className:"item-item"},"\u6536\u5165\u989d"),d.a.createElement("span",{className:"item-item"},"\u5b9e\u6536\u989d")),d.a.createElement("div",{className:"ba-title-item"},d.a.createElement("span",{className:"item-item"},"\u652f\u51fa\u989d"),d.a.createElement("span",{className:"item-item"},"\u5b9e\u4ed8\u989d")),d.a.createElement("div",{className:"ba-title-item"},d.a.createElement("span",{className:"item-item"},"\u6536\u652f\u51c0\u989d"),d.a.createElement("span",{className:"item-item"},"\u6536\u4ed8\u51c0\u989d"))),d.a.createElement(h.s,{flex:"1",uniqueKey:"xmye-scroll",className:"scroll-item",savePosition:!0},d.a.createElement("div",{className:"ba-list flow-content"},function e(a,r){return a.map((function(a,c){var s,g,f=u.indexOf(a.get("uuid"))>-1,m=r>1?"#FEF3E3":"#fff";return a.get("childList").size?d.a.createElement("div",{key:c},d.a.createElement(j,(s={leve:r,className:"balance-running-tabel-width",style:{backgroundColor:m},ba:a,haveChild:!0,showChild:f,history:n,dispatch:t,issuedate:i},Object(o.a)(s,"issuedate",i),Object(o.a)(s,"endissuedate",l),Object(o.a)(s,"isTop",_),Object(o.a)(s,"xmType",R),Object(o.a)(s,"runningType",M),Object(o.a)(s,"categoryUuid",U),Object(o.a)(s,"runningCategoryUuid",D),Object(o.a)(s,"propertyCost",H),s)),f?e(a.get("childList"),r+1):""):d.a.createElement("div",{key:c},d.a.createElement(j,(g={leve:r,className:"balance-running-tabel-width",style:{backgroundColor:m},ba:a,haveChild:!1,showChild:f,history:n,dispatch:t,issuedate:i},Object(o.a)(g,"issuedate",i),Object(o.a)(g,"endissuedate",l),Object(o.a)(g,"isTop",_),Object(o.a)(g,"xmType",R),Object(o.a)(g,"runningType",M),Object(o.a)(g,"runningCategoryUuid",D),g)),f?e(a.get("childList"),r+1):"")}))}(L,1)),d.a.createElement(p.c,{diff:1,classContent:"flow-content",callback:function(e){t(A(i,l,B+1,_,U,D,H,!0,!0,e))},isGetAll:B>=S,itemSize:L.size})))}}]),n}(d.a.Component))||r),S=Object(g.fromJS)({flags:{categoryUuid:"",year:"",month:"",endYear:"",endMonth:"",subordinateUuid:"",runningCategoryUuid:"",propertyCost:"",categoryList:[{children:[]}],projectCategoryList:[{children:[]}],xmType:"\u635f\u76ca\u9879\u76ee",runningType:"\u5168\u90e8",endissuedate:"",menuLeftIdx:0,lbMenuLeftIdx:0,menuType:""},issues:[],code:"",uuid:"489391919097446400",categoryUuid:"",incomeAmount:"",expenseAmount:"",balanceAmount:"",realIncomeAmount:"",realExpenseAmount:"",realBalanceAmount:"",childList:[],balanceTemp:[]});var _={xmyebState:function(){var e,t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:S,n=arguments.length>1?arguments[1]:void 0;return((e={},Object(o.a)(e,"INIT_XMYEB",(function(){return S})),Object(o.a)(e,"GET_XM_BALANCE_LIST",(function(){n.isReflash&&(t=t.set("balanceTemp",S)),"true"===n.getPeriod&&(t=t.set("period",Object(g.fromJS)(n.period)).set("issues",Object(g.fromJS)(n.issues))),n.changeDate&&(t=t.setIn(["flags","xmType"],S.getIn(["flags","xmType"])).setIn(["flags","runningType"],S.getIn(["flags","runningType"])));var e=[];n.receivedData.length&&(e.push(n.receivedData[0].uuid),n.receivedData[0].childList.length&&function t(n){return n.map((function(n,a){n.childList&&n.childList.length&&t(n.childList),e.push(n.uuid)}))}(n.receivedData[0].childList));var a=[];n.shouldConcat?a=t.get("balanceTemp").toJS().concat(n.receivedData):a=n.receivedData;return t.set("balanceTemp",Object(g.fromJS)(a)).setIn(["flags","issuedate"],Object(g.fromJS)(n.issuedate)).setIn(["flags","endissuedate"],Object(g.fromJS)(n.endissuedate)).setIn(["flags","balanceAmount"],n.balanceAmount).setIn(["flags","expenseAmount"],n.expenseAmount).setIn(["flags","incomeAmount"],n.incomeAmount).setIn(["flags","realBalanceAmount"],n.realBalanceAmount).setIn(["flags","realExpenseAmount"],n.realExpenseAmount).setIn(["flags","realIncomeAmount"],n.realIncomeAmount).setIn(["flags","categoryUuid"],n.categoryUuid).setIn(["flags","runningCategoryUuid"],n.runningCategoryUuid).setIn(["flags","isTop"],n.isTop).setIn(["flags","propertyCost"],n.propertyCost).setIn(["flags","runningShowChild"],Object(g.fromJS)([])).set("currentPage",n.currentPage).set("pageCount",n.pages)})),Object(o.a)(e,"ACCOUNTCONF_XM_BALANCE_TRIANGLE_SWITCH",(function(){var e=t.getIn(["flags","runningShowChild"]);if(n.showChild){var a=e.splice(e.findIndex((function(e){return e===n.uuid})),1);return t.setIn(["flags","runningShowChild"],a)}var r=e.push(n.uuid);return t.setIn(["flags","runningShowChild"],r)})),Object(o.a)(e,"CHANGE_ZHYE_MORE_PERIODS",(function(){return n.chooseperiods?t.set("chooseperiods",!0):t.update("chooseperiods",(function(e){return!e}))})),Object(o.a)(e,"CHANGE_XMYE_COMMON_STRING",(function(){return t.setIn(n.placeArr,n.value)})),Object(o.a)(e,"XMYE_MENU_DATA",(function(){return t.setIn(["flags",n.dataType],n.value)})),e)[n.type]||function(){return t})()},xmmxbState:n(1438).a}}}]);