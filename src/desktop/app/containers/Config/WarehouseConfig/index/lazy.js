import view from '../app.js';

import accountConfigState from 'app/redux/Config/AccountConfig'
import warehouseConfigState from 'app/redux/Config/warehouseConfig'

const reducer = {
    accountConfigState,
    warehouseConfigState
}

export { reducer, view }
