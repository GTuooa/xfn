import { fromJS, toJS }	from 'immutable'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const assetsYebState = fromJS({
	issuedate: '',
	endissuedate: '',
	currentPage: 1,
	showedLowerAssdetalList: [],
	detailassetslist: [{
		alreadyTime: 0,
		cardValue: 0,
		currentDepreciation: 0,
		serialName: "",
		serialNumber: "",
		termDepreciation: 0,
		totalTime: 0,
		upperNumber: ""
	}],
	assetsClass: {
		serialName: '',
		serialNumber: ''
	},
	classification: {
		serialName: '',
		serialNumber: ''
	},
	detailMxList: {
		'1': [
		// 	{
		// 	alreadyTime: 0,
		// 	cardValue: 0,
		// 	currentDepreciation: 0,
		// 	serialName: "",
		// 	serialNumber: "",
		// 	termDepreciation: 0,
		// 	totalTime: 0,
		// 	upperNumber: ""
		// }
		],
		'2': [],
		'3': [],
		'4': [],
		'5': []
	},
	detailMx:{}
})

export default function handleKmyeb(state = assetsYebState, action) {
	return ({
		[ActionTypes.INIT_ASSETSYEB]					  : () => assetsYebState,
		[ActionTypes.GET_ASSETS_DETAILFETCH]              : () => {
			return state.set('detailassetslist', fromJS(action.receivedData))
			.set('issuedate', action.issuedate)
			.set('endissuedate', action.endissuedate)
			.set('showedLowerAssdetalList', fromJS([]))
		},
		[ActionTypes.TOGGLELOWERDETAILASSETS]			  : () => {
			const showedLowerAssdetalList = state.get('showedLowerAssdetalList')

			if (showedLowerAssdetalList.indexOf(action.serialNumber) > -1)
				return state.update('showedLowerAssdetalList', v => v.map(w => w.indexOf(action.serialNumber) > -1 ? '' : w).filter(w => !!w))
			else
				return state.update('showedLowerAssdetalList', v => v.push(action.serialNumber))
		},
		[ActionTypes.GET_DETAIL_LIST_SINGLE] 			  : () => {
			const serialNumber = action.serialNumber
			const serialName = action.serialName
			if (serialNumber.length === 1) {
				state = state.setIn(['assetsClass', 'serialNumber'], action.serialNumber).setIn(['assetsClass', 'serialName'], serialName)
						.setIn(['classification', 'serialNumber'], '').setIn(['classification', 'serialName'], '')
			} else if (serialNumber.length === 3) {
				if (action.prePage === 'index'){
					state = state.setIn(['assetsClass', 'serialNumber'], action.receivedData.cardList[0].assetsNumber)
								.setIn(['assetsClass', 'serialName'], action.receivedData.cardList[0].assetsName)
								.setIn(['classification', 'serialNumber'], action.serialNumber)
								.setIn(['classification', 'serialName'], serialName)
				} else {
					state = state.setIn(['classification', 'serialNumber'], action.serialNumber).setIn(['classification', 'serialName'], serialName)
				}
			} else if (serialNumber === '全部') {
				state = state.setIn(['classification', 'serialNumber'], '')
							.setIn(['classification', 'serialName'], '')
			}
			state = state.set('detailMx',fromJS(action.receivedData))
						 .set('issuedate', action.issuedate)
						 .set('endissuedate', action.endissuedate)
						 .set('currentPage', 1)
			return state
		},
		[ActionTypes.CHANGE_ASSETS_MXB_CURRENTPAGE]			: () => {
			return state = state.set('currentPage', action.currentPage)
		}
	}[action.type] || (() => state))()
}
