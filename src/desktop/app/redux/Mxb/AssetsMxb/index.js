import { fromJS, toJS }	from 'immutable'
import { message } from 'antd'
import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const assetsMxbState = fromJS({
	flags: {
		detailChildShow: [],
		chooseperiods: false
	},
	assetslist: [],
	mxMaindata: {
		// cardList: []
		// "cardValue": '',
		// 	"residualValue": '',
		// 	currentDepreciation: '',
		// 	"monthlyDepreciation": '',
		// 	"sumStarDepreciation": '',
		// 	"sumEndDepreciation": '',
		// 	"starNetWorth": '',
		// 	"endNetWorth": ''
	},
	issuedate: '',
	endissuedate: '',
	currentSelectedKeys: ['1'], //当前被选中的卡片
	currentSelectedTitle: '1_固定资产' ,//当前被选中的卡片
	currentPage: 1,
	pageCount: 0,

})
export default
function handleAssetsMxbState(state = assetsMxbState, action) {
	return ({
		[ActionTypes.INIT_ASSETSMXB]					  : () => assetsMxbState,
		[ActionTypes.GET_ASSESTS_LIST_FETCH] 			  : () => {
			state = state.set('assetslist', fromJS(action.receivedData))
			return state
		},
		[ActionTypes.GET_MX_LIST_FETCH]						: () => {
				state = state.set('mxMaindata', fromJS(action.receivedData))
				// .setIn(['mxTotal','cardValue'], fromJS(action.receivedData.cardValue))
				// .setIn(['mxTotal','residualValue'], fromJS(action.receivedData.residualValue))
				// .setIn(['mxTotal','currentDepreciation'], fromJS(action.receivedData.currentDepreciation))
				// .setIn(['mxTotal','monthlyDepreciation'], fromJS(action.receivedData.monthlyDepreciation))
				// .setIn(['mxTotal','sumStarDepreciation'], fromJS(action.receivedData.sumStarDepreciation))
				// .setIn(['mxTotal','sumEndDepreciation'], fromJS(action.receivedData.sumEndDepreciation))
				// .setIn(['mxTotal','starNetWorth'], fromJS(action.receivedData.starNetWorth))
				// .setIn(['mxTotal','endNetWorth'], fromJS(action.receivedData.endNetWorth))
				// .setIn(['currentSelectedKeys', 0], action.serialNumber.toString())
				.set('issuedate', action.issuedate)
				.set('endissuedate', action.endissuedate)
				.setIn(['currentSelectedKeys', 0], action.serialNumber ? action.serialNumber.toString() : '1')
				.set('currentPage', action.currentPage) 
				.set('pageCount', action.pageCount)

				if(isNaN(action.serialNumber)){//搜索框的值
					state = state.set('currentSelectedTitle',action.serialNumber)
				}else{
					state.get('assetslist').map(v=>{
						if(v.get('serialNumber')==action.serialNumber){
							state=state.set('currentSelectedTitle',v.get('serialNumber')+'_'+v.get('serialName'))
						}
					})
				}

				return state
		},
		[ActionTypes.CHANGE_ASSETS_MXB_CHOOSE_MORE_PERIODS] : () => action.bool === undefined ? state.updateIn(['flags', 'chooseperiods'], v => !v) : state.setIn(['flags', 'chooseperiods'], action.bool),
		[ActionTypes.CHANGE_DETAILCHILDSHOW]			  : () => {
			const assetsChildShow = state.getIn(['flags' ,'detailChildShow'])
			if (assetsChildShow.indexOf(action.serialNumber) === -1) {
				const newAssetsChildShow = assetsChildShow.push(action.serialNumber)
				return state.setIn(['flags', 'detailChildShow'], newAssetsChildShow)
			} else {
				const newAssetsChildShow = assetsChildShow.splice(assetsChildShow.findIndex(v => v === action.serialNumber), 1)
				return state.setIn(['flags', 'detailChildShow'], newAssetsChildShow)
			}
		}
	}[action.type] || (() => state))()
}
