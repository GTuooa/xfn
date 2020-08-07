// import 'es6-shim'
import fetchFunc from './fetchFunc'

import { SERVERURL } from './fetch.constant.js'
export const ROOTGL =  `${SERVERURL}/CWSERVICE`
export const ROOT = `${SERVERURL}/CWJR`
export const ROOTPKT = `${SERVERURL}/CWPKT`
export const ROOTAPPROVAL = `${SERVERURL}/CWPROCESS`
// export const ROOTGL = 'http://172.18.0.12:8082'
// export const ROOT = 'http://172.18.0.12:8080'
// export const ROOTPKT = 'http://172.18.0.12:8081'
// export const ROOTAPPROVAL = 'http://172.18.0.12:8083'

 //export const ROOT = 'http://172.18.0.252:8080' //jk
 //export const ROOTPKT = 'http://172.18.0.252:8081'

const URL = {
	// 发送消息
	msgTextSend		                     : `${ROOTGL}/msg/text/send`,
	//往来单位管理
	getIUManageTypeContent               : `${ROOTPKT}/current_unit/category/get`,
	saveIUManageHighType                 : `${ROOTPKT}/current_unit/category/insert`,
	getIUManageListTitle				 : `${ROOTPKT}/current_unit/category/list`,
	getIUManageTreeByType	             : `${ROOTPKT}/current_unit/category/subordinate/list`,
	getIUManagetTreeSingleType           : `${ROOTPKT}/current_unit/category/subordinate/get/one`,
	saveIUManageType                     : `${ROOTPKT}/current_unit/category/subordinate/insert`,
	saveIUManageCard                     : `${ROOTPKT}/current_unit/card/insert`,
	editIUManageCard                     : `${ROOTPKT}/current_unit/card/modify`,
	getIUmanageListAll                   : `${ROOTPKT}/current_unit/card/list`,
	getIUmanageListBySontype             : `${ROOTPKT}/current_unit/card/list/by/subordinate`,
	getIUManageOneCardInfo               : `${ROOTPKT}/current_unit/card/get/one`,
	deleteIUManageHighType               : `${ROOTPKT}/current_unit/category/delete`,
	deleteIUManageTreeList               : `${ROOTPKT}/current_unit/category/subordinate/delete/list`,
	deleteIUManageListCard               : `${ROOTPKT}/current_unit/card/delete/list`,
	switchCardStatus                     : `${ROOTPKT}/current_unit/card/status/modify`,
	swapIUmanageTypePosition             : `${ROOTPKT}/current_unit/category/subordinate/adjust`,
	adjustIUmanageCardTypeList           : `${ROOTPKT}/current_unit/card/subordinate/adjust`,
	adjustIUmanageCardTitleSame          : `${ROOTPKT}/current_unit/card/name/repeat`,
	adjustIUmanageTypeTitleSame          : `${ROOTPKT}/current_unit/category/subordinate/name/repeat`,
	getIUManageUndefienCard              : `${ROOTPKT}/default_ac/get`,
	editIUManageUndefienCard             : `${ROOTPKT}/default_ac/current/modify`,
	getIUManageCardLimitAndAc			 : `${ROOTPKT}/default_ac/card/insert/before`,
	//存货设置
	getAssistList			  			 :`${ROOTPKT}/assist/list`,
	getInventoryAssistList			  	 :`${ROOTPKT}/inventory/assist/list`,
	insertInventoryHighType              : `${ROOTPKT}/inventory/category/insert`,
	getInventoryHighTypeList             : `${ROOTPKT}/inventory/category/list`,
	getOneInventorySettingHighType       : `${ROOTPKT}/inventory/category/get`,
	deleteInventorySettingHighType       : `${ROOTPKT}/inventory/category/delete`,
	addInventorySettingCardType          : `${ROOTPKT}/inventory/category/subordinate/insert`,
	getInventorySettingCardTypeList      : `${ROOTPKT}/inventory/category/subordinate/list`,
	getInventorySettingOneCardType       : `${ROOTPKT}/inventory/category/subordinate/get/one`,
	deleteInventorySettingOneCardType    : `${ROOTPKT}/inventory/category/subordinate/delete`,
	addInventorySettingCard              : `${ROOTPKT}/inventory/card/insert`,
	editInventorySettingCard             : `${ROOTPKT}/inventory/card/modify`,
	getInventorySettingCardList          : `${ROOTPKT}/inventory/card/list`,
	getInventorySettingOneCard           : `${ROOTPKT}/inventory/card/get/one`,
	deleteInventorySettingCardList       : `${ROOTPKT}/inventory/card/delete/list`,
	deleteInventoryCheck      			: `${ROOTPKT}/inventory/card/delete/list/check`,
	modifyInventorySettingCardUsedStatus : `${ROOTPKT}/inventory/card/status/modify`,
	modifyInventoryAssemblyOpen			: `${ROOTPKT}/assembly/open`,
	modifyInventoryAssemblyClose		: `${ROOTPKT}/assembly/close`,
	getInventorySettingCardListByType    : `${ROOTPKT}/inventory/card/list/by/subordinate`,
	adjustInventorySettingCardTypeList   : `${ROOTPKT}/inventory/card/subordinate/adjust`,
	adjustInventorySettingCardTitleSame  : `${ROOTPKT}/inventory/card/name/repeat`,
	adjustInventorySettingTypeTitleSame  : `${ROOTPKT}/inventory/category/subordinate/name/repeat`,
	getInventorySettingUndefienCard      : `${ROOTPKT}/default_ac/get`,
	editInventorySettingUndefienCard     : `${ROOTPKT}/default_ac/inventory/modify`,
	swapInventorySettingTypePosition     : `${ROOTPKT}/inventory/category/subordinate/adjust`,
	getUnitList     				: `${ROOTPKT}/unit/list`,
	saveDefaultPrice     				: `${ROOTPKT}/unit/default/price/save`,
	getInSerialList   				: `${ROOTPKT}/inventory/serial/list/in`,
	getBatchList   				: `${ROOTPKT}/inventory/batch/list`,
	deleteBatch   				: `${ROOTPKT}/inventory/batch/delete`,
	toggleBatch   				: `${ROOTPKT}/inventory/batch/modify/status`,

	//项目设置
	getProjectConfigHighType			 : `${ROOTPKT}/project/category/list`,
	getProjectConfigHighTypeSob			 : `${ROOTPKT}/project/top/category/list`,
	getProjectConfigHighTypeOne			 : `${ROOTPKT}/project/category/get`,
	modifyProjectConfigHighType          : `${ROOTPKT}/project/category/modify`,
	getProjectTree						 : `${ROOTPKT}/project/category/subordinate/list`,
	getProjectTreeOne  					 : `${ROOTPKT}/project/category/subordinate/get/one`,
	insertProjectTreeOne  				 : `${ROOTPKT}/project/category/subordinate/insert`,
	adjustProjectTypeNameSame 			 : `${ROOTPKT}/project/category/subordinate/name/repeat`,
	swapProjectTypePosition              : `${ROOTPKT}/project/category/subordinate/adjust`,
	deleteProjectType              		 : `${ROOTPKT}/project/category/subordinate/delete/list`,
	insertProjectCard					 : `${ROOTPKT}/project/card/insert`,
	adjustProjectCardNameSame 			 : `${ROOTPKT}/project/card/name/repeat`,
	getProjectListAndTree				 : `${ROOTPKT}/project/card/list`,
	getProjectCardOne					 : `${ROOTPKT}/project/card/get/one`,
	changeProjectCardUsedStatus			 : `${ROOTPKT}/project/card/status/modify`,
	deleteProjectCard					 : `${ROOTPKT}/project/card/delete/list`,
	getProjectCardByType				 : `${ROOTPKT}/project/card/list/by/subordinate`,
	adjustProjectCardType				 : `${ROOTPKT}/project/card/subordinate/adjust`,
	editProjectCard						 : `${ROOTPKT}/project/card/modify`,
	getProjectCardList					:`${ROOTPKT}/running/project/card/list/by/category`,
	getProjectTreeList					:`${ROOTPKT}/running/project/category/tree/list`,
	getProjectAllTreeList					:`${ROOTPKT}/running/project/all/category/tree/list`,
	getProjectSubordinateCardList			:`${ROOTPKT}/running/project/card/list/by/subordinate`,
	getDefaultProjectCode        	 : `${ROOTPKT}/default_ac/get/project/code/for/water`,

	//账户设置
	getRunningAccount           	  : `${ROOTPKT}/account/list`,
	insertRunningAccount              : `${ROOTPKT}/account/insert`,
	modifyRunningAccount              : `${ROOTPKT}/account/modify`,
	deleteRunningAccount              : `${ROOTPKT}/account/delete`,
	runningAccountUsed             : `${ROOTPKT}/account/used`,
	swapRunningAccount             : `${ROOTPKT}/account/swap`,
	getAccountRegretList             : `${ROOTPKT}/account/regret/list`,
	saveAccountRegret             : `${ROOTPKT}/account/regret`,

	//仓库设置
	warehouseCardTree             : `${ROOTPKT}/warehouse/card/tree`,
	insertBatch             		: `${ROOTPKT}/inventory/batch/insert`,
	modifyBatch             		: `${ROOTPKT}/inventory/batch/modify`,
	getSerialList             		: `${ROOTPKT}/inventory/serial/list`,
	batchUsedCheck             		: `${ROOTPKT}/inventory/batch/check/used`,
	getOpenWarehouseCardTree      : `${ROOTPKT}/inventory/open/get`,
	canUseWarehouseCardTree       : `${ROOTPKT}/warehouse/card/list/canUse`,
	insertWarehouseCard           : `${ROOTPKT}/warehouse/card/insert`,
	modifyWarehouseCard           : `${ROOTPKT}/warehouse/card/modify`,
	getWarehouseCard              : `${ROOTPKT}/warehouse/card/get`,
	modifyWarehouseCardStatus     : `${ROOTPKT}/warehouse/card/status/modify`,
	deleteWarehouseCard  		  : `${ROOTPKT}/warehouse/card/delete`,
	enableWarehouse		  			: `${ROOTPKT}/warehouse/enable`,
	disableWarehouse		  			: `${ROOTPKT}/warehouse/disable`,
	repeatWarehouseCardName		  			: `${ROOTPKT}/warehouse/card/name/repeat`,
	getWarehouseDefaultCode		  			: `${ROOTPKT}/default_ac/get/warehouse/code/for/water`,
	insertAssistCategroy		  			: `${ROOTPKT}/inventory/assist/classification/insert`,
	deleteAssistCategroy		  			: `${ROOTPKT}/inventory/assist/classification/delete`,
	modifyAssistCategroy		  			: `${ROOTPKT}/inventory/assist/classification/modify`,
	insertAssist	  						: `${ROOTPKT}/inventory/assist/property/insert`,
	deleteAssist	  						: `${ROOTPKT}/inventory/assist/property/delete`,
	modifyAssist		  					: `${ROOTPKT}/inventory/assist/property/modify`,


	// 流水账
	getRunningCategory                : `${ROOT}/category/list`,
	getRegretCategory                 : `${ROOT}/regret/list`,
	saveRegretMessage                 : `${ROOT}/regret/use`,
	getRunningDetail				  : `${ROOT}/category/get`,
	insertRunningCategory             : `${ROOT}/category/insert`,
	modifyRunningCategory             : `${ROOT}/category/modify`,
	deleteRunningCategory             : `${ROOT}/category/delete`,
	runningSwapItem                   : `${ROOT}/category/swap`,

	enabledCategory                   : `${ROOT}/category/enabled`,
	disabledCategory                  : `${ROOT}/category/disabled`,
	getRunningTaxRate           	  : `${ROOT}/rate/get`,
	modifyRateOption           	  		: `${ROOT}/rate/options/modify`,
	modifyRunningTaxRate              : `${ROOT}/rate/modify`,
	canModifyRunningTaxRate           : `${ROOT}/rate/modify/check`,
	getManagerCategoryList			  : `${ROOT}/business/manager/category/list`,
	getRunningSettingInfo             : `${ROOT}/setting/info`,
	deletevc						  : `${ROOT}/business/vc/delete`,
	insertIncome                      : `${ROOT}/business/income/insert`,
	insertExpense                     : `${ROOT}/business/expense/insert`,
	insertCost                        : `${ROOT}/business/cost/insert`,
	insertPayment                     : `${ROOT}/business/payment/insert`,
	insertTax                         : `${ROOT}/business/tax/insert`,
	insertOutIncome                   : `${ROOT}/business/out/income/insert`,
	insertOutExpense                  : `${ROOT}/business/out/expense/insert`,
	insertTemporaryReceipt            : `${ROOT}/business/temporary/receipt/insert`,
	insertTemporaryPay                : `${ROOT}/business/temporary/pay/insert`,
	insertLoan                        : `${ROOT}/business/loan/insert`,
	insertAssets                      : `${ROOT}/business/assets/insert`,
	insertInvest                      : `${ROOT}/business/invest/insert`,
	insertCapital                     : `${ROOT}/business/capital/insert`,
	insertVirement                    : `${ROOT}/business/virement/insert`,
	modifyRunningbusiness             : `${ROOT}/business/modify`,
	deleteRunningbusiness             : `${ROOT}/business/delete`,
	// getRunningDutyList                :`${ROOT}/business/duty/list`,
	getRunningAccountInfo             : `${ROOT}/business/account/info`, //有定金时获取金额
	getOutPutTax					  : `${ROOT}/business/outPut/tax`,
	getPaymentInfo                    : `${ROOT}/business/payment/info`,
	getPaymentTaxInfo                 : `${ROOT}/business/payment/tax/info`,
	getIncomeTax                      : `${ROOT}/business/income/tax`,
	insertRunningpayment              : `${ROOT}/payment/insert`,
	modifyRunningpayment              : `${ROOT}/payment/modify`,
	deleteRunningpayment              : `${ROOT}/payment/delete`,
	getRunningPaymentList             : `${ROOT}/payment/list`,
	getRunningmanagementedList        : `${ROOT}/managemented/list`,
	getRunningBusinessList			  : `${ROOT}/business/list`,
	getRunningRealizeList			  : `${ROOT}/business/realize/list`,//获取收付实现列表
	getRunningDutyList			      : `${ROOT}/business/duty/list`,//获取权责发生列表

	getRunningBusiness                : `${ROOT}/business/get`,
	getRunningBusinessDuty            : `${ROOT}/business/duty/get`,
	getRunningPayment                 : `${ROOT}/payment/get`,
	insertRunningBusinessVc           : `${ROOT}/business/vc/insert`,
	insertRunningPaymentVc            : `${ROOT}/payment/vc/insert`,
	getBusinessManagerCardList        : `${ROOT}/business/manager/card/list`,
	getBusinessVATInfo				  : `${ROOT}/business/VAT/info`,
	getRunningOtherAccountInfo		  : `${ROOT}/business/other/account/info`,
	getStockCardList                  : `${ROOTPKT}/running/stock/category/tree/list`, //存货科目树
	getStockCategoryList              : `${ROOTPKT}/running/stock/card/list/by/category`,//存货卡片
	getContactsCategoryList           : `${ROOTPKT}/running/current/card/list/by/category`,//往来单位卡片
	getContactsCardList               : `${ROOTPKT}/running/current/category/tree/list`,//往来单位科目树
	getInitRelaCard						: `${ROOTPKT}/default_ac/get/current/code/for/water`,
	getInitStockCard						: `${ROOTPKT}/default_ac/get/stock/code/for/water`,
	regretCode						: `${ROOTPKT}/card/regret/code`,
	regretResult						: `${ROOTPKT}/card/regret/result`,
	downloadRegretCode 					: `${ROOTPKT}/data/download/card/regret/code`,
	checkCardUsed 					: `${ROOT}/business/check/card/used`,
	regretCardConfirm					: `${ROOTPKT}/card/regret/code/confirm`,



	// 成本结转
	getCarryoverList                  : `${ROOT}/business/carryover/list`,
	getCarryoverCheckStockList        : `${ROOT}/jr/manage/carryover/check/list`,
	insertCarryoverItem               : `${ROOT}/business/carryover/insert`,
	modifyCarryoverItem               : `${ROOT}/business/carryover/modify`,
	// 发票认证
	getBusinessAuthList               : `${ROOT}/business/auth/list`,
	insertBusinessAuthItem            : `${ROOT}/business/auth/insert`,
	modifyBusinessAuthItem            : `${ROOT}/business/auth/modify`,
	// 开具发票
	getBusinessMakeoutList            : `${ROOT}/business/makeout/list`,
	insertBusinessMakeoutItem         : `${ROOT}/business/makeout/insert`,
	modifyBusinessMakeoutItem         : `${ROOT}/business/makeout/modify`,
	// 转出未交增值税
	getBusinessTurnoutList            : `${ROOT}/business/turnout/list`,
	insertBusinessTurnoutItem         : `${ROOT}/business/turnout/insert`,
	modifyBusinessTurnoutItem         : `${ROOT}/business/turnout/modify`,
	//公共费用分摊
	getProjectShareList				  :`${ROOT}/business/manager/list/project/share`,
	insertProjectShare				:`${ROOT}/business/manager/project/share/insert`,
	modifyProjectShare				:`${ROOT}/business/manager/project/share/modify`,
	//长期资产处置损益
	getAssetsCleaningCategory		:`${ROOT}/category/assets/list`,
	getAssetsCarryoverList			:`${ROOT}/business/assets/carryover/list`,
	insertAssetsCleaning			:`${ROOT}/business/assets/cleaning/insert`,
	modifyAssetsCleaning			:`${ROOT}/business/assets/cleaning/modify`,



	// 流水余额明细
	getBusinessDetailList             : `${ROOT}/business/detail/list`,
	getBusinessBalanceList            : `${ROOT}/business/balance/list`,
	getRunningDetailCategory          : `${ROOT}/business/detail/category`,

	// 账户余额明细
	getAccountDetailList             : `${ROOT}/account/detail/list`,
	getAccountBalanceList            : `${ROOT}/account/balance/list`,
	getAccountDetailCategory          : `${ROOT}/account/detail/category`,
	// 项目余额明细
	getProjectBalanceList				:`${ROOT}/project/balance/list`,
	getProjectCategoryList				:`${ROOT}/project/balance/category`,
	getProjectDetailList				:`${ROOT}/project/detail/list`,
	getProjectDetailCardList				:`${ROOT}/project/detail/card/list`,
	getProjectDetailCategory			:`${ROOT}/project/detail/category`,
	getProjectDetailCategoryList		:`${ROOT}/project/detail/category/list`,
	getProjectDetailRunningCategoryList		:`${ROOT}/project/detail/running/category`,

	// 往来余额明细
	getContactsBalanceCategory         : `${ROOT}/contact/balance/category`,
	getContactsRelation                : `${ROOT}/contact/balance/relation`,
	getContactsBalanceList             : `${ROOT}/contact/balance/list`,
	getContactsDetailCategory          : `${ROOT}/contact/detail/category`,
	getContactsDetailCardList          : `${ROOT}/contact/detail/card`,
	getContactsRunningCategory         : `${ROOT}/contact/detail/running/category`,
	getContactsDetailList              : `${ROOT}/contact/detail/list`,

	// 新报表
	// 往来
	getRelativeReportCategory         : `${ROOT}/jr/report/contact/category`,
	getRelativeYebReport              : `${ROOT}/jr/report/contact/balance`,
	getRelativeMxbCardList            : `${ROOT}/jr/report/contact/card`,
	getRelativeMxbReport              : `${ROOT}/jr/report/contact/detail`,
	getRelativeMxbCategoryAndType     : `${ROOT}/jr/report/contact/jrType`,
	// 账户
	getAccountYebReport               : `${ROOT}/jr/report/account/balance`,
	getAccountMxbCategory             : `${ROOT}/jr/report/account/detail/category`,
	getAccountMxbReport               : `${ROOT}/jr/report/account/detail`,
	// 收支
	getIncomeExpendYebReport               : `${ROOT}/jr/report/jrSheet/balance`,
	getIncomeExpendMxbReport               : `${ROOT}/jr/report/jrSheet/detail`,
	getIncomeExpendMxbCategory             : `${ROOT}/jr/report/jrSheet/detail/category`,


	// getProjectReportRunningCategory  : `${ROOT}/jr/report/project/category`,  	 //流水类别
	getProjectYebReport              : `${ROOT}/jr/report/project/balance`,      	 //余额表列表（收支+类型）isType
	getProjectYebTypeCategory     	 : `${ROOT}/jr/report/project/type/balance/tree`,//类型余额表项目类别+类型树
	getProjectYebIncomeCategory      : `${ROOT}/jr/report/project/balance/tree`,     //收支余额表项目类别+流水类别树

	getProjectMxbCardList            : `${ROOT}/jr/report/project/card`,             //明细表收支卡片列表
	getProjectTypeMxbCardList        : `${ROOT}/jr/report/project/type/card`,    	 //明细表类型卡片列表
	getProjectMxbReport              : `${ROOT}/jr/report/project/detail`,       	 //明细表收支列表
	getProjectTypeMxbReport          : `${ROOT}/jr/report/project/type/detail`,  	 //明细表类型列表
	getProjectMxbRunningCategory     : `${ROOT}/jr/report/project/category`,      	 //明细表流水类别树
	getProjectMxbType     			 : `${ROOT}/jr/report/project/jrType`,      	 //明细表类型树
	getProjectReportCategory         : `${ROOT}/jr/report/project/card/category`,	 //项目卡片类别（明细表，收支+类型）isType

	getRunningTypeYebReport               : `${ROOT}/jr/report/type/balance`,
	getRunningTypeMxbReport               : `${ROOT}/jr/report/type/detail`,
	getRunningTypeMxbCategory             : `${ROOT}/jr/report/type/detail/tree`,


	// 期初
	getBeginAllList                   : `${ROOT}/period/balance/list`,
	modifyBeginPeriod                 : `${ROOT}/balance/period/modify`,
	// 期初卡片类别
	getBeginCategory                  : `${ROOT}/card/category/list`,

	getBeginCardList                  : `${ROOT}/card/list`,
	// 修改期初
	ModifyBeginAccount                : `${ROOT}/period/balance/modify/account`,
	ModifyBeginTax                    : `${ROOT}/period/balance/modify/rate`,
	ModifyBeginSalary                 : `${ROOT}/period/balance/modify/payment`,
	ModifyBeginContacts               : `${ROOT}/period/balance/modify/amount`,
	ModifyBeginStock                  : `${ROOT}/period/balance/modify/stock`,
	ModifyBeginOthers                 : `${ROOT}/period/balance/modify/other`,
	ModifyBeginLongTerm               : `${ROOT}/period/balance/modify/assets`,
	ModifyBeginCIB                    : `${ROOT}/period/balance/modify/mixing`,
	ModifyBeginProject                : `${ROOT}/period/balance/modify/project`,

	// getBeginContactsList              : `${ROOTPKT}/running/current/subordinate/and/card/list`,
	// getBeginStockList                 : `${ROOTPKT}/running/stock/subordinate/and/card/list`,
	getRunningContactsMemberList        : `${ROOTPKT}/running/current/card/list/by/subordinate`,
	getRunningStockMemberList           : `${ROOTPKT}/running/stock/card/list/by/subordinate`,

	getBeginContactsList              : `${ROOTPKT}/running/current/opened/subordinate/and/card/list`,
	getBeginStockList                 : `${ROOTPKT}/running/stock/opened/subordinate/and/card/list`,
	getBeginProjectList                 : `${ROOTPKT}/running/project/opened/subordinate/and/card/list`,
	getBeginContactsMemberList        : `${ROOTPKT}/running/current/opened/card/list/by/subordinate`,
	getBeginStockMemberList           : `${ROOTPKT}/running/stock/opened/list/by/subordinate`,
	getBeginProjectMemberList           : `${ROOTPKT}/running/project/opened/card/list/by/subordinate`,
// 核算与管理
	getRunningManageCategory          : `${ROOT}/business/manage/category`,//成本结转类别列表
	getRunningMakeoutCategory         : `${ROOT}/business/makeout/category`,//开具发票类别列表
	getRunningCarryoverCategory       : `${ROOT}/business/carryover/category`,//成本结转类别列表
	getRunningAuthCategory            : `${ROOT}/business/auth/category`,//发票认证类别列表
	getManageList					  : `${ROOT}/business/manage/list`,

	// getBusinessAssList                :`${ROOT}/business/manager/card/list`,

	// 成本结转获取流水类别
	getCostCategory					  : `${ROOT}/business/category/state`,
	getCostStock					  : `${ROOT}/business/carryover/card`,
	getCostCategoryTree					  : `${ROOT}/stock/card/category/tree`,
	getCostCardList					      : `${ROOT}/stock/card/category/card/list`,
	// 收付管理获取往来单位卡片
	getManagerCardList					  : `${ROOT}/business/manager/category/card/list`,
	getManageCardTree					  : `${ROOT}/card/category/tree`,
	// 新增附件
	insertEnclosure					  : `${ROOTPKT}/enclosure/insert`,
	initLsLabel					  : `${ROOTPKT}/enclosure/initLabel`,
	getLsLabel					  : `${ROOTPKT}/enclosure/getLabel`,


	// 往来单位卡片导入
	wlUpload                          : `${ROOTPKT}/data/upload/current`,
	wlImport                          : `${ROOTPKT}/data/import/current`,
	wlImportError                     : `${ROOTPKT}/data/download/current/error`,
	wlExport						  : `${ROOTPKT}/data/send/current`,

	// 存货卡片导入
	chUpload                          : `${ROOTPKT}/data/upload/stock`,
	chImport                          : `${ROOTPKT}/data/import/stock`,
	chImportError                     : `${ROOTPKT}/data/download/stock/error`,
	chUploadInitial                   : `${ROOTPKT}/data/upload/stock/open`,
	chImportInitial                   : `${ROOTPKT}/data/import/stock/open`,
	chImportErrorInitial              : `${ROOTPKT}/data/download/stock/open/error`,
	chExport						  : `${ROOTPKT}/data/send/stock`,
	chExportInitial 			      : `${ROOTPKT}/data/send/stock/open`,
	chPlImport			      : `${ROOTPKT}/data/import/stock/with/insert`,
	//仓库卡片导入
	ckUpload                          : `${ROOTPKT}/data/upload/warehouse`,
	ckImport                          : `${ROOTPKT}/data/import/warehouse`,
	ckImportError                     : `${ROOTPKT}/data/download/warehouse/error`,
	ckExport						  : `${ROOTPKT}/data/send/warehouse`,

	// 长期资产折旧摊销
	getAssetsList					  : `${ROOT}/category/assets/list`,
	// 查询流水-新
	getSearchRunningList		  : `${ROOT}/jr/report/list`,

	// 整理流水号
	getSearchRunningSort		  : `${ROOT}/jr/vc/sort`,
	// 删除流水-新
	deleteRunningItems             : `${ROOT}/jr/delete`,
	// 审核、反审核
	insertVcList         		   : `${ROOT}/jr/vc/insert`,
	deleteVcList         		   : `${ROOT}/jr/vc/delete`,
	// 内部转账
	insertInternalTransfer				:`${ROOT}/jr/internalTransfer/insert`,
	modifyInternalTransfer				:`${ROOT}/jr/modify`,
	// 长期资产折旧摊销
	insertDepreciation			 		:`${ROOT}/jr/manage/assets/depreciation/insert`,
	modifyDepreciation			 		:`${ROOT}/jr/manage/assets/depreciation/modify`,
	// 发票认证、发票认证
	insertInvoice			 			:`${ROOT}/jr/manage/invoice/insert`,
	modifyInvoice			 			:`${ROOT}/jr/manage/invoice/modify`,
	getInvoiceList			 			:`${ROOT}/jr/manage/invoice/list`,
	// 长期资产处置损益
	getUnprocessedList			 		:`${ROOT}/jr/manage/assets/unprocessed/list`,
	insertCarryover				 		:`${ROOT}/jr/manage/assets/carryover/insert`,
	modifyCarryover				 		:`${ROOT}/jr/manage/assets/carryover/modify`,
	// 转出未交增值税
	insertTransferVat				 	:`${ROOT}/jr/transferVat/insert`,
	modifyTransferVat				 	:`${ROOT}/jr/modify`,
	getTransferVatList				 	:`${ROOT}/jr/vat/transfer/list`,
	// 收付管理
	getPaymentManageList				:`${ROOT}/jr/paymentManage/list`,
	insertPaymentManage					:`${ROOT}/jr/paymentManage/insert`,
	modifyPaymentManage					:`${ROOT}/jr/modify`,
	getPaymentCategory					:`${ROOT}/jr/paymentManage/category/tree`,
	getPaymentCardTree					:`${ROOT}/jr/paymentManage/card/tree`,
	getPaymentCardList					:`${ROOT}/jr/paymentManage/card/list`,
	getPaymentCardTreeList				:`${ROOT}/jr/paymentManage/category/card/list`,
	getPerCategoryTree					:`${ROOT}/jr/paymentManage/balance/category/tree`,

	// 结转成本
	getCarryoverCard					:`${ROOT}/jr/manage/carryover/card`,
	getJrCarryoverList					:`${ROOT}/jr/manage/carryover/list`,
	insertJrCarryover					:`${ROOT}/jr/manage/carryover/insert`,
	modifyJrCarryover					:`${ROOT}/jr/manage/carryover/modify`,
	getCarryoverStockList				:`${ROOT}/jr/manage/stock/card/category/card/list`,
	getCarryoverStockTree				:`${ROOT}/jr/manage/stock/card/category/tree`,
	getCarryoverCategory				: `${ROOT}/jr/manage/carryover/category`,
	getCarryoverStockPrice				: `${ROOT}/jr/manage/carryover/stock/price`,
	getCarryoverWarehouse				: `${ROOT}/jr/manage/carryover/warehouse`,

	// 费用分摊
	getJrProjectShareList				:`${ROOT}/jr/manage/project/share/list`,
	insertJrProjectShare				:`${ROOT}/jr/manage/project/share/insert`,
	modifyJrProjectShare				:`${ROOT}/jr/manage/project/share/modify`,
	getJrProjectShareType				:`${ROOT}/jr/manage/project/share/type`,

	// 存货调拨
	getCanUseCardList					:`${ROOTPKT}/warehouse/card/list/canUse`, //获取可选的仓库卡片列表
	insertInventoryTransfer				:`${ROOT}/jr/manage/inventory/transfer/insert`,
	modifyInventoryTransfer				:`${ROOT}/jr/manage/inventory/transfer/modify`,

	// 存货余额调整
	insertBalanceAdjustment				:`${ROOT}/jr/manage/inventory/balance/insert`,
	modifyBalanceAdjustment				:`${ROOT}/jr/manage/inventory/balance/modify`,
	getBalanceUniformPrice				:`${ROOT}/jr/manage/inventory/balance/uniform/price`,

	// 进项税额转出
	insertTaxTransferOut				:`${ROOT}/jr/manage/inputTaxTransferOut/insert`,
	modifyTaxTransferOut				:`${ROOT}/jr/manage/inputTaxTransferOut/modify`,

	// 存货组装拆卸
	insertStockBuildUp					:`${ROOT}/jr/manage/inventory/assembly/insert`,
	modifyStockBuildUp					:`${ROOT}/jr/manage/inventory/assembly/modify`,
	getStockBuildUpAssembly				:`${ROOTPKT}/assembly/valid/list/by/category`,
	getAssemblyListByProduct			:`${ROOTPKT}/assembly/list/by/product`,

	// 存货投入项目
	insertStockIntoProject					:`${ROOT}/jr/manage/stockIntoProject/insert`,
	modifyStockIntoProject					:`${ROOT}/jr/manage/stockIntoProject/modify`,

	// 项目结转
	getProjectCarryoverList					:`${ROOT}/jr/manage/projectCarryover/list`,
	insertProjectCarryover					:`${ROOT}/jr/manage/projectCarryover/insert`,
	modifyProjectCarryover					:`${ROOT}/jr/manage/projectCarryover/modify`,
	getXmjzCardByCategory					:`${ROOT}/jr/manage/projectCarryover/card/category/card/list`,
	getXmjzCategory							:`${ROOT}/jr/manage/projectCarryover/card/category/tree`,
	getXmjzCardList							:`${ROOT}/jr/manage/projectCarryover/card`,

	// 盘点
	getWarehouseCardTree					:`${ROOTPKT}/warehouse/card/tree`,
	saveAdjustmentEnclosure					:`${ROOTPKT}/pdf/save/jr/inventory/adjustment/enclosure/data`, //保存盘点单
	getWarehouseLastStage					:`${ROOTPKT}/warehouse/card/list/last/stage`, //获取统一单价存货有数量金额的末级仓库卡片列表




	//新版流水
	getJrOri							: `${ROOT}/jr/ori/get`,
	//暂收暂付
	getJrTemporaryNotHandleList			: `${ROOT}/jr/temporary/notHandler/list`,
	insertJrTemporaryReceipt            : `${ROOT}/jr/temporary/receipt/insert`,
	modifyJrTemporaryReceipt            : `${ROOT}/jr/modify`,
	insertJrTemporaryPay				: `${ROOT}/jr/temporary/pay/insert`,
	modifyJrTemporaryPay				: `${ROOT}/jr/modify`,
	//长期资产
	insertJrAssets						: `${ROOT}/jr/assets/insert`,
	modifyJrAssets						: `${ROOT}/jr/modify`,
	//借款
	insertJrLoan						: `${ROOT}/jr/loan/insert`,
	modifyJrLoan						: `${ROOT}/jr/modify`,
	getJrLoanNotHandleList				: `${ROOT}/jr/loan/notHandler/list`,
	//投资
	insertJrInvest						: `${ROOT}/jr/invest/insert`,
	modifyJrInvest						: `${ROOT}/jr/modify`,
	getJrInvestNotHandleList			: `${ROOT}/jr/invest/notHandler/list`,
	//资本
	insertJrCapital						: `${ROOT}/jr/capital/insert`,
	modifyJrCapital						: `${ROOT}/jr/modify`,
	getJrCapitalNotHandleList			: `${ROOT}/jr/capital/notHandler/list`,
	//营业外收入
	insertJrNonOperatingIncome			: `${ROOT}/jr/nonOperatingIncome/insert`,
	modifyJrNonOperatingIncome			: `${ROOT}/jr/modify`,
	//营业外支出
	insertJrNonOperatingExpenses		: `${ROOT}/jr/nonOperatingExpenses/insert`,
	modifyJrNonOperatingExpenses		: `${ROOT}/jr/modify`,
	//薪酬支出
	getJrPaymentNotHandleList			: `${ROOT}/jr/payment/notHandler/list`,
	insertJrPayment						: `${ROOT}/jr/payment/insert`,
	modifyJrPayment						: `${ROOT}/jr/modify`,
	getJrPaymentAmountInfo				: `${ROOT}/jr/payment/amount/info`,
	getJrPaymentTaxInfo				: `${ROOT}/jr/payment/tax/info`,
	//费用支出
	insertJrOutlay						: `${ROOT}/jr/outlay/insert`,
	modifyJrOutlay						: `${ROOT}/jr/modify`,
	//税费支出
	insertJrTax							: `${ROOT}/jr/tax/insert`,
	modifyJrTax							: `${ROOT}/jr/modify`,
	getJrVatNotHandleList				: `${ROOT}/jr/vat/notHandler/list`,
	getJrVatPrepayList					: `${ROOT}/jr/vat/prepay/list`,
	getTransferAmount					: `${ROOT}/jr/vat/transfer/amount`,
	//营业收入/支出
	insertJrIncome						: `${ROOT}/jr/income/insert`,
	insertJrExpense						: `${ROOT}/jr/expense/insert`,
	modifyJrIncome						: `${ROOT}/jr/modify`,
	modifyJrExpense						: `${ROOT}/jr/modify`,
	getYyszPreAmountInfo				: `${ROOT}/jr/incomeAndExpense/amount/info`,
	//预览流水
	getOriPreview						: `${ROOT}/jr/ori/preview`,
	relativeOriginTags                  : `${ROOTPKT}/current_unit/category/adjust`,
	relativeInventoryTags                   : `${ROOTPKT}/inventory/category/adjust`,

	adjustCategoryOrder					: `${ROOTPKT}/running/move/category`,

	// 审批
	getApprovalBasicComponentList				: `${ROOTAPPROVAL}/component/basic/list`,
	getApprovalModel					        : `${ROOTAPPROVAL}/model/get`,
	createApprovalModel					        : `${ROOTAPPROVAL}/model/create`,
	deleteApprovalModel					        : `${ROOTAPPROVAL}/model/delete`,
	clearApprovalModel					        : `${ROOTAPPROVAL}/model/clear/invalid`,
	modifyApprovalModel					        : `${ROOTAPPROVAL}/model/modify`,
	getapprovalmodelsync 					    : `${ROOTAPPROVAL}/model/sync`,
	changeApprovalModelState					    : `${ROOTAPPROVAL}/model/change/state`,
	getApprovalModelList					        : `${ROOTAPPROVAL}/model/list`,
	getApprovalDetail					        	: `${ROOTAPPROVAL}/detail/get`,
	createApprovalDetail					        : `${ROOTAPPROVAL}/detail/create`,
	deleteApprovalDetail					        : `${ROOTAPPROVAL}/detail/delete`,
	modifyApprovalDetail					        : `${ROOTAPPROVAL}/detail/modify`,
	getApprovalDetailList					        : `${ROOTAPPROVAL}/detail/list`,
	getApprovalCategoryList					        : `${ROOT}/process/jr/get/category`,

	// 查询审批
	getApprovalProcessList					        : `${ROOTAPPROVAL}/process/list/process/info`,
	getapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/get/detail/info`,
	disuseapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/detail/info/disuse`,
	cancelapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/detail/accounting/cancel`,
	accountingapprovalprocessdetailinfo				: `${ROOTAPPROVAL}/process/detail/info/accounting`,
	payingapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/detail/info/paying`,
	receiveapprovalprocessdetailinfo				: `${ROOTAPPROVAL}/process/detail/info/income`,
	bookkeepingapprovalprocessdetailinfo			: `${ROOTAPPROVAL}/process/detail/info/bookKeeping`,
	modifyapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/modify/detail/info`,
	processlistdeletedinstance					    : `${ROOTAPPROVAL}/process/list/deleted/instance`,
	deleteprocesslist					            : `${ROOTAPPROVAL}/process/delete`,

	//库存明细
	getInventoryMxbCardDetail                       :`${ROOT}/jr/report/stock/detail/card`,
	getInventoryStockDetail                         :`${ROOT}/jr/report/stock/detail`,
	getInventoryMxbStockCategory                    :`${ROOT}/jr/report/stock/category`,
	getInventoryMxbStockStore                       :`${ROOT}/jr/report/stock/store`,
    getInventoryTypeList			                :`${ROOT}/jr/report/stock/type`,  //类型树
	//库存余额
	getInventoryYebData               :`${ROOT}/jr/report/stock/balance`,
	getStockQuantity                  :`${ROOT}/jr/report/stock/quantity`, //存货列表
	getStockCategory				  :`${ROOT}/jr/report/stock/category`, //存货类别树
	getStockStore                     :`${ROOT}/jr/report/stock/store`,  //仓库树
	getInventoryYebDecimalScale			  :`${ROOT}/jr/report/stock/decimal/scale/get`,  //获取库存数量单价单位
	modifyInventoryYebDecimalScale			  :`${ROOT}/jr/report/stock/decimal/scale/modify`,  //修改库存数量单价单位
	getInventoryMxbBatchList			  :`${ROOT}/jr/report/stock/detail/batch`,  //获取存货明细表筛选批次列表
	getInventoryMxbAssistList			  :`${ROOT}/jr/report/stock/detail/assist`,  //获取存货明细表筛选属性列表
	getInventoryMxbSerialListFollow			  :`${ROOT}/jr/report/stock/detail/serial/follow`,  //获取存货明细表筛选属性列表

}

export default
function fetchApi(type, method, data, callback) {
	// console.log('type', type);
	fetchFunc(type, method, data, callback, URL)
}
