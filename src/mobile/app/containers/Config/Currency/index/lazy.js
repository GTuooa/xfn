import view from '../app.js'

import currencyState from 'app/redux/Config/Currency'
import acconfigState from 'app/redux/Config/Ac'


const reducer = {
    currencyState,
    acconfigState
}

export { reducer, view }
