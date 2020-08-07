import view from '../app.js'

import assYebState from 'app/redux/Yeb/AssYeb'
import assMxbState from 'app/redux/Mxb/AssMxb'

const reducer = {
    assYebState,
    assMxbState
}

export { reducer, view }
