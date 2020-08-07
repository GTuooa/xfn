import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import { message } from 'antd'

//生产环境应当设置为空
const jzState = fromJS({
	flags: {
		circleStatus: true
	},
	fcList: [
		/*{
			fcNumber: '',
			name: '',
			exchange: '',
			standard: '',
			// newExchange: ''
		}*/
	]
})

export default function handleLrb(state = jzState, action) {
	return ({
		[ActionTypes.INIT_JZ]						: () => jzState,
        [ActionTypes.CHANGE_ICON]       			: () => state.setIn(['flags', 'circleStatus'], !state.getIn(['flags', 'circleStatus'])),
		[ActionTypes.GET_CURRENCY_LIST_FETCH_JZ]	: () => {
			const receivedData = fromJS(action.receivedData)
			let data = fromJS(action.receivedData)
			receivedData.map((u,i) => {
				const exchange = u.get('newExchange').toFixed(4)
				data = data.setIn([i, 'newExchange'], exchange)
			})
			return state.set('fcList', data)
		},
		[ActionTypes.CHANGE_EXCHANNGE_JZ]			: () => {
			if (action.value == '') {
				message.info('为空时按默认汇率调汇')
				return state.setIn(['fcList', action.idx, 'newExchange'], action.value)
			} else {
				const decimal = action.value.split('.')
				if (decimal[1] && decimal[1].length > Limit.FC_EXCHANGE_DECIMAL_LENGTH ) {
					state = state
				}
				return state.setIn(['fcList', action.idx, 'newExchange'], action.value)
			}
		}
	}[action.type] || (() => state))()
}
