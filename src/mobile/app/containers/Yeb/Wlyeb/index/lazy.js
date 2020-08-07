import view from '../app.js'

import wlyebState from 'app/redux/Yeb/Wlyeb'
import wlmxbState from 'app/redux/Mxb/Wlmxb'

const reducer = {
    wlyebState,
    wlmxbState
}

export { reducer, view }
