import view from '../app.js'

import inventoryMxbState from 'app/redux/Mxb/InventoryMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import searchRunningAllState from 'app/redux/Search/SearchRunning/searchRunningAll.js'
const reducer = {
    inventoryMxbState,
    runningPreviewState,
    searchRunningAllState
}

export { reducer, view }
