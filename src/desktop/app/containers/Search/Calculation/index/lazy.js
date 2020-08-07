import view from '../app.js'

import calculationState from 'app/redux/Search/Calculation'
import accountConfState from 'app/redux/Config/Account'
import lrAccountState from 'app/redux/Edit/LrAccount'
import cxlsState from 'app/redux/Search/Cxpz'
import yllsState from 'app/redux/Search/Ylls'
const reducer = {
    'calculationState': calculationState,
    'accountConfState': accountConfState,
    'lrAccountState': lrAccountState,
    'cxlsState': cxlsState,
    yllsState
}

export { reducer, view }
