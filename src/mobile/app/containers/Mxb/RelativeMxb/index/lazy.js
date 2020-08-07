import view from '../app.js'

import relativeMxbState from 'app/redux/Mxb/RelativeMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview'

const reducer = {
    relativeMxbState,
    runningPreviewState
}

export { reducer, view }
