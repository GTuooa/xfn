import view from '../app.js'

import accountMxbState from 'app/redux/Mxb/AccountMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import searchRunningAllState from 'app/redux/Search/SearchRunning/searchRunningAll.js'

const reducer = {
    accountMxbState,
    runningPreviewState,
    searchRunningAllState
}

export { reducer, view }
