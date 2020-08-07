import view from '../app.js'

import assMxbState from 'app/redux/Mxb/AssMxb'
import lrpzState from 'app/redux/Edit/Lrpz'

const reducer = {
    assMxbState,
    lrpzState
}

export { reducer, view }
