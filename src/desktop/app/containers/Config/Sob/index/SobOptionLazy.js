import view from '../SobOption';

import sobConfigState from 'app/redux/Config/Sob'
import sobOptionState from 'app/redux/Config/Sob/SobOption'

const reducer = {
    sobConfigState,
    sobOptionState
}

export { reducer, view }
