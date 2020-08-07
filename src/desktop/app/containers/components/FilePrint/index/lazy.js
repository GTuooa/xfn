import view from '../app.js'

import filePrintState from 'app/redux/Edit/FilePrint'
import pzBombState from 'app/redux/Edit/PzBomb'

const reducer = {
    filePrintState,
    pzBombState
}

export { reducer, view }
