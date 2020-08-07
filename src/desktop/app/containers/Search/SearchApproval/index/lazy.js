import view from '../app.js'

import searchApprovalState from 'app/redux/Search/SearchApproval/index.js'
import editRunningModalState from 'app/redux/Search/SearchApproval/editRunningModal.js'
import inventoryCardState from 'app/redux/Config/Inventory/editInventoryCard.js'
import relativeCardState from 'app/redux/Config/Relative/editRelativeCard.js'
import projectCardState from 'app/redux/Config/Project/editProjectCard.js'
import projectConfState from 'app/redux/Config/Project/index.js'
import runningPreviewState from 'app/redux/Edit/RunningPreview/index.js'
import approalCalculateState from 'app/redux/Search/SearchApproval/approalCalculate.js'
import searchRunningAllState from 'app/redux/Search/SearchRunning/searchRunningAll.js'



const reducer = {
    searchApprovalState,
    editRunningModalState,
    inventoryCardState,
    relativeCardState,
    projectCardState,
    projectConfState,
    runningPreviewState,
    approalCalculateState,
    searchRunningAllState,
}

export { reducer, view }