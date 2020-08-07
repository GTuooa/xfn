import view from '../app.js'

import relativeYebState from 'app/redux/Yeb/RelativeYeb'
import relativeMxbState from 'app/redux/Mxb/RelativeMxb'

const reducer = {
    relativeYebState,
    relativeMxbState
}

export { reducer, view }
