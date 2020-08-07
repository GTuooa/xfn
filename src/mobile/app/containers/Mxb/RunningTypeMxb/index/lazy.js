import view from '../app.js'

import runningTypeMxbState from 'app/redux/Mxb/RunningTypeMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview'

const reducer = {
    runningTypeMxbState,
    runningPreviewState
}

export { reducer, view }
