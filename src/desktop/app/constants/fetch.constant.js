// import 'es6-shim'
import fetchFunc from './fetchFunc'

const href = window.location.href
// 安全域名灰度
const isPre = href.indexOf('desktop.xfannix.com') > 0
// 从路由读取 corpid
const urlParam = getUrlParam(href)
let corpId = urlParam.corpid

const specialCom = [ "dingf45f2aeb902bdb76a1320dcb25e91351", "ding6e88256a939bff83", "ding75d2d8a9cfb940bf" ]
const isSpecial = true

export const XFNVERSION = '3.1.2'
export const ROOTURL = 'http://dtst.xfannix.com'
export let SERVERURL = isPre && isSpecial && urlParam.urlbackup !== 'true' ? 'https://xfannixapp1948.eapps.dingtalkcloud.com' : 'http://papitst.xfannix.com'
export const ROOT = `${SERVERURL}/CWSERVICE`
export const ROOTPKT = `${SERVERURL}/CWPKT`
export const ROOTJR = `${SERVERURL}/CWJR`
export const ROOTLOG = `${SERVERURL}/CWLOG`
export const ROOTCO = `${SERVERURL}/CO`
export const ROOTAUTH = `${SERVERURL}/CWAUTH`

let nameType = 'yz'
// export const ROOT = 'http://172.18.0.12:8100' //jk
// export const ROOTPKT = 'http://172.18.0.174:8081' //j

const URL = {
	// getddconfig			: 'https://fannixddfe1.hz.taeapp.com/XFN-MF' + '/dd/config',
	// getdduserinfo       : 'https://fannixddfe1.hz.taeapp.com/XFN-MF' + '/dd/new/info',
	getddconfig			: `${ROOT}/dd/config`,
	getdduserinfo       : `${ROOT}/dd/new/info`,

	// getdduserinfo       : `${ROOT}/dd/userinfo`,

	// login				: `${ROOT}/u/login/${nameType}`,
	// login				: `https:/yfannixddfe1.hz.taeapp.com/XFN-MF/u/new/login/${nameType}`,
	login				: `${ROOT}/u/new/login/${nameType}`,
	getusercode			: `${ROOT}/u/code/get`,
	getuserlogintemporary : `${ROOT}/u/temporary/login`,
	// getuserinfo			: `${ROOT}/u/info`,
	setlocksecret       : `${ROOT}/u/lock/secret/set`,
	// getuserinfo			: `${ROOT}/u/info`,

	playOpen		    : `${ROOT}/play/open`,
	copyTest		    : `${ROOT}/sob/copy/test`,
	msgTextSend		    : `${ROOT}/msg/text/send`,

	getuserinfo			: `${ROOT}/u/info`,
	getSecurityCenter	: `${ROOT}/security_center/info`,
	saveSecurityCenter	: `${ROOT}/security_center/save`,
	actioninsert		: `${ROOT}/u/action/insert`,
	getAdminNameList	: `${ROOT}/u/get/adminNameList`,
	// getsoblist			: `${ROOT}/sob/list`,
	getsobcopycode		: `${ROOT}/sob/list/copy/code`,
	deletesob			: `${ROOT}/admin/list/delete`,
	getSobSetting		: `${ROOT}/sob/setting/get`,
	sendGuideImage      : `${ROOT}/upload/send/guide/image`,
	checkRoleIsRepeat   : `${ROOT}/sob/check/role`,
	checkwarehousedisable   : `${ROOTPKT}/warehouse/disable/check`,
	getMeasureList			: `${ROOT}/sob/report/customize/incomestatement/test`,
	getJrMeasureList			: `${ROOTJR}/jr/report/xfn/profit/calculate`,
	operationTrafficList  : `${ROOTLOG}/operation/traffic/list`,
	operationUsersList    : `${ROOT}/u/list/user`,
	getPlaySobModelList   : `${ROOT}/play/sob/model/list`,
	deleteExtraMessage		: `${ROOT}/sob/report/customize/income/extra/message/list/delete`,
	deleteJrExtraMessage		: `${ROOTJR}/jr/report/xfn/profit/extra/delete`,

	// 权限
	getrolelist		      : `${ROOTAUTH}/role/list`,
	getrolepermission	  : `${ROOTAUTH}/role/permission`,
	addrole	              : `${ROOTAUTH}/role/save`,
	modifyrole	          : `${ROOTAUTH}/role/modify`,
	deleterole	          : `${ROOTAUTH}/role/delete`,
	modifyrolename	      : `${ROOTAUTH}/role/modify/name`,

	// 审批
	getProcessSelectModel : `${ROOT}/process/select/model`,
	// createProcessModel    : `${ROOT}/process/create/model`,
	// disableProcessModel   : `${ROOT}/process/disable/model`,

	// 付费
	// adminCorpEquity		: `${ROOT}/admin/corp/equity`,
	// payProductInfo		: `${ROOT}/pay/product/info`,
	adminCorpEquity		: `${ROOT}/corp/equity`,
	payProductInfo		: `${ROOT}/pay/product/new/info`,

	payNewOrder			: `${ROOT}/pay/new/order`,
	cancelOrder			: `${ROOT}/pay/cancelOrder`,
	createInvoiceUrl	: `${ROOT}/pay/createInvoice`,//发送发票的表单数据
	trailEquity	        : `${ROOT}/admin/trial/equity`,//发送发票的表单数据
	complete			: `${ROOT}/pay/complete`,//发送发票的表单数据
	refund				: `${ROOT}/pay/refund`,//申请退款

	// 凭证
	getLastVcIndex		: `${ROOT}/sob/vc/index/last`,
	getvc				: `${ROOT}/sob/vc/`,
	getvcpaging			: `${ROOT}/sob/vc/paging`,
	getvclist			: `${ROOT}/sob/vc/list`,
	getaclist			: `${ROOT}/sob/ac/list`,
	getperiod			: `${ROOT}/sob/period`,
	getbalist			: `${ROOT}/sob/ba/list`,
	getbalancesheet		: `${ROOT}/sob/report/balancesheet`,
	getJrAssets			: `${ROOTJR}/jr/report/assets`,
	getincomestatement	: `${ROOT}/sob/report/incomestatement`,
	getJrincomestatement	: `${ROOTJR}/jr/report/profit`,
	getJrProfit			: `${ROOTJR}/jr/report/xfn/profit`,
	getsubsidiaryledger	: `${ROOT}/sob/report/subsidiaryledger`,
	getAsssubsidiaryledger	: `${ROOT}/sob/report/countList/subsidiaryledger/by/ass`,
	getmoresubsidiaryledger    : `${ROOT}/sob/report/more/subsidiaryledger`,
	getmxbaclist		: `${ROOT}/sob/report/subsidiaryledger/aclist`,
	getmxbasslist		: `${ROOT}/sob/report/countList/subsidiaryledger/ass/tree`,
	getmoremxbaclist    : `${ROOT}/sob/report/more/subsidiaryledger/aclist`,
	getbosssheet		: `${ROOT}/sob/report/boss`,
	getasslist			: `${ROOT}/sob/ass/list`,
	getincomestatementass	: `${ROOT}/sob/report/incomestatement/ass`,
	getcachFlow				: `${ROOT}/sob/report/cachFlow`,
	getJrCachFlow				: `${ROOTJR}/jr/report/cashFlow/list`,
	getJrRate				: `${ROOTJR}/jr/report/rate`,
	getSelfTypeListData     : `${ROOT}/sob/report/customize/incomestatement`,
	getSelfTypeListExtraMessage: `${ROOT}/sob/report/customize/income/extra/message/list`,
	getJrExtraMessage		: `${ROOTJR}/jr/report/xfn/profit/extra/list`,
	getIncomestatementCustomize	: `${ROOT}/sob/report/customize/incomestatement`,
	setExtraMessageList			: `${ROOT}/sob/report/customize/income/extra/message/list/set`,
	setJrExtraMessageList			: `${ROOTJR}/jr/report/xfn/profit/extra/modify`,
	getassinput         : `${ROOT}/sob/ass/insert/before`,
	getAcMoreColumn     :`${ROOT}/sob/report/ac/more/column`,
	// 明细余额
	getreportacbalance  : `${ROOT}/sob/report/ac/balance`,
	getreportacdetailtree : `${ROOT}/sob/report/ac/detail/tree`,
	getreportacdetail   : `${ROOT}/sob/report/ac/detail`,
	getreportacdetailcolumn   : `${ROOT}/sob/report/ac/detail/column`,

	// 期初列表
	getbainitlist     	: `${ROOT}/sob/ba/init/list`,
	getbamorelist       : `${ROOT}/sob/ba/more/list`,

	insertass			: `${ROOT}/sob/ass/insert`,
	insertac			: `${ROOT}/sob/ac/insert`,
	insertVc			: `${ROOT}/sob/vc/insert`,
	insertsob			: `${ROOT}/sob/insert`,
	insertdraft			: `${ROOT}/sob/vc/model/insert`,
	getdraftlist		: `${ROOT}/sob/vc/model/list`,
	modifydraft			: `${ROOT}/sob/vc/model/modify`,
	deletedraft			: `${ROOT}/sob/vc/model/list/delete`,
	lockdraft			: `${ROOT}/sob/vc/model/lock`,
	unlockdraft			: `${ROOT}/sob/vc/model/unlock`,
	getdraft			: `${ROOT}/sob/vc/model/get`,

	modifyass			: `${ROOT}/sob/ass/modify`,
	modifyac			: `${ROOT}/sob/ac/modify`,
	modifyVc			: `${ROOT}/sob/vc/modify`,
	reviewVc			: `${ROOT}/sob/vc/review`,
	cancelReviewVc		: `${ROOT}/sob/vc/backReview`,
	sortvc				: `${ROOT}/sob/vc/sort`,
	modifysob			: `${ROOT}/sob/modify`,

	deleteac			: `${ROOT}/sob/ac/list/delete`,
	deletevc			: `${ROOT}/sob/vc/list/delete`,
	transferDraftPz		: `${ROOT}/sob/vc/model/transfer`,

	setdefaultsobid		: `${ROOT}/u/default/modify`,
	getbainit 			: `${ROOT}/sob/ba/init`,
	// initba				: `${ROOT}/sob/ba/init`,
	gettrailbalance		: `${ROOT}/sob/ba/trail/balance`,

	closesob			: `${ROOT}/sob/close`,
	opensob				: `${ROOT}/sob/open`,

	assCheck			: `${ROOT}/sob/ass/regret/check`,
	assRegret 			: `${ROOT}/sob/ass/regret/ass`,
	relateass 			: `${ROOT}/sob/ass/relate`,
	deleteass			: `${ROOT}/sob/ass/list/delete`,
	excelexport         : `${ROOT}/excel/export`,
	reportassac         : `${ROOT}/sob/report/ass/ac`,
	reportassdetail     : `${ROOT}/sob/report/ass/detail`,
	reportassbalance    : `${ROOT}/sob/report/ass/balance`,
	reportacregretcheck : `${ROOT}/sob/ac/regret/check`,
	acregretcheckNum1    : `${ROOT}/sob/ac/regret/check/Num1`,
	acregretcheckNum2    : `${ROOT}/sob/ac/regret/check/Num2`,
	acregretuseNum    : `${ROOT}/sob/ac/regret/use/Num`,
	changeAssCategoryName: `${ROOT}/sob/ass/category/modify`,

	reportacregretuse   : `${ROOT}/sob/ac/regret/use`,

	cxpzpdfexport 		: `${ROOT}/pdf/send`,
	excelsend   		: `${ROOT}/excel/send`,
	excelJrAssetsSend   : `${ROOTJR}/jr/excel/send/assets`,
	// kmyebexcelsend   	: `${ROOT}/excel/send/acBalance`,
	kmyebexcelsend   	: `${ROOT}/sob/report/ac/balance/excel/send`,
	lrbambexcelsend   	: `${ROOT}/excel/send/AMB`,
	// mxbexcelsuball   	: `${ROOT}/excel/send/SubAll`,
	mxbexcelsuball   	: `${ROOT}/sob/report/ac/detail/all/excel/send`,
	// mxbexcelsubone   	: `${ROOT}/excel/send/SubOne`,
	mxbexcelsubone   	: `${ROOT}/sob/report/ac/detail/one/excel/send`,
	qcyeexcelsend		: `${ROOT}/excel/send/periodBas`,
	assmxbexcelsuball   : `${ROOT}/excel/send/AssSubAll`,
	assmxbexcelsubone   : `${ROOT}/excel/send/AssSubOne`,
	asskmyebexcelsend	: `${ROOT}/excel/send/assba`,
	excelsendall		: `${ROOT}/excel/send/all`,
	excelcashFlow		: `${ROOT}/excel/send/cashFlow`,
	excelJrcashFlow		: `${ROOTJR}/jr/excel/send/cashFlow`,
	excelcountBa		: `${ROOT}/excel/send/countBa`,
	excelcountBaAss		: `${ROOT}/excel/send/countBa/by/ass`,
	excelcountSunOne	: `${ROOT}/excel/send/countSunOne`,
	excelcountSunOneAss	: `${ROOT}/excel/send/countSubOne/by/ass`,
	excelcountSubAll	: `${ROOT}/excel/send/countSubAll`,
	excelcountSubAllAss	: `${ROOT}/excel/export/countSubAll/by/ass`,
	excelclassification	: `${ROOT}/excel/send/classification`,
	excelcard  			: `${ROOT}/excel/send/card`,
	taxPayTableExcel    : `${ROOT}/excel/send/payTaxTable`,
	taxJrPayTableExcel    : `${ROOTJR}/jr/excel/send/rate`,
	excelAssetsBalance  : `${ROOT}/excel/send/AssetsBalance`,
	excelAMBIncome  	: `${ROOT}/excel/send/AMBIncome`,
	excelAMBSYBIncome   : `${ROOT}/excel/send/project/AMBIncome`,
	excelFcBa  			: `${ROOT}/excel/send/fcBa`,
	excelAssertSub  	: `${ROOT}/excel/send/assertSub`,
	excelFcSubOne  		: `${ROOT}/excel/send/fcSubOne`,
	// excelExportLedger   : `${ROOT}/excel/send/ledger`,
	excelExportLedger   : `${ROOT}/sob/report/ac/detail/ledger/excel/send`,
	excelXiaoFanLrb     :`${ROOT}/excel/send/customize/incomestatement`,
	excelJrProfit     :`${ROOTJR}/jr/excel/send/profit`,
	excelXfnProfit     :`${ROOTJR}/jr/excel/send/xfn/profit`,

	pdfcountBaAss		: `${ROOT}/pdf/send/exportCountBa/by/ass`,
	// pdfkmyeexport		: `${ROOT}/pdf/send/exportacbalancepdf`,
	pdfkmyeexport		: `${ROOT}/sob/report/ac/balance/pdf/send`,
	pdfzcfzexport		: `${ROOT}/pdf/send/exportbasheetpdf`,
	pdfJrAssetsSend		: `${ROOTJR}/jr/pdf/send/assets`,
	pdflrbexport		: `${ROOT}/pdf/send/exportincomepdf`,
	pdfJrProfit			: `${ROOTJR}/jr/pdf/send/profit`,
	pdflrbincomepdfquarter : `${ROOT}/pdf/send/exportincomepdfquarter`,
	// pdfmxbexport		: `${ROOT}/pdf/send/exportsubpdf`,
	pdfmxbexport		: `${ROOT}/sob/report/ac/detail/one/pdf/send`,
	pdfassmxballexport	: `${ROOT}/pdf/send/exportsubassall`,
	pdfassmxboneexport	: `${ROOT}/pdf/send/exportsubass`,
	pdfasswbaexport	    : `${ROOT}/pdf/send/exportassba`,
	pdfCashFlow	        : `${ROOT}/pdf/send/exportCashFlow`,
	pdfJrCashFlow	        : `${ROOTJR}/jr/pdf/send/cashFlow`,
	pdfCountBa	        : `${ROOT}/pdf/send/exportCountBa`,
	pdfCountSub	        : `${ROOT}/pdf/send/exportCountSub`,
	pdfCountSubAss	        : `${ROOT}/pdf/send/exportCountBa/by/ass`,
	// pdfExportLedger	    : `${ROOT}/pdf/send/exportLedger`,
	pdfExportLedger	    : `${ROOT}/sob/report/ac/detail/ledger/first/pdf/send`,
	pdfTaxPayTable      : `${ROOT}/pdf/send/taxPayTable`,
	// pdfVcAll      		: `${ROOT}/pdf/send/VcAll`,
	pdfVcAll      		: `${ROOT}/sob/report/ac/balance/vc/pdf/send`,
	pdfAssetsBa    		: `${ROOT}/pdf/send/assertsBa`,
	pdfFcBa 		   	: `${ROOT}/pdf/send/FcBa`,
	pdfAssertSub 		: `${ROOT}/pdf/send/assertSub`,
	pdfFcSub 			: `${ROOT}/pdf/send/fcSub`,
	// pdfAcSub 			: `${ROOT}/pdf/send/AcSub`,
	pdfAcSub 			: `${ROOT}/sob/report/ac/detail/all/first/pdf/send`,
	// pdfSecondAcSub      : `${ROOT}/pdf/send/SecondAcSub`,
	pdfSecondAcSub      : `${ROOT}/sob/report/ac/detail/all/second/pdf/send`,
	// pdfExportLedger2    : `${ROOT}/pdf/send/exportLedger2`,
	pdfExportLedger2    : `${ROOT}/sob/report/ac/detail/ledger/second/pdf/send`,
	pzsendFailExcel     : `${ROOT}/excel/send/failExcel`,
	acdetailonevcexcel  : `${ROOT}/sob/report/ac/detail/one/vc/excel/send`,

	getAmountData       : `${ROOT}/sob/ac/direction`,//lrpz的数量一栏的信息
	getCountList		: `${ROOT}/sob/report/countList`,//数量余额表
	getMoreCountList	: `${ROOT}/sob/report/moreCount/list`,//数量余额表
	getAmmxbTree		: `${ROOT}/sob/report/count/acList`,//数量明细表科目树的数据

	getassetslist		    : `${ROOT}/fixed_assets/getList`,
	getclassification       : `${ROOT}/fixed_assets/classification/get`,
	insertclassification    : `${ROOT}/fixed_assets/classification/insert`,
	modifyclassification    : `${ROOT}/fixed_assets/classification/modify`,
	initclassification  	: `${ROOT}/fixed_assets/classification/init`,
	getassetscard        	: `${ROOT}/fixed_assets/card/get`,
	insertassetscard		: `${ROOT}/fixed_assets/card/insert`,
	copyassetscard			: `${ROOT}/fixed_assets/card/copy`,
	modifyassetscard		: `${ROOT}/fixed_assets/card/modify`,
	// deleteassetscard		: `${ROOT}/fixed_assets/card/list/delete`,
	deleteclassification 	: `${ROOT}/fixed_assets/classification/list/delete`,
	getmaxcardnumber		: `${ROOT}/fixed_assets/card/getMaxCardNumber`,
	clearcard				: `${ROOT}/fixed_assets/card/clearCard`,
	cancelclearcard			: `${ROOT}/fixed_assets/card/cancelClearCard`,

	getassetsdetail    		: `${ROOT}/fixed_assets/detail/getAssetsDetail`,
	getlabelList    		: `${ROOT}/fixed_assets/card/getLabelList`,
	getasstree              : `${ROOT}/fixed_assets/detail/tree`,
	getcardlist             : `${ROOT}/fixed_assets/card/list/Number`,
	getcardlistbylabel      : `${ROOT}/fixed_assets/card/list/label`,
	deletecard              : `${ROOT}/fixed_assets/card/list/delete`,
	//资产类别
	getSortList             : `${ROOT}/fixed_assets/classification/get/list`,
	deletesort              : `${ROOT}/fixed_assets/classification/list/delete`,
	//折旧摊新余额表
	getDetailAssets			:`${ROOT}/fixed_assets/detail/getAssetsBalanceReport`,
	//折旧摊新明细表
	getMxList			    :`${ROOT}/fixed_assets/detail/getAssetsDetailReport`,

	getinitincomestatement 			  : `${ROOT}/sob/report/get/incomestatement/init`,
	getJrinitincomestatement 			  : `${ROOTJR}/jr/report/profit/balance/list`,

	incomestatementinit				  : `${ROOT}/sob/report/incomestatement/init`,
	incomeJrstatementinit				  : `${ROOTJR}/jr/report/profit/balance/modify`,
	getincomestatementquarter         : `${ROOT}/sob/report/incomestatementquarter`,
	getincomestatementquarterass	  : `${ROOT}/sob/report/incomestatementquarter/ass`,
	getInitBaSheet	  	  			  : `${ROOT}/sob/report/baSheet/init`,
	assetsBalanceModify	  	  			  : `${ROOTJR}/jr/report/assets/balance/modify`,
	getAcCloseBalance                 : `${ROOT}/sob/ac/close/balance`,


	//附件管理
	uploadgettoken		              : `${ROOT}/upload/gettoken`,
	uploadgetfile					  : `${ROOT}/upload/getFilePath`,
	modifyFile                        : `${ROOT}/upload/modifyFile`,
	getFjData                         : `${ROOT}/upload/getEnList`,
	deleteFj                          : `${ROOT}/upload/deleteFilePath`,
	getFjLabelData                    : `${ROOT}/upload/getLabel`,
	initLabel                         : `${ROOT}/upload/initLabel`,
	updateLabel                       : `${ROOTPKT}/enclosure/updateLabel`,
	checkEnclosureList                : `${ROOT}/upload/checkEnIsUser`,
	fjglDown                          : `${ROOT}/upload/downLoadZipFile`,
	// uploadaddfile					  : `${ROOT}/upload/addfile`,
	uploadGetEnclosure 				  : `${ROOT}/upload/getEnclosure`,
	insertEnclosure				      : `${ROOTPKT}/enclosure/insert`,
	enclosureDownLoadNative			  : `${ROOT}/upload/downLoadNative`,
	aliyunOssPolicy                   : `${ROOTPKT}/aliyun/oss/policy`,

	//应交税金表
	getSjbData                        : `${ROOT}/sob/report/taxPayTable`,
	getYjsfbData					  : `${ROOT}/sob/report/payTaxTable`,
	//辅助核算余额表科目的数据
	getAssYebTree                     : `${ROOT}/sob/report/ass/balance/tree`,

	AMBPcIncomeStatement              : `${ROOT}/sob/report/AMBPcIncomeStatement`,
	asslistforamb                     : `${ROOT}/sob/ass/list/for/amb`,
	assgetAMB			              : `${ROOT}/sob/ass/getAMB`,
	assrelateAMB		              : `${ROOT}/sob/ass/relateAMB`,
	AMBAcDetail		             	  : `${ROOT}/sob/report/AMBPcIncomeStatement/acDetail`,
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
	// 现金流量表调整请求
	getInitXjllbFetch                 :`${ROOT}/sob/report/get/cashFlow/init`,
	getInitJrXjllbFetch                 :`${ROOTJR}/jr/report/cashFlow/balance/list`,
	saveInitXjllbFetch                :`${ROOT}/sob/report/cashFlow/init`,
	saveInitJrXjllbFetch                :`${ROOTJR}/jr/report/cashFlow/balance/modify`,
	//账套日志
	getLogListFetch					  :`${ROOT}/sob/getUserOperateInfo`,

	excelLog						  :`${ROOT}/excel/send/userOperate`,

	//辅助核算科目是否关连两个辅助核算
	checkHaveDoubleAssFetch           :`${ROOT}/sob/report/assTwo/tree`,
	assKmyueDoubleList           	  :`${ROOT}/sob/report/assTwo/balance`,
	getAmountKmyueList          		:`${ROOT}/sob/report/countList/list/by/ass`,
	getMoreAmountKmyueList          		:`${ROOT}/sob/report/moreCount/list/by/ass`,
	getAmountKmTree					:`${ROOT}/sob/report/number/balance/tree`,
	getAmountAssTwoTree				:`${ROOT}/sob/report/number/assTwo/tree`,
	getAmountAssTwoKmyueList  			:`${ROOT}/sob/report/countList/list/by/two/ass`,
	// 文件导入
	acImport                          : `${ROOT}/excel/import/ac/new`,
	acImportProgress                  : `${ROOT}/excel/import/progress`,
	assImport                         : `${ROOT}/excel/import/ass/new`,
	vcImport                          : `${ROOT}/excel/import/vc/new`,
	periodBaImport                    : `${ROOT}/excel/import/periodBa/new`,
	assetCardImport                   : `${ROOT}/excel/import/card/new`,
	assetClassImport                  : `${ROOT}/excel/import/assets/new`,
	downVcError                  	  : `${ROOT}/excel/import/vc/error`,


	// // 流水账
	// getRunningCategory           	  :`${ROOT}/running/category/list`,
	// getRunningDetail				  :`${ROOT}/running/category/get`,
	// insertRunningCategory             :`${ROOT}/running/category/insert`,
	// modifyRunningCategory             :`${ROOT}/running/category/modify`,
	// deleteRunningCategory             :`${ROOT}/running/category/delete`,
	//
	// getRunningAccount           	  :`${ROOT}/running/account/list`,
	// insertRunningAccount              :`${ROOT}/running/account/insert`,
	// modifyRunningAccount              :`${ROOT}/running/account/modify`,
	// deleteRunningAccount              :`${ROOT}/running/account/delete`,
	//
	// getRunningTaxRate           	  :`${ROOT}/running/rate/get`,
	// modifyRunningTaxRate              :`${ROOT}/running/rate/modify`,
	//
	// getRunningSettingInfo             :`${ROOT}/running/setting/info`,
	//
	// insertRunningbusiness             :`${ROOT}/running/business/insert`,
	// modifyRunningbusiness             :`${ROOT}/running/business/modify`,
	// deleteRunningbusiness             :`${ROOT}/running/business/delete`,
	// getRunningDutyList                :`${ROOT}/running/business/duty/list`,
	// getRunningAccountInfo             :`${ROOT}/running/business/account/info`, //有定金时获取金额
	// getOutPutTax					  :`${ROOT}/running/business/outPut/tax`,
	// getPaymentInfo                    :`${ROOT}/running/business/payment/info`,
	// getIncomeTax                      :`${ROOT}/running/business/income/tax`,
	// insertRunningpayment              :`${ROOT}/running/payment/insert`,
	// modifyRunningpayment              :`${ROOT}/running/payment/modify`,
	// deleteRunningpayment              :`${ROOT}/running/payment/delete`,
	// getRunningPaymentList             :`${ROOT}/running/payment/list`,
	// getRunningmanagementedList        :`${ROOT}/running/managemented/list`,
	// getRunningBusinessList			  :`${ROOT}/running/business/list`,
	// getRunningBusiness				  :`${ROOT}/running/business/get`,
	// getRunningBusinessDuty            :`${ROOT}/running/business/duty/get`,
	// getRunningPayment                 :`${ROOT}/running/payment/get`,
	// insertRunningBusinessVc           :`${ROOT}/running/business/vc/insert`,
	// insertRunningPaymentVc            :`${ROOT}/running/payment/vc/insert`,
	// getManageList					  :`${ROOT}/running/business/manage/list`,
	// getBusinessAssList                :`${ROOT}/running/business/ass/list`,
	// getBusinessVATInfo				  :`${ROOT}/running/business/VAT/info`,
	//
	// // 余额明细
	// getBusinessDetailList                : `${ROOT}/running/business/detail/list`,
	// getBusinessBalanceList               : `${ROOT}/running/business/balance/list`,
	// getRunningDetailCategory             : `${ROOT}/running/business/detail/category`,
	//
	// // 成本结转
	// getCarryoverList                  : `${ROOT}/running/business/carryover/list`,
	// insertCarryoverItem               : `${ROOT}/running/business/carryover/insert`,
	// modifyCarryoverItem               : `${ROOT}/running/business/carryover/modify`,
	// // 发票认证
	// getBusinessAuthList               : `${ROOT}/running/business/auth/list`,
	// insertBusinessAuthItem            : `${ROOT}/running/business/auth/insert`,
	// modifyBusinessAuthItem            : `${ROOT}/running/business/auth/modify`,
	// // 开具发票
	// getBusinessMakeoutList               : `${ROOT}/running/business/makeout/list`,
	// insertBusinessMakeoutItem            : `${ROOT}/running/business/makeout/insert`,
	// modifyBusinessMakeoutItem            : `${ROOT}/running/business/makeout/modify`,
	// // 转出未交增值税
	// getBusinessTurnoutList               : `${ROOT}/running/business/turnout/list`,
	// insertBusinessTurnoutItem            : `${ROOT}/running/business/turnout/insert`,
	// modifyBusinessTurnoutItem            : `${ROOT}/running/business/turnout/modify`,
	//账套设置
	sobOptionInit						: `${ROOT}/sob/get/new`,
	sobOptionSave						: `${ROOT}/sob/save/new`,
	getNewSobList 						: `${ROOT}/sob/list/new`,
	modifyUnitDecimalCount				: `${ROOT}/sob/unit/decimalCount/set`,

	// 导出
	sendTypeExcelDetail                 : `${ROOTJR}/jr/excel/send/type/detail`,
	sendTypeExcelbalance                : `${ROOTJR}/jr/excel/send/type/balance`,
	sendAllTypeExcelDetail				: `${ROOTJR}/jr/excel/send/all/type/detail`,
	sendAccountExcelDetail            : `${ROOTJR}/jr/excel/send/account/detail`,
	excelcountSubAllByAss	: `${ROOT}/excel/send/countSubAll/by/ass`,
	sendAccountExcelbalance           : `${ROOTJR}/jr/excel/send/account/balance`,

	sendProjectExcelDetail            : `${ROOTJR}/jr/excel/send/project/balance`,
	sendProjectExcelbalance           : `${ROOTJR}/jr/excel/send/current/project/detail`,
	sendIncomeExcelbalance            : `${ROOTJR}/jr/excel/send/incomeAndExpense/balance`,
	sendIncomeExcelDetail           : `${ROOTJR}/jr/excel/send/incomeAndExpense/detail`,
	sendAllIncomeExcelDetail				: `${ROOTJR}/jr/excel/send/all/incomeAndExpense/detail`,
	sendAllProjectExcelDetail        : `${ROOTJR}/jr/excel/send/all/project/detail`,
	sendRelativeExcelbalance            : `${ROOTJR}/jr/excel/send/contact/balance`,
	sendRelativeExcelDetail           : `${ROOTJR}/jr/excel/send/contact/detail`,
	sendAllRelativeExcelDetail        : `${ROOTJR}/jr/excel/send/all/contact/detail`,

	sendProjectIncomeExcelbalance            : `${ROOTJR}/jr/excel/send/project/incomeAndExpense/balance`,
	sendProjectIncomeExcelDetail           : `${ROOTJR}/jr/excel/send/project/incomeAndExpense/detail`,
	sendAllProjectIncomeExcelDetail        : `${ROOTJR}/jr/excel/send/all/project/incomeAndExpense/detail`,
	sendInventortYebStockBalance           :`${ROOTJR}/jr/excel/send/stock/balance`,
	sendInventortMxbStockBalance           :`${ROOTJR}/jr/excel/send/stock/detail`,

	sendExcelStockAdjustment        	   :`${ROOTPKT}/data/send/jr/inventory/adjustment`,
	sendPdfStockAdjustment				   :`${ROOTPKT}/pdf/send/jr/inventory/adjustment`,

	sendExcelCarroverAdjustment				   :`${ROOTJR}/jr/excel/send/carryover/adjustment`,
	sendPdfCarroverAdjustment				   :`${ROOTJR}/jr/pdf/send/carryover/adjustment`,
	//附件管理
	runningEnclosure                    : `${ROOTPKT}/water/enclosure/list`,
	exportEncloseure					: `${ROOTCO}/water/enclosure/export`,
	exportEnclosureList					: `${ROOTPKT}/water/enclosure/export/list`,
    exportEnclosureProgress             : `${ROOTCO}/water/enclosure/export/progress`,
    insertVcList         		        : `${ROOTJR}/jr/vc/insert`,
    deleteVcList         		        : `${ROOTJR}/jr/vc/delete`,
	getEnclosureTagList                 : `${ROOTPKT}/enclosure/label/list`,
	modifyEnclosureLabel                : `${ROOTPKT}/enclosure/label/modify`,
	insertNewEnclosureLabel          	: `${ROOTPKT}/enclosure/label/insert`,
	deleteEnclosureLabel				: `${ROOTPKT}/enclosure/label/delete`,
	deleteEnclosureList                 : `${ROOTPKT}/water/enclosure/delete/list`,
	deleteEnclosureExportList           : `${ROOTPKT}/water/enclosure/export/delete/list`,

	//仓库余额
	getInventoryYebData               :`${ROOTJR}/jr/report/stock/balance`,
	getStockQuantity                  :`${ROOTJR}/jr/report/stock/quantity`, //存货列表
	getStockCategory				  :`${ROOTJR}/jr/report/stock/category`, //存货类别树
    getStockStore                     :`${ROOTJR}/jr/report/stock/store`,  //仓库树
    getInventoryTypeList			  :`${ROOTJR}/jr/report/stock/type`,  //类型树
    getInventoryYebDecimalScale			  :`${ROOTJR}/jr/report/stock/decimal/scale/get`,  //获取库存数量单价单位
    modifyInventoryYebDecimalScale			  :`${ROOTJR}/jr/report/stock/decimal/scale/modify`,  //修改库存数量单价单位

	insertPoundage             		: `${ROOTJR}/account/poundage/insert`,
	modifyPoundage             		: `${ROOTJR}/account/poundage/modify`,
	getPoundage             		: `${ROOTJR}/account/poundage/get`,

	//pdf打印
	pdfPrint									:`${ROOT}/pdf/vc/print`,
	JrPdfPrint		  				: `${ROOTJR}/jr/pdf/print/jrOri`,

	getSyxmbData                    :`${ROOT}/sob/report/project/AMBPcIncomeStatement`,
	getSyxmbAcDetail				:`${ROOT}/sob/report/project/AMBPcIncomeStatement/acDetail`,
	getSyxmbCardList                :`${ROOTJR}/jr/AMB/card/list`
}

export default
function fetchApi(type, method, data, callback) {
	// console.log('type', type);
	fetchFunc(type, method, data, callback, URL)
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
//
// fetch('http://10.0.0.99:3000/dd/setsuitticket?signature=c40d41cf79b099da27f1b2114f7e652071b8a001&timestamp=1468139698135&nonce=miHtFJtC',
// {
// 	method: 'POST',
// 	headers: {
// 		'Content-Type': 'application/json'
// 	},
// 	credentials: 'include',
// 	body: JSON.stringify({"encrypt":"MiiyJyo2NY337Npvr3nX675AWI/i1NW9jgzDyJDeeWN6p5dilupVpH/KQl8BZNeoFEwcM5ny4umG9UUe/wPN4OO9B6zjsyF2zx4ktowMegXaP4N8k+5bUT/BE2JFKFlOoY4SOZwP70Wr/FS7eSuCnUxFwS9ojstNFIsDrJqRoI5f2osa9T8D8YSKd6wqUqmOVdjsYj6h6hDm/Xq7WgtP7g=="})
// })
//

// const code = '211e02556740139782'
// fetchApi('getdduserinfo', 'POST', JSON.stringify({code}), json => {
// 	alert('getdduserinfo----' + json.code)
// 	json.code === 0 && fetchApi('getuserinfo', 'POST', JSON.stringify({}), json => {
//
// 	})
// })
