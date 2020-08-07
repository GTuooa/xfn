import view from '../index.js'

import runningConfState from 'app/redux/Config/Running/runningConf'
import taxConfState from 'app/redux/Config/Running/Tax'
import runningIndexState from 'app/redux/Config/Running/index.js'

const reducer = {
    runningConfState,
    taxConfState,
    runningIndexState
}

export { reducer, view }
