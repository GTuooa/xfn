import { fromJS } from 'immutable'
import { showMessage } from 'app/utils'
import * as ActionTypes from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'
import thirdParty from 'app/thirdParty'

//生产环境应当设置为空
const jzState = fromJS({
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
		[ActionTypes.INIT_JZ]					         : () => jzState,
        [ActionTypes.GET_CURRENCY_LIST_FETCH_JZ]	     : () => {
			const receivedData = fromJS(action.receivedData)
			let data = fromJS(action.receivedData)
			receivedData.map((u,i) => {
				const exchange = u.get('newExchange').toFixed(4)
				data = data.setIn([i, 'newExchange'], exchange)
			})
			return state.set('fcList', data)
		},
        [ActionTypes.CHANGE_EXCHANNGE_JZ]			: () => {
            if (/^\d*\.?\d{0,4}$/g.test(action.value)) {
                if (action.value == '') {
                    thirdParty.toast.info('为空时按默认汇率调汇')
    			}
				return state.setIn(['fcList', action.idx, 'newExchange'], action.value)
            }
            return state

		}
	}[action.type] || (() => state))()
}
