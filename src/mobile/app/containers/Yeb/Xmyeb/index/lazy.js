import view from '../app.js'

import xmyebState from 'app/redux/Yeb/Xmyeb'
import xmmxbState from 'app/redux/Mxb/Xmmxb'

const reducer = {
    xmyebState,
    xmmxbState
}

export { reducer, view }
