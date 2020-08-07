import view from '../app.js'

import runningTypeYebState from 'app/redux/Yeb/RunningTypeYeb'
import runningTypeMxbState from 'app/redux/Mxb/RunningTypeMxb'

const reducer = {
    runningTypeYebState,
    runningTypeMxbState
}

export { reducer, view }
