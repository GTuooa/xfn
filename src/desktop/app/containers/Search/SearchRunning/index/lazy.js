import view from '../app.js'

import searchRunningState from 'app/redux/Search/SearchRunning'
import editRunningState from 'app/redux/Edit/EditRunning'
import editCalculateState from 'app/redux/Edit/EditCalculate'
import pzBombState from 'app/redux/Edit/PzBomb'
import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import editRunningAllState from 'app/redux/Edit/EditRunning/runningAll.js'
import searchRunningAllState from 'app/redux/Search/SearchRunning/searchRunningAll.js'
import runningEnclosureState from 'app/redux/Search/RunningEnclosure'
import filePrintState from 'app/redux/Edit/FilePrint'

const reducer = {
    searchRunningState,
    editRunningState,
    editCalculateState,
    pzBombState,
    runningPreviewState,
    editRunningAllState,
    searchRunningAllState,
    runningEnclosureState,
    filePrintState
}

export { reducer, view }
