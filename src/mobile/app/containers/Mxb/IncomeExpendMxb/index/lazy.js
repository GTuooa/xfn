import view from '../app.js'

import incomeExpendMxbState from 'app/redux/Mxb/IncomeExpendMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview'

const reducer = {
    incomeExpendMxbState,
    runningPreviewState
}

export { reducer, view }
