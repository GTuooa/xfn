import view from '../app.js';

import runningConfState from 'app/redux/Config/Running/runningConf'
import taxConfState from 'app/redux/Config/Running/tax'
import runningIndexState from 'app/redux/Config/Running/index.js'
import lsqcState from 'app/redux/Config/Lsqc'

const reducer = {
    runningConfState,
    taxConfState,
    runningIndexState,
    lsqcState
}

export { reducer, view }
