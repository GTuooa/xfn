import 'es6-shim'
import fetchFunc from './fetchFunc'

export const AGENTID = '26171292'
export const XFNVERSION = '3.1.2'
export const ROOTURL = 'http://mtst.xfannix.com'

const href = window.location.href
// 安全域名灰度
const isPre = href.indexOf('mobile.xfannix.com') > 0
// 从路由读取 corpid
const urlParam = getUrlParam(href)

let corpId = urlParam.corpid

const specialCom = [ "dingf45f2aeb902bdb76a1320dcb25e91351", "ding6e88256a939bff83", "ding75d2d8a9cfb940bf" ]
const isSpecial = true

export let SERVERURL = isPre && isSpecial && urlParam.urlbackup !== 'true' ? 'https://xfannixapp1948.eapps.dingtalkcloud.com' : 'http://papitst.xfannix.com'

export const ROOT = `${SERVERURL}/CWSERVICE`
export const ROOTCARD = `${SERVERURL}/CWPKT`
export const ROOTJR = `${SERVERURL}/CWJR`
// export const ROOT = 'http://172.18.0.12:8082'

// export const ROOT = `https://fannixddfe1.hz.taeapp.com/XFN-MF`

// export const ROOTCARD = 'https://fannixddfe1.hz.taeapp.com/XFN-MF/CWSERVICE' + '/pkt/psi'
//  图片地址
// export const USER_GUIDE = 'http://www.fannix.com.cn/xfn/support/mobile/app/index.html'
// export const USER_GUIDE = 'https://www.xfannix.com/support/mobile/app/index.html'
export const USER_GUIDE_ZN = 'https://www.xfannix.com/support/mobile/app/index.html#/sysczn/1.1'
export const USER_GUIDE_KJ = 'https://www.xfannix.com/support/mobile/app/index.html#/sysc/1.1'
export const USER_GUIDE_VIDEO = 'https://www.xfannix.com/support/mobile/app/index.html'

// export const USER_GUIDE = 'https://www.xfare.cn/xfn/manual/mobile/index.html'
const nameType = 'gt'

const URL = {
	getddconfig			    : `${ROOT}/dd/config`,
	getdduserinfo           : `${ROOT}/dd/new/info`,

	// getdduserinfo           : `${ROOT}/dd/userinfo`,

	// login				    : `${ROOT}/u/login/${nameType}`,
	login                   : `${ROOT}/u/new/login/${nameType}`,
	// 开启体验模式
	playOpen		        : `${ROOT}/play/open`,

	// 获取用户信息，包括（soblist和aclist）
	getuserinfo			    : `${ROOT}/u/info`,
	modifydefaultsobid	    : `${ROOT}/u/default/modify`,
	getAdminNameList	    : `${ROOT}/u/get/adminNameList`,
	adminNewEntry	        : `${ROOT}/admin/new/entry`,
	getSobSetting		    : `${ROOT}/sob/setting/get`,
	sendGuideImage          : `${ROOT}/upload/send/guide/image`,
	getPlaySobModelList     : `${ROOT}/play/sob/model/list`,
	checkRoleIsRepeat       : `${ROOT}/sob/check/role`,
	getsobcopycode		    : `${ROOT}/sob/list/copy/code`,
	setlocksecret           : `${ROOT}/u/lock/secret/set`,
	getdingiappageurl       : `${ROOT}/ding/iap/page/url`,

	// 付费
	// adminCorpEquity		    : `${ROOT}/admin/corp/equity`,
	// payProductInfo		    : `${ROOT}/pay/product/info`,

	adminCorpEquity		    : `${ROOT}/corp/equity`,
	payProductInfo		    : `${ROOT}/pay/product/new/info`,

	payNewOrder			    : `${ROOT}/pay/new/order`,
	cancelOrder			    : `${ROOT}/pay/cancelOrder`,
	createInvoiceUrl	    : `${ROOT}/pay/createInvoice`,//发送发票的表单数据
	trailEquity	            : `${ROOT}/admin/trial/equity`,//发送发票的表单数据
	complete			    : `${ROOT}/pay/complete`,//发送发票的表单数据
	refund				    : `${ROOT}/pay/refund`,//申请退款

	// getsoblist			    : `${ROOT}/sob/list`,
	getSecurityCenter	    : `${ROOT}/security_center/info`,
	saveSecurityCenter      : `${ROOT}/security_center/save`,
	insertsob			    : `${ROOT}/sob/insert`,
	modifysob			    : `${ROOT}/sob/modify`,
	// deletesob			    : `${ROOT}/sob/list/delete`,
	getperiod			    : `${ROOT}/sob/period`,
	closesob			    : `${ROOT}/sob/close`,
	opensob				    : `${ROOT}/sob/open`,
	getincomestatementass	: `${ROOT}/sob/report/incomestatement/ass`,
	getcachFlow				: `${ROOT}/sob/report/cachFlow`,
	getJrcachFlow				: `${ROOTJR}/jr/report/cashFlow/list`,
	getSelfTypeListData     : `${ROOT}/sob/report/customize/incomestatement`,
	getJrProfit			: `${ROOTJR}/jr/report/xfn/profit`,
	getMeasureList			: `${ROOT}/sob/report/customize/incomestatement/test`,
	getJrMeasureList			: `${ROOTJR}/jr/report/xfn/profit/calculate`,
	getSelfTypeListExtraMessage: `${ROOT}/sob/report/customize/income/extra/message/list`,
	getJrExtraMessage		: `${ROOTJR}/jr/report/xfn/profit/extra/list`,
	setJrNewExtraMessage      : `${ROOTJR}/jr/report/xfn/profit/extra/single/set`,
	setNewExtraMessage      : `${ROOT}/sob/report/customize/income/extra/message/set`,
	updateExtraMessage		: `${ROOT}/sob/report/customize/income/extra/message/update`,
	updateJrExtraMessage		: `${ROOTJR}/jr/report/xfn/profit/extra/single/modify`,
	deleteExtraMessage		: `${ROOT}/sob/report/customize/income/extra/message/list/delete`,
	deleteJrExtraMessage		: `${ROOTJR}/jr/report/xfn/profit/extra/delete`,
	getlastvcindex		    : `${ROOT}/sob/vc/index/last`,
	getvc				    : `${ROOT}/sob/vc/`,
	getvclist			    : `${ROOT}/sob/vc/list`,
	insertvc			    : `${ROOT}/sob/vc/insert`,
	modifyvc			    : `${ROOT}/sob/vc/modify`,
	reviewvc			    : `${ROOT}/sob/vc/review`,
	backreviewvc		    : `${ROOT}/sob/vc/backReview`,
	sortvc				    : `${ROOT}/sob/vc/sort`,
	deletevc			    : `${ROOT}/sob/vc/list/delete`,
	insertdraft				: `${ROOT}/sob/vc/model/insert`,
	getdraftlist			: `${ROOT}/sob/vc/model/list`,
	modifydraft				: `${ROOT}/sob/vc/model/modify`,
	deletedraft				: `${ROOT}/sob/vc/model/list/delete`,
	lockdraft				: `${ROOT}/sob/vc/model/lock`,
	unlockdraft				: `${ROOT}/sob/vc/model/unlock`,
	getdraft				: `${ROOT}/sob/vc/model/get`,
	uploadGetEnclosure 	    : `${ROOT}/upload/getEnclosure`,

	getaclist			    : `${ROOT}/sob/ac/list`,
	insertac			    : `${ROOT}/sob/ac/insert`,
	modifyac			    : `${ROOT}/sob/ac/modify`,
	deleteac			    : `${ROOT}/sob/ac/list/delete`,
	getAmountData       	: `${ROOT}/sob/ac/direction`,  //lrpz的数量一栏的信息

	assCheck			    : `${ROOT}/sob/ass/regret/check`,
	assRegret 			    : `${ROOT}/sob/ass/regret/ass`,
	getacasslist		    : `${ROOT}/sob/ass/list`,
	insertass			    : `${ROOT}/sob/ass/insert`,
	modifyass			    : `${ROOT}/sob/ass/modify`,
	relateass 			    : `${ROOT}/sob/ass/relate`,
	deleteass			    : `${ROOT}/sob/ass/list/delete`,
	changeAssName           : `${ROOT}/sob/ass/category/modify`,

    initba				    : `${ROOT}/sob/ba/init`,
	getbainitlist		    : `${ROOT}/sob/ba/init/list`,
	getbalist			    : `${ROOT}/sob/ba/list`,
	gettrailbalance			: `${ROOT}/sob/ba/trail/balance`,

	getbalancesheet		    : `${ROOT}/sob/report/balancesheet`,
	getJrbalancesheet		    : `${ROOTJR}/jr/report/assets`,
	getincomestatement	    : `${ROOT}/sob/report/incomestatement`,
	getJrincomestatement	: `${ROOTJR}/jr/report/profit`,
	getsubsidiaryledger	    : `${ROOT}/sob/report/subsidiaryledger`,
	getmxbaclist		    : `${ROOT}/sob/report/subsidiaryledger/aclist`,
	getAmountMxByAss	    : `${ROOT}/sob/report/countList/subsidiaryledger/by/ass`,
	getAmountMxTerrByAss	: `${ROOT}/sob/report/countList/subsidiaryledger/ass/tree`,
	getbosssheet		    : `${ROOT}/sob/report/boss`,
	getbosssheetamb			: `${ROOT}/sob/report/boss/AMB`,
	getJrBossSheet	        : `${ROOTJR}/jr/report/xfn/boss`,
	getCountList			: `${ROOT}/sob/report/countList`,//数量余额表
	getMoreCountList		: `${ROOT}/sob/report/moreCount/list`,//数量余额表
	getAmountKmyueList          		:`${ROOT}/sob/report/countList/list/by/ass`,
	getMoreAmountKmyueList          	:`${ROOT}/sob/report/moreCount/list/by/ass`,
	getAmountKmTree						:`${ROOT}/sob/report/number/balance/tree`,
	getAmountAssTwoTree					:`${ROOT}/sob/report/number/assTwo/tree`,
	getAmountAssTwoKmyueList  			:`${ROOT}/sob/report/countList/list/by/two/ass`,

	getassetslist		    : `${ROOT}/fixed_assets/getList`,
	getclassification       : `${ROOT}/fixed_assets/classification/get`,
	insertclassification    : `${ROOT}/fixed_assets/classification/insert`,
	modifyclassification    : `${ROOT}/fixed_assets/classification/modify`,
	initclassification  	: `${ROOT}/fixed_assets/classification/init`,
	getassetscard        	: `${ROOT}/fixed_assets/card/get`,
	insertassetscard		: `${ROOT}/fixed_assets/card/insert`,
	copyassetscard			: `${ROOT}/fixed_assets/card/copy`,
	modifyassetscard		: `${ROOT}/fixed_assets/card/modify`,
	deleteassetscard		: `${ROOT}/fixed_assets/card/list/delete`,
	deleteclassification 	: `${ROOT}/fixed_assets/classification/list/delete`,
	getmaxcardnumber		: `${ROOT}/fixed_assets/card/getMaxCardNumber`,
	clearcard				: `${ROOT}/fixed_assets/card/clearCard`,
	cancelclearcard			: `${ROOT}/fixed_assets/card/cancelClearCard`,

	//	资产余额表手机端接口
	getassetsdetail    		: `${ROOT}/fixed_assets/detail/getAssetsDetail`,
	getassetsdetailmore    	: `${ROOT}/fixed_assets/detail/getAssetsBalanceReport`,
	getMxList			    :`${ROOT}/fixed_assets/detail/getAssetsDetailReport`,
	getlabelList    		: `${ROOT}/fixed_assets/card/getLabelList`,
	pagindvc 				: `${ROOT}/sob/vc/paging`,

	reportassac             : `${ROOT}/sob/report/ass/ac`,
	reportassdetail         : `${ROOT}/sob/report/ass/detail`,

	reportassbalance        : `${ROOT}/sob/report/ass/balance`,
	reportacregretcheck     : `${ROOT}/sob/ac/regret/check`,
	reportacregretuse       : `${ROOT}/sob/ac/regret/use`,
	acregretcheckNum1       : `${ROOT}/sob/ac/regret/check/Num1`,
	acregretcheckNum2       : `${ROOT}/sob/ac/regret/check/Num2`,
	acregretuseNum          : `${ROOT}/sob/ac/regret/use/Num`,

	// 明细余额
	getreportacbalance      : `${ROOT}/sob/report/ac/balance`,
	getreportacdetailtree   : `${ROOT}/sob/report/ac/detail/tree`,
	getreportacdetail       : `${ROOT}/sob/report/ac/detail`,

	// reportacregretuse   : `${ROOT}/sob/ac/regret/use`,
	excelsend   		: `${ROOT}/excel/send`,
	excelJrProfit     :`${ROOTJR}/jr/excel/send/profit`,
	pdfJrProfit			: `${ROOTJR}/jr/pdf/send/profit`,
	excelJrsend   		: `${ROOTJR}/jr/excel/send/assets`,
	lrbambexcelsend   	: `${ROOT}/excel/send/AMB`,
	pdflrbexport		: `${ROOT}/pdf/send/exportincomepdf`,
	pdflrbincomepdfquarter : `${ROOT}/pdf/send/exportincomepdfquarter`,
	pdfzcfzexport		: `${ROOT}/pdf/send/exportbasheetpdf`,
	pdfJrzcfzexport		: `${ROOTJR}/jr/pdf/send/assets`,
	excelcashFlow		: `${ROOT}/excel/send/cashFlow`,
	excelJrcashFlow		: `${ROOTJR}/jr/excel/send/cashFlow`,
	pdfCashFlow	        : `${ROOT}/pdf/send/exportCashFlow`,
	pdfJrCashFlow	        : `${ROOTJR}/jr/pdf/send/cashFlow`,
	// kmyebexcelsend   	: `${ROOT}/excel/send/acBalance`,
	kmyebexcelsend   	: `${ROOT}/sob/report/ac/balance/excel/send`,
	// pdfkmyeexport		: `${ROOT}/pdf/send/exportacbalancepdf`,
	pdfkmyeexport		: `${ROOT}/sob/report/ac/balance/pdf/send`,
	// pdfAcSub 			: `${ROOT}/pdf/send/AcSub`,
	pdfAcSub 			: `${ROOT}/sob/report/ac/detail/all/first/pdf/send`,
	// pdfSecondAcSub      : `${ROOT}/pdf/send/SecondAcSub`,
	pdfSecondAcSub      : `${ROOT}/sob/report/ac/detail/all/second/pdf/send`,
	// pdfExportLedger2    : `${ROOT}/pdf/send/exportLedger2`,
	pdfExportLedger2    : `${ROOT}/sob/report/ac/detail/ledger/second/pdf/send`,
	// excelExportLedger  	: `${ROOT}/excel/send/ledger`,
	excelExportLedger  	: `${ROOT}/sob/report/ac/detail/ledger/excel/send`,
	excelXfn            : `${ROOT}/excel/send/customize/incomestatement`,
	excelXfnProfit     :`${ROOTJR}/jr/excel/send/xfn/profit`,

	asskmyebexcelsend	: `${ROOT}/excel/send/assba`,
	pdfasswbaexport	    : `${ROOT}/pdf/send/exportassba`,
	qcyeexcelsend		: `${ROOT}/excel/send/periodBas`,

	// mxbexcelsubone   	: `${ROOT}/excel/send/SubOne`,
	mxbexcelsubone   	: `${ROOT}/sob/report/ac/detail/one/excel/send`,
	// pdfmxbexport		: `${ROOT}/pdf/send/exportsubpdf`,
	pdfmxbexport		: `${ROOT}/sob/report/ac/detail/one/pdf/send`,
	// mxbexcelsuball   	: `${ROOT}/excel/send/SubAll`,
	mxbexcelsuball   	: `${ROOT}/sob/report/ac/detail/all/excel/send`,

	assmxbexcelsubone   : `${ROOT}/excel/send/AssSubOne`,
	pdfassmxboneexport	: `${ROOT}/pdf/send/exportsubass`,
	assmxbexcelsuball   : `${ROOT}/excel/send/AssSubAll`,
	cxpzpdfexport 		: `${ROOT}/pdf/send`,
	// pdfExportLedger	    : `${ROOT}/pdf/send/exportLedger`,
	pdfExportLedger	    : `${ROOT}/sob/report/ac/detail/ledger/first/pdf/send`,
	excelclassification	: `${ROOT}/excel/send/classification`,
	excelcard  			: `${ROOT}/excel/send/card`,
	excelcountSunOne	: `${ROOT}/excel/send/countSunOne`,
	pdfCountSub	        : `${ROOT}/pdf/send/exportCountSub`,
	excelcountSubAll	: `${ROOT}/excel/send/countSubAll`,
	excelcountBa		: `${ROOT}/excel/send/countBa`,
	excelcountBaByAss	: `${ROOT}/excel/send/countBa/by/ass`,
	pdfCountBa	        : `${ROOT}/pdf/send/exportCountBa`,
	pdfCountBaByAss	    : `${ROOT}/pdf/send/exportCountBa/by/ass`,
	excelAssetsBalance  : `${ROOT}/excel/send/AssetsBalance`,
	pdfAssetsBa    		: `${ROOT}/pdf/send/assertsBa`,
	pdfAssertSub        : `${ROOT}/pdf/send/assertSub`,
	// pdfVcAll      		: `${ROOT}/pdf/send/VcAll`,
	pdfVcAll      		: `${ROOT}/sob/report/ac/balance/vc/pdf/send`,
	excelAMBIncome  	: `${ROOT}/excel/send/AMBIncome`,
	excelAMBSYBIncome   : `${ROOT}/excel/send/project/AMBIncome`,
	excelFcBa  			: `${ROOT}/excel/send/fcBa`,
	pdfFcBa 		   	: `${ROOT}/pdf/send/FcBa`,
	excelAssertSub  	: `${ROOT}/excel/send/assertSub`,
	// pdfAssetsBa    		: `${ROOT}/pdf/send/assertsBa`,
	excelFcSubOne  		: `${ROOT}/excel/send/fcSubOne`,
	pdfFcSub 			: `${ROOT}/pdf/send/fcSub`,
	excelcountSunOneByAss	: `${ROOT}/excel/send/countSubOne/by/ass`,
	pdfCountSubByAss 		: `${ROOT}/pdf/send/exportCountSub/by/ass`,
	excelcountSubAllByAss	: `${ROOT}/excel/send/countSubAll/by/ass`,
	acdetailonevcexcel  : `${ROOT}/sob/report/ac/detail/one/vc/excel/send`,

	// AMBIncomeStatement	: `${ROOT}/sob/report/AMBIncomeStatement`,
	AMBIncomeStatement	: `${ROOT}/sob/report/AMBPcIncomeStatement`,
	asslistforamb       : `${ROOT}/sob/ass/list/for/amb`,
	getSyxmbIncomeStatement : `${ROOT}/sob/report/project/AMBIncomeStatement`,
	getSYXMBCardList    : `${ROOTJR}/jr/AMB/card/list`,
	assgetAMB			: `${ROOT}/sob/ass/getAMB`,
	assrelateAMB		: `${ROOT}/sob/ass/relateAMB`,
	//应交税金表
	getSjbData              : `${ROOT}/sob/report/taxPayTable`,
	getYjsfbData        :`${ROOT}/sob/report/payTaxTable`,
	getJrYjsfbData        :`${ROOTJR}/jr/report/rate`,
	//超级管理
	deletesob						  : `${ROOT}/admin/list/delete`,
	adminSetsobadmin				  : `${ROOT}/admin/setsobadmin`,
	adminTrialext					  : `${ROOT}/admin/trialext`,
	adminActivatext					  : `${ROOT}/admin/activatext`,
	adminCorpinfo					  : `${ROOT}/admin/corpinfo`,
	packageAmountList				  : `${ROOT}/pay/packageAmountList`,
	payOrder						  : `${ROOT}/pay/order`,
	// cancelOrder						  : `${ROOT}/pay/cancelOrder`,
	// complete						  : `${ROOT}/pay/complete`,   //完成支付
	orderList					      : `${ROOT}/pay/orderList`,	//获取订单的初始数据
	// createInvoiceUrl				  : `${ROOT}/pay/createInvoice`,	//发送发票的表单数据
	aliPayAppInfo				  	  : `${ROOT}/pay/aliPayAppInfo`,		//发送发票的表单数据
	// refund							  : `${ROOT}/pay/refund`,//发送发票的表单数据
	getVcFetch                        : `${ROOT}/sob/vc/`,//获取附件信息
	getSpaceAndAuthorization          : `${ROOT}/upload/getDingSpace`,//获取自定义空间与授权
	//附件 附件管理
	uploadgetfile                     : `${ROOT}/upload/getFilePath`,
	getFjData                         : `${ROOT}/upload/getEnList`,
	deleteFj                          : `${ROOT}/upload/deleteFilePath`,
	getFjLabelData                    : `${ROOT}/upload/getLabel`,
	initLabel                         : `${ROOT}/upload/initLabel`,
	updateLabel                       : `${ROOTCARD}/enclosure/updateLabel`,
	checkEnclosureList                : `${ROOT}/upload/checkEnIsUser`,
	fjglDown                          : `${ROOT}/upload/downLoadZipFile`,
	uploadaddfile					  : `${ROOT}/upload/addfile`,
	getAssYebTree                     : `${ROOT}/sob/report/ass/balance/tree`,//辅助核算余额表科目树
	insertEnclosure				      : `${ROOTCARD}/enclosure/insert`,
	aliyunOssPolicy                   : `${ROOTCARD}/aliyun/oss/policy`,

	//外币
	getFCList		             	  : `${ROOT}/FC/list`,
	getModelFCList		              : `${ROOT}/FC/model/list`,
	insertFC		              	  : `${ROOT}/FC/insert`,
	modifyFC		                  : `${ROOT}/FC/modify`,
	deleteFC		                  : `${ROOT}/FC/delete`,
	relateFCList		              : `${ROOT}/FC/relate`,
	getFCRelateAcList		          : `${ROOT}/FC/relate/get`,
	getFCYebList		          	  : `${ROOT}/FC/ba/list`,
	getFCDetail		          	  	  : `${ROOT}/FC/detail`,
	getFCDetailAc		          	  : `${ROOT}/FC/detail/ac`,

	//应交税费表导出
	taxPayTableExcel    			  : `${ROOT}/excel/send/payTaxTable`,
	taxPayJrTableExcel    			  : `${ROOTJR}/jr/excel/send/rate`,
	pdfTaxPayTable      			  : `${ROOT}/pdf/send/taxPayTable`,
	//kmyeb跨账期
	getbamorelist       			  : `${ROOT}/sob/ba/more/list`,
	//利润表多账期
	getincomestatementquarter         : `${ROOT}/sob/report/incomestatementquarter`,
	getincomestatementquarterass	  : `${ROOT}/sob/report/incomestatementquarter/ass`,
	//辅助核算科目是否关连两个辅助核算
	checkHaveDoubleAssFetch           :`${ROOT}/sob/report/assTwo/tree`,
	assKmyueDoubleList           	  :`${ROOT}/sob/report/assTwo/balance`,

	sobOptionInit						: `${ROOT}/sob/get/new`,
	sobOptionSave						: `${ROOT}/sob/save/new`,
	getNewSobList 						: `${ROOT}/sob/list/new`,

	// 获取附件token
	uploadgettoken		              : `${ROOT}/upload/gettoken`,
	modifyUnitDecimalCount				: `${ROOT}/sob/unit/decimalCount/set`,

	// 流水报表导出
	sendTypeExcelDetail               : `${ROOTJR}/jr/excel/send/type/detail`,
	sendTypeExcelbalance              : `${ROOTJR}/jr/excel/send/type/balance`,
	sendAllTypeExcelDetail			  : `${ROOTJR}/jr/excel/send/all/type/detail`,
	sendAccountExcelDetail            : `${ROOTJR}/jr/excel/send/account/detail`,
	sendAccountExcelbalance           : `${ROOTJR}/jr/excel/send/account/balance`,
	sendProjectExcelDetail            : `${ROOTJR}/jr/excel/send/project/balance`,
	sendProjectExcelbalance           : `${ROOTJR}/jr/excel/send/current/project/detail`,
	sendAllProjectExcelDetail         : `${ROOTJR}/jr/excel/send/all/project/detail`,

	sendIncomeExcelbalance            : `${ROOTJR}/jr/excel/send/incomeAndExpense/balance`,
	sendIncomeExcelDetail             : `${ROOTJR}/jr/excel/send/incomeAndExpense/detail`,
	sendAllIncomeExcelDetail		  : `${ROOTJR}/jr/excel/send/all/incomeAndExpense/detail`,
	sendInventoryExcel                : `${ROOTCARD}/data/send/stock`,//存货卡片导出
	exportInventoryExcel              : `${ROOTCARD}/data/send/stock/open`,//存货期初导出


	sendRelativeExcelbalance            : `${ROOTJR}/jr/excel/send/contact/balance`,
	sendRelativeExcelDetail           : `${ROOTJR}/jr/excel/send/contact/detail`,
	sendAllRelativeExcelDetail        : `${ROOTJR}/jr/excel/send/all/contact/detail`,

	sendProjectIncomeExcelbalance            : `${ROOTJR}/jr/excel/send/project/incomeAndExpense/balance`,
	sendProjectIncomeExcelDetail           : `${ROOTJR}/jr/excel/send/project/incomeAndExpense/detail`,
	sendAllProjectIncomeExcelDetail        : `${ROOTJR}/jr/excel/send/all/project/incomeAndExpense/detail`,
	sendInventoryYebExcel               :`${ROOTJR}/jr/excel/send/stock/balance`,
	sendInventoryMxbExcel               :`${ROOTJR}/jr/excel/send/stock/detail`,
}

export default
function fetchApi(type, method, data, callback, loadingtext) {

	fetchFunc(type, method, data, callback, loadingtext, URL)
	// const source = `source=${browserNavigator.versions.android ? 'android' : 'ios'}`
	// let network = 'network=notfetch'
	//
	// if (type === 'getddconfig' || !browserNavigator.versions.DingTalk) {
	// 	fetchLocalApi(type, method, data, callback, loadingtext, network, source)
	// } else {
	// 	thirdParty.getNetworkType({
	// 		onSuccess : (value) => {
	// 			network = `network=${value.result}`
	// 			fetchLocalApi(type, method, data, callback, loadingtext, network, source)
	// 		},
	// 		onFail : (err) => {
	// 			network = 'network=""'
	// 			fetchLocalApi(type, method, data, callback, loadingtext, network, source)
	// 		}
	// 	})
	// }
}


export function getUrlParam (url) {
    const post = url.indexOf('?')
	const endPost = url.indexOf('#/') == -1 ? url.length : url.indexOf('#/')
	let serverMessage = url.slice(post+1, endPost).split('&')

	let _urlParam = {}
	for (let i=0; i < serverMessage.length; i++) {
		const valueList = serverMessage[i].split('=')
		_urlParam[valueList[0]] = valueList[1]
	}
	return _urlParam
}


// function fetchLocalApi(type, method, data = '', callback, loadingtext, network, source) {
//
// 	let url, option
// 	switch (method.toUpperCase()) {
// 		case 'GET':
// 			url = URL[type] + '?' + (data ? [data, network, source].join('&') : [network, source].join('&'))
// 			option = {
// 				credentials: 'include',
// 				headers: {
// 					// 'Accept-Encoding': 'gzip, deflate'
// 				}
// 			}
// 			break
// 		case 'POST':
// 			url = URL[type] + '?' + [network, source].join('&')
// 			option = {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 					// 'Accept-Encoding': 'gzip, deflate'
// 				},
// 				credentials: 'include',
// 				body: data
// 			}
// 			break
// 		default:
// 			return console.error('method is not GET or POST')
// 	}
//
// 	return fetch(url, option)
// 	.then(res => {
// 		if (res.status === 200) {
// 			return res.json()
// 		} else {
// 			return {
// 				code: '-2',
// 				// message: err
// 				message: `通信异常，服务器返回码${res.status}`
// 			}
// 		}
// 	})
// 	.catch(err => {
// 		return {
// 			code: '-2',
// 			message: `系统无响应`
// 		}
// 	})
// 	.then(json => {
// 		// if (global.TRACING) {
// 		// 	alert(method+','+url+','+JSON.stringify(json))
// 		// }
// 		callback(json)
// 	})
// }

// 安全通道版
// export default
// function fetchApi(type, method, data = '', callback, loadingtext) {
// 	const source = `source=${browserNavigator.versions.android ? 'android' : 'ios'}`
//
// 	thirdParty.Alert({
// 		message: 'type:'+type,
// 		buttonName: '确定'
// 	})
//
// 	// 在钉钉里，并且是测试， 并且不是getddconfig请求的走安全通道
// 	if (browserNavigator.versions.DingTalk && type !== 'getddconfig' && ROOT.indexOf('fannixddfe1') > 0) {
//
// 		thirdparty.getNetworkType({
// 			onSuccess : (value) => {
// 				const network = `network=${value.result}`
// 				safePathFetch(type, method, data, callback, loadingtext, network, source)
// 			},
// 			onFail : (err) => {
// 				const network = 'network=""'
// 				safePathFetch(type, method, data, callback, loadingtext, network, source)
// 			}
// 		})
// 	} else {
// 		if (type === 'getddconfig' || !browserNavigator.versions.DingTalk) {
// 			const network = 'network=notfetch'
// 			const sources = 'source=notsource'
// 			fetchLocalApi(type, method, data, callback, loadingtext, network, sources)
//
// 		} else {
// 			thirdparty.getNetworkType({
// 				onSuccess : (value) => {
// 					const network = `network=${value.result}`
// 					fetchLocalApi(type, method, data, callback, loadingtext, network, source)
// 				},
// 				onFail : (err) => {
// 					const network = 'network=""'
// 					fetchLocalApi(type, method, data, callback, loadingtext, network, source)
// 				}
// 			})
// 		}
// 	}
// }
//
// function safePathFetch (type, method, data = '', callback, loadingtext, network, source) {
//
// 	let url, headers
//
// 	alert('url:'+url)
//
// 	switch (method.toUpperCase()) {
// 		case 'GET':
// 			url = URL[type] + '?' + (data ? [data, network, source].join('&') : [network, source].join('&'))
// 			break
// 		case 'POST':
// 			url = URL[type] + '?' + [network, source].join('&')
// 			headers = {
// 				'Content-Type': 'application/json'
// 			}
// 			break
// 		default:
// 			return console.error('method is not GET or POST')
// 	}
// 	// switch (method.toUpperCase()) {
// 	// 	case 'GET':
// 	// 		url = URL[type] + '?' + data
// 	// 		headers = {
// 	// 			'Accept-Encoding': 'gzip, deflate'
// 	// 		}
// 	// 		break
// 	// 	case 'POST':
// 	// 		url = URL[type]
// 	// 		headers = {
// 	// 			'Content-Type': 'application/json',
// 	// 			'Accept-Encoding': 'gzip, deflate'
// 	// 		}
// 	// 		break
// 	// 	default:
// 	// 		return console.error('method is not GET or POST')
// 	// }
//
// 	thirdparty.hidePreloader()
// 	thirdparty.showPreloader({
// 		text: loadingtext ? loadingtext : "使劲加载中.."
// 	})
//
// 	thirdparty.httpOverLwp({
// 		url: url,
// 		headers: headers,
// 		method: method,
// 		body: data,
// 		onSuccess : json => {
//
// 			//alert('httpOverLwp:'+JSON.stringify(json))
// 			thirdparty.hidePreloader()
//
// 			if (browserNavigator.versions.ios) {
// 				if (json.result.code === 200) {
// 					const receivedData = JSON.parse(json.result.body)
// 					callback(receivedData)
// 				} else {
// 					alert(`httpOverLwp通信异常，服务器返回${JSON.stringify(json)}`)
// 				}
// 			} else if (browserNavigator.versions.android) {
// 				if (json.code === 200) {
// 					const receivedData = JSON.parse(json.body)
// 					callback(receivedData)
// 				} else {
// 					alert(`httpOverLwp通信异常，服务器返回${JSON.stringify(json)}`)
// 				}
// 			}
// 		},
// 		onFail : function(err) {
// 			alert(JSON.stringify(err))
// 		}
// 	})
// }
//
// function fetchLocalApi(type, method, data = '', callback, loadingtext, network, source) {
//
// 	let url, option
//
// 	switch (method.toUpperCase()) {
// 		case 'GET':
// 			url = URL[type] + '?' + (data ? [data, network, source].join('&') : [network, source].join('&'))
// 			option = {
// 				credentials: 'include',
// 				headers: {
// 					'Accept-Encoding': 'gzip, deflate'
// 				}
// 			}
// 			break
// 		case 'POST':
// 			url = URL[type] + '?' + [network, source].join('&')
// 			option = {
// 				method: 'POST',
// 				headers: {
// 					'Content-Type': 'application/json',
// 					'Accept-Encoding': 'gzip, deflate'
// 				},
// 				credentials: 'include',
// 				body: data
// 			}
// 			break
// 		default:
// 			return console.error('method is not GET or POST')
// 	}
//
// 	thirdparty.hidePreloader()
// 	thirdparty.showPreloader({
// 		text: loadingtext ? loadingtext : "使劲加载中.."
// 	})
//
// 	return fetch(url, option)
// 	.then(res => {
// 		if (res.status === 200)
// 		{
// 			return res.json()
// 		}
// 		else {
// 			thirdparty.hidePreloader()
// 			return {
// 				code: '-2',
// 				// message: err
// 				message: `通信异常，服务器返回码${res.status}`
// 			}
// 		}
//
// 	})
// 	.catch(err => {
// 		thirdparty.hidePreloader()
// 		return {
// 			code: '-2',
// 			// message: err
// 			message: `系统无响应`
// 		}
// 	})
// 	.then(json => {
// 		thirdparty.hidePreloader()
//
// 		if (global.TRACING) {
// 			alert(method+','+url+','+JSON.stringify(json))
// 		}
//
// 		callback(json)
// 	})
// }
