import view from '../app.js'

import runningPreviewState from 'app/redux/Edit/RunningPreview'
import previewEnclosureState from 'app/redux/Edit/PreviewEnclosure/index.js'
import searchRunningState from 'app/redux/Search/SearchRunning'

const reducer = {
    runningPreviewState,
    previewEnclosureState,
    searchRunningState,
}

export { reducer, view }
