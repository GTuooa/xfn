import view from '../app.js'

import relativeMxbState from 'app/redux/Mxb/RelativeMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import searchRunningState from 'app/redux/Search/SearchRunning'
import searchRunningAllState from 'app/redux/Search/SearchRunning/searchRunningAll.js'

const reducer = {
    relativeMxbState,
    runningPreviewState,
    searchRunningState,
    searchRunningAllState
}

export { reducer, view }
