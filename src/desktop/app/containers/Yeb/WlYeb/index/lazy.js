import view from '../app.js'

import cxlsState from 'app/redux/Search/Cxls'
import wlyeState from 'app/redux/Yeb/WlYeb'
import wlmxState from 'app/redux/Mxb/WlMxb'

const reducer = {
    cxlsState,
    wlyeState,
    wlmxState
}

export { reducer, view }
