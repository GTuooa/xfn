import view from '../app.js'

import amountYebState from 'app/redux/Yeb/AmountYeb'
import amountMxbState from 'app/redux/Mxb/AmountMxb'

const reducer = {
    amountYebState,
    amountMxbState
}

export { reducer, view }
