import view from '../app.js'

import projectMxbState from 'app/redux/Mxb/ProjectMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview'

const reducer = {
    projectMxbState,
    runningPreviewState
}

export { reducer, view }
