import view from '../app.js';

import sobConfigState from 'app/redux/Config/Sob'
import sobOptionState from 'app/redux/Config/Sob/SobOption'
import sobRoleState from 'app/redux/Config/SobRole'
//
const reducer = {
    sobConfigState,
    sobOptionState,
    sobRoleState
}

export { reducer, view }
