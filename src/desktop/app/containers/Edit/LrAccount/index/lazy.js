import view from '../app.js'

import lrAccountState from 'app/redux/Edit/LrAccount'
import lrCalculateState from 'app/redux/Edit/LrAccount/lrCalculate'
import cxlsState from 'app/redux/Search/Cxls'
import accountConfState from 'app/redux/Config/Account'
import yllsState from 'app/redux/Search/Ylls'
const reducer = {
    lrAccountState,
    accountConfState,
    cxlsState,
    lrCalculateState,
    yllsState
}

export { reducer, view }
