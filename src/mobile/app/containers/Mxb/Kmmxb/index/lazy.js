import view from '../app.js'

import kmmxbState from 'app/redux/Mxb/Kmmxb'
import lrpzState from 'app/redux/Edit/Lrpz'

const reducer = {
    kmmxbState,
    lrpzState
}

export { reducer, view }
