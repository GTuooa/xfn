import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import * as editRunning from 'app/constants/editRunning.js'
import { DateLib, decimal } from 'app/utils'

//生产环境应当设置为空
const searchRunningState = fromJS({
	views: {
        currentPage: 1,
        pageCount: 1,//总页数
        start: '',
        end: '',
        issues: [{value: '2018-01', key: ''}],//所有账期
        isLoading: false,
        fromRouter: 'HOME',
        selectedIndex: 'CXLS',//查询流水 和查询核算管理的各个页面
		dateSelectValue: 'ISSUE',
		cardObj: {
			cardType: 'ALL',
			cardUuid: '',
			name: '全部',
			searchContent: '',
			isSearch: false,
		},
		fromPageType: ''
	},
	data: {//处理单笔流水的数据
        amount: '',
        oriAbstract: '',
		oriDate: '',
    },
	dataList: [],
	projectList: [],//单笔结转损益时项目卡片列表
	projectCardList: [],
	currentCardList: [],
	stockCardList: [],
	accounCardtList: [],
	poundageProjectList: [],

})

export default function handleEditRunning(state = searchRunningState, action) {
	return ({
		[ActionTypes.INIT_SEARCH_RUNNING]						: () => searchRunningState,
		[ActionTypes.SEARCHRUNNING_GETPERIOD_AND_BUSINESSLIST]	: () => {

			const issudate = action.issuedate

            return state.setIn(['views', 'start'],  issudate)
                        .setIn(['views', 'issues'], fromJS(action.issues))
                        .setIn(['views', 'pageCount'], action.receivedData.result.pageCount)
                        .set('dataList', fromJS(action.receivedData.result.jrList))
		},
		[ActionTypes.CHANGE_SEARCHRUNNING_DATA]                          : () => {
            return state.setIn(action.dataType, action.value)
        },
		[ActionTypes.SEARCHRUNNING_GET_BUSINESSLIST]						    : () => {
            if (action.shouldConcat) {
                let oldList = state.get('dataList').toJS()
                let newList = oldList.concat(action.receivedData.result.jrList)
                state = state.set('dataList', fromJS(newList))
            } else {
                state = state.set('dataList', fromJS(action.receivedData.result.jrList))
            }

            return state.setIn(['views', 'currentPage'], action.currentPage)
                        .setIn(['views', 'pageCount'], action.receivedData.result.pageCount)

        },
		[ActionTypes.SEARCHRUNNING_SELECT_LS_ALL]                    : () => {
            switch (action.selectedIndex) {
                case 'CXLS': {
                    state = state.update('dataList', v => v.map(w => w.set('selected', action.value)))
                    break
                }
                case 'CX_HSGL': {
                    state = state.updateIn(['hsgl', 'dataList'], v => v.map(w => w.set('selected', action.value)))
                    break
                }
            }

            return state
        },
		[ActionTypes.SEARCHRUNNING_SELECT_LS]                       : () => {
            return state.updateIn(['dataList', action.idx, 'selected'], v => !v)
        },
		[ActionTypes.GET_SEARCHRUNNING_SINGLE]                           : () => {//单笔核算管理
            const categoryType = action.receivedData.category.categoryType
            const type = editRunning.categoryTypeObj[categoryType]
			const jrOri = action.receivedData.jrOri
			const category = action.receivedData.category
			const oriDate = new DateLib(new Date()).valueOf()
			state = state.set('data', fromJS({}))

            switch (action.toRouter) {
                case 'SFGL': {
					let notHandleAmount = jrOri.notHandleAmount
					const oriState = jrOri.oriState
					let direction = ''
					if (notHandleAmount < 0 ) {
						direction = action.direction == 'debit' ? 'credit' : 'debit'
						if (oriState==='STATE_YYWSR') {
							direction='credit'
						}
					} else {
						direction = action.direction == 'credit' && !['STATE_YYZC_DJ', 'STATE_FY_DJ', 'STATE_YYZC_TG', 'STATE_SF_YJZZS'].includes(oriState) ? 'credit' : 'debit'
					}

					// 判断是收、付， 收退，付退
					let fromPageType = ''
					const fromPage = action.fromPage
					const actionFrom = action.actionFrom

					let title = 'QUERY_JR'
					if (fromPage === 'searchApproval') {
						title = 'QUERY_PROCESS'
					}

					if (direction === 'debit') {
						if (actionFrom === 'shouldReturn') {
							fromPageType = `${title}-QUICK_OPERATION-PAYMENT_REFUND`
						} else {
							fromPageType = `${title}-QUICK_OPERATION-COLLECTION`
						}
					} else if (direction === 'credit') {
						if (actionFrom === 'shouldReturn') {
							fromPageType = `${title}-QUICK_OPERATION-INCOME_REFUND`
						} else {
							fromPageType = `${title}-QUICK_OPERATION-PAYMENT`
						} 
					}
					// else {
					// 	const oldAmount = jrOri.amount
					// 	if (direction === 'debit' && oldAmount > 0) {
					// 		fromPageType = 'QUERY_PROCESS-QUICK_OPERATION-COLLECTION'
					// 	} else if (direction === 'debit' && oldAmount < 0) {
					// 		fromPageType = 'QUERY_PROCESS-QUICK_OPERATION-PAYMENT_REFUND'
					// 	} else if (direction === 'credit' && oldAmount > 0) {
					// 		fromPageType = 'QUERY_PROCESS-QUICK_OPERATION-PAYMENT'
					// 	} else if (direction === 'credit' && oldAmount < 0) {
					// 		fromPageType = 'QUERY_PROCESS-QUICK_OPERATION-INCOME_REFUND'
					// 	}
					// }

                    state = state.setIn(['data', 'amount'], Math.abs(jrOri.notHandleAmount))
								.setIn(['data', 'notHandleAmount'], Math.abs(jrOri.notHandleAmount))
                                .setIn(['data', 'amountTitle'],direction == 'debit' ? '收款金额：' : '付款金额：')
                                .setIn(['data', 'oriAbstract'], '核销账款')
								.setIn(['data', 'oriState'], 'STATE_SFGL')
								.setIn(['data', 'oriDate'], oriDate)
								.setIn(['data', 'currentCardList'], fromJS(jrOri.currentCardList))
								.setIn(['data', 'accounts'], fromJS([{"accountUuid": "", "accountName": ""}]))
                                .setIn(['data', 'pendingManageDto'], fromJS({
									categoryUuid: jrOri.categoryUuid,
									categoryName: jrOri.categoryName,
									pendingManageList: [{
										uuid: action.jrJvUuid
									}],
									oriDate: jrOri.oriDate,
								}))
								.setIn(['data', 'needUsedPoundage'], false)
								.setIn(['data', 'poundageCurrentCardList'], fromJS([]))
								.setIn(['data', 'poundageProjectCardList'], fromJS([]))
								.setIn(['views', 'fromPageType'], fromPageType)
                    break
                }
                case 'KJFP': {
                    let oriState = 'STATE_KJFP_XS'
                    let billType = 'BILL_MAKE_OUT_TYPE_XS'
					let oriAbstract = '收入开具发票'
                    if (jrOri.billList[0]['oriState'] == 'STATE_KJFP_TS') {
						oriState = 'STATE_KJFP_TS'
                        billType = 'BILL_MAKE_OUT_TYPE_TS'
						oriAbstract = '退销开具发票'
                    }

					let amount = 0
					jrOri.billList.forEach(v => {
						amount += v['notHandleAmount']
					})

					if (oriState == 'STATE_KJFP_TS') {
						amount = Math.abs(amount)
					}
					const jrAmount = jrOri['billList'][0]['tax']
					const taxTotal = decimal(amount/jrAmount*jrOri.amount)//计算价税合计
					
                    state = state.setIn(['data', 'oriAbstract'], oriAbstract)
								.setIn(['data', 'amount'], amount)
								.setIn(['data', 'oriState'], oriState)
								.setIn(['data', 'billType'], billType)
								.setIn(['data', 'taxTotal'], taxTotal)
								.setIn(['data', 'jrTaxAmount'], taxTotal)
								.setIn(['data', 'jrAmount'], jrAmount)
                                .setIn(['data', 'pendingStrongList'], fromJS([{
									categoryUuid: jrOri.categoryUuid,
									jrJvUuid: action.jrJvUuid,
									oriAmount: jrOri.amount,
									oriState: jrOri.oriState,
									taxAmount: jrOri['billList'][0]['tax'],
									taxRate: jrOri['billList'][0]['taxRate'],
									oriDate: jrOri.oriDate,
								}]))

                    break
                }
                case 'FPRZ': {
                    let oriState = 'STATE_FPRZ_CG'
                    let billType = 'BILL_AUTH_TYPE_CG'
					let oriAbstract = '增值税专用发票认证'
                    if (jrOri.billList[0]['oriState'] == 'STATE_FPRZ_TG') {
						oriState = 'STATE_FPRZ_TG'
                        billType = 'BILL_AUTH_TYPE_TG'
						oriAbstract = '退购红字发票认证'
                    }

					let amount = 0
					jrOri.billList.forEach(v => {
						amount += v['notHandleAmount']
					})

					if (oriState == 'STATE_FPRZ_TG') {
						amount = Math.abs(amount)
					}

                    state = state.setIn(['data', 'oriAbstract'], oriAbstract)
								.setIn(['data', 'amount'], amount)
								.setIn(['data', 'oriState'], oriState)
								.setIn(['data', 'billType'], billType)
								.setIn(['data', 'pendingStrongList'], fromJS([{
									categoryUuid: jrOri.categoryUuid,
									jrJvUuid: action.jrJvUuid,
									oriAmount: jrOri.amount,
									oriState: jrOri.oriState,
									taxAmount: jrOri['billList'][0]['tax'],
									taxRate: jrOri['billList'][0]['taxRate'],
									oriDate: jrOri.oriDate,
								}]))

                    break
                }
                case 'JZSY': {
                    let amount = Number(jrOri.amount)-Number(jrOri.billList[0].tax)

                    state = state.setIn(['data', 'oriAbstract'], '处置损益')
								.setIn(['data', 'oriState'], 'STATE_CQZC_JZSY')
                                .setIn(['data', 'categoryUuid'], jrOri.categoryUuid)
                                .setIn(['data', 'categoryName'], jrOri.categoryName)
                                .setIn(['data', 'amount'], amount)
                                .setIn(['data', 'assets', 'originalAssetsAmount'], '')
                                .setIn(['data', 'assets', 'depreciationAmount'], '')
								.setIn(['data', 'assets', 'cleaningAmount'], amount)
                                .setIn(['data', 'beProject'], action.receivedData.category.beProject)
                                .setIn(['data', 'usedProject'], action.receivedData.category.beProject)
                                .setIn(['data', 'projectRange'], action.receivedData.category.projectRange)
                                .setIn(['data', 'projectCardList'], fromJS([{amount: ''}]))
								.setIn(['data', 'pendingStrongList'], fromJS([{
									"beSelect": true,
									"oriUuid": jrOri.oriUuid,
									"jrUuid": jrOri.jrUuid,
									"oriDate": jrOri.oriDate,
									"amount": amount,
									'jrJvUuid': action.jrJvUuid
								}]))
                    break
                }
				case 'XCZC': {
					const oriAbstract = {SX_GZXJ:'发放工资薪金',SX_FLF:`支付${jrOri.categoryName}`,SX_QTXC:`发放${jrOri.categoryName}`}[category.propertyPay]

					state = state.setIn(['data', 'oriAbstract'], oriAbstract)
								.setIn(['data', 'oriState'], 'STATE_XC_FF')
								.setIn(['data', 'categoryUuid'], jrOri.categoryUuid)
								.setIn(['data', 'amount'], Math.abs(jrOri.notHandleAmount))
								.setIn(['data', 'notHandleAmount'], jrOri.notHandleAmount)
								.setIn(['data', 'payment'], fromJS({actualAmount: Math.abs(jrOri.notHandleAmount)}))
								.setIn(['data', 'accounts'], fromJS([{"accountUuid": "", "accountName": ""}]))
								.setIn(['data', 'pendingStrongList'], fromJS([{
									"beSelect": true,
									"jrIndex": jrOri.jrIndex,
									"oriDate": jrOri.oriDate,
									"amount": jrOri.amount,
									'jrJvUuid': action.jrJvUuid
								}]))
								.setIn(['data', 'needUsedPoundage'], false)
								.setIn(['data', 'poundageCurrentCardList'], fromJS([]))
								.setIn(['data', 'poundageProjectCardList'], fromJS([]))
					break
				}
				case 'DEFRAY': {//薪酬支出税费支出缴纳
					let amount = jrOri.amount
					const notHandleAmount = jrOri.notHandleAmount
					let oriAbstract = '', oriState = 'STATE_XC_JN'
					let payment = {actualAmount: Math.abs(notHandleAmount)}

					if (categoryType === 'LB_SFZC') {
						oriState = 'STATE_SF_JN'
						oriAbstract = {SX_QYSDS:'缴纳企业所得税',SX_QTSF:`缴纳${jrOri.categoryName}`,SX_ZZS:'缴纳增值税'}[category.propertyTax]
						amount = amount - (jrOri.tax || 0)
						state = state.setIn(['data', 'amount'], jrOri.notHandleAmount)
					} else {
						oriAbstract = `缴纳${{SX_SHBX:'社会保险',SX_ZFGJJ:'住房公积金'}[category.propertyPay]}`
						if (category === 'SX_ZFGJJ') {
							payment['companyAccumulationAmount'] =  Math.abs(notHandleAmount)
						} else {
							payment['companySocialSecurityAmount'] =  Math.abs(notHandleAmount)
						}
						state = state.setIn(['data', 'payment'], fromJS(payment))
					}

					state = state.setIn(['data', 'oriAbstract'], oriAbstract)
								.setIn(['data', 'oriState'], oriState)
								.setIn(['data', 'categoryUuid'], jrOri.categoryUuid)
								.setIn(['data', 'notHandleAmount'], jrOri.notHandleAmount)
								.setIn(['data', 'propertyPay'], category.propertyPay)
								.setIn(['data', 'accounts'], fromJS([{"accountUuid": "", "accountName": ""}]))
								.setIn(['data', 'pendingStrongList'], fromJS([{
									"beSelect": true,
									"jrIndex": jrOri.jrIndex,
									"oriDate": jrOri.oriDate,
									"amount": amount,
									'jrJvUuid': action.jrJvUuid,
									"notHandleAmount": notHandleAmount,
									oriUuid: jrOri.oriUuid
								}]))
								.setIn(['data', 'needUsedPoundage'], false)
								.setIn(['data', 'poundageCurrentCardList'], fromJS([]))
								.setIn(['data', 'poundageProjectCardList'], fromJS([]))
					break
				}
				case 'ZSFKX': {//暂收暂付
					const notHandleAmount = jrOri.notHandleAmount
					let oriAbstract = '暂付款收回', oriState = 'STATE_ZF_SH'

					if (categoryType === 'LB_ZSKX') {
						oriState = 'STATE_ZS_TH'
						oriAbstract = '暂收款退还'
					}
					state = state.setIn(['data', 'oriAbstract'], oriAbstract)
								.setIn(['data', 'oriState'], oriState)
								.setIn(['data', 'categoryUuid'], jrOri.categoryUuid)
								.setIn(['data', 'notHandleAmount'], notHandleAmount)
								.setIn(['data', 'amount'], notHandleAmount)
								.setIn(['data', 'accounts'], fromJS([{"accountUuid": "", "accountName": ""}]))
								.setIn(['data', 'pendingStrongList'], fromJS([{
									"beSelect": true,
									"jrIndex": jrOri.jrIndex,
									"oriDate": jrOri.oriDate,
									"amount": jrOri.amount,
									'jrJvUuid': action.jrJvUuid,
								}]))
								.setIn(['data', 'needUsedPoundage'], false)
								.setIn(['data', 'poundageCurrentCardList'], fromJS([]))
								.setIn(['data', 'poundageProjectCardList'], fromJS([]))
					break
				}
                default: console.log('获取单条数据失败');
            }


            return state.setIn(['data', 'oriDate'], oriDate)
        },
		[ActionTypes.SEARCHRUNNING_GET_PROJECT_CARDLIST]					: () => {
            let cardList = []
            action.receivedData.forEach((v, i) => {
                cardList.push({
                    key: `${v['code']} ${v['name']}`,
                    value: `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
                })
            })

            return state.set('projectList', fromJS(cardList))
        },
		[ActionTypes.GET_SEARCHRUNNING_CARD]					: () => {
            let cardList = [{key: '全部', value: ''}]
			let specialCard = []
            action.receivedData.forEach((v, i) => {
				let name = `${v['code']} ${v['name']}`
				if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(v['code'])) {
					name = v['name']
					specialCard.push({
						key: name,
						value: v['cardUuid'],
						order: {'COMNCRD': 0, 'ASSIST': 1, 'MAKE': 2, 'INDIRECT': 3, 'MECHANICAL': 4}[v['code']]
					})
					return
				}
                cardList.push({
                    key: name,
                    value: v['cardUuid']
                })
            })
			cardList.push(...specialCard.sort((a, b)=>a.order-b.order))

            return state.set(action.cardType, fromJS(cardList))
        },
		[ActionTypes.SEARCHRUNNING_GET_CARDLIST]					       : () => {
			if (action.cardType=='poundageProject') {
				let cardList = [], commonCard, idx = null
				action.receivedData.forEach((v, i) => {
					v['key'] = `${v['code']} ${v['name']}`,
					v['value'] = `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
					if (['COMNCRD', 'ASSIST', 'MAKE', 'INDIRECT', 'MECHANICAL'].includes(v['code'])) {
						v['key'] = v['name']
					}
					cardList.push(v)
				})

				return state.set('poundageProjectList', fromJS(cardList))
			}

			if (action.cardType == 'poundageCurrent') {
				let cardList = []
				action.receivedData.forEach(v => {
					let value = `${v['uuid']}${Limit.TREE_JOIN_STR}${v['code']}${Limit.TREE_JOIN_STR}${v['name']}`
					v['key'] = `${v['code']} ${v['name']}`
					v['value'] = value
					cardList.push(v)
				})

				state = state.set('poundageCurrentList', fromJS(cardList))
            }
            return state
        },

	}[action.type] || (() => state))()
}
