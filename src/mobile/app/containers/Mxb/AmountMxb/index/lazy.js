import view from '../app.js'

import amountMxbState from 'app/redux/Mxb/AmountMxb'
import lrpzState from 'app/redux/Edit/Lrpz'

const reducer = {
    amountMxbState,
    lrpzState
}

export { reducer, view }
