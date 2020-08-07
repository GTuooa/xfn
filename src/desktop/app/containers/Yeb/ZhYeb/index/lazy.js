import view from '../app.js'

import cxlsState from 'app/redux/Search/Cxls'
import zhyeState from 'app/redux/Yeb/ZhYeb'
import zhmxState from 'app/redux/Mxb/ZhMxb'

const reducer = {
    cxlsState,
    zhyeState,
    zhmxState
}

export { reducer, view }
