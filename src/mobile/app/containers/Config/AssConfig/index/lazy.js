import view from '../app.js'

import assconfigState from 'app/redux/Config/Ass'
import acconfigState from 'app/redux/Config/Ac'

const reducer = {
    assconfigState,
    acconfigState
}

export { reducer, view }
