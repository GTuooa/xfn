import view from '../app.js'

import kmyebState from 'app/redux/Yeb/Kmyeb'
import kmmxbState from 'app/redux/Mxb/Kmmxb'

const reducer = {
    kmyebState,
    kmmxbState
}

export { reducer, view }
