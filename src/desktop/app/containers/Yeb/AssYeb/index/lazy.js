import view from '../app.js'

import assYebState from 'app/redux/Yeb/AssYeb'
import assmxbState from 'app/redux/Mxb/AssMxb'

const reducer = {
    assYebState,
    assmxbState
}

export { reducer, view }
