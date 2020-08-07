import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'
import thirdParty from 'app/thirdParty'

//生产环境应当设置为空
const assetsState = fromJS({
	currentassetsindex: 1,
	showSelectlabel: false,
	assetsConfigMode: 'insert',
	assetsCardMode: 'insert',
	showCardDetail: true,
	allModifyButtonDisplay: false,
	showedLowerAssetsIdList: [],
	assetsCheckboxDisplay: false,
	selectLabeListAllDisplay: false,// 标志：是否显示全部的标签列表
	// selectLabeList: ['红街店', '总经办', '明月刀明月刀', '张无忌', '圣后', '梦想小镇互联网村', '丁桥店', '总部', '一个西藏', '喜欢你－藏语版', '若初见', '悲画扇', '程序有毒'],
	selectLabeList: [],
	periodIssuedate: '',

	tabSelectedIndex: 0,// 所指科目类别

	selectAcIndex: '',
	classificationOrCard: '',

    assetslist:[
		// {
		// 	serialNumber: '1',
		// 	serialName: '固定资产',
		// 	upperAssetsNumber: '',
		// 	checked: false,
		// 	idx: 0
		// }
	],
	classification:{
		serialNumber: '',
		serialName: '',
		upperAssetsName: '',
		upperAssetsNumber: '',
		depreciationMethod: '平均年限法',
		totalMonth: '',
		salvage: '',
		assetsAcId: '',
		assetsAcName: '',
		assetsAcAssList: [
			// {
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: ''
			// }
		],
		debitId: '',
		debitName: '',
		debitAssList: [
			// {
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: ''
			// }
		],
		creditId: '',
		creditName: '',
		creditAssList: [
			// {
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: ''
			// }
		],
		remark: ''
	},
	card: {
		serialNumber: '',
		oldSerialNumber: '',
		cardNumber: '',
		cardName: '',
		assetsName: '',
		assetsNumber: '',
		classificationName: '',
		classificationNumber: '',
		label: [],// 标签list
		startTime: '',//开始使用期间
		inputPeriod: '',//录入期间
		depreciationMethod: '平均年限法',
		totalMonth: '',
		debitId: '',
		debitName: '',
		debitAssList: [
			// {
			// 	asskey: '',
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: '',
			// }
		],
		creditId: '',
		creditName: '',
		creditAssList: [
			// {
			// 	asskey: '',
			// 	assId: '',
			// 	assName: '',
			// 	assCategory: '',
			// }
		],
		cardValue: '',// 原值
		salvage: '',// 残值率
		residualValue: '',// 预计残值
		monthlyDepreciation: '',// 月折旧
		alreadyDepreciationTime: '',// 已折旧期间
		sumDepreciation: '',// 累计折旧
		earlyNetWorth: '',// 期初
		// 卡片状态：
		// 0:正常使用、
		// 1:清理中，
		// 2:已清理
		status: '0',
		currentCardTime: '',// 本期期间(当前卡片期间)
		remark: ''
	},
	cardDetailList: {
		'1': [],
		'2': [],
		'3': [],
		'4': [],
		'5': []
	}
})

export default function handleAssets(state = assetsState, action) {
	return ({
		[ActionTypes.INIT_ASSETS]						  : () => assetsState,
		[ActionTypes.INIT_ASSETS_STATUS]				  : () => state.set('allModifyButtonDisplay', false),
		[ActionTypes.INIT_ASSETS_CARD]					  : () => state.set('card', assetsState.get('card')),
		[ActionTypes.INIT_ASSETS_CLASSIFICATION]		  : () => state.set('classification', assetsState.get('classification')),
		[ActionTypes.GET_LABEL_LIST]					  : () => state.set('selectLabeList', fromJS(action.receivedData.data)),
		[ActionTypes.GET_ASSESTS_LIST_FETCH]			  : () => {
			// console.log('')
			let cardDetailList = {
				'1': [],
				'2': [],
				'3': [],
				'4': [],
				'5': []
			}
			state = state.set('assetslist', fromJS(action.receivedData))
			if (action.receivedData) {
				fromJS(action.receivedData).forEach((v, i)=> {
					if (v.get('serialNumber').length === 7) {
						cardDetailList[v.get('serialNumber').substr(0,1)].push(v.get('serialNumber'))
					}
					state = state.setIn(['assetslist', i, 'idx'], i).setIn(['assetslist', i, 'checked'], false)
				})
			}

			return state.set('cardDetailList', fromJS(cardDetailList))
		},
		// [ActionTypes.DETAIL_ENTO_CARD] 								: () => {
		//
		// },
        [ActionTypes.SHOW_ALL_MODIFY_BUTTON]              : () => state.update('allModifyButtonDisplay', v => !v).update('showedLowerAssetsIdList', v => v.merge(['1', '2', '3', '4', '5'])),
		[ActionTypes.TOGGLE_LOWER_ASSETS]                 : () => {
			const showedLowerAssetsIdList = state.get('showedLowerAssetsIdList')

			if (showedLowerAssetsIdList.indexOf(action.id) > -1)
				return state.update('showedLowerAssetsIdList', v => v.map(w => w.indexOf(action.id) > -1 ? '' : w).filter(w => !!w))
			else
				return state.update('showedLowerAssetsIdList', v => v.push(action.id))
		},
		[ActionTypes.CHANGE_SALVAGE]      	  : () => {
			if (/^[0-9\.]*$/g.test(action.value) || action.value === '') {
				if (action.value > 100) {
					return state
				} else {
					return state.updateIn(['classification', 'salvage'], v => action.value)
				}
			} else {
				return state
			}
		},
		[ActionTypes.CHANGE_DEFAULT_USE_MONTH]				: () => {
			if (/^[0-9]*$/g.test(action.value) || action.value === '') {
				state = state.updateIn(['classification', 'totalMonth'], v => action.value)
			}
			return state
		},
		[ActionTypes.CHANGE_SERIAL_NAME]            : () => state.updateIn(['classification', 'serialName'], v => action.name),
		[ActionTypes.CHANGE_CLASSIFICATION_ID]				: () => {
			const id = action.id
			const upperAssetsNumber = action.upperAssetsNumber
			var re = eval("/^" + upperAssetsNumber + "[0-9]*$/g")
			if (re.test(id) && id.length < 4) {
				state = state.updateIn(['classification', 'serialNumber'], v => id)
			}
			return state
		},
		[ActionTypes.CHANGE_REMARK]							: () => state.updateIn(['classification', 'remark'], v => action.remark),
		[ActionTypes.BEFORE_INSERT_CLASSIFICATION]			: () => state.set('classification', fromJS(action.receivedData))
																		.set('assetsConfigMode', 'insert')
																		.set('currentassetsindex', action.currentassetsindex)
																		.setIn(['classification', 'serialNumber'], action.newassetsId)
																		.setIn(['classification', 'upperAssetsNumber'], action.currentassetsindex)
																		.setIn(['classification', 'upperAssetsName'], action.upperAssetsName)
																		.setIn(['classification', 'remark'], '')
																		.setIn(['classification', 'serialName'], ''),
		[ActionTypes.ASSETS_SELECT_AC]						: () => {
			const selectAcIndex = action.selectAcIndex
			const classificationOrCard = action.classificationOrCard

			state = state.setIn([classificationOrCard, `${selectAcIndex}Id`], action.acid)
						.setIn([classificationOrCard, `${selectAcIndex}Name`], action.acname)

			const asscategorylist = action.asscategorylist
			if (asscategorylist.size) {
				// return state.setIn([classificationOrCard, `${selectAcIndex}AssList`, 0, 'assCategory'], action.aclist.getIn([0, 'asscategorylist', 0]))
				return state.setIn([classificationOrCard, `${selectAcIndex}AssList`], fromJS(asscategorylist.map(v => {return fromJS({'assCategory': v})})))

			} else {
				return state.updateIn([classificationOrCard, `${selectAcIndex}AssList`], v => v.clear())
			}
		},
		[ActionTypes.GET_CLASSIFICATION_FETCH]					: () => {
			return state.set('assetsConfigMode', 'modify')
						.set('classification', fromJS(action.receivedData.data))
		},
		[ActionTypes.ENTER_ASSETS_ASSLIST]						: () => {
			const ass = action.value.split('_')
			return state.setIn(['classification', 'assetsAcAssList', 0, 'assId'], ass[0]).setIn(['classification', 'assetsAcAssList', 0, 'assName'], ass[1])
		},
		[ActionTypes.AFTER_ENTER_CLASSIFICATION]				: () => state.set('allModifyButtonDisplay', false)
																			.set('assetsConfigMode', 'insert'),
		[ActionTypes.ENTER_CLASSIFICATION_OR_CARD_ASSLIST]						: () => {
			const ass = action.value.split('_')
			const classificationOrCard = action.classificationOrCard
			const strAsslist = action.strAsslist
			return state.setIn([classificationOrCard, strAsslist, action.idx, 'assId'], ass[0]).setIn([classificationOrCard, strAsslist, action.idx, 'assName'], ass[1])
		},
		[ActionTypes.SELECT_ASSETS_ITEM] 						: () => state.updateIn(['assetslist', action.idx, 'checked'], v => !v),
		[ActionTypes.CHANGE_ASSETS_CHECKBOX]          			: () => {
			if (state.get('showedLowerAssetsIdList').size === 0) {
				state = state.update('showedLowerAssetsIdList', v => v.merge(['1', '2', '3', '4', '5']))
			}
			return state.update('assetsCheckboxDisplay', v => !v)
		},
		[ActionTypes.CANCEL_ASSETS_CHECKBOX]   					: () => {
			if (action.bool === false) {
				return state.set('assetslist', state.get('assetslist').map(v => v.set('checked', false))).update('assetsCheckboxDisplay', v => false)
			}
			return state.set('assetslist', state.get('assetslist').map(v => v.set('checked', false))).update('assetsCheckboxDisplay', v => !v)
		},
		[ActionTypes.SELECT_ALL_ASSETS_CHECKBOX] 				: () => state.set('assetslist', state.get('assetslist').map(v => v.set('checked', !state.get('assetslist').every(v => v.get('checked'))))),
		[ActionTypes.CHANGE_TAB_INDEX_ASSETSCONFIG]				: () => state.set('tabSelectedIndex', action.idx),
		[ActionTypes.ASSETS_TO_AC]					: () => state.set('selectAcIndex', action.selectAcIndex)
																.set('classificationOrCard', action.classificationOrCard),
																// .set('toolBarDisplayIndex', 4)

		// card
		[ActionTypes.GET_ASSETS_CARD_FETCH]						: () => state.set('assetsCardMode', 'detail').set('card', fromJS(action.receivedData.data)).setIn(['card', 'oldSerialNumber'], action.oldSerialNumber).setIn(['card', 'oldCardNumber'], action.receivedData.data.cardNumber),
		[ActionTypes.CHANGE_CARD_PERIOD]						: () => state.set('periodIssuedate', action.cardInputPeriod),
		[ActionTypes.GET_CARDNUMBER_FETCH]						: () => {
			// const _date = new Date()
			// const year = _date.getFullYear()
			// const _month = _date.getMonth() + 1
			// const month = _month > 9 ? _month : '0' + _month
			// const _day = _date.getDate()
			// const day = _day > 9 ? _day : '0' + _day
			//.setIn(['card', 'inputPeriod'], action.cardInputPeriod).setIn(['card', 'currentCardTime'], action.cardInputPeriod)
			// const date = `${year}/${month}/${day}`

			// const inputPeriod = month === 12 ? `${year+1}年第${1}期` : `${year}年第${month+1}期`
			return state.set('card', assetsState.get('card'))
						// .setIn(['card', 'startTime'], date)
						.setIn(['card', 'inputPeriod'], state.get('periodIssuedate'))
						.setIn(['card', 'currentCardTime'], state.get('periodIssuedate'))
						.setIn(['card', 'cardNumber'], action.receivedData.data)
						.set('assetsCardMode', 'insert')
		},
		[ActionTypes.CHANGE_CARD_NAME]							: () => state.setIn(['card', 'cardName'], action.name),
		[ActionTypes.CHANGE_CARD_NUNBER]						: () => state.setIn(['card', 'cardNumber'], action.value),
		[ActionTypes.CARD_AFTER_GET_CLASSIFICATION] 			: () => {
			return state.setIn(['card', 'depreciationMethod'], action.receivedData.data.depreciationMethod)
																				.setIn(['card', 'debitId'], action.receivedData.data.debitId)
																				.setIn(['card', 'debitName'], action.receivedData.data.debitName)
																				.setIn(['card', 'debitAssList'], fromJS(action.receivedData.data.debitAssList))
																				.setIn(['card', 'creditId'], action.receivedData.data.creditId)
																				.setIn(['card', 'creditName'], action.receivedData.data.creditName)
																				.setIn(['card', 'creditAssList'], fromJS(action.receivedData.data.creditAssList))
																				.setIn(['card', 'totalMonth'], action.receivedData.data.totalMonth ? action.receivedData.data.totalMonth : '')
																				.setIn(['card', 'salvage'], action.receivedData.data.salvage ? action.receivedData.data.salvage : '')
		},
		[ActionTypes.CHANGE_CARD_REMARK]						: () => state.setIn(['card', 'remark'], action.remark),
		[ActionTypes.CHANGE_CARD_SALVAGE]						: () => {
			if (/^[0-9\.]*$/g.test(action.salvage) || action.salvage === '') {
				if (action.salvage > 100) {
					return state
				} else {
					return state.updateIn(['card', 'salvage'], v => action.salvage)
				}
			} else {
				return state
			}
		},
		[ActionTypes.CHANGE_CARD_ORIGINAL_VALUE]				: () => {
			// 输入数值保留2位小数
			if ((/^\d*\.?\d{0,2}$/g.test(action.cardValue)) || action.cardValue === '') {
				return state.updateIn(['card', 'cardValue'], v => action.cardValue)
			} else {
				return state
			}
		},
		[ActionTypes.CHANGE_USE_MONTH]							: () => {
			if(/^[0-9]{1,3}$/g.test(action.monthValue) || action.monthValue === '') {
				return state.updateIn(['card', 'totalMonth'], v => action.monthValue)
			}
			return state
		},
		[ActionTypes.CHANGE_START_USE_TIME]    					: () => {

			const year = action.value.substr(0,4)
			const month = action.value.substr(5,2)
			const day = action.value.substr(8,2)
			const date = `${year}/${month}/${day}`


			const issuedateyear = action.issuedate.substr(0,4)
			const issuedatemonth = action.issuedate.substr(6,2)

			if (year > issuedateyear || (year === issuedateyear && month > issuedatemonth)) {
				thirdParty.Alert('日期不合法，不能超过录入日期')
			} else {
				state = state.setIn(['card', 'startTime'], date)
			}

			// const issueTodate = new Date(issuedate)

			// console.log('startusettimevalue:', action.value <= newDate)
			// const valueDate = new Date(action.value)
			// alert('date:'+ date +',valueDate:'+ valueDate +',issueTodate:'+issueTodate)




			// if (valueDate <= issueTodate) {
			// 	state =  state.setIn(['card', 'startTime'], date)
			// }
			// else {
			// 	showMessage('', '', '', '日期不合法，不能超过录入日期')
			// }
			return state
		},
		[ActionTypes.CHANGE_CARD_ASSETS_NAME]					: () => {
			const value = action.value.split('_')

			return state.setIn(['card', 'assetsNumber'], value[0])
						.setIn(['card', 'assetsName'], value[1])
						.setIn(['card', 'classificationNumber'], '')
						.setIn(['card', 'classificationName'], '')
						.setIn(['card', 'serialNumber'], `${value[0]}00`)
		},
		[ActionTypes.CHANGE_CARD_CLASSIFICATION_NAME]					: () => {
			const value = action.value.split('_')

			return state.setIn(['card', 'classificationNumber'], value[0])
						.setIn(['card', 'classificationName'], value[1])
						.setIn(['card', 'serialNumber'], `${value[0]}`)
		},
		[ActionTypes.BEFORE_ENTER_CARD] 								: () => state.setIn(['card', 'residualValue'], action.residualValue)
																					.setIn(['card', 'monthlyDepreciation'], action.monthlyDepreciation)
																					.setIn(['card', 'alreadyDepreciationTime'], action.alreadyDepreciationTime)
																					.setIn(['card', 'sumDepreciation'], action.sumDepreciation)
																					.setIn(['card', 'earlyNetWorth'], action.earlyNetWorth)
																					.updateIn(['card', 'label'], v => v.filter(w => w !== '' || w !== ' ')),
		[ActionTypes.BEFORE_MOFIFY_CARD]								: () => state.set('assetsCardMode', 'modify'),
		[ActionTypes.CHANGE_DETAIL_CARD]								: () => state.set('assetsCardMode', 'detail'),
		[ActionTypes.CHANGE_CARD_STATUS]								: () => {

			if (action.status === '0') {
				state = state.setIn(['card', 'clearCardMonth'], '0')
							.setIn(['card', 'clearCardYear'], '0')
			} else if (action.status === '1')  {
				state = state.setIn(['card', 'clearCardMonth'], action.openedmonth)
							.setIn(['card', 'clearCardYear'], action.openedyear)
			}

			return state.setIn(['card', 'status'], action.status)
		},
		[ActionTypes.CHANGE_SELECTLABEL_STATUS]							: () => state.set('showSelectlabel', action.status),
		[ActionTypes.CHANGE_SELECT_LABELIST_ALL_DISPLAY]				: () => state.update('selectLabeListAllDisplay', v => !v),
		[ActionTypes.CHANGE_LABELINPUT]									: () => {
			if (action.labelList.get(0) === '') state = state.updateIn(['card', 'label'], v => v.clear())
			let spaceLabelList = action.value.split(' ')
			// spaceLabelList.forEach(v => {
			// 	if (v === ' ') {
			// 		v = ''
			// 	}
			// })
			// if (spaceLabelList.length === 4) {
			// 	spaceLabelList.pop()
			// }
			if (spaceLabelList.length >= 4) {
				spaceLabelList.pop()
				return state
			}else {
				return state.updateIn(['card', 'label'], v => fromJS(spaceLabelList))
			}
		},
		[ActionTypes.CHANGE_LABEL_FROM_SELECT]							: () => {
			if (action.labelList.get(0) === '') state = state.updateIn(['card', 'label'], v => v.clear())
			if (action.labelList.size < 4) {
				if (action.labelList.indexOf(action.value) > -1) {
					return state.updateIn(['card', 'label'], v => v.filter(w => w !== action.value))
				} else {
					if(action.labelList.size < 3) {
						return state.updateIn(['card', 'label'], v => {
							return v.push(action.value)
						})
					} else {
						return state
					}
				}
			} else {
				return state
			}
		}
	}[action.type] || (() => state))()
}
