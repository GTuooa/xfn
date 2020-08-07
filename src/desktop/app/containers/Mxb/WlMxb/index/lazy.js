import view from '../app.js'

import accountConfState from 'app/redux/Config/Account'
import wlmxState from 'app/redux/Mxb/WlMxb'
import lrAccountState from 'app/redux/Edit/LrAccount'
import lrCalculateState from 'app/redux/Edit/LrAccount/lrCalculate'
import yllsState from 'app/redux/Search/Ylls'
const reducer = {
    accountConfState,
    wlmxState,
    lrAccountState,
    lrCalculateState,
    yllsState
}

export { reducer, view }
