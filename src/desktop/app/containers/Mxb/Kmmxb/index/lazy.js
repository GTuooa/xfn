import view from '../app.js'

import kmmxbState from 'app/redux/Mxb/Kmmxb'
import lrpzState from 'app/redux/Edit/Lrpz'
import pzBombState from 'app/redux/Edit/PzBomb'

const reducer = {
    kmmxbState,
    lrpzState,
    pzBombState
}

export { reducer, view }
