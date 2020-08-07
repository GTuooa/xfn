import view from '../app.js';

import jzState from 'app/redux/Config/Jz'
import editRunningState from 'app/redux/Edit/EditRunning'
import editCalculateState from 'app/redux/Edit/EditCalculate'
import editRunningAllState from 'app/redux/Edit/EditRunning/runningAll.js'

const reducer = {
    jzState,
    editRunningState,
    editCalculateState,
    editRunningAllState
}

export { reducer, view }
