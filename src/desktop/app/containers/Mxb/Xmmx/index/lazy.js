import view from '../app.js'

import accountConfState from 'app/redux/Config/Account'
import xmmxState from 'app/redux/Mxb/XmMxb'
import lrAccountState from 'app/redux/Edit/LrAccount'
import lrCalculateState from 'app/redux/Edit/LrAccount/lrCalculate'
import yllsState from 'app/redux/Search/Ylls'
const reducer = {
    accountConfState,
    xmmxState,
    lrAccountState,
    lrCalculateState,
    yllsState,
}

export { reducer, view }
