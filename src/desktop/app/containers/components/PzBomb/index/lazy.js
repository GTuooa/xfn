import view from '../app.js'

import pzBombState from 'app/redux/Edit/PzBomb'
import lrpzState from 'app/redux/Edit/Lrpz'
import filePrintState from 'app/redux/Edit/FilePrint'
const reducer = {
    pzBombState,
    lrpzState,
    filePrintState
}

export { reducer, view }
