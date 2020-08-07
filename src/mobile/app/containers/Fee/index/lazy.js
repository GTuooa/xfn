import view from '../app.js';

import tcgmState from 'app/redux/Fee/Tcgm'
import feeState from 'app/redux/Fee'
import tcxqState from 'app/redux/Fee/Tcxq'
// import sobConfigState from 'app/redux/Config/Sob'

const reducer = {
    tcgmState,
    tcxqState,
    feeState,
    // sobConfigState
}

export { reducer, view }
