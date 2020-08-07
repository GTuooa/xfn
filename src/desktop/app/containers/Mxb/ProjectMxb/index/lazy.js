import view from '../app.js'

import projectMxbState from 'app/redux/Mxb/ProjectMxb'
import searchRunningState from 'app/redux/Search/SearchRunning'
import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import searchRunningAllState from 'app/redux/Search/SearchRunning/searchRunningAll.js'

const reducer = {
    projectMxbState,
    searchRunningState,
    runningPreviewState,
    searchRunningAllState
}

export { reducer, view }
