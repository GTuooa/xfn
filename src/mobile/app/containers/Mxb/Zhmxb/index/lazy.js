import view from '../app.js'

import zhmxbState from 'app/redux/Mxb/Zhmxb'
import yllsState from 'app/redux/Ylls'

const reducer = {
    zhmxbState,
    yllsState
}

export { reducer, view }
