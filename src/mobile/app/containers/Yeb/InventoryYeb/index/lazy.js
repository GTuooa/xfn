import view from '../app.js'

import inventoryYebState from 'app/redux/Yeb/InventoryYeb'
import inventoryMxbState from 'app/redux/Mxb/InventoryMxb'
const reducer = {
    inventoryYebState,
    inventoryMxbState,
}

export { reducer, view }
