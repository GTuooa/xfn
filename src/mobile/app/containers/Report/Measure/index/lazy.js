import view from '../app.js'

import measureState from 'app/redux/Report/Measure'
import lrbState from 'app/redux/Report/Lrb'
const reducer = {
    measureState,
    lrbState
}

export { reducer, view }
