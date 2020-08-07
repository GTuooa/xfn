import view from '../app.js'

import cxpzState from 'app/redux/Search/Cxpz'
import fjglState from 'app/redux/Search/Fjgl'
import lrpzState from 'app/redux/Edit/Lrpz'

const reducer = {
    cxpzState,
    fjglState,
    lrpzState
}

export { reducer, view }
