import { fromJS, toJS }	from 'immutable'
import { message } from 'antd'
import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'

//生产环境应当设置为空
const assetsYebState = fromJS({
	flags: {
		detailChildShow: [],
        chooseperiods: false
	},
	assetslist: [],
	detailList: [],
    AssetsMainData: {},
	// detailTotal:{
	// 	"cardValue": '',
	// 	"residualValue": '',
	// 	currentDepreciation: '',
	// 	"monthlyDepreciation": '',
	// 	"sumStarDepreciation": '',
	// 	"sumEndDepreciation": '',
	// 	"starNetWorth": '',
	// 	"endNetWorth": ''
	// },
	// currentSelectedKeys: ['1'],//当前被选中的卡片
	// currentSelectedTitle: '1_固定资产',//当前被选中的卡片
	issuedate: '',
    endissuedate: ''
})
export default
function handleAssetsYebState(state = assetsYebState, action) {
	return ({
        [ActionTypes.INIT_ASSETSYEB]            : () => assetsYebState,
		[ActionTypes.GET_DETAIL_ASSETS_FETCH]	: () => state.set('AssetsMainData', fromJS(action.receivedData))
                                                            .set('issuedate', action.issuedate)
                                                            .set('endissuedate', action.endissuedate),
        [ActionTypes.CHANGE_ASSETSYEB_CHOOSE_MORE_PERIODS]    : () => state.updateIn(['flags', 'chooseperiods'], v => !v),
		[ActionTypes.CHANGE_DETAILCHILDSHOW]    : () => {
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
