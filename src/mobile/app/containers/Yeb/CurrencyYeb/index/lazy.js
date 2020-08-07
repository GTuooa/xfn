import view from '../app.js'

import currencyYebState from 'app/redux/Yeb/CurrencyYeb'
import currencyMxbState from 'app/redux/Mxb/CurrencyMxb'

const reducer = {
    currencyYebState,
    currencyMxbState
}

export { reducer, view }
