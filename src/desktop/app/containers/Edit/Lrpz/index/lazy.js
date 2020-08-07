import view from '../app.js';

import lrpzState from 'app/redux/Edit/Lrpz'
import draftState from 'app/redux/Edit/Draft'
import filePrintState from 'app/redux/Edit/FilePrint'
const reducer = {
    lrpzState,
    draftState,
    filePrintState
}

export { reducer, view }
