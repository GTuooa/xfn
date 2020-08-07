import view from '../app.js'

import fjglState from 'app/redux/Search/Fjgl'
import previewEnclosureState from 'app/redux/Edit/PreviewEnclosure/index.js'

const reducer = {
    fjglState,
    previewEnclosureState
}

export { reducer, view }
