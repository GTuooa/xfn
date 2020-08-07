import view from '../index.js'

import searchRunningState from 'app/redux/Search/SearchRunning'
import runningPreviewState from 'app/redux/Edit/RunningPreview'
import lrpzState from 'app/redux/Edit/Lrpz'
import enclosureState from 'app/redux/Home/All/enclosure.js'
import previewEnclosureState from 'app/redux/Edit/PreviewEnclosure/index.js'

const reducer = {
    searchRunningState,
    runningPreviewState,
    lrpzState,
    enclosureState,
    previewEnclosureState
}

export { reducer, view }
