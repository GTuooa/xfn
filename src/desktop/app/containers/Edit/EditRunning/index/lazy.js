import view from '../app.js'

import editRunningState from 'app/redux/Edit/EditRunning'
import editCalculateState from 'app/redux/Edit/EditCalculate'
import editRunningAllState from 'app/redux/Edit/EditRunning/runningAll.js'
// import accountConfState from 'app/redux/Config/Account'

import inventoryCardState from 'app/redux/Config/Inventory/editInventoryCard.js'
import relativeCardState from 'app/redux/Config/Relative/editRelativeCard.js'
import projectCardState from 'app/redux/Config/Project/editProjectCard.js'
import projectConfState from 'app/redux/Config/Project/index.js'
import accountConfigState from 'app/redux/Config/AccountConfig'
import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import searchRunningAllState from 'app/redux/Search/SearchRunning/searchRunningAll.js'
import searchRunningState from 'app/redux/Search/SearchRunning'


const reducer = {
    editRunningState,
    editCalculateState,
    editRunningAllState,
    inventoryCardState,
    relativeCardState,
    projectCardState,
    projectConfState,
    accountConfigState,
    runningPreviewState,
    searchRunningAllState,
    searchRunningState
}

export { reducer, view }
