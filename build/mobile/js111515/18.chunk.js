(this.webpackJsonpfannix=this.webpackJsonpfannix||[]).push([[18],{1100:function(t,e,n){"use strict";n.d(e,"k",(function(){return a})),n.d(e,"l",(function(){return c})),n.d(e,"q",(function(){return d})),n.d(e,"b",(function(){return v})),n.d(e,"c",(function(){return I})),n.d(e,"j",(function(){return f})),n.d(e,"m",(function(){return S})),n.d(e,"o",(function(){return p})),n.d(e,"s",(function(){return w})),n.d(e,"r",(function(){return O})),n.d(e,"n",(function(){return m})),n.d(e,"p",(function(){return l})),n.d(e,"f",(function(){return b})),n.d(e,"d",(function(){return y})),n.d(e,"h",(function(){return g})),n.d(e,"e",(function(){return _})),n.d(e,"g",(function(){return E})),n.d(e,"i",(function(){return T})),n.d(e,"a",(function(){return N}));var i=n(1258),r=n(17),u=n(12),o=n(14),s=n(2),a=function(){return function(t){Object(r.g)("adminCorpEquity","GET","",(function(e){Object(u.u)(e)&&t({type:i.k,receivedData:e.data})}))}},c=function(t){return function(e){s.a.toast.loading(o.p,0),Object(r.g)("trailEquity","POST",JSON.stringify({productCode:t}),(function(t){s.a.toast.hide(),Object(u.u)(t,"show")&&e(a())}))}},d=function(t){return{type:i.r,idx:t}},v=function(){return{type:i.b}},I=function(t){return function(e){Object(r.g)("cancelOrder","POST",JSON.stringify({orderNo:[t]}),(function(t){Object(u.u)(t,"show")&&(e({type:i.c,receivedData:t.data}),e(a()))}))}},f=function(t){return function(e){Object(r.g)("getdingiappageurl","GET","goods_code=".concat(t),(function(t){Object(u.u)(t,"show")&&s.a.openLink({url:t.data})}))}},S=function(t){return{type:i.n,itemID:t}},p=function(t,e){return{type:i.p}},w=function(t,e){return function(n){n({type:i.c}),n({type:i.v,orderAmount:t,orderNumber:e})}},O=function(){return{type:i.t}},m=function(){return{type:i.o}},l=function(t){return{type:i.q,spaceArr:t}},b=function(t){return{type:i.f,value:t}},y=function(t){return{type:i.d,value:t}},g=function(t){return{type:i.h,value:t}},_=function(t){return{type:i.e,value:t}},E=function(t){return{type:i.g,value:t}},T=function(t,e,n){return function(o){Object(r.g)("createInvoiceUrl","POST",JSON.stringify({orderNoList:t,invoice:e}),(function(t){Object(u.u)(t)&&(o(a()),o({type:i.j}),n.goBack())}))}},N=function(t){return function(e){Object(r.g)("refund","POST",JSON.stringify({orderNo:t}),(function(t){0!==t.code?31014==t.code?(e(v()),s.a.Alert("\u9519\u8bef\u4fe1\u606f\uff1a".concat(t.message," "))):s.a.alert("\u9519\u8bef\u4fe1\u606f\uff1a".concat(t.message," ")):(e(a()),s.a.Alert("\u9000\u6b3e\u7533\u8bf7\u6210\u529f\uff0c\u6b3e\u9879\u5c06\u4e8e1\uff5e3\u4e2a\u5de5\u4f5c\u65e5\u9000\u56de\uff0c\u8bf7\u53ca\u65f6\u67e5\u770b\u652f\u4ed8\u5b9d\u6b3e\u9879\u4fe1\u606f\u3002\u82e5\u6709\u7591\u95ee\u8bf7\u8054\u7cfb\u5ba2\u670d\u7535\u8bdd\uff1a0571-28121680\u3002"))}))}}},1257:function(t,e,n){"use strict";n.d(e,"f",(function(){return i})),n.d(e,"n",(function(){return r})),n.d(e,"o",(function(){return u})),n.d(e,"j",(function(){return o})),n.d(e,"k",(function(){return s})),n.d(e,"l",(function(){return a})),n.d(e,"m",(function(){return c})),n.d(e,"c",(function(){return d})),n.d(e,"e",(function(){return v})),n.d(e,"i",(function(){return I})),n.d(e,"b",(function(){return f})),n.d(e,"a",(function(){return S})),n.d(e,"g",(function(){return p})),n.d(e,"h",(function(){return w})),n.d(e,"p",(function(){return O})),n.d(e,"d",(function(){return m}));var i="GET_PAY_PRODUCT_FETCH",r="TCGM_SELECT_UPGRADE_ITEM",u="TCGM_SELECT_UPGRADE_ITEM_INDEX",o="SUCCESS_SUBMIT_TC",s="SWITCH_TCGM_BUY_OR_UPGRADE",a="TCGM_SELECT_BUY_ITEM",c="TCGM_SELECT_BUY_ITEM_INDEX",d="CANCEL_SHOW_ORDER_TCSJ",v="FROM_TCXQ_JUMP_TO_TCGM",I="SUCCESS_SUBMIT_ORDER",f="AGREE_READ_CONTRACT_TCSJ",S="AGREE_READ_CONTRACT_TCGM",p="SUBMIT_ORDER_TCGM",w="SUBMIT_ORDER_TCSJ",O="UNTREATED_ORDER_TC",m="CANCEL_UNTREATED_ORDER_TC"},1258:function(t,e,n){"use strict";n.d(e,"k",(function(){return i})),n.d(e,"r",(function(){return r})),n.d(e,"b",(function(){return u})),n.d(e,"c",(function(){return o})),n.d(e,"n",(function(){return s})),n.d(e,"m",(function(){return a})),n.d(e,"a",(function(){return c})),n.d(e,"u",(function(){return d})),n.d(e,"i",(function(){return v})),n.d(e,"s",(function(){return I})),n.d(e,"p",(function(){return f})),n.d(e,"t",(function(){return S})),n.d(e,"o",(function(){return p})),n.d(e,"q",(function(){return w})),n.d(e,"f",(function(){return O})),n.d(e,"d",(function(){return m})),n.d(e,"h",(function(){return l})),n.d(e,"e",(function(){return b})),n.d(e,"g",(function(){return y})),n.d(e,"l",(function(){return g})),n.d(e,"v",(function(){return _})),n.d(e,"j",(function(){return E}));var i="GET_ADMIN_CORPINFO_EQUITY",r="SHOW_ORDER_INFO",u="CANCEL_SHOW_ORDER_INFO",o="CANCEL_WAIT_PAY_ORDER",s="SELECT_ONE_BUTTON_ORDER",a="SELECT_ALL_BUTTON_ORDER",c="CANCEL_SELECT_ALL_BUTTON_ORDER",d="SOW_BILL_MESSAGE",v="CLOSE_BILL_MESSAGE",I="SHOW_PROMPT",f="SHOW_EMAIL_ORDER",S="SHOW_TELEPHONE_ORDER",p="SHOW_DUTY_ID_ORDER",w="SHOW_INVOICE_STATUS",O="CHANGE_INVOICE_TITLE_ORDER",m="CHANGE_DUTY_ID_ORDER",l="CHANGE_TELEPHONE_ORDER",b="CHANGE_EMAIL_ORDER",y="CHANGE_REMARK_ORDER",g="GET_ORDER_LIST_FETCH_ORDER",_="SUCCESS_SUBMIT_ORDER",E="CREATE_INVOICE_TO_SERVER"},1324:function(t,e,n){},1451:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));n(115),n(31);var i=n(4),r=n(1257),u=n(1),o=Object(u.fromJS)({views:{buyOrUpgrade:"upgrade",upgradeStatu:[],buyStatu:{equityName:"",index:""},orderNumber:"",orderAmount:"",agreeGm:!1,agreeSj:!1,untreatedOrderVisible:!1,untreatedOrderMessage:"",untreatedOrderList:[],untreatedOrderNo:[]},aliPayAppInfo:"",data:{payInfo:{corpId:"",corpName:"",expirationInfo:"",equityList:[],packageList:{}}}});function s(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,n=arguments.length>1?arguments[1]:void 0;return((t={},Object(i.a)(t,r.f,(function(){return e=e.setIn(["data","payInfo"],Object(u.fromJS)(n.receivedData))})),Object(i.a)(t,r.l,(function(){var t=e.getIn(["views","buyStatu","equityName"]);return e=t!==n.key?e.setIn(["views","buyStatu","equityName"],n.key).setIn(["views","buyStatu","index"],0):e.setIn(["views","buyStatu","equityName"],"").setIn(["views","buyStatu","index"],"")})),Object(i.a)(t,r.m,(function(){var t=e.getIn(["views","buyStatu","index"]);return e.getIn(["views","buyStatu","equityName"])!==n.key&&(e=e.setIn(["views","buyStatu","equityName"],n.key)),t!==n.index&&(e=e.setIn(["views","buyStatu","index"],n.index)),e})),Object(i.a)(t,r.n,(function(){var t=e.getIn(["views","upgradeStatu"]).findIndex((function(t){return t.get("productName")===n.key}));return e=t>-1?e.updateIn(["views","upgradeStatu"],(function(e){return e.delete(t)})):e.updateIn(["views","upgradeStatu"],(function(t){return t.push(Object(u.fromJS)({productName:n.key,index:0}))}))})),Object(i.a)(t,r.o,(function(){var t=e.getIn(["views","upgradeStatu"]).findIndex((function(t){return t.get("productName")===n.key}));return e=t>-1?e.updateIn(["views","upgradeStatu"],(function(e){return e.setIn([t,"index"],n.index)})):e.updateIn(["views","upgradeStatu"],(function(t){return t.push(Object(u.fromJS)({productName:n.key,index:n.index}))}))})),Object(i.a)(t,r.g,(function(){return e=e.setIn(["views","orderNumber"],n.orderNo).setIn(["views","orderAmount"],n.orderAmount).setIn(["views","orderWindowShow"],!0).set("aliPayAppInfo",n.receivedData.payInfo)})),Object(i.a)(t,r.h,(function(){return e=e.setIn(["views","orderNumber"],n.orderNo).setIn(["views","orderAmount"],n.orderAmount).setIn(["views","orderWindowShow"],!0).set("aliPayAppInfo",n.receivedData.payInfo)})),Object(i.a)(t,r.i,(function(){return e=e.setIn(["views","orderNumber"],n.orderNumber).setIn(["views","orderAmount"],n.orderAmount)})),Object(i.a)(t,r.j,(function(){return e.setIn(["views","orderWindowShow"],!1)})),Object(i.a)(t,r.c,(function(){return e.setIn(["views","orderWindowShow"],!1)})),Object(i.a)(t,r.k,(function(){return e=e.setIn(["views","buyOrUpgrade"],n.buyOrUpgrade)})),Object(i.a)(t,r.e,(function(){return e=e.setIn(["views","upgradeStatu"],Object(u.fromJS)([{productName:n.productName,index:0}]))})),Object(i.a)(t,r.b,(function(){return e=e.setIn(["views","agreeSj"],n.bool)})),Object(i.a)(t,r.a,(function(){return e=e.setIn(["views","agreeGm"],n.bool)})),Object(i.a)(t,r.p,(function(){return e.setIn(["views","untreatedOrderVisible"],!e.get("untreatedOrderVisible")).setIn(["views","untreatedOrderMessage"],n.message).setIn(["views","untreatedOrderList"],n.receivedData).setIn(["views","untreatedOrderNo"],n.receivedData.map((function(t,e){return t.orderNo})))})),Object(i.a)(t,r.d,(function(){return e.setIn(["views","untreatedOrderVisible"],!e.getIn(["views","untreatedOrderVisible"]))})),t)[n.type]||function(){return e})()}},1452:function(t,e,n){"use strict";n.d(e,"a",(function(){return s}));n(31),n(116);var i=n(4),r=n(1258),u=n(1),o=Object(u.fromJS)({views:{orderItemStatus:!1,orderItemStatusFals:!1,applyStatus:!1,selectAllStatus:!1,avtiveItemId:[],showOrderInfoStatus:!1,billMessageStatus:!1,showSuccessSubmit:!1,showPrompt:!1,orderNoList:[],invoice:{invoiceTitle:"",dutyId:"",email:"",telephone:"",remark:""},invoiceStatus:{invoiceTitleStatus:!0,dutyIdStatus:!0,telephoneStatus:!0,emailStatus:!0,remarkStatus:!0},invoiceFormatStatus:{dutyIdStatus:!0,bankAccountStatus:!0,registeredTelStatus:!0,telephoneStatus:!0,emailStatus:!0},invoiceMessage:{orderNo:"",orderTime:"",tradeStatus:"",activateAmount:"",validTime:"",payAmount:"",isInvoice:"",isRefund:"",createName:"",orderType:"",payTime:"",payMonth:"",invoice:{invoiceType:"",invoiceTitle:"",dutyId:"",telephone:"",email:"",remark:""}}},data:{corpInfo:{corpId:"",corpName:"",equityList:[],invalidEquityList:[],orderInfoList:[]}}});function s(){var t,e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:o,n=arguments.length>1?arguments[1]:void 0;return((t={},Object(i.a)(t,r.k,(function(){e=o.setIn(["data","corpInfo"],Object(u.fromJS)(n.receivedData));var t=[],i=[];return e.getIn(["data","corpInfo","orderInfoList"]).map((function(e,n){t.push({indexId:n,checkboxDisplay:!1,orderNo:e.get("orderNo"),payAmount:e.get("payAmount"),orderType:e.get("orderType")}),"NO"==e.get("isInvoice")&&"WAIT_BUYER_PAY"!==e.get("tradeStatus")&&"NO"==e.get("isRefund")&&i.push(n)})),e.setIn(["views","orderItemStatus"],Object(u.fromJS)(t)).setIn(["views","orderItemStatusFalse"],Object(u.fromJS)(i)).setIn(["views","invoice"],o.getIn(["views","invoice"])).setIn(["views","invoice","invoiceType"],"\u589e\u503c\u7a0e\u666e\u901a\u53d1\u7968").setIn(["views","billMessageStatus"],!1).setIn(["views","applyStatus"],!0).setIn(["views","selectAllStatus"],!1).setIn(["views","showSuccessSubmit"],!1)})),Object(i.a)(t,r.r,(function(){return e.setIn(["views","invoiceMessage"],e.getIn(["data","corpInfo","orderInfoList",n.idx])).setIn(["views","showOrderInfoStatus"],!0)})),Object(i.a)(t,r.b,(function(){return e.setIn(["views","showOrderInfoStatus"],!1)})),Object(i.a)(t,r.c,(function(){return e.setIn(["views","showOrderInfoStatus"],!1)})),Object(i.a)(t,r.n,(function(){e.getIn(["views","orderItemStatus"]).map((function(t,i){t.get("indexId")==n.itemID&&(e=e.setIn(["views","orderItemStatus",n.itemID,"checkboxDisplay"],!e.getIn(["views","orderItemStatus",n.itemID,"checkboxDisplay"])))})),e=e.getIn(["views","orderItemStatus"]).some((function(t){return t.get("checkboxDisplay")}))?e.setIn(["views","applyStatus"],!1):e.setIn(["views","selectAllStatus"],!1).setIn(["views","applyStatus"],!0);var t=[];return e.getIn(["views","orderItemStatus"]).map((function(e,n){e.get("checkboxDisplay")&&t.push({orderNo:e.get("orderNo"),payAmount:e.get("payAmount")})})),e=e.setIn(["views","avtiveItemId"],Object(u.fromJS)(t))})),Object(i.a)(t,r.m,(function(){(e=e.setIn(["views","selectAllStatus"],!e.getIn(["views","selectAllStatus"]))).getIn(["views","orderItemStatus"]).map((function(t,n){e.getIn(["views","orderItemStatusFalse"]).map((function(t){t==n&&(e=e.setIn(["views","orderItemStatus",n,"checkboxDisplay"],e.getIn(["views","selectAllStatus"])))}))})),e=e.getIn(["views","orderItemStatus"]).some((function(t){return t.get("checkboxDisplay")}))?e.setIn(["views","applyStatus"],!1):e.setIn(["views","selectAllStatus"],!1).setIn(["views","applyStatus"],!0);var t=[];return e.getIn(["views","orderItemStatus"]).map((function(e,n){e.get("checkboxDisplay")&&t.push({orderNo:e.get("orderNo"),payAmount:e.get("payAmount")})})),e=e.setIn(["views","avtiveItemId"],Object(u.fromJS)(t))})),Object(i.a)(t,r.a,(function(){return e=e.setIn(["views","avtiveItemId"],Object(u.fromJS)([])).updateIn(["views","orderItemStatus"],(function(t){return t.map((function(t){return t.set("checkboxDisplay",!1)}))})).setIn(["views","applyStatus"],!0)})),Object(i.a)(t,r.u,(function(){return e.setIn(["views","billMessageStatus"],!0)})),Object(i.a)(t,r.i,(function(){return e.setIn(["views","invoice"],o.getIn(["views","invoice"])).setIn(["views","invoiceStatus"],o.getIn(["views","invoiceStatus"])).setIn(["views","invoiceFormatStatus"],o.getIn(["views","invoiceFormatStatus"])).setIn(["views","invoice","invoiceType"],"\u589e\u503c\u7a0e\u666e\u901a\u53d1\u7968").setIn(["views","billMessageStatus"],!1)})),Object(i.a)(t,r.p,(function(){return e.setIn(["views","invoiceFormatStatus","emailStatus"],!1)})),Object(i.a)(t,r.t,(function(){return e.setIn(["views","invoiceFormatStatus","telephoneStatus"],!1)})),Object(i.a)(t,r.o,(function(){return e.setIn(["views","invoiceFormatStatus","dutyIdStatus"],!1)})),Object(i.a)(t,r.q,(function(){return e=e.setIn(["views","invoiceStatus"],e.getIn(["views","invoiceStatus"]).map((function(t,n){for(var i in e.getIn(["views","invoice"]).toJS())if(i+"Status"==n)return""!=e.getIn(["views","invoice"]).toJS()[i]&&t})))})),Object(i.a)(t,r.f,(function(){return(e=""==n.value?e.setIn(["views","invoiceStatus","invoiceTitleStatus"],!1):e.setIn(["views","invoiceStatus","invoiceTitleStatus"],!0)).setIn(["views","invoice","invoiceTitle"],n.value)})),Object(i.a)(t,r.d,(function(){return""==n.value?e=e.setIn(["views","invoiceStatus","dutyIdStatus"],!1).setIn(["views","invoiceFormatStatus","dutyIdStatus"],!0):(e=e.setIn(["views","invoiceStatus","dutyIdStatus"],!0),e=/[0-9A-Z]{15}|[0-9A-Z]{18}|[0-9A-Z]{20}/.test(n.value)?e.setIn(["views","invoiceFormatStatus","dutyIdStatus"],!0):e.setIn(["views","invoiceFormatStatus","dutyIdStatus"],!1)),e.setIn(["views","invoice","dutyId"],n.value)})),Object(i.a)(t,r.h,(function(){return""==n.value?e=e.setIn(["views","invoiceStatus","telephoneStatus"],!1).setIn(["views","invoiceFormatStatus","telephoneStatus"],!0):(e=e.setIn(["views","invoiceStatus","telephoneStatus"],!0),e=/(^(\d{3,4}-)?\d{7,8})$|(^1[3|4|5|7|8][0-9]{9}$)/.test(n.value)?e.setIn(["views","invoiceFormatStatus","telephoneStatus"],!0):e.setIn(["views","invoiceFormatStatus","telephoneStatus"],!1)),e.setIn(["views","invoice","telephone"],n.value)})),Object(i.a)(t,r.e,(function(){return""==n.value?e=e.setIn(["views","invoiceStatus","emailStatus"],!1).setIn(["views","invoiceFormatStatus","eamilStatus"],!0):(e=e.setIn(["views","invoiceStatus","emailStatus"],!0),e=/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(n.value)?e.setIn(["views","invoiceFormatStatus","emailStatus"],!0):e.setIn(["views","invoiceFormatStatus","emailStatus"],!1)),e.setIn(["views","invoice","email"],n.value)})),Object(i.a)(t,r.g,(function(){return e.setIn(["views","invoice","remark"],n.value)})),Object(i.a)(t,r.j,(function(){return e.setIn(["views","billMessageStatus"],!1)})),Object(i.a)(t,r.l,(function(){e=o.setIn(["data","orderInfoList"],Object(u.fromJS)(n.receivedData));var t=[],i=[];return e.getIn(["data","orderInfoList"]).map((function(e,n){t.push({indexId:n,checkboxDisplay:!1,orderNo:e.get("orderNo"),payAmount:e.get("payAmount"),orderType:e.get("orderType")}),"NO"==e.get("isInvoice")&&"WAIT_BUYER_PAY"!==e.get("tradeStatus")&&"NO"==e.get("isRefund")&&i.push(n)})),e.setIn(["views","orderItemStatus"],Object(u.fromJS)(t)).setIn(["views","orderItemStatusFalse"],Object(u.fromJS)(i)).setIn(["views","invoice"],o.getIn(["invoice"])).setIn(["views","invoice","invoiceType"],"\u589e\u503c\u7a0e\u666e\u901a\u53d1\u7968").setIn(["views","billMessageStatus"],!1).setIn(["views","applyStatus"],!0).setIn(["views","selectAllStatus"],!1).setIn(["views","showSuccessSubmit"],!1)})),t)[n.type]||function(){return e})()}}}]);