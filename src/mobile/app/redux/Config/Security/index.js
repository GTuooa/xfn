import { fromJS }	from 'immutable'
import * as ActionTypes	from './ActionTypes.js'
import * as Limit from 'app/constants/Limit.js'

//生产环境应当设置为空
const securityState = fromJS({
    views: {

    },
    setting: {
        adminList: [],
        financeList: [
            // {
            //     emplId: 'sdfdsf',
            //     name: 'sgsdfgsdfgdfgsdfgsdfgdsfgsdgfsdfgsdfgdsfgsdfg'
            // },
            // {
            //     emplId: '123',
            //     name: '4545'
            // }
        ],
        informList: [

        ]
    }
})

export default function handleLrb(state = securityState, action) {
	return ({
		[ActionTypes.INIT_SECURITY]						        : () => securityState,
        [ActionTypes.GET_SECURITY_PERMISSION_LIST]              : () => {
            state = state.set('setting', fromJS(action.receivedData))
            return state
        },
        [ActionTypes.DELETE_SECURITY_PERMISSION_EMPL]           : () => {
            state = state.updateIn(['setting', action.listName], v => v.delete(action.index))
            return state
        },
        [ActionTypes.CHANGE_SECURITY_PERMISSION_LIST]           : () => {
            state = state.setIn(['setting', action.listName], fromJS(action.list))
            return state
        }

	}[action.type] || (() => state))()
}
