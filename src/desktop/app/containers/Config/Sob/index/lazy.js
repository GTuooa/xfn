import view from '../app.js';

import sobConfigState from 'app/redux/Config/Sob'
import sobOptionState from 'app/redux/Config/Sob/SobOption'
import sobLogState from 'app/redux/Config/SobLog'
import sobRoleState from 'app/redux/Config/SobRole'
//
const reducer = {
    sobConfigState,
    sobOptionState,
    sobLogState,
    sobRoleState
}

export { reducer, view }
