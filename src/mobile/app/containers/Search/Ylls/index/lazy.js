import view from '../app.js'

import yllsState from 'app/redux/Ylls'
import previewEnclosureState from 'app/redux/Edit/PreviewEnclosure/index.js'

const reducer = {
    yllsState,
    previewEnclosureState
}

export { reducer, view }
