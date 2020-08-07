import view from '../app.js'

import cxAccountState from 'app/redux/Search/Cxls'
import yllsState from 'app/redux/Ylls'
import lrpzState from 'app/redux/Edit/Lrpz'
import previewEnclosureState from 'app/redux/Edit/PreviewEnclosure/index.js'

const reducer = {
    cxAccountState,
    yllsState,
    lrpzState,
    previewEnclosureState
}

export { reducer, view }
