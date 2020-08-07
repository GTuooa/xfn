import view from '../app.js'

import currencyMxbState from 'app/redux/Mxb/CurrencyMxb'
import lrpzState from 'app/redux/Edit/Lrpz'

const reducer = {
    currencyMxbState,
    lrpzState
}

export { reducer, view }
