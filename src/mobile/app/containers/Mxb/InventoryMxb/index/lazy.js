import view from '../app.js'

import inventoryMxbState from 'app/redux/Mxb/InventoryMxb'
import runningPreviewState from 'app/redux/Edit/RunningPreview'

const reducer = {
    inventoryMxbState,
    runningPreviewState
}

export { reducer, view }
