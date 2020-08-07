import view from '../app.js'

import runningEnclosureState from 'app/redux/Search/RunningEnclosure'
import exportRecordingState from 'app/redux/Search/ExportRecording'
const reducer = {
    runningEnclosureState,
    exportRecordingState
}

export { reducer, view }
