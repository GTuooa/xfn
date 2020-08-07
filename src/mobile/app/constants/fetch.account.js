import 'es6-shim'
import fetchFunc from './fetchFunc'

import { SERVERURL } from './fetch.constant.js'

// 暂时的测试
export const ROOT = `${SERVERURL}/CWJR`
export const ROOTCARD = `${SERVERURL}/CWPKT`
export const ROOTAPPROVAL = `${SERVERURL}/CWPROCESS`

// export const ROOT = 'http://172.18.0.12:8080' //jk
// export const ROOTCARD = 'http://172.18.0.12:8081'


const URL = {

	//存货设置
	insertInventoryHighType              : `${ROOTCARD}/inventory/category/insert`,
	getInventoryHighTypeList             : `${ROOTCARD}/inventory/category/list`,
	getOneInventorySettingHighType       : `${ROOTCARD}/inventory/category/get`,
	deleteInventorySettingHighType       : `${ROOTCARD}/inventory/category/delete`,
	deleteInventorySettingHighTypeList   : `${ROOTCARD}/inventory/category/delete/list`,
	addInventorySettingCardType          : `${ROOTCARD}/inventory/category/subordinate/insert`,
	getInventorySettingCardTypeList      : `${ROOTCARD}/inventory/category/subordinate/list`,
	getInventorySettingOneCardType       : `${ROOTCARD}/inventory/category/subordinate/get/one`,
	deleteInventorySettingOneCardType    : `${ROOTCARD}/inventory/category/subordinate/delete`,
	addInventorySettingCard              : `${ROOTCARD}/inventory/card/insert`,
	editInventorySettingCard             : `${ROOTCARD}/inventory/card/modify`,
	getInventorySettingCardList          : `${ROOTCARD}/inventory/card/list`,
	getInventorySettingOneCard           : `${ROOTCARD}/inventory/card/get/one`,
	deleteInventorySettingCardList       : `${ROOTCARD}/inventory/card/delete/list`,
	checkBeforeDelete                    : `${ROOTCARD}/inventory/card/delete/list/check`,
	modifyInventorySettingCardUsedStatus : `${ROOTCARD}/inventory/card/status/modify`,
	getInventorySettingCardListByType    : `${ROOTCARD}/inventory/card/list/by/subordinate`,
	adjustInventorySettingCardTypeList   : `${ROOTCARD}/inventory/card/subordinate/adjust`,
	adjustInventorySettingCardTitleSame  : `${ROOTCARD}/inventory/card/name/repeat`,
	adjustInventorySettingTypeTitleSame  : `${ROOTCARD}/inventory/category/subordinate/name/repeat`,
	getInventorySettingUndefienCard      : `${ROOTCARD}/default_ac/get`,
	editInventorySettingUndefienCard     : `${ROOTCARD}/default_ac/inventory/modify`,
	swapInventorySettingTypePosition     : `${ROOTCARD}/inventory/category/subordinate/adjust`,
	getIUManageCardLimitAndAc			 : `${ROOTCARD}/default_ac/card/insert/before`,
	//新增存货数量管理
	getWarehouseTree					 : `${ROOTCARD}/warehouse/card/tree`,
	getUnit					 			 : `${ROOTCARD}/unit/list`,
	getStockCategoryTree				 : `${ROOTCARD}/running/stock/category/tree/list`,//存货卡片类别树
	inventoryAssistList                  : `${ROOTCARD}/inventory/assist/list`,//存货辅助属性列表
	assistClassInsert                    : `${ROOTCARD}/inventory/assist/classification/insert`,//新增辅助分类
	assistClassModify                    : `${ROOTCARD}/inventory/assist/classification/modify`,//修改辅助分类
	assistClassDelete                    : `${ROOTCARD}/inventory/assist/classification/delete`,//删除辅助分类
	assistPropertyInsert                 : `${ROOTCARD}/inventory/assist/property/insert`,//新增辅助属性
	assistPropertyModify                 : `${ROOTCARD}/inventory/assist/property/modify`,//修改辅助属性
	assistPropertyDelete                 : `${ROOTCARD}/inventory/assist/property/delete`,//删除辅助属性
	batchInsert                          : `${ROOTCARD}/inventory/batch/insert`,//新增批次
	batchModify                          : `${ROOTCARD}/inventory/batch/modify`,//新增批次
	batchCheckUsed                       : `${ROOTCARD}/inventory/batch/check/used`,//校验批次是否被使用
	getBatchList                         : `${ROOTCARD}/inventory/batch/list`,//获取批次
	modifyBatchStatus                    : `${ROOTCARD}/inventory/batch/modify/status`,//修改批次状态
	deleteBatchList                      : `${ROOTCARD}/inventory/batch/delete`,//删除批次状态
	getOpenWarehouseTree                 : `${ROOTCARD}/inventory/open/get`,//获取卡片期初值树
	getSerialList                        : `${ROOTCARD}/inventory/serial/list`,//获取卡片期初值序列号
	getSerialListIn                      : `${ROOTCARD}/inventory/serial/list/in`,//获取在库的存货卡片序列号

	//往来单位管理
	getIUManageTypeContent               : `${ROOTCARD}/current_unit/category/get`,
	saveIUManageHighType                 : `${ROOTCARD}/current_unit/category/insert`,
	getIUManageListTitle				 : `${ROOTCARD}/current_unit/category/list`,
	getIUManageTreeByType	             : `${ROOTCARD}/current_unit/category/subordinate/list`,
	getIUManagetTreeSingleType           : `${ROOTCARD}/current_unit/category/subordinate/get/one`,
	saveIUManageType                     : `${ROOTCARD}/current_unit/category/subordinate/insert`,
	saveIUManageCard                     : `${ROOTCARD}/current_unit/card/insert`,
	editIUManageCard                     : `${ROOTCARD}/current_unit/card/modify`,
	getIUmanageListAll                   : `${ROOTCARD}/current_unit/card/list`,
	getIUmanageListBySontype             : `${ROOTCARD}/current_unit/card/list/by/subordinate`,
	getIUManageOneCardInfo               : `${ROOTCARD}/current_unit/card/get/one`,
	deleteIUManageHighType               : `${ROOTCARD}/current_unit/category/delete`,
	deleteIUManageTreeList               : `${ROOTCARD}/current_unit/category/subordinate/delete/list`,
	deleteIUManageListCard               : `${ROOTCARD}/current_unit/card/delete/list`,
	switchCardStatus                     : `${ROOTCARD}/current_unit/card/status/modify`,
	swapIUmanageTypePosition             : `${ROOTCARD}/current_unit/category/subordinate/adjust`,
	adjustIUmanageCardTypeList           : `${ROOTCARD}/current_unit/card/subordinate/adjust`,
	adjustIUmanageCardTitleSame          : `${ROOTCARD}/current_unit/card/name/repeat`,
	adjustIUmanageTypeTitleSame          : `${ROOTCARD}/current_unit/category/subordinate/name/repeat`,
	getIUManageUndefienCard              : `${ROOTCARD}/default_ac/get`,
	editIUManageUndefienCard             : `${ROOTCARD}/default_ac/current/modify`,
	// getIUManageCardLimitAndAc			 : `${ROOTCARD}/default_ac/card/insert/before`,
	deleteIUManageSettingHighTypeList	 : `${ROOTCARD}/current_unit/category/delete/list`,

	//项目设置
	getProjectConfigHighType			 : `${ROOTCARD}/project/category/list`,
	getProjectConfigHighTypeOne			 : `${ROOTCARD}/project/category/get`,
	modifyProjectConfigHighType          : `${ROOTCARD}/project/category/modify`,
	getProjectTree						 : `${ROOTCARD}/project/category/subordinate/list`,
	getProjectTreeOne  					 : `${ROOTCARD}/project/category/subordinate/get/one`,
	insertProjectTreeOne  				 : `${ROOTCARD}/project/category/subordinate/insert`,
	adjustProjectTypeNameSame 			 : `${ROOTCARD}/project/category/subordinate/name/repeat`,
	swapProjectTypePosition              : `${ROOTCARD}/project/category/subordinate/adjust`,
	deleteProjectType              		 : `${ROOTCARD}/project/category/subordinate/delete/list`,
	insertProjectCard					 : `${ROOTCARD}/project/card/insert`,
	adjustProjectCardNameSame 			 : `${ROOTCARD}/project/card/name/repeat`,
	getProjectListAndTree				 : `${ROOTCARD}/project/card/list`,
	getProjectCardOne					 : `${ROOTCARD}/project/card/get/one`,
	changeProjectCardUsedStatus			 : `${ROOTCARD}/project/card/status/modify`,
	deleteProjectCard					 : `${ROOTCARD}/project/card/delete/list`,
	getProjectCardByType				 : `${ROOTCARD}/project/card/list/by/subordinate`,
	adjustProjectCardType				 : `${ROOTCARD}/project/card/subordinate/adjust`,
	editProjectCard						 : `${ROOTCARD}/project/card/modify`,
	getProjectCardList					 : `${ROOTCARD}/running/project/card/list/by/category`,
	getProjectTreeList					 : `${ROOTCARD}/running/project/category/tree/list`,
	getProjectSubordinateCardList		 : `${ROOTCARD}/running/project/card/list/by/subordinate`,
	getProjectAllCardList				 : `${ROOTCARD}/running/project/all/category/tree/list`,
	getProjectCardCode				 	 : `${ROOTCARD}/default_ac/get/project/code/for/water`,

	//流水账
	getRunningSettingInfo             : `${ROOT}/setting/info`,
	getRunningDetail				  : `${ROOT}/category/get`,
	getRunningAccount                 : `${ROOTCARD}/account/list`,//获取账户列表
	insertRunningbusiness             : `${ROOT}/business/insert`,
	modifyRunningbusiness             : `${ROOT}/business/modify`,
	insertIncome             		  : `${ROOT}/business/income/insert`,//新增营业收入
	insertExpense           		  : `${ROOT}/business/expense/insert`,//新增营业支出
	insertCost           		 	  : `${ROOT}/business/cost/insert`,//新增费用支出
	insertPayment           		  : `${ROOT}/business/payment/insert`,//新增薪酬支出
	insertTax           		  	  : `${ROOT}/business/tax/insert`,//新增税费支出
	insertOutIncome                   : `${ROOT}/business/out/income/insert`,//新增营业外收入流水
	insertOutExpense                  : `${ROOT}/business/out/expense/insert`,//新增营业外支出流水
	insertTemporaryReceipt            : `${ROOT}/business/temporary/receipt/insert`,//新增暂收流水
	insertTemporaryPay                : `${ROOT}/business/temporary/pay/insert`,//新增暂付流水
	insertLoan                        : `${ROOT}/business/loan/insert`,//新增借款流水
	insertAssets                      : `${ROOT}/business/assets/insert`,//新增资产流水
	insertInvest                      : `${ROOT}/business/invest/insert`,//新增投资流水
	insertCapital                     : `${ROOT}/business/capital/insert`,//新增资本流水
	insertRunningCategory             : `${ROOT}/category/insert`,
	modifyRunningCategory             : `${ROOT}/category/modify`,
	deleteRunningCategory             : `${ROOT}/category/delete`,
	getRunningCategory                : `${ROOT}/category/list`,
	getRegretCategory                : `${ROOT}/regret/list`,
	saveRegretMessage                : `${ROOT}/regret/use`,
	getRunningAccountInfo             : `${ROOT}/business/account/info`, //有定金时获取金额
	getRunningBusinessList			  : `${ROOT}/business/list`,//查询流水
	getRunningBusinessDutyList		  : `${ROOT}/business/duty/list`,//查询发生额流水
	getRunningBusinessRealizeList	  : `${ROOT}/business/realize/list`,//查询收支额流水
	deleteRunningbusiness             : `${ROOT}/business/delete`,//删除流水
	getRunningBusiness				  : `${ROOT}/business/get`,//获取单条流水
	getPaymentInfo                    : `${ROOT}/business/payment/info`,//获取公积金 社保未处理金额
	getPaymentTaxInfo                 : `${ROOT}/business/payment/tax/info`,
	getBusinessVATInfo				  : `${ROOT}/business/VAT/info`,//税费支出PaymentList
	getStockCardList				  : `${ROOTCARD}/running/stock/card/list/by/category`,//获取存货卡片列表
	getCurrentCardList				  : `${ROOTCARD}/running/current/card/list/by/category`,//获取往来单位卡片列表
	runningSwapItem                   : `${ROOT}/category/swap`,
	// 期初
	getBeginAllList                   : `${ROOT}/period/balance/list`,
	modifyBeginPeriod                 : `${ROOT}/balance/period/modify`,
	getBeginContactsList              : `${ROOTCARD}/running/current/opened/subordinate/and/card/list`,
	getBeginStockList                 : `${ROOTCARD}/running/stock/opened/subordinate/and/card/list`,
	getBeginContactsMemberList        : `${ROOTCARD}/running/current/opened/card/list/by/subordinate`,
	getBeginStockMemberList           : `${ROOTCARD}/running/stock/opened/list/by/subordinate`,
	// 修改期初
	ModifyBeginAccount                : `${ROOT}/period/balance/modify/account`,
	ModifyBeginTax                    : `${ROOT}/period/balance/modify/rate`,
	ModifyBeginSalary                 : `${ROOT}/period/balance/modify/payment`,
	ModifyBeginContacts               : `${ROOT}/period/balance/modify/amount`,
	ModifyBeginStock                  : `${ROOT}/period/balance/modify/stock`,
	ModifyBeginOthers                 : `${ROOT}/period/balance/modify/other`,
	ModifyBeginLongTerm               : `${ROOT}/period/balance/modify/assets`,
	ModifyBeginCIB                    : `${ROOT}/period/balance/modify/mixing`,
	//收付管理
	insertVirement                    : `${ROOT}/business/virement/insert`,//内部转账
	getBusinessManagerCardList        : `${ROOT}/business/manager/card/list`,//获取收付管理往来单位卡片
	getManageList					  : `${ROOT}/business/manage/list`,//收付管理核账列表
	getManagerCategoryList			  : `${ROOT}/business/manager/category/list`,
	insertRunningpayment              : `${ROOT}/payment/insert`,//收付管理新增
	modifyRunningpayment              : `${ROOT}/payment/modify`,

	// 成本结转
	getCarryoverList                  : `${ROOT}/business/carryover/list`,
	insertCarryoverItem               : `${ROOT}/business/carryover/insert`,
	modifyCarryoverItem               : `${ROOT}/business/carryover/modify`,
	getCostCategory					  : `${ROOT}/business/category/state`,// 成本结转获取流水类别
	getCostStock					  : `${ROOT}/business/carryover/card`,//成本结转获取存货卡片

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

	getBusinessBalanceList            : `${ROOT}/business/balance/list`,//收支余额表
	getBusinessDetailList             : `${ROOT}/business/detail/list`,//收支明细表
	getRunningDetailCategory          : `${ROOT}/business/detail/category`,//流水明细科目树
	insertRunningBusinessVc           : `${ROOT}/business/vc/insert`,//查询流水生成凭证

	getRunningTaxRate           	  : `${ROOT}/rate/get`,//税费设置
	modifyRunningTaxRate              : `${ROOT}/rate/modify`,//修改税费
	canModifyRunningTaxRate           : `${ROOT}/rate/modify/check`,
	modifyRateOptionList              : `${ROOT}/rate/options/modify`,//修改税率列表
	insertRunningAccount              : `${ROOTCARD}/account/insert`,//账户设置
	modifyRunningAccount              : `${ROOTCARD}/account/modify`,
	deleteRunningAccount              : `${ROOTCARD}/account/delete`,
	deletevc						  : `${ROOT}/business/vc/delete`,//删除凭证
	getRunningStockMemberList         : `${ROOTCARD}/running/stock/card/list/by/subordinate`,//查询核算管理获取存货卡片
	swapAccount                       : `${ROOTCARD}/account/swap`,//账户交换顺序

	getProjectShareList          	  : `${ROOT}/business/manager/list/project/share`,//（项目公共费用分摊列表）
	insertProjectShare				  : `${ROOT}/business/manager/project/share/insert`,
	modifyProjectShare				  : `${ROOT}/business/manager/project/share/modify`,

	// 账户余额明细
	getAccountDetailList             : `${ROOT}/account/detail/list`,
	getAccountBalanceList            : `${ROOT}/account/balance/list`,
	getAccountDetailCategory          : `${ROOT}/account/detail/category`,

	// 往来余额明细
	getContactsBalanceCategory         : `${ROOT}/contact/balance/category`,
	getContactsRelation                : `${ROOT}/contact/balance/relation`,
	getContactsBalanceList             : `${ROOT}/contact/balance/list`,
	getContactsDetailCategory          : `${ROOT}/contact/detail/category`,
	getContactsDetailCardList          : `${ROOT}/contact/detail/card`,
	getContactsRunningCategory         : `${ROOT}/contact/detail/running/category`,
	getContactsDetailList              : `${ROOT}/contact/detail/list`,
	//流水新增往来卡片
	getInitRelaCard					 : `${ROOTCARD}/default_ac/get/current/code/for/water`,
	//流水新增存货卡片
	getInitStockCard				 : `${ROOTCARD}/default_ac/get/stock/code/for/water`,

	// 项目余额明细
	getProjectBalanceList				:`${ROOT}/project/balance/list`,
	getProjectCategoryList				:`${ROOT}/project/balance/category`,
	getProjectDetailList				:`${ROOT}/project/detail/list`,
	getProjectDetailCardList				:`${ROOT}/project/detail/card/list`,
	getProjectDetailCategory			:`${ROOT}/project/detail/category`,
	getProjectDetailCategoryList		:`${ROOT}/project/detail/category/list`,
	getProjectDetailRunningCategoryList		:`${ROOT}/project/detail/running/category`,

	// 报表导出
	sendAccountExcelDetail            : `${ROOT}/jr/excel/send/account/detail`,
	sendAccountExcelbalance           : `${ROOT}/jr/excel/send/account/balance`,

	//核算管理结转损益
	getCategoryList         			: `${ROOT}/category/assets/list`,
	getJzsyList         				: `${ROOT}/business/assets/carryover/list`,
	insertJzsy         					: `${ROOT}/business/assets/cleaning/insert`,
	modifyJzsy         					: `${ROOT}/business/assets/cleaning/modify`,

	// 新增附件
	insertEnclosure					  : `${ROOTCARD}/enclosure/insert`,
	initLsLabel					  : `${ROOTCARD}/enclosure/initLabel`,
	getLsLabel					  : `${ROOTCARD}/enclosure/getLabel`,

	//库存余额表
	getInventoryYebData              :`${ROOT}/jr/report/stock/balance`,
	getInventoryYebStockQuantity     :`${ROOT}/jr/report/stock/quantity`,
	getInventoryYebstockCategory     :`${ROOT}/jr/report/stock/category`,
	getInventoryYebStockStore        :`${ROOT}/jr/report/stock/store`,
	getInventoryMxbStockDetail       :`${ROOT}/jr/report/stock/detail`,
	getInventoryMxbStockCard         :`${ROOT}/jr/report/stock/detail/card`,
	getInventoryYebTypeList          :`${ROOT}/jr/report/stock/type`,
	getInventoryYebDecimalScale			  :`${ROOT}/jr/report/stock/decimal/scale/get`,  //获取库存数量单价单位
	modifyInventoryYebDecimalScale			  :`${ROOT}/jr/report/stock/decimal/scale/modify`,  //修改库存数量单价单位

	//审批
	getApprovalProjectList           :`${ROOTCARD}/process/list/project/level/tree`,
	getApprovalCurrentList           :`${ROOTCARD}/process/list/current/level/tree`,
	getApprovalStockList          	 :`${ROOTCARD}/process/list/stock/level/tree`,
	getApprovalProjectCard           :`${ROOTCARD}/process/list/project/card/byType`,
	getApprovalCurrentCard           :`${ROOTCARD}/process/list/current/card/byType`,
	getApprovalStockCard             :`${ROOTCARD}/process/list/stock/card/byType`,
	saveApprovalItem             	:`${ROOTAPPROVAL}/instance/create`,







}

export default
function fetchApi(type, method, data, callback, loadingtext) {

	fetchFunc(type, method, data, callback, loadingtext, URL)
}
