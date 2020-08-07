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
	getUnit					 			 : `${ROOTCARD}/unit/list`,//新增存货数量管理
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

	//仓库设置
	warehouseEnable					 	 : `${ROOTCARD}/warehouse/enable`,//启用仓库
	getWarehouseTree					 : `${ROOTCARD}/warehouse/card/tree`,
	getWarehouseList					 : `${ROOTCARD}/warehouse/card/list/canUse`,
	warehouseCardNameRepeat				 : `${ROOTCARD}/warehouse/card/name/repeat`,
	insertWarehouseCard 				 : `${ROOTCARD}/warehouse/card/insert`,
	modifyWarehouseCard					 : `${ROOTCARD}/warehouse/card/modify`,
	getWarehouseSingleCard				 : `${ROOTCARD}/warehouse/card/get`,
	deleteWarehouseCard					 : `${ROOTCARD}/warehouse/card/delete`,

	//流水账
	getRunningSettingInfo             : `${ROOT}/setting/info`,
	getRunningDetail				  : `${ROOT}/category/get`,
	getRunningAccount                 : `${ROOTCARD}/account/list`,//获取账户列表
	insertRunningbusiness             : `${ROOT}/business/insert`,
	modifyRunningbusiness             : `${ROOT}/jr/modify`,
	insertIncome             		  : `${ROOT}/jr/income/insert`,//新增营业收入
	insertExpense           		  : `${ROOT}/jr/expense/insert`,//新增营业支出
	insertCost           		 	  : `${ROOT}/jr/outlay/insert`,//新增费用支出
	insertPayment           		  : `${ROOT}/jr/payment/insert`,//新增薪酬支出
	insertTax           		  	  : `${ROOT}/jr/tax/insert`,//新增税费支出
	insertOutIncome                   : `${ROOT}/jr/nonOperatingIncome/insert`,//新增营业外收入流水
	insertOutExpense                  : `${ROOT}/jr/nonOperatingIncome/insert`,//新增营业外支出流水
	insertTemporaryReceipt            : `${ROOT}/jr/temporary/receipt/insert`,//新增暂收流水
	insertTemporaryPay                : `${ROOT}/jr/temporary/pay/insert`,//新增暂付流水
	insertLoan                        : `${ROOT}/jr/loan/insert`,//新增借款流水
	insertAssets                      : `${ROOT}/jr/assets/insert`,//新增资产流水
	insertInvest                      : `${ROOT}/jr/invest/insert`,//新增投资流水
	insertCapital                     : `${ROOT}/jr/capital/insert`,//新增资本流水
	insertRunningCategory             : `${ROOT}/category/insert`,
	modifyRunningCategory             : `${ROOT}/category/modify`,
	deleteRunningCategory             : `${ROOT}/category/delete`,
	getRunningCategory                : `${ROOT}/category/list`,
	getRegretCategory                : `${ROOT}/regret/list`,
	saveRegretMessage                : `${ROOT}/regret/use`,
	getRunningAccountInfo             : `${ROOT}/jr/incomeAndExpense/amount/info`, //有定金时获取金额
	getRunningBusinessList			  : `${ROOT}/jr/report/list`,//查询流水
	searchRunningCard                 : `${ROOT}/jr/report/list/card`,//查询流水卡片
	getRunningBusinessDutyList		  : `${ROOT}/business/duty/list`,//查询发生额流水
	getRunningBusinessRealizeList	  : `${ROOT}/business/realize/list`,//查询收支额流水
	deleteRunningbusiness             : `${ROOT}/jr/delete`,//删除流水
	getRunningBusiness				  : `${ROOT}/jr/ori/get`,//获取单条流水
	getRunningPreview				  : `${ROOT}/jr/ori/preview`,//预览单条流水
	getPaymentInfo                    : `${ROOT}/jr/payment/amount/info`,//获取公积金 社保未处理金额
	getXczcPaymentList				  : `${ROOT}/jr/payment/notHandler/list`,//获取薪酬支出计提流水
	getPaymentTaxInfo                 : `${ROOT}/jr/temporary/notHandler/list`,
	getJkPendingStrongList            : `${ROOT}/jr/loan/notHandler/list`,
	getTzPendingStrongList            : `${ROOT}/jr/invest/notHandler/list`,
	getZbPendingStrongList            : `${ROOT}/jr/capital/notHandler/list`,
	getSfzcZzsList				  	  : `${ROOT}/jr/vat/prepay/list`,//税费支出PaymentList
	getSfzcNotPayList				  : `${ROOT}/jr/vat/notHandler/list`,//税费支出未缴列表
	getSfzcTransferAmount			  : `${ROOT}/jr/vat/transfer/amount`,//获取待转出未交增值税金额
	getSfzcNotHandleAmount			  : `${ROOT}/jr/payment/tax/info`,//税费支出未处理金额
	getStockCardList				  : `${ROOTCARD}/running/stock/card/list/by/category`,//获取存货卡片列表
	getCurrentCardList				  : `${ROOTCARD}/running/current/card/list/by/category`,//获取往来单位卡片列表
	runningSwapItem                   : `${ROOT}/category/swap`,
	// 期初
	getBeginAllList                   : `${ROOT}/period/balance/list`,
	modifyBeginPeriod                 : `${ROOT}/balance/period/modify`,
	getBeginContactsList              : `${ROOTCARD}/running/current/opened/subordinate/and/card/list`,
	getBeginStockList                 : `${ROOTCARD}/running/stock/opened/subordinate/and/card/list`,
	getBeginProjectList                : `${ROOTCARD}/running/project/opened/subordinate/and/card/list`,
	getBeginContactsMemberList        : `${ROOTCARD}/running/current/opened/card/list/by/subordinate`,
	getBeginStockMemberList           : `${ROOTCARD}/running/stock/opened/list/by/subordinate`,
	getBeginProjectMemberList           : `${ROOTCARD}/running/project/opened/card/list/by/subordinate`,
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
	//内部转账
	insertVirement                    : `${ROOT}/jr/internalTransfer/insert`,//内部转账
	//收付管理
	getSfglCardList        			  : `${ROOT}/jr/paymentManage/card/list`,//获取收付管理往来单位卡片
	getSfglCategoryList        		  : `${ROOT}/jr/paymentManage/category/tree`,//获取处理类别树
	getManageList					  : `${ROOT}/jr/paymentManage/list`,//收付管理核账列表
	getManagerCategoryList			  : `${ROOT}/jr/paymentManage/balance/category/tree`,//收付管理期初值类别树
	insertRunningpayment              : `${ROOT}/jr/paymentManage/insert`,//收付管理新增

	// 成本结转
	getCarryoverList                  : `${ROOT}/jr/manage/carryover/list`,
	insertCarryoverItem               : `${ROOT}/jr/manage/carryover/insert`,
	modifyCarryoverItem               : `${ROOT}/jr/manage/carryover/modify`,
	getCostCategory					  : `${ROOT}/jr/manage/carryover/category`,// 成本结转获取流水类别
	getCostWarehouse				  : `${ROOT}/jr/manage/carryover/warehouse`,// 成本结转获取仓库
	getCostStock					  : `${ROOT}/jr/manage/carryover/card`,//成本结转获取存货卡片
	getCostStockCategory			  : `${ROOT}/jr/manage/stock/card/category/tree`,//成本结转获取存货卡片类别
	getCostStockByCategory			  : `${ROOT}/jr/manage/stock/card/category/card/list`,//成本结转获取存货卡片通过类别

	// 发票认证
	getBusinessAuthList               : `${ROOT}/jr/manage/invoice/list`,
	insertBusinessAuthItem            : `${ROOT}/jr/manage/invoice/insert`,
	modifyBusinessAuthItem            : `${ROOT}/jr/manage/invoice/modify`,

	// 开具发票
	getBusinessMakeoutList            : `${ROOT}/jr/manage/invoice/list`,
	insertBusinessMakeoutItem         : `${ROOT}/jr/manage/invoice/insert`,
	modifyBusinessMakeoutItem         : `${ROOT}/jr/manage/invoice/modify`,

	//项目结转
	getXmjzList                       : `${ROOT}/jr/manage/projectCarryover/list`,
	insertXmjz                        : `${ROOT}/jr/manage/projectCarryover/insert`,
	modifyXmjz                        : `${ROOT}/jr/manage/projectCarryover/modify`,
	getXmjzProjectList                : `${ROOT}/jr/manage/projectCarryover/card`,
	xmjzProjectTree                   : `${ROOT}/jr/manage/projectCarryover/card/category/tree`,
	xmjzProjectListByCategory         : `${ROOT}/jr/manage/projectCarryover/card/category/card/list`,


	// 转出未交增值税
	getBusinessTurnoutList            : `${ROOT}/jr/vat/transfer/list`,
	insertBusinessTurnoutItem         : `${ROOT}/jr/transferVat/insert`,
	getChdbPrice					  : `${ROOT}/jr/manage/carryover/stock/price`,//存货调拨获取参考单价
	insertChdb						  : `${ROOT}/jr/manage/inventory/transfer/insert`,//存货调拨新增
	modifyChdb						  : `${ROOT}/jr/manage/inventory/transfer/modify`,//存货调拨修改
	insertChye						  : `${ROOT}/jr/manage/inventory/balance/insert`,//存货余额新增
	modifyChye						  : `${ROOT}/jr/manage/inventory/balance/modify`,//存货余额修改
	insertJxsezc                      : `${ROOT}/jr/manage/inputTaxTransferOut/insert`,//进项税额转出
	modifyJxsezc                      : `${ROOT}/jr/manage/inputTaxTransferOut/modify`,//进项税额转出

	insertChtrxm                      : `${ROOT}/jr/manage/stockIntoProject/insert`,//存货投入项目
	modifyChtrxm                      : `${ROOT}/jr/manage/stockIntoProject/modify`,//存货投入项目

	//存货组装
	insertChzz                        : `${ROOT}/jr/manage/inventory/assembly/insert`,//存货组装
	modifyChzz                        : `${ROOT}/jr/manage/inventory/assembly/modify`,//存货组装
	chzzAssemblyList                  : `${ROOTCARD}/assembly/valid/list/by/category`,//存货组装成品列表

	getBusinessBalanceList            : `${ROOT}/business/balance/list`,//收支余额表
	getBusinessDetailList             : `${ROOT}/business/detail/list`,//收支明细表
	getRunningDetailCategory          : `${ROOT}/business/detail/category`,//流水明细科目树
	insertRunningBusinessVc           : `${ROOT}/jr/vc/insert`,//查询流水生成凭证
	deletevc						  : `${ROOT}/jr/vc/delete`,//删除凭证

	getRunningTaxRate           	  : `${ROOT}/rate/get`,//税费设置
	modifyRunningTaxRate              : `${ROOT}/rate/modify`,//修改税费
	canModifyRunningTaxRate           : `${ROOT}/rate/modify/check`,
	modifyRateOptionList              : `${ROOT}/rate/options/modify`,//修改税率列表
	insertRunningAccount              : `${ROOTCARD}/account/insert`,//账户设置
	modifyRunningAccount              : `${ROOTCARD}/account/modify`,
	deleteRunningAccount              : `${ROOTCARD}/account/delete`,
	getRunningStockMemberList         : `${ROOTCARD}/running/stock/card/list/by/subordinate`,//查询核算管理获取存货卡片
	swapAccount                       : `${ROOTCARD}/account/swap`,//账户交换顺序
	insertAccountPoundage             : `${ROOT}/account/poundage/insert`,//账户手续费
	modifyAccountPoundage             : `${ROOT}/account/poundage/modify`,//账户手续费
	getAccountPoundage                : `${ROOT}/account/poundage/get`,//账户手续费
	getAccountRegretList              : `${ROOTCARD}/account/regret/list`,//账户反悔模式列表
	accountRegret                     : `${ROOTCARD}/account/regret`,//账户反悔

	getProjectShareList          	  : `${ROOT}/jr/manage/project/share/list`,//（项目公共费用分摊列表）
	getProjectShareType          	  : `${ROOT}/jr/manage/project/share/type`,//（项目分摊状态）
	insertProjectShare				  : `${ROOT}/jr/manage/project/share/insert`,
	modifyProjectShare				  : `${ROOT}/jr/manage/project/share/modify`,

	// 账户余额明细
	getAccountDetailList             : `${ROOT}/account/detail/list`,
	getAccountBalanceList            : `${ROOT}/account/balance/list`,
	getAccountDetailCategory          : `${ROOT}/account/detail/category`,

	//往来通过类别获取卡片
	getCurrentTree                    : `${ROOTCARD}/running/current/category/tree/list`,//往来类别树
	getCurrentListByCategory          : `${ROOTCARD}/running/current/card/list/by/subordinate`,//往来类别树

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

	//核算管理结转损益
	getCategoryList         			: `${ROOT}/category/assets/list`,
	getJzsyList         				: `${ROOT}/jr/manage/assets/unprocessed/list`,
	insertJzsy         					: `${ROOT}/jr/manage/assets/carryover/insert`,
	modifyJzsy         					: `${ROOT}/jr/manage/assets/carryover/modify`,

	//核算管理折旧摊销
	insertZjtx         					: `${ROOT}/jr/manage/assets/depreciation/insert`,
	modifyZjtx         					: `${ROOT}/jr/manage/assets/depreciation/modify`,

	// 新增附件
	insertEnclosure					  : `${ROOTCARD}/enclosure/insert`,
	initLsLabel					  : `${ROOTCARD}/enclosure/initLabel`,
	getLsLabel					  : `${ROOTCARD}/enclosure/getLabel`,

	// 新-账户余额明细
	getAccountReportBalance					  : `${ROOT}/jr/report/account/balance`,
	getAccountReportDetail					  : `${ROOT}/jr/report/account/detail`,
	getAccountReportCategory				  : `${ROOT}/jr/report/account/detail/category`,

	// 往来余额明细
	getRelativeBalance						  : `${ROOT}/jr/report/contact/balance`,
	getRelativeCategory						  : `${ROOT}/jr/report/contact/category`,
	getRelativeDetail						  : `${ROOT}/jr/report/contact/detail`,
	getRelativeCard							  : `${ROOT}/jr/report/contact/card`,
	getRelativejrType						  : `${ROOT}/jr/report/contact/jrType`,

	// 收支余额明细
	getIncomeExpendYebReport               : `${ROOT}/jr/report/jrSheet/balance`,
	getIncomeExpendMxbReport               : `${ROOT}/jr/report/jrSheet/detail`,
	getIncomeExpendMxbCategory             : `${ROOT}/jr/report/jrSheet/detail/category`,

	// 类型
	getRunningTypeYebReport               : `${ROOT}/jr/report/type/balance`,
	getRunningTypeMxbReport               : `${ROOT}/jr/report/type/detail`,
	getRunningTypeMxbCategory             : `${ROOT}/jr/report/type/detail/tree`,
	getJrRunningTypeList			:`${ROOT}/jr/report/type/detail/boss`,
	getJrAcList				:`${ROOT}/jr/report/type/detail/tree/boss`,

	// 项目
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

	// 审批
	getApprovalBasicComponentList				: `${ROOTAPPROVAL}/component/basic/list`,
	getApprovalModel					        : `${ROOTAPPROVAL}/model/get`,
	createApprovalModel					        : `${ROOTAPPROVAL}/model/create`,
	deleteApprovalModel					        : `${ROOTAPPROVAL}/model/delete`,
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
	getCategorySubList             					:`${ROOT}/jr/setting/process/category/subList`,

	// 录入审批
	getApprovalList					            	: `${ROOTAPPROVAL}/instance/create/model/list`,
	getModelInfo					            	: `${ROOTAPPROVAL}/instance/get/model/component/info`,
	getSpaceInfo					            	: `${ROOTAPPROVAL}/instance/get/space/info`,
	getCustomSpace					            	: `${ROOTAPPROVAL}/instance/grant/custom/space`,
	getRelationList					            	: `${ROOTAPPROVAL}/instance/list/relation`,
	approvalEnclosureUpload				            	: `${ROOTAPPROVAL}/instance/enclosure/upload/space`,
	updateInstanceModel				            	: `${ROOTAPPROVAL}/instance/update/model/before/create`,

	// 查询审批
	getApprovalProcessList					        : `${ROOTAPPROVAL}/process/mobile/list/process/info`,
	getapprovalprocessdetaillist					: `${ROOTAPPROVAL}/process/mobile/list/detail/info`,
	getapprovalprocessmodellist					    : `${ROOTAPPROVAL}/process/list/process/model`,
	getapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/get/detail/info`,
	disuseapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/detail/info/disuse`,
	cancelapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/detail/accounting/cancel`,
	accountingapprovalprocessdetailinfo				: `${ROOTAPPROVAL}/process/detail/info/accounting`,
	payingapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/detail/info/paying`,
	receiveapprovalprocessdetailinfo				: `${ROOTAPPROVAL}/process/detail/info/income`,
	bookkeepingapprovalprocessdetailinfo			: `${ROOTAPPROVAL}/process/detail/info/bookKeeping`,
	modifyapprovalprocessdetailinfo					: `${ROOTAPPROVAL}/process/modify/detail/info`,

}

export default
function fetchApi(type, method, data, callback, loadingtext) {

	fetchFunc(type, method, data, callback, loadingtext, URL)
}
