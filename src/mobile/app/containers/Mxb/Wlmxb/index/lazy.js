import view from '../app.js'

import wlmxbState from 'app/redux/Mxb/Wlmxb'
import yllsState from 'app/redux/Ylls'

const reducer = {
    wlmxbState,
    yllsState
}

export { reducer, view }
