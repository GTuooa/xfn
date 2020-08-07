import view from '../app.js'

import runningTypeMxbState from 'app/redux/Mxb/RunningTypeMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import searchRunningState from 'app/redux/Search/SearchRunning'
import searchRunningAllState from 'app/redux/Search/SearchRunning/searchRunningAll.js'

const reducer = {
    runningTypeMxbState,
    runningPreviewState,
    searchRunningState,
    searchRunningAllState
}

export { reducer, view }
