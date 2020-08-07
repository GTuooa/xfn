import view from '../app.js'

import inventoryConfState from 'app/redux/Config/Inventory/index.js'
import inventoryCardState from 'app/redux/Config/Inventory/editInventoryCard.js'
import lrAccountState from 'app/redux/Edit/LrAccount'

const reducer = {
    inventoryConfState,
    inventoryCardState,
    lrAccountState,
}

export { reducer, view }
