import view from '../index.js'

import searchApprovalState from 'app/redux/Search/SearchApproval/index.js'
import runningPreviewState from 'app/redux/Edit/RunningPreview'
import editRunningModalState from 'app/redux/Search/SearchApproval/editRunningModal.js'
import searchRunningState from 'app/redux/Search/SearchRunning'
import approalAccountState from 'app/redux/Search/SearchApproval/approalAccount'

import relativeConfState from 'app/redux/Config//Relative'
import inventoryConfState from 'app/redux/Config/Inventory/index.js'
import projectConfState from 'app/redux/Config/Project/index.js'

const reducer = {
    searchApprovalState,
    runningPreviewState,
    editRunningModalState,
    searchRunningState,
    approalAccountState,

    relativeConfState,
    inventoryConfState,
    projectConfState,
}

export { reducer, view }