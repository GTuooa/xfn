import view from '../index.js'

import editApprovalState from 'app/redux/Edit/EditApproval/index.js'
import relativeConfState from 'app/redux/Config//Relative'
import inventoryConfState from 'app/redux/Config/Inventory/index.js'
import projectConfState from 'app/redux/Config/Project/index.js'

const reducer = {
    editApprovalState,
    relativeConfState,
    inventoryConfState,
    projectConfState
}

export { reducer, view }
