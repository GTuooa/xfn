import { fromJS } from 'immutable'

const ActionTypes = {
    SWITCH_RUNNING_INDEX_PAGE   : 'SWITCH_RUNNING_INDEX_PAGE'
}

//生产环境应当设置为空
const runningIndexState = fromJS({
	views: {
        currentPage: 'running'
    },
})

export default function handleRunningIndex(state = runningIndexState, action) {
	return ({
		[ActionTypes.SWITCH_RUNNING_INDEX_PAGE]			   : () => {
			return state = state.setIn(['views', 'currentPage'], action.page)
        },

	}[action.type] || (() => state))()
}

const runningIndexActions = {
    switchRunningIndexPage: (page) => ({
        type: ActionTypes.SWITCH_RUNNING_INDEX_PAGE,
        page
    })
}

export { runningIndexActions }
