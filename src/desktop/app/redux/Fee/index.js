import { fromJS } from 'immutable'

const ActionTypes = {
    SWITCH_FEE_ACTIVE_PAGE   : 'SWITCH_FEE_ACTIVE_PAGE'
}

//生产环境应当设置为空
const feeState = fromJS({
	views: {
        currentPage: 'Tcxq'
    },
})

export default function handleHome(state = feeState, action) {
	return ({
		[ActionTypes.SWITCH_FEE_ACTIVE_PAGE]			   : () => {
			return state = state.setIn(['views', 'currentPage'], action.page)
        },

	}[action.type] || (() => state))()
}

const feeActions = {
    switchFeeActivePage: (page) => ({
        type: ActionTypes.SWITCH_FEE_ACTIVE_PAGE,
        page
    })
}

export { feeActions }
