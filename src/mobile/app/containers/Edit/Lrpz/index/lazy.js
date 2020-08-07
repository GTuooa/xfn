import view from '../app.js'

import lrpzState from 'app/redux/Edit/Lrpz'
import previewEnclosureState from 'app/redux/Edit/PreviewEnclosure/index.js'

const reducer = {
    lrpzState,
    previewEnclosureState
}

export { reducer, view }
