import view from '../index.js'

import editRunningState from 'app/redux/Edit/EditRunning'
import relativeConfState from 'app/redux/Config//Relative'
import inventoryConfState from 'app/redux/Config/Inventory/index.js'
import projectConfState from 'app/redux/Config/Project/index.js'
import accountConfigState from 'app/redux/Config/Account'
import previewEnclosureState from 'app/redux/Edit/PreviewEnclosure/index.js'

const reducer = {
    editRunningState,
    relativeConfState,
    inventoryConfState,
    projectConfState,
    accountConfigState,
    previewEnclosureState,
}

export { reducer, view }
