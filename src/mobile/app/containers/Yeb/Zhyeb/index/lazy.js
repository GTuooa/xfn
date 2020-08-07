import view from '../app.js'

import zhyebState from 'app/redux/Yeb/Zhyeb'
import zhmxbState from 'app/redux/Mxb/Zhmxb'

const reducer = {
    zhyebState,
    zhmxbState
}

export { reducer, view }
