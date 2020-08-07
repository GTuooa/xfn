import view from '../app.js'

import lsyebState from 'app/redux/Yeb/Lsyeb'
import lsmxbState from 'app/redux/Mxb/Lsmxb'

const reducer = {
    lsyebState,
    lsmxbState
}

export { reducer, view }
