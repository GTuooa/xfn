import view from '../app.js'

import currencyMxbState from 'app/redux/Mxb/CurrencyMxb'
import lrpzState from 'app/redux/Edit/Lrpz'
import pzBombState from 'app/redux/Edit/PzBomb'

const reducer = {
    currencyMxbState,
    lrpzState,
    pzBombState
}

export { reducer, view }
