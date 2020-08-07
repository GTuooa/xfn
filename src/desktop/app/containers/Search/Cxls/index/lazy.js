import view from '../app.js'

import cxlsState from 'app/redux/Search/Cxls'
import accountConfState from 'app/redux/Config/Account'
import lrAccountState from 'app/redux/Edit/LrAccount'
import lrCalculateState from 'app/redux/Edit/LrAccount/lrCalculate'
import yllsState from 'app/redux/Search/Ylls'
import pzBombState from 'app/redux/Edit/PzBomb'

const reducer = {
    accountConfState,
    cxlsState,
    lrAccountState,
    lrCalculateState,
    yllsState,
    pzBombState
}

export { reducer, view }
