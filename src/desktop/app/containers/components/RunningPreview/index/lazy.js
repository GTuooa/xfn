import view from '../app.js'

import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import editRunningState from 'app/redux/Edit/EditRunning'
import editCalculateState from 'app/redux/Edit/EditCalculate'
import editRunningAllState from 'app/redux/Edit/EditRunning/runningAll.js'
import searchRunningState from 'app/redux/Search/SearchRunning'
import filePrintState from 'app/redux/Edit/FilePrint'


const reducer = {
    runningPreviewState,
    editRunningState,
    editCalculateState,
    editRunningAllState,
    searchRunningState,
    filePrintState
}

export { reducer, view }
