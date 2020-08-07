import view from '../app.js'

import fjglState from 'app/redux/Search/Fjgl'
import exportRecordingState from 'app/redux/Search/ExportRecording'
const reducer = {
    fjglState,
    exportRecordingState
}

export { reducer, view }
