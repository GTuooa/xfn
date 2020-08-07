import view from '../app.js'

import cxpzState from 'app/redux/Search/Cxpz'
import fjglState from 'app/redux/Search/Fjgl'
import pzBombState from 'app/redux/Edit/PzBomb'
import lrpzState from 'app/redux/Edit/Lrpz'
import kmmxbState from 'app/redux/Mxb/Kmmxb'
import filePrintState from 'app/redux/Edit/FilePrint'

const reducer = {
    cxpzState,
    fjglState,
    pzBombState,
    lrpzState,
    kmmxbState,
    filePrintState,
}

export { reducer, view }
