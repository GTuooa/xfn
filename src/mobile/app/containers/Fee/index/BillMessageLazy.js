import view from '../Wddd/BillMessage';

import tcgmState from 'app/redux/Fee/Tcgm'
import feeState from 'app/redux/Fee'
import tcxqState from 'app/redux/Fee/Tcxq'

const reducer = {
    tcgmState,
    tcxqState,
    feeState,
}

export { reducer, view }
