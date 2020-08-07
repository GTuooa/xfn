import view from '../app.js'

import ammxbState from 'app/redux/Mxb/AmountMxb'
import lrpzState from 'app/redux/Edit/Lrpz'
import pzBombState from 'app/redux/Edit/PzBomb'

const reducer = {
    ammxbState,
    lrpzState,
    pzBombState
}

export { reducer, view }
