import view from '../app.js'

import incomeExpendMxbState from 'app/redux/Mxb/IncomeExpendMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import searchRunningState from 'app/redux/Search/SearchRunning'
import searchRunningAllState from 'app/redux/Search/SearchRunning/searchRunningAll.js'

const reducer = {
    incomeExpendMxbState,
    runningPreviewState,
    searchRunningState,
    searchRunningAllState
}

export { reducer, view }
