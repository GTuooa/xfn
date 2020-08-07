import view from '../app.js'

import accountMxbState from 'app/redux/Mxb/AccountMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview'

const reducer = {
    accountMxbState,
    runningPreviewState
}

export { reducer, view }
