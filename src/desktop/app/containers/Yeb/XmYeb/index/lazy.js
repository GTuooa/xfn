import view from '../app.js'

import cxlsState from 'app/redux/Search/Cxls'
import xmyeState from 'app/redux/Yeb/XmYeb'
import xmmxState from 'app/redux/Mxb/XmMxb'

const reducer = {
    cxlsState,
    xmyeState,
    xmmxState
}

export { reducer, view }
