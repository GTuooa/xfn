import view from '../app.js'

import assmxbState from 'app/redux/Mxb/AssMxb'
import lrpzState from 'app/redux/Edit/Lrpz'
import pzBombState from 'app/redux/Edit/PzBomb'

const reducer = {
    assmxbState,
    lrpzState,
    pzBombState
}

export { reducer, view }
